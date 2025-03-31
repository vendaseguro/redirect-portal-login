export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = request.headers.get("host");
    const cookieHeader = request.headers.get("cookie") || "";

    // Ignora arquivos que não são HTML (ex: .json, .js, .css, .ico, etc)
    const ignoredExtensions = [
      ".json", ".js", ".css", ".ico", ".png", ".jpg", ".jpeg", ".gif",
      ".svg", ".webmanifest", ".woff", ".woff2", ".ttf", ".eot", ".map", ".mp4"
    ];

    if (ignoredExtensions.some(ext => url.pathname.endsWith(ext))) {
      return fetch(request); // segue normalmente sem redirecionar
    }

    // Extrai o token do cookie
    const match = cookieHeader.match(/vs_token_portal=([^;]+)/);
    const tokenFromCookie = match ? match[1] : null;

    const isPortal = host === "portal.vendaseguro.com.br";
    const hasToken = !!tokenFromCookie;
    const urlHasTokenParam = url.searchParams.has("token");

    if (isPortal && !hasToken && !urlHasTokenParam) {
      const redirectUrl = `https://hub.vendaseguro.com.br/login?redirect_portal=${encodeURIComponent(url.href)}`;
      return Response.redirect(redirectUrl, 302);
    }

    return fetch(request);
  },
};
