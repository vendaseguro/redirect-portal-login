export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = request.headers.get("host");
    const path = url.pathname;
    const cookieHeader = request.headers.get("cookie") || "";
    const acceptHeader = request.headers.get("accept") || "";

    const isPortal = host === "portal.vendaseguro.com.br";
    const isRootPath = path === "/";

    // Ignora arquivos estáticos e não-HTML
    const staticExtensions = [
      ".json", ".js", ".css", ".ico", ".png", ".jpg", ".jpeg", ".gif",
      ".svg", ".webmanifest", ".woff", ".woff2", ".ttf", ".eot", ".map", ".mp4"
    ];
    const isStaticFile = staticExtensions.some(ext => url.pathname.endsWith(ext));
    const isHtmlRequest = acceptHeader.includes("text/html");

    // Lê o token do cookie
    const match = cookieHeader.match(/vs_token_portal=([^;]+)/);
    const tokenFromCookie = match ? match[1] : null;
    const urlHasTokenParam = url.searchParams.has("token");

    const shouldRedirect =
      isPortal &&
      !isRootPath &&
      !tokenFromCookie &&
      !urlHasTokenParam &&
      isHtmlRequest &&
      !isStaticFile;

    if (shouldRedirect) {
      const redirectUrl = `https://hub.vendaseguro.com.br/login?redirect_portal=${encodeURIComponent(url.href)}`;
      return Response.redirect(redirectUrl, 302);
    }

    return fetch(request);
  },
};
