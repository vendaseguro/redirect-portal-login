export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    console.log("🚀 Worker executado para:", url.href);

    const isPortal = url.hostname === "portal.vendaseguro.com.br";
    const hasToken = url.searchParams.has("token");

    console.log("🌐 Host:", url.hostname);
    console.log("🔍 Token presente:", hasToken);

    // Se for o portal e não tiver token, redireciona
    if (isPortal && !hasToken) {
      const redirectUrl = `https://hub.vendaseguro.com.br/login?redirect_portal=${encodeURIComponent(url.href)}`;
      console.log("🔁 Redirecionando para:", redirectUrl);
      return Response.redirect(redirectUrl, 302);
    }

    console.log("✅ Sem redirecionamento, seguindo para o servidor.");
    return fetch(request);
  },
};
