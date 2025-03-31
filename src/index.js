export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = request.headers.get("host");
    const cookieHeader = request.headers.get("cookie") || "";

    // Extrai o token do cookie
    const match = cookieHeader.match(/vs_token_portal=([^;]+)/);
    const tokenFromCookie = match ? match[1] : null;

    const isPortal = host === "portal.vendaseguro.com.br";
    const hasToken = !!tokenFromCookie;

    // Redireciona para o Hub apenas se estiver no Portal e sem token no cookie
    // IMPORTANTE: só executa isso se NÃO houver nenhum parâmetro token na URL
    const urlHasTokenParam = url.searchParams.has("token");

    if (isPortal && !hasToken && !urlHasTokenParam) {
      const redirectUrl = `https://hub.vendaseguro.com.br/login?redirect_portal=${encodeURIComponent(url.href)}`;
      return Response.redirect(redirectUrl, 302);
    }

    // Caso contrário, segue a requisição normalmente
    return fetch(request);
  },
};
