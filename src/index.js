export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = request.headers.get("host");
    const token = url.searchParams.get("token");

    console.log("🌐 Host recebido:", host);
    console.log("🔗 URL acessada:", url.href);
    console.log("🔍 Token na URL:", token);

    const isPortal = host === "portal.vendaseguro.com.br";
    const hasToken = !!token;

    if (isPortal && !hasToken) {
      const redirectUrl = `https://hub.vendaseguro.com.br/login?redirect_portal=${encodeURIComponent(url.href)}`;
      console.log("🔁 Redirecionando para:", redirectUrl);
      return Response.redirect(redirectUrl, 302);
    }

    console.log("✅ Sem redirecionamento, seguindo para o portal.");
    return fetch(request);
  },
};
