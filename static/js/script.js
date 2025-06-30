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
  // ---- RandomGlitch Effect for .randomly-glitched Elements ----
  function addRandomGlitchEffect(el) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:',.<>/?";
    if (el.dataset.randomglitching) return; // Prevent double-glitching
    el.dataset.randomglitching = "true";
    const original = el.textContent;
    let current = Array.from(original);
    let glitchedIndices = new Set();
    let interval = null;
    let revertTimeouts = [];

    function render(cursorIndex = null, cursorChar = null) {
      let out = "";
      for (let i = 0; i < current.length; i++) {
        if (/\s/.test(original[i])) {
          out += original[i];
        } else if (i === cursorIndex && cursorChar !== null) {
          out += `<span style="color: #0c0c0c; background: #d63333;">${cursorChar}</span>`;
        } else if (glitchedIndices.has(i)) {
          out += `<span style="color: #0c0c0c; background: #d63333;">${current[i]}</span>`;
        } else {
          out += original[i];
        }
      }
      el.innerHTML = out;
    }

    // Helper: stutter the cursor at a given index, then call cb(finalChar)
    function stutterCursor(idx, targetChar, cb, options = {}) {
      // options: {stutterCount, stutterDelay, finalDelay}
      const stutterCount =
        options.stutterCount || 3 + Math.floor(Math.random() * 2); // 3-4
      const stutterDelay = options.stutterDelay || 40;
      const finalDelay = options.finalDelay || 120;
      let count = 0;

      function doStutter() {
        if (count < stutterCount) {
          // Show a random char as cursor
          let randChar;
          do {
            randChar = chars[Math.floor(Math.random() * chars.length)];
          } while (randChar === original[idx]);
          render(idx, randChar);
          count++;
          setTimeout(doStutter, stutterDelay);
        } else {
          // Show the targetChar as cursor for a bit longer
          render(idx, targetChar);
          setTimeout(() => {
            cb(targetChar);
          }, finalDelay);
        }
      }
      doStutter();
    }

    function glitchOne() {
      // Find indices that are not yet glitched and are not whitespace
      let candidates = [];
      for (let i = 0; i < original.length; i++) {
        if (!glitchedIndices.has(i) && !/\s/.test(original[i])) {
          candidates.push(i);
        }
      }
      if (candidates.length === 0) {
        clearInterval(interval);
        interval = null;
        // Remove all glitched chars after a delay, with stutter-out for each
        let indices = Array.from(glitchedIndices);
        let revertAll = () => {
          el.textContent = original;
          delete el.dataset.randomglitching;
        };
        if (indices.length === 0) {
          setTimeout(revertAll, 1200);
          return;
        }
        // Stutter out each glitched char, one after another
        let i = 0;
        function stutterOutNext() {
          if (i >= indices.length) {
            setTimeout(revertAll, 200);
            return;
          }
          let idx = indices[i];
          let origChar = original[idx];
          stutterCursor(
            idx,
            origChar,
            () => {
              glitchedIndices.delete(idx);
              current[idx] = origChar;
              render();
              i++;
              setTimeout(stutterOutNext, 40 + Math.random() * 80);
            },
            {
              stutterCount: 2 + Math.floor(Math.random() * 2),
              stutterDelay: 40,
              finalDelay: 90,
            },
          );
        }
        stutterOutNext();
        return;
      }
      // Pick a random index to glitch
      const idx = candidates[Math.floor(Math.random() * candidates.length)];
      // Pick a random char different from the original
      let randChar;
      do {
        randChar = chars[Math.floor(Math.random() * chars.length)];
      } while (randChar === original[idx]);
      // Show the cursor effect with stutter-in
      stutterCursor(
        idx,
        randChar,
        () => {
          current[idx] = randChar;
          glitchedIndices.add(idx);
          render();
          // After a while, revert this character back to original with stutter-out
          let revertTimeout = setTimeout(
            () => {
              stutterCursor(
                idx,
                original[idx],
                () => {
                  glitchedIndices.delete(idx);
                  current[idx] = original[idx];
                  render();
                },
                {
                  stutterCount: 2 + Math.floor(Math.random() * 2),
                  stutterDelay: 40,
                  finalDelay: 90,
                },
              );
            },
            1000 + Math.random() * 1000,
          ); // 1-2s
          revertTimeouts.push(revertTimeout);
        },
        {
          stutterCount: 3 + Math.floor(Math.random() * 2),
          stutterDelay: 40,
          finalDelay: 120,
        },
      );
    }

    render();
    interval = setInterval(glitchOne, 500);
  }

  // Use observeInView for .randomly-glitched elements
  document.querySelectorAll(".randomly-glitched").forEach((el) => {
    window.observeInView(el, addRandomGlitchEffect);
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
