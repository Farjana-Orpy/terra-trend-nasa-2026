// TerraTrend Pages Function: validate requests and proxy only approved NASA POWER parameters.
const NASA_ENDPOINT = "https://power.larc.nasa.gov/api/temporal/monthly/point";
const ALLOWED_PARAMETERS = new Set(["T2M", "PRECTOTCORR", "RH2M", "WS10M", "ALLSKY_SFC_SW_DWN"]);
function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }
  });
}
export async function onRequest({ request }) {
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405, headers: { Allow: "GET" } });
  const incoming = new URL(request.url);
  const q = incoming.searchParams;
  const parameter = q.get("parameters") || "";
  const latitude = Number(q.get("latitude"));
  const longitude = Number(q.get("longitude"));
  const start = Number(q.get("start"));
  const end = Number(q.get("end"));
  const latestCompleteYear = new Date().getUTCFullYear() - 1;
  if (!ALLOWED_PARAMETERS.has(parameter)) return jsonError("Unsupported NASA POWER parameter.", 400);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) return jsonError("Latitude or longitude is outside the valid range.", 400);
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1984 || end > latestCompleteYear || end - start < 2 || start > end) return jsonError("Choose a valid period containing at least three complete calendar years.", 400);
  const upstream = new URL(NASA_ENDPOINT);
  upstream.searchParams.set("parameters", parameter);
  upstream.searchParams.set("community", "AG");
  upstream.searchParams.set("latitude", String(latitude));
  upstream.searchParams.set("longitude", String(longitude));
  upstream.searchParams.set("start", String(start));
  upstream.searchParams.set("end", String(end));
  upstream.searchParams.set("format", "JSON");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(upstream.toString(), { method: "GET", headers: { Accept: "application/json" }, signal: controller.signal });
    const headers = new Headers(response.headers);
    headers.set("Cache-Control", response.ok ? "public, max-age=1800, s-maxage=1800" : "no-store");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-TerraTrend-Source", "NASA POWER Monthly Point API");
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  } catch (error) {
    const timedOut = error && error.name === "AbortError";
    return jsonError(timedOut ? "NASA POWER request timed out. Please retry." : "NASA POWER is temporarily unavailable. Please retry.", timedOut ? 504 : 502);
  } finally {
    clearTimeout(timeout);
  }
}