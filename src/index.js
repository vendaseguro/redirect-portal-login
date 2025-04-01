export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = request.headers.get("host");
    const path = url.pathname;
    const cookieHeader = request.headers.get("cookie") || "";
    const accept = request.headers.get("accept") || "";

    const isPortal = host === "portal.vendaseguro.com.br";
    const isRoot = path === "/";
    const isHtml = accept.includes("text/html");

    // Ignora arquivos estáticos
    const staticExt = [
      ".js", ".css", ".json", ".svg", ".png", ".jpg", ".jpeg", ".gif",
      ".webp", ".ico", ".woff", ".woff2", ".ttf", ".eot", ".otf", ".mp4", ".mp3", ".webm"
    ];
    const isStatic = staticExt.some(ext => url.pathname.endsWith(ext));

    // Verifica cookie e parâmetro token
    const cookieMatch = cookieHeader.match(/vs_token_portal=([^;]+)/);
    const cookieToken = cookieMatch ? cookieMatch[1] : null;
    const urlToken = url.searchParams.get("token");

    // DEBUG
    console.log("🟡 Venda Seguro - Debug");
    console.log("[debug] Host:", host);
    console.log("[debug] Path:", path);
    console.log("[debug] Accept Header:", accept);
    console.log("[debug] Cookie Header:", cookieHeader);
    console.log("[debug] Cookie Token:", cookieToken);
    console.log("[debug] URL Token:", urlToken);

    const shouldRedirect =
      isPortal &&
      !isRoot &&
      !cookieToken &&
      !urlToken &&
      isHtml &&
      !isStatic;

    console.log("[debug] shouldRedirect:", shouldRedirect);

    if (shouldRedirect) {
      const redirectUrl = `https://hub.vendaseguro.com.br/login?redirect_portal=${encodeURIComponent(url.href)}`;
      console.log("[debug] 🔁 Redirecionando para:", redirectUrl);
      return Response.redirect(redirectUrl, 302);
    }

    // Repassa requisição normalmente
    return fetch(request);
  },
};
