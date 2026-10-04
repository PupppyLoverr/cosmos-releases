#!/bin/sh
set -eu

release_root="https://raw.githubusercontent.com/PupppyLoverr/cosmos-releases/main/artifacts/v0.2.1-alpha/linux"
machine=$(uname -m)
case "$machine" in
    x86_64)
        artifact="Cosmos-linux-x86_64.tar.gz"
        ;;
    aarch64|arm64)
        echo "No verified Linux aarch64 artifact is published in v0.2.1-alpha." >&2
        echo "Refusing to install an unverified runner build." >&2
        exit 1
        ;;
    *)
        echo "Unsupported Linux architecture: $machine" >&2
        exit 1
        ;;
esac

command -v curl >/dev/null 2>&1 || {
    echo "curl is required to install Cosmos." >&2
    exit 1
}
command -v sha256sum >/dev/null 2>&1 || {
    echo "sha256sum is required to verify the Cosmos release." >&2
    exit 1
}

tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' 0 HUP INT TERM
archive="$tmpdir/$artifact"
checksums="$tmpdir/SHA256SUMS"

curl -fsSL "$release_root/$artifact" -o "$archive"
curl -fsSL "$release_root/SHA256SUMS" -o "$checksums"
expected=$(awk -v name="$artifact" '$2 == name { print $1 }' "$checksums")
if [ -z "$expected" ]; then
    echo "No checksum for $artifact in the published SHA256SUMS." >&2
    exit 1
fi
actual=$(sha256sum "$archive" | awk '{ print $1 }')
if [ "$actual" != "$expected" ]; then
    echo "Checksum verification failed for $artifact." >&2
    exit 1
fi

tar -xzf "$archive" -C "$tmpdir"
binary=$(find "$tmpdir" -type f -name cosmos -print | sed -n '1p')
if [ -z "$binary" ]; then
    echo "The verified archive did not contain the cosmos executable." >&2
    exit 1
fi

mkdir -p "$HOME/.local/bin"
cp "$binary" "$HOME/.local/bin/cosmos"
chmod 755 "$HOME/.local/bin/cosmos"
PATH="$HOME/.local/bin:$PATH"
export PATH

echo "Installed Cosmos to ~/.local/bin/cosmos."
cosmos login
cosmos daemon install
if command -v loginctl >/dev/null 2>&1; then
    runner_user=${USER:-$(id -un)}
    if ! loginctl enable-linger "$runner_user"; then
        echo "Could not enable linger; run 'sudo loginctl enable-linger $runner_user' if needed." >&2
    fi
fi
