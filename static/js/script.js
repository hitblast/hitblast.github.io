document.addEventListener("DOMContentLoaded", function () {
  // ---- Set dark mode as default theme ----
  document.documentElement.setAttribute("data-theme", "dark");

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
    const img = document.getElementById("blep-image");
    if (!img) return;

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

  // ---- Rainbow Sparkle Icons ----
  document.querySelectorAll(".rainbow").forEach((element) => {
    const sparkleIcon = document.createElement("i");
    sparkleIcon.className = "fa-solid fa-wand-magic-sparkles rainbow";
    sparkleIcon.style.marginLeft = "0.5rem";
    element.appendChild(sparkleIcon);
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
