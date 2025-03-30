export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Se for portal e não tiver token, redireciona para o hub
    if (
      url.hostname === "portal.vendaseguro.com.br" &&
      !url.searchParams.has("token")
    ) {
      const redirectUrl = `https://hub.vendaseguro.com.br/login?redirect_portal=${encodeURIComponent(url.href)}`;
      return Response.redirect(redirectUrl, 302);
    }

    // Caso contrário, segue normalmente
    return fetch(request);
  },
};
