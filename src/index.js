export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = request.headers.get("host");
    const cookieHeader = request.headers.get("cookie") || "";

    // Extrai o token do parâmetro e do cookie
    const urlToken = url.searchParams.get("token");
    const cookieMatch = cookieHeader.match(/vs_token_portal=([^;]+)/);
    const cookieToken = cookieMatch ? cookieMatch[1] : null;

    const isPortal = host === "portal.vendaseguro.com.br";
    const hasUrlToken = !!urlToken;
    const hasCookieToken = !!cookieToken;

    // Proteção extra: só intercepta requisições HTML
    const accept = request.headers.get("accept") || "";
    const isHtml = accept.includes("text/html");

    // Evita redirecionamento para arquivos estáticos
    const staticExt = [".js", ".css", ".json", ".svg", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".woff", ".woff2", ".ttf", ".eot", ".otf", ".mp4", ".mp3", ".webm"];
    const isStatic = staticExt.some(ext => url.pathname.endsWith(ext));

    if (isPortal && !hasUrlToken && !hasCookieToken && isHtml && !isStatic) {
      const redirectUrl = `https://hub.vendaseguro.com.br/login?redirect_portal=${encodeURIComponent(url.href)}`;
      return Response.redirect(redirectUrl, 302);
    }

    return fetch(request);
  },
};
