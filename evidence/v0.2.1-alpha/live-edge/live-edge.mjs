// Live E2E against the deployed Cosmos edge (woozlit auth).
// Mints real Firebase id tokens via the public web API key (same one the
// shipped app embeds), then drives: status probe -> host ws -> owner gate ->
// PairPhone -> AuthorizePhone -> gated surface -> host_closed bounce.
import { RpcClient, relaySpec, encodeRelayFrame, decodeRelayFrame } from './rpc.mjs';

const EDGE = 'https://cosmos-edge.cosmos-edge.workers.dev';
const API_KEY = 'AIzaSyBbJtkBoJrKM2hjW2H3o9pgtcyiGge9yOo'; // Firebase web key (public, ships in the client)
const DEVICE_ID = `e2e-live-${process.pid % 100000}`;

let failures = 0;
const ok = (name, cond, detail = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
  if (!cond) failures++;
};

async function firebaseUser(tag) {
  const email = `cosmos-e2e-${tag}-${Date.now()}@e2e.invalid`;
  const r = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password: 'E2e-password-1!', returnSecureToken: true }),
    },
  );
  const j = await r.json();
  if (!r.ok) throw new Error(`firebase signUp ${tag}: ${JSON.stringify(j)}`);
  return { idToken: j.idToken, uid: j.localId };
}

async function status(token) {
  const r = await fetch(`${EDGE}/device/${DEVICE_ID}/status`, {
    headers: { authorization: `Bearer ${token}` },
  });
  return { code: r.status, body: await r.json().catch(() => null) };
}

// Minimal engine-side stub: joins role=host, answers the RPC surface the
// phone uses (bootstrap methods always open; gated surface needs a paired conn).
function startHost(token) {
  const ws = new WebSocket(
    `${EDGE.replace('https', 'wss')}/device/${DEVICE_ID}/ws?role=host&token=${encodeURIComponent(token)}`,
  );
  ws.binaryType = 'arraybuffer';
  const codes = new Map(); // code -> token
  const authorized = new Set(); // connIds (frame.header.from)
  let hostTok = 0;
  ws.onmessage = (ev) => {
    const frame = decodeRelayFrame(ev.data);
    if (!frame || frame.header.k !== 'rpc') return;
    const msg = JSON.parse(frame.payload);
    const conn = frame.header.from;
    const reply = (body) =>
      ws.send(encodeRelayFrame(frame.header.s, 'rpc', JSON.stringify(body), conn));
    const gated = authorized.has(conn);
    const bootstrap = ['PairPhone', 'AuthorizePhone', 'EngineInfo', 'LocalDevice', 'AuthStatus'];
    const m = msg.method;
    if (!bootstrap.includes(m) && !gated) {
      return reply({ id: msg.id, err: `${m} needs a paired phone — scan the QR in Settings → Devices on the desktop` });
    }
    if (m === 'EngineInfo') return reply({ id: msg.id, ok: { version: '0.2.79', deviceId: DEVICE_ID, platform: 'e2e-stub' } });
    if (m === 'LocalDevice') return reply({ id: msg.id, ok: { deviceId: DEVICE_ID, name: 'e2e stub desktop' } });
    if (m === 'AuthStatus') return reply({ id: msg.id, ok: { signedIn: true } });
    if (m === 'PairPhone') {
      const code = (msg.params?.code ?? '').toUpperCase();
      if (!codes.has(code)) return reply({ id: msg.id, err: 'invalid or expired code' });
      const t = `grant-${++hostTok}`;
      codes.delete(code); // single-use
      return reply({ id: msg.id, ok: { deviceToken: t, grantId: 'g1', deviceId: DEVICE_ID } });
    }
    if (m === 'AuthorizePhone') {
      if (msg.params?.deviceToken === 'grant-1') {
        authorized.add(conn);
        return reply({ id: msg.id, ok: { ok: true } });
      }
      return reply({ id: msg.id, err: 'phone not paired — scan the desktop QR' });
    }
    if (m === 'WatchSessions') {
      reply({ id: msg.id, item: { id: 's1', title: 'e2e session', state: 'idle' } });
      return reply({ id: msg.id, done: true });
    }
    if (m === 'ComputerStatus') return reply({ id: msg.id, ok: { computers: [], online: true } });
    return reply({ id: msg.id, err: `unimplemented ${m}` });
  };
  // The "desktop QR" content: issue a code like core.pairing.issue would.
  const issue = () => { const c = 'E2E' + String(Math.floor(Math.random() * 900) + 100); codes.set(c, 1); return c; };
  const ready = new Promise((res, rej) => { ws.onopen = res; ws.onerror = (e) => rej(new Error('host ws error')); });
  return { ws, issue, ready };
}

const waitOpen = (rpc, ms = 15000) =>
  new Promise((res, rej) => {
    const off = rpc.onStatusChange((s, d) => {
      if (s === 'connected') { off(); res(); }
      else if (s === 'error') { off(); rej(new Error(d ?? 'error')); }
    });
    rpc.connect();
    setTimeout(() => { off(); rej(new Error('open timeout')); }, ms);
  });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const main = async () => {
  console.log(`edge=${EDGE} device=${DEVICE_ID}`);
  const owner = await firebaseUser('owner');
  const stranger = await firebaseUser('stranger');
  ok('firebase signUp x2', !!owner.idToken && !!stranger.idToken, `owner=${owner.uid.slice(0, 8)}…`);

  // 1. never-claimed room -> 404 for the owner
  const s0 = await status(owner.idToken);
  ok('unclaimed room 404', s0.code === 404, JSON.stringify(s0));

  // 2. no token -> 401
  const sNo = await fetch(`${EDGE}/device/${DEVICE_ID}/status`);
  ok('no-token status 401', sNo.status === 401);

  // 3. host joins
  const host = startHost(owner.idToken);
  await host.ready;
  await sleep(400);
  const s1 = await status(owner.idToken);
  ok('status hostConnected', s1.code === 200 && s1.body?.hostConnected === true, JSON.stringify(s1.body));

  // 4. stranger (different account) cannot attach — owner gate
  const badWs = new WebSocket(
    `${EDGE.replace('https', 'wss')}/device/${DEVICE_ID}/ws?role=client&token=${encodeURIComponent(stranger.idToken)}`,
  );
  const bad = await new Promise((res) => {
    badWs.onopen = () => res('OPENED');
    badWs.onerror = () => res('REJECTED');
    setTimeout(() => res('TIMEOUT'), 8000);
  });
  ok('stranger account rejected at upgrade', bad === 'REJECTED', bad);

  // 5. owner phone conn: bootstrap open, gated closed
  const phone = new RpcClient(relaySpec(EDGE, DEVICE_ID), async () => owner.idToken);
  await waitOpen(phone);
  ok('owner phone connected', phone.getStatus() === 'connected');
  const info = await phone.call('EngineInfo');
  ok('EngineInfo bootstrap', info?.deviceId === DEVICE_ID, JSON.stringify(info));
  let gatedErr = '';
  try { await phone.call('WatchSessions'); } catch (e) { gatedErr = e.message; }
  ok('WatchSessions gated pre-pair', /needs a paired phone/.test(gatedErr), gatedErr);

  // 6. wrong code rejected
  let badCode = '';
  try { await phone.call('PairPhone', { code: 'ZZZZZZ', label: 'iPhone' }); } catch (e) { badCode = e.message; }
  ok('bad code rejected', /invalid/.test(badCode), badCode);

  // 7. redeem real code -> grant token -> authorize -> gated surface opens
  const code = host.issue();
  const grant = await phone.call('PairPhone', { code, label: 'iPhone' });
  ok('PairPhone redeems', typeof grant?.deviceToken === 'string', `token=${grant?.deviceToken}`);
  const auth = await phone.call('AuthorizePhone', { deviceToken: grant.deviceToken });
  ok('AuthorizePhone', auth?.ok === true);
  let items = [], streamDone = false;
  await new Promise((res, rej) => {
    const h = phone.stream('WatchSessions', {}, (it) => items.push(it));
    h.done.then(() => { streamDone = true; res(); }).catch(rej);
    setTimeout(() => rej(new Error('stream timeout')), 8000);
  });
  ok('WatchSessions streams post-pair', streamDone && items.length === 1, `${items.length} item(s)`);
  const cs = await phone.call('ComputerStatus');
  ok('ComputerStatus post-pair', cs?.online === true, JSON.stringify(cs));

  // 8. host drops -> client sees host_closed bounce
  const closed = new Promise((res) => {
    const off = phone.onStatusChange((s, d) => { if (s === 'error') { off(); res(d); } });
    setTimeout(() => res('NO_BOUNCE'), 8000);
  });
  host.ws.close();
  const bounce = await closed;
  ok('host_closed bounce reaches phone', typeof bounce === 'string' && /offline/.test(bounce), String(bounce));

  phone.close();
  console.log(failures === 0 ? 'ALL GREEN' : `${failures} FAILURE(S)`);
  process.exit(failures === 0 ? 0 : 1);
};

main().catch((e) => { console.log('HARNESS ERROR', e); process.exit(2); });
