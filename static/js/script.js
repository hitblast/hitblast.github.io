document.addEventListener("DOMContentLoaded", function () {
  // ---- Icon loader ----
  document.querySelectorAll(".icon").forEach((el) => {
    fetch(el.dataset.src)
      .then((r) => r.text())
      .then((svg) => (el.innerHTML = svg));
  });

  // ---- Copy button ----
  document.querySelectorAll("#copy-btn").forEach((el) => {
    el.addEventListener("click", () => {
      let attr = el.getAttribute("data-copyable");
      el.setAttribute(
        "data-tooltip",
        el.getAttribute("data-copynotif") || "copied!",
      );
      navigator.clipboard.writeText(attr);

      setTimeout(() => {
        el.removeAttribute("data-tooltip");
      }, 4000);
    });
  });

  // ---- Random Message for Blep Section ----
  (function () {
    const messages = [
      "snaccs? :3",
      "mie ^w^",
      "mieeeee :3",
      "agomeoww ^w^",
      "pats? :<",
      "*scratches* :D",
      "*mlem mlem*",
      "*^w^*",
      ":D",
    ];

    const randomMsgElem = document.getElementById("random-message");
    if (randomMsgElem) {
      randomMsgElem.textContent =
        messages[Math.floor(Math.random() * messages.length)];
    }
  })();

  // ---- Blep Image Toggle Code ----
  (function () {
    const img = document.getElementById("blep");
    if (!img) return;

    let clickable = true;
    const happySrc = img.getAttribute("data-happy-src");
    img.addEventListener("click", function () {
      if (!clickable) return;
      clickable = false;
      const originalSrc = img.src;
      if (happySrc) img.src = happySrc;
      setTimeout(function () {
        img.src = originalSrc;
        clickable = true;
      }, 2000);
    });
  })();

  // ---- Equalize Project Card Heights ----
  (function () {
    function debounce(fn, wait = 120) {
      let t;
      return (...a) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...a), wait);
      };
    }

    function equalizeProjectCards() {
      const cards = document.querySelectorAll(".project-card");
      if (!cards.length) return;

      cards.forEach((c) => (c.style.minHeight = ""));
      let max = 0;
      cards.forEach((c) => {
        max = Math.max(max, c.getBoundingClientRect().height);
      });
      cards.forEach((c) => (c.style.minHeight = `${Math.ceil(max)}px`));
    }

    function whenImagesLoaded(cb) {
      const imgs = Array.from(document.images);
      if (!imgs.length) return cb();
      Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((r) => (img.onload = img.onerror = r)),
        ),
      ).then(cb);
    }

    whenImagesLoaded(equalizeProjectCards);
    window.addEventListener("resize", debounce(equalizeProjectCards));
  })();
});
