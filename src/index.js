export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = request.headers.get("host");
    const cookieHeader = request.headers.get("cookie") || "";

    // Extrai o token do cookie
    const match = cookieHeader.match(/vs_token_portal=([^;]+)/);
    const tokenFromCookie = match ? match[1] : null;

    console.log("🌐 Host recebido:", host);
    console.log("🔗 URL acessada:", url.href);
    console.log("🍪 Token no cookie:", tokenFromCookie);

    const isPortal = host === "portal.vendaseguro.com.br";
    const hasToken = !!tokenFromCookie;

    if (isPortal && !hasToken) {
      const redirectUrl = `https://hub.vendaseguro.com.br/login?redirect_portal=${url.href}`;
      console.log("🔁 Redirecionando para:", redirectUrl);
      return Response.redirect(redirectUrl, 302);
    }

    console.log("✅ Token encontrado no cookie. Acesso liberado.");
    return fetch(request);
  },
};
