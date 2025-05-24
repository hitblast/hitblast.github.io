document.addEventListener("DOMContentLoaded", function () {
  // ---- Auto theme based on system preference ----
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
  } else {
      document.documentElement.setAttribute('data-theme', 'light');
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      const newColorScheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newColorScheme);
  });
  // ---- Random Message for Blep Section ----
  (function () {
    if(document.documentElement.getAttribute('data-theme') === 'dark') return;
    const messages = [
      "snaccs? :3",
      "mie ^w^",
      "mieeeeeeeee :3",
      "agoumeowwwww ^w^",
      "pats? :<",
      "no pats? :<",
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
    const img = document.getElementById("blep-image");
    if (!img) return;
    if(document.documentElement.getAttribute('data-theme') === 'dark') {
      img.src = "images/shadowblep.png";
      return;
    }
    let clickable = true;
    // Use the data-happy-src attribute for the happy image URL
    const happySrc = img.getAttribute("data-happy-src");
    img.addEventListener("click", function () {
      if (!clickable) return;
      clickable = false;
      const originalSrc = img.src;
      if (happySrc) {
        img.src = happySrc;
      }
      setTimeout(function () {
        img.src = originalSrc;
        clickable = true;
      }, 2000);
    });
  })();

  // ---- Copyable Code Blocks ----
  document.querySelectorAll("code.copyable").forEach((code) => {
    const original = code.innerText.trim();
    code.dataset.original = original;
    code.innerHTML =
      '<i class="fa-regular fa-clipboard"></i> ' + code.innerHTML;
    code.addEventListener("click", () => {
      navigator.clipboard.writeText(code.dataset.original);
      code.innerHTML =
        '<i class="fa-regular fa-clipboard"></i> copied to clipboard!';
      setTimeout(() => {
        code.innerHTML =
          '<i class="fa-regular fa-clipboard"></i> ' + code.dataset.original;
      }, 2000);
    });
  });

  // ---- Dialog Open/Close Code ----
  document.querySelectorAll("dialog").forEach((dialog) => {
    const container = dialog.parentElement;
    if (container) {
      container.addEventListener("click", function (e) {
        // Prevent clicks on buttons or links from triggering the dialog.
        if (e.target.closest("a") || e.target.closest("button")) return;
        dialog.showModal();
      });
    }
    const closeBtn = dialog.querySelector(".close-dialog");
    if (closeBtn) {
      closeBtn.addEventListener("click", function (e) {
        dialog.close();
        e.stopPropagation();
      });
    }
  });
});
