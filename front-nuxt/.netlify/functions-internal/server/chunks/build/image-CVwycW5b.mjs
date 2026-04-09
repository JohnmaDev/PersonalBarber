function optimizeImage(url, width = 0) {
  if (!url) return "/hero_barber.webp";
  if (!url.includes("cloudinary.com")) {
    return url;
  }
  if (url.includes("/f_auto") || url.includes("/q_auto")) {
    return url;
  }
  const transform = width > 0 ? `f_auto,q_auto,w_${width},c_limit` : "f_auto,q_auto";
  const parts = url.split("/upload/");
  if (parts.length === 2) {
    return `${parts[0]}/upload/${transform}/${parts[1]}`;
  }
  return url;
}

export { optimizeImage as o };
//# sourceMappingURL=image-CVwycW5b.mjs.map
