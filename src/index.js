export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = request.headers.get("host");
    const cookieHeader = request.headers.get("cookie") || "";

    const match = cookieHeader.match(/vs_token_portal=([^;]+)/);
    const tokenFromCookie = match ? match[1] : null;

    const isPortal = host === "portal.vendaseguro.com.br";
    const hasToken = !!tokenFromCookie;
    const urlHasTokenParam = url.searchParams.has("token");

    // ⚠️ EXCLUIR RECURSOS ESTÁTICOS DA VERIFICAÇÃO
    const staticExtensions = [".js", ".css", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".json", ".woff", ".woff2", ".ttf", ".eot"];
    const isStaticAsset = staticExtensions.some(ext => url.pathname.endsWith(ext));

    if (isPortal && !hasToken && !urlHasTokenParam && !isStaticAsset) {
      const redirectUrl = `https://hub.vendaseguro.com.br/login?redirect_portal=${encodeURIComponent(url.href)}`;
      return Response.redirect(redirectUrl, 302);
    }

    return fetch(request);
  },
};
