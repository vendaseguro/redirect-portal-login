export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = request.headers.get("host");
    const cookieHeader = request.headers.get("cookie") || "";
    const acceptHeader = request.headers.get("accept") || "";

    // Verifica se a requisição espera HTML
    const isHtmlRequest = acceptHeader.includes("text/html");

    // Ignora se não for uma requisição por página
    if (!isHtmlRequest) {
      return fetch(request);
    }

    // Verifica se está no portal e se há token no cookie
    const match = cookieHeader.match(/vs_token_portal=([^;]+)/);
    const tokenFromCookie = match ? match[1] : null;
    const hasToken = !!tokenFromCookie;

    const isPortal = host === "portal.vendaseguro.com.br";
    const urlHasTokenParam = url.searchParams.has("token");

    if (isPortal && !hasToken && !urlHasTokenParam) {
      const redirectUrl = `https://hub.vendaseguro.com.br/login?redirect_portal=${encodeURIComponent(url.href)}`;
      return Response.redirect(redirectUrl, 302);
    }

    return fetch(request);
  },
};
