export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = request.headers.get("host");
    const cookieHeader = request.headers.get("cookie") || "";
    const acceptHeader = request.headers.get("accept") || "";

    const isPortal = host === "portal.vendaseguro.com.br";
    const match = cookieHeader.match(/vs_token_portal=([^;]+)/);
    const tokenFromCookie = match ? match[1] : null;
    const hasToken = !!tokenFromCookie;

    const urlHasTokenParam = url.searchParams.has("token");

    // Evita redirecionamento se não for uma página HTML
    const isHtmlRequest = acceptHeader.includes("text/html");

    // Proteção adicional: ignora requisições com extensões de arquivos estáticos
    const staticExtensions = ['.js', '.css', '.json', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.otf', '.mp4', '.mp3', '.webm'];
    const isStaticFile = staticExtensions.some(ext => url.pathname.endsWith(ext));

    if (isPortal && !hasToken && !urlHasTokenParam && isHtmlRequest && !isStaticFile) {
      const redirectUrl = `https://hub.vendaseguro.com.br/login?redirect_portal=${encodeURIComponent(url.href)}`;
      return Response.redirect(redirectUrl, 302);
    }

    return fetch(request);
  }
};
