function formatPrice(value) {
  let num;
  if (typeof value === "string") {
    const digits = value.replace(/\D/g, "");
    num = parseInt(digits, 10) || 0;
  } else {
    num = value;
  }
  const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  });
  return `${formatter.format(num)} COP`;
}
function generateProductSlug(id, name) {
  if (!name) return String(id);
  const cleanName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${id}-${cleanName}`;
}
function getIdFromSlug(slug) {
  const parts = slug.split("-");
  return parseInt(parts[0], 10) || 0;
}

export { generateProductSlug as a, formatPrice as f, getIdFromSlug as g };
//# sourceMappingURL=format-CwTWAru-.mjs.map
