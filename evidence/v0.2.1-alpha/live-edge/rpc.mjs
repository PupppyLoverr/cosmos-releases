// src/lib/rpc.ts
var DEFAULT_TIMEOUT_MS = 3e4;
var STREAM_TIMEOUT_MS = 6e5;
function ulebEncode(len) {
  const out = [];
  let n = len;
  for (; ; ) {
    let b = n & 127;
    n >>= 7;
    if (n !== 0) b |= 128;
    out.push(b);
    if (n === 0) break;
  }
  return out;
}
var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder();
function encodeRelayFrame(streamId, kind, payload, to) {
  const header = { s: streamId, k: kind };
  if (to) header.to = to;
  const headerBytes = textEncoder.encode(JSON.stringify(header));
  const payloadBytes = textEncoder.encode(payload);
  const len = ulebEncode(headerBytes.length);
  const out = new Uint8Array(len.length + headerBytes.length + payloadBytes.length);
  out.set(len, 0);
  out.set(headerBytes, len.length);
  out.set(payloadBytes, len.length + headerBytes.length);
  return out.buffer;
}
function decodeRelayFrame(bytes) {
  const buf = new Uint8Array(bytes);
  let offset = 0;
  let len = 0;
  let shift = 0;
  for (; ; ) {
    if (offset >= buf.length) return null;
    const b = buf[offset++];
    len |= (b & 127) << shift;
    if ((b & 128) === 0) break;
    shift += 7;
    if (shift >= 32) return null;
  }
  if (offset + len > buf.length) return null;
  try {
    const header = JSON.parse(textDecoder.decode(buf.subarray(offset, offset + len)));
    return { header, payload: textDecoder.decode(buf.subarray(offset + len)) };
  } catch {
    return null;
  }
}
var RpcClient = class {
  constructor(spec, tokenProvider) {
    this.spec = spec;
    this.tokenProvider = tokenProvider;
  }
  spec;
  tokenProvider;
  ws = null;
  nextId = 1;
  pending = /* @__PURE__ */ new Map();
  statusListeners = /* @__PURE__ */ new Set();
  reconnectTimer = null;
  reconnectDelay = 1e3;
  closed = false;
  status = "disconnected";
  onStatusChange(fn) {
    this.statusListeners.add(fn);
    fn(this.status);
    return () => this.statusListeners.delete(fn);
  }
  getStatus() {
    return this.status;
  }
  setStatus(s, detail) {
    this.status = s;
    for (const fn of this.statusListeners) fn(s, detail);
  }
  connect() {
    if (this.closed) return;
    void this.dial();
  }
  close() {
    this.closed = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.failAll(new Error("connection closed"));
    this.setStatus("disconnected");
  }
  async dial() {
    if (this.closed) return;
    this.setStatus(this.status === "disconnected" ? "connecting" : "reconnecting");
    let url = this.spec.url;
    if (this.spec.relay && this.tokenProvider) {
      const token = await this.tokenProvider();
      if (!token) {
        this.setStatus("error", "signed out");
        this.scheduleReconnect();
        return;
      }
      const sep = url.includes("?") ? "&" : "?";
      url = `${url}${sep}token=${encodeURIComponent(token)}`;
    }
    let ws;
    try {
      ws = new WebSocket(url);
      ws.binaryType = "arraybuffer";
    } catch (e) {
      this.setStatus("error", String(e));
      this.scheduleReconnect();
      return;
    }
    this.ws = ws;
    ws.onopen = () => {
      this.reconnectDelay = 1e3;
      this.setStatus("connected");
    };
    ws.onerror = () => {
    };
    ws.onclose = (ev) => {
      const detail = ev.reason || void 0;
      this.failAll(new Error(`socket closed (${ev.code})`));
      if (!this.closed) {
        this.setStatus("reconnecting", detail);
        this.scheduleReconnect();
      }
    };
    ws.onmessage = (ev) => {
      if (this.spec.relay) {
        const frame = typeof ev.data === "string" ? decodeRelayFrame(textEncoder.encode(ev.data).buffer) : decodeRelayFrame(ev.data);
        if (!frame) return;
        if (frame.header.k === " relay") {
          const code = (() => {
            try {
              return JSON.parse(frame.payload).error;
            } catch {
              return void 0;
            }
          })();
          this.failAll(new Error(code === "host_closed" ? "the desktop went offline" : "the desktop is offline"));
          this.ws?.close();
          return;
        }
        if (frame.header.k !== "rpc") return;
        this.handleText(frame.payload);
      } else if (typeof ev.data === "string") {
        this.handleText(ev.data);
      }
    };
  }
  scheduleReconnect() {
    if (this.closed) return;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => void this.dial(), this.reconnectDelay);
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 15e3);
  }
  failAll(err) {
    const pending = [...this.pending.values()];
    this.pending.clear();
    for (const p of pending) {
      clearTimeout(p.timer);
      p.reject(err);
    }
  }
  handleText(text) {
    let frame;
    try {
      frame = JSON.parse(text);
    } catch {
      return;
    }
    const id = frame.id;
    if (typeof id !== "number") return;
    const pending = this.pending.get(id);
    if (!pending) return;
    if (frame.item !== void 0 && pending.onItem) {
      pending.onItem(frame.item);
      return;
    }
    if (frame.done === true) {
      clearTimeout(pending.timer);
      this.pending.delete(id);
      pending.resolve(void 0);
      return;
    }
    if (frame.err !== void 0) {
      clearTimeout(pending.timer);
      this.pending.delete(id);
      const msg = typeof frame.err === "string" ? frame.err : frame.err?.message ?? "RPC error";
      pending.reject(new Error(msg));
      return;
    }
    if ("ok" in frame) {
      clearTimeout(pending.timer);
      this.pending.delete(id);
      pending.resolve(frame.ok);
    }
  }
  send(payload) {
    const text = JSON.stringify(payload);
    if (this.spec.relay) {
      this.ws?.send(encodeRelayFrame("rpc-0", "rpc", text));
    } else {
      this.ws?.send(text);
    }
  }
  call(method, params) {
    return this.request(method, params, void 0, DEFAULT_TIMEOUT_MS);
  }
  stream(method, params, onItem) {
    let cancelFn = () => {
    };
    const done = new Promise((resolve, reject) => {
      this.request(method, params, onItem, STREAM_TIMEOUT_MS).then(() => resolve()).catch(reject);
      const id = this.nextId - 1;
      cancelFn = () => {
        const p = this.pending.get(id);
        if (p) {
          clearTimeout(p.timer);
          this.pending.delete(id);
        }
        resolve();
      };
    });
    return { cancel: () => cancelFn(), done };
  }
  request(method, params, onItem, timeoutMs) {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error("not connected"));
        return;
      }
      const id = this.nextId++;
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`${method} timed out`));
      }, timeoutMs);
      this.pending.set(id, { resolve, reject, onItem, timer });
      this.send({ id, method, params: params ?? {} });
    });
  }
};
function localSpec(host, port = 27654) {
  const h = host.includes(":") ? `[${host}]` : host;
  return { url: `ws://${h}:${port}`, relay: false };
}
function relaySpec(edgeUrl, deviceId) {
  const base = edgeUrl.replace(/^http/, "ws").replace(/\/+$/, "");
  return { url: `${base}/device/${encodeURIComponent(deviceId)}/ws?role=client`, relay: true };
}
export {
  RpcClient,
  decodeRelayFrame,
  encodeRelayFrame,
  localSpec,
  relaySpec
};
