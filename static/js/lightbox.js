// Shows linked images of a post in an overlay. Links stay plain links
// without JavaScript, or when opened in a new tab.
(() => {
  const IMAGE = /\.(jpe?g|png|gif|webp|bmp)(\?|$)/i;
  const links = [...document.querySelectorAll(".post-body a, .post-assets a.thumb")].filter((a) => IMAGE.test(a.pathname) && a.querySelector("img"));
  const hrefs = [...new Set(links.map((a) => a.href))];
  if (!hrefs.length || !window.HTMLDialogElement) return;
  const captions = new Map();
  for (const a of links) {
    const text = a.querySelector(".asset__caption")?.textContent || a.querySelector("img").alt;
    if (text && !captions.get(a.href)) captions.set(a.href, text);
  }

  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.innerHTML = `
    <figure class="lightbox__figure"><img class="lightbox__image" alt=""><figcaption class="lightbox__caption"></figcaption></figure>
    <button class="lightbox__close" type="button" aria-label="Close">&times;</button>
    <button class="lightbox__prev" type="button" aria-label="Previous image">&lsaquo;</button>
    <button class="lightbox__next" type="button" aria-label="Next image">&rsaquo;</button>
    <a class="lightbox__original" target="_blank" rel="noopener">Open original</a>`;
  document.body.append(dialog);
  const img = dialog.querySelector(".lightbox__image");
  const caption = dialog.querySelector(".lightbox__caption");
  const original = dialog.querySelector(".lightbox__original");
  dialog.classList.toggle("lightbox--single", hrefs.length === 1);
  let index = 0;

  function show(i) {
    index = (i + hrefs.length) % hrefs.length;
    const href = hrefs[index];
    dialog.classList.add("lightbox--loading");
    img.onload = img.onerror = () => dialog.classList.remove("lightbox--loading");
    img.src = href;
    const text = captions.get(href) || "";
    caption.textContent = hrefs.length > 1 ? `${text}${text ? " — " : ""}${index + 1} / ${hrefs.length}` : text;
    original.href = href;
    // Warm the cache for the next image.
    if (hrefs.length > 1) new Image().src = hrefs[(index + 1) % hrefs.length];
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a || !links.includes(a) || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    e.preventDefault();
    show(hrefs.indexOf(a.href));
    dialog.showModal();
  });
  dialog.querySelector(".lightbox__close").onclick = () => dialog.close();
  dialog.querySelector(".lightbox__prev").onclick = () => show(index - 1);
  dialog.querySelector(".lightbox__next").onclick = () => show(index + 1);
  // A click on the backdrop (the dialog itself, outside the figure) closes.
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog || e.target.classList.contains("lightbox__figure")) dialog.close();
  });
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
  dialog.addEventListener("close", () => img.removeAttribute("src"));

  let startX = null;
  dialog.addEventListener("touchstart", (e) => (startX = e.touches.length === 1 ? e.touches[0].clientX : null), { passive: true });
  dialog.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
