export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = request.headers.get("host");

    // 🧁 Lê os cookies da requisição
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader
        .split(";")
        .map(cookie => cookie.trim().split("="))
        .map(([k, ...v]) => [k, v.join("=")])
    );

    const token = cookies["token_member_kit_1"]; // 🍪 Token salvo via cookie

    console.log("🌐 Host recebido:", host);
    console.log("🔗 URL acessada:", url.href);
    console.log("🍪 Cookie token_member_kit_1:", token);

    const isPortal = host === "portal.vendaseguro.com.br";
    const hasToken = !!token;

    if (isPortal && !hasToken) {
      const redirectUrl = `https://hub.vendaseguro.com.br/login?redirect_portal=${url.href}`;
      console.log("🔁 Redirecionando para:", redirectUrl);
      return Response.redirect(redirectUrl, 302);
    }

    console.log("✅ Cookie de token presente. Acesso liberado.");
    return fetch(request);
  }
};
