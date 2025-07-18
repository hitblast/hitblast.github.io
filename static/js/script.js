document.addEventListener("DOMContentLoaded", function () {
  // ---- Set dark mode as default theme ----
  document.documentElement.setAttribute("data-theme", "dark");

  // ---- Shared IntersectionObserver Utility ----
  // Allows any component to use the observer for in-view effects
  window.observeInView = (function () {
    // Map from element to callback
    const elementCallbackMap = new WeakMap();

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cb = elementCallbackMap.get(entry.target);
            if (typeof cb === "function") {
              cb(entry.target, entry, obs);
            }
            obs.unobserve(entry.target); // Only trigger once per element
            elementCallbackMap.delete(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    // Public API: observeInView(element, callback)
    return function observeInView(element, callback) {
      if (!element || typeof callback !== "function") return;
      elementCallbackMap.set(element, callback);
      observer.observe(element);
    };
  })();

  // ---- Glitch Effect for .glitched Elements ----
  function addGlitchEffect(el) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:',.<>/?";
    if (el.dataset.glitching) return; // Prevent double-glitching
    el.dataset.glitching = "true";
    const original = el.textContent;
    let obfuscated = Array.from(original);

    // Obfuscate all non-whitespace characters
    for (let i = 0; i < original.length; i++) {
      if (/\s/.test(original[i])) {
        obfuscated[i] = original[i];
      } else {
        let randChar;
        do {
          randChar = chars[Math.floor(Math.random() * chars.length)];
        } while (randChar === original[i]);
        obfuscated[i] =
          `<span style="color: #0c0c0c; background: #d63333;">${randChar}</span>`;
      }
    }
    el.innerHTML = obfuscated.join("");

    // Reveal characters slowly from end to start
    let revealIndex = original.length - 1;
    function revealNext() {
      if (revealIndex < 0) {
        el.textContent = original;
        delete el.dataset.glitching;
        return;
      }
      // Replace the obfuscated character at revealIndex with the original
      let current = [];
      for (let i = 0; i < original.length; i++) {
        if (i > revealIndex) {
          current[i] = original[i];
        } else if (/\s/.test(original[i])) {
          current[i] = original[i];
        } else {
          let randChar;
          do {
            randChar = chars[Math.floor(Math.random() * chars.length)];
          } while (randChar === original[i]);
          current[i] =
            `<span style="color: #0c0c0c; background: #d63333;">${randChar}</span>`;
        }
      }
      el.innerHTML = current.join("");
      revealIndex--;
      setTimeout(revealNext, 50);
    }
    setTimeout(revealNext, 200);
  }

  // Use observeInView for .glitched elements
  document.querySelectorAll(".glitched").forEach((el) => {
    window.observeInView(el, addGlitchEffect);
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
