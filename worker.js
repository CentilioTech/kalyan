// Edge access control for the HM Intel project portal (HTTP Basic Auth).
//
// The username is a non-secret var (PORTAL_USER); the password is a Worker
// secret (PORTAL_PASS) set via `wrangler secret put`, so it is NEVER committed
// to the repository. With `run_worker_first` enabled in wrangler.jsonc, this
// Worker runs ahead of the static assets, so every path (including the HTML,
// JS and CSS) is gated. Only after a valid login are assets served through the
// ASSETS binding.
export default {
  async fetch(request, env) {
    const expected = "Basic " + btoa(`${env.PORTAL_USER}:${env.PORTAL_PASS}`);
    const provided = request.headers.get("Authorization") || "";

    if (provided !== expected) {
      return new Response(
        "HM Intel Project Portal — access restricted. Please sign in.",
        {
          status: 401,
          headers: {
            "WWW-Authenticate":
              'Basic realm="HM Intel Project Portal", charset="UTF-8"',
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
          },
        }
      );
    }

    // Authenticated: serve the Android APK from R2 (too large for static assets).
    const { pathname } = new URL(request.url);
    if (pathname === "/downloads/HM-Intel.apk" && env.DOWNLOADS) {
      const obj = await env.DOWNLOADS.get("HM-Intel.apk");
      if (!obj) return new Response("APK not found", { status: 404 });
      return new Response(obj.body, {
        headers: {
          "Content-Type": "application/vnd.android.package-archive",
          "Content-Disposition": 'attachment; filename="HM-Intel.apk"',
          "Content-Length": String(obj.size),
          "Cache-Control": "no-store",
        },
      });
    }

    // Authenticated: serve the static SPA from the assets binding.
    return env.ASSETS.fetch(request);
  },
};
