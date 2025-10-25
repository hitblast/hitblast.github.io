document.addEventListener("DOMContentLoaded", function () {
  // ---- Pixelated curtain effect ----
  (function pixelatedCurtain() {
    const curtain = document.getElementById("curtain");
    if (!curtain) return;

    // Only play effect if not played in this session
    if (sessionStorage.getItem("curtainPlayed")) {
      if (curtain && curtain.parentNode) {
        curtain.parentNode.removeChild(curtain);
      }
      return;
    }
    sessionStorage.setItem("curtainPlayed", "true");

    // Ensure curtain has red background at start
    curtain.style.background = "var(--pico-primary)";

    // Add centered FontAwesome icon
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-hammer";
    icon.style.position = "absolute";
    icon.style.top = "50%";
    icon.style.left = "50%";
    icon.style.transform = "translate(-50%, -50%)";
    icon.style.fontSize = "5rem";
    icon.style.color = "#000";
    icon.style.zIndex = "10000";
    icon.id = "curtain-icon";
    icon.style.opacity = "0";
    icon.style.transition = "opacity 0.7s cubic-bezier(.42,0,.58,1)";
    curtain.appendChild(icon);

    // Fade in and out repeatedly for 3 seconds, then fade out permanently
    let fadeState = true;
    let fadeCycles = 0;
    const fadeInterval = setInterval(() => {
      fadeState = !fadeState;
      icon.style.opacity = fadeState ? "1" : "0.4";
      fadeCycles += 1;
      // Each cycle is 500ms (fade in + fade out)
      if (fadeCycles >= 7) {
        // 3 seconds / 0.5s = 6 cycles
        clearInterval(fadeInterval);
        // Fade out permanently
        icon.style.opacity = "0";
      }
    }, 500);

    // After icon fade, start slide-to-left animation for the overlay after 1s
    setTimeout(() => {
      if (icon && icon.parentNode) {
        icon.parentNode.removeChild(icon);
      }

      // Prepare for slide animation
      curtain.style.transition = "transform 0.8s cubic-bezier(.77,0,.18,1)";
      curtain.style.willChange = "transform";
      curtain.style.transform = "translateY(0)";

      // Start slide-to-left after 1s
      setTimeout(() => {
        // Use 100vh instead of 100vw to ensure it covers the full height
        curtain.style.transform = "translateY(100vh)";
      }, 1000);

      // Remove curtain after animation completes
      setTimeout(() => {
        if (curtain && curtain.parentNode) {
          curtain.parentNode.removeChild(curtain);
        }
      }, 1800); // 0.8s animation + 1s delay
    }, 4000); // 3s icon + 1s delay
  })();

  // ---- Icon append on desktop nav item hover ----
  function setupDesktopNavHoverIcons() {
    const desktopNav = document.querySelector(".desktop-nav");
    if (!desktopNav) return;

    // Map li class to FontAwesome icon class
    const iconMap = {
      "desktop-nav-blog": "fa-solid fa-book-open",
      "desktop-nav-rss": "fa-solid fa-rss",
      "desktop-nav-github": "fa-brands fa-github",
      "desktop-nav-mastodon": "fa-brands fa-mastodon",
      "desktop-nav-linkedin": "fa-brands fa-linkedin",
      "desktop-nav-bluesky": "fa-brands fa-bluesky",
    };

    desktopNav.querySelectorAll("li > a").forEach(function (link) {
      link.addEventListener("mouseenter", function () {
        // Only add if not already present
        if (!link.querySelector(".hover-icon")) {
          // Find the parent li and its class
          const li = link.closest("li");
          let iconClass = "fa-solid fa-arrow-right"; // default
          if (li) {
            for (const cls of li.classList) {
              if (iconMap[cls]) {
                iconClass = iconMap[cls];
                break;
              }
            }
          }
          const icon = document.createElement("i");
          icon.className = iconClass + " hover-icon";
          icon.style.marginRight = "0.4em";
          icon.style.verticalAlign = "middle";
          // Insert icon before the first child (usually <small>)
          link.insertBefore(icon, link.firstChild);
        }
      });
      link.addEventListener("mouseleave", function () {
        const icon = link.querySelector(".hover-icon");
        if (icon) {
          icon.remove();
        }
      });
    });
  }

  setupDesktopNavHoverIcons();

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

        // Don't show dialog on mobile-sized screens
        if (window.innerWidth <= 768) return;

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
