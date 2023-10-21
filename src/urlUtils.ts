export function getServerBaseUrl() {
  return !import.meta.env.PROD ? "https://es-hät-wieder-eine-glitzt.ch" : "";
}
