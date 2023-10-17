export function getServerBaseUrl() {
  return !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "https://es-hät-wieder-eine-glitzt.ch"
    : "";
}
