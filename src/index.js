export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = request.headers.get("host");
    const cookieHeader = request.headers.get("cookie") || "";
    const acceptHeader = request.headers.get("accept") || "";

    const isPortal = host === "portal.vendaseguro.com.br";

    // Evita redirecionamento de arquivos estáticos
    const staticExtensions = [
      ".json", ".js", ".css", ".ico", ".png", ".jpg", ".jpeg", ".gif",
      ".svg", ".webmanifest", ".woff", ".woff2", ".ttf", ".eot", ".map", ".mp4", ".mp3", ".webm"
    ];
    const isStaticFile = staticExtensions.some(ext => url.pathname.endsWith(ext));

    // Evita redirecionamento se não for uma página HTML
    const isHtmlRequest = acceptHeader.includes("text/html");

    // Extrai o token do cookie
    const match = cookieHeader.match(/vs_token_portal=([^;]+)/);
    const tokenFromCookie = match ? match[1] : null;
    const hasToken = !!tokenFromCookie;
    const urlHasTokenParam = url.searchParams.has("token");

    if (
      isPortal &&
      !hasToken &&
      !urlHasTokenParam &&
      isHtmlRequest &&
      !isStaticFile
    ) {
      const redirectUrl = `https://hub.vendaseguro.com.br/login?redirect_portal=${encodeURIComponent(url.href)}`;
      return Response.redirect(redirectUrl, 302);
    }

    return fetch(request);
  },
};
