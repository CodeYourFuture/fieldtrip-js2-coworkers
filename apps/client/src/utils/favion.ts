export const changeFavicon = (file: string) => {
  const link: HTMLLinkElement =
    window.document.querySelector("link[rel*='icon']") ||
    window.document.createElement("link");

  link.type = "image/svg+xml";
  link.rel = "shortcut icon";
  link.href = link.href.replace(/[^\/]+$/, file);

  window.document.getElementsByTagName("head")[0].appendChild(link);
};
