
/* ==========================================
   MOCHI'S WORLD — COMPLETE INTERACTIVE SCRIPT
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const scene = $("#homeScene");
  const mochi = $("#mochiCharacter");
  const sceneLabel = $("#sceneLabel");
  const toast = $("#toast");

  let toastTimer;
  let soundEnabled = false;
  let audioContext = null;
  let magicCount = 0;
  let cursorTimer = null;

  /* ==========================================
     1. TOAST MESSAGE
     ========================================== */

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }

  /* ==========================================
     2. MOCHI MAGIC PARTICLES
     ========================================== */

  const magicParticles = [
    "💗", "💕", "💖", "💝",
    "💛", "💚", "💜", "🩵",
    "💙", "🧡", "✨", "⭐",
    "🌟", "💫", "🌸", "🌷",
    "🦋", "♡", "✦", "💞"
  ];

  function createMochiMagic() {
    if (!scene || !mochi) return;

    magicCount++;

    // Trigger a new effect even if clicked quickly.
    mochi.classList.remove("jumping", "blink", "magic-glow");
    void mochi.offsetWidth;

    // Happy bunny jump.
    mochi.classList.add("jumping");

    // Magical pink and golden glow.
    mochi.classList.add("magic-glow");

    setTimeout(() => {
      mochi.classList.remove("jumping");
    }, 700);

    setTimeout(() => {
      mochi.classList.remove("magic-glow");
    }, 1500);

    // A little blink.
    setTimeout(() => {
      mochi.classList.add("blink");

      setTimeout(() => {
        mochi.classList.remove("blink");
      }, 450);
    }, 120);

    // Magical flash behind Mochi.
    const flash = document.createElement("div");
    flash.className = "mochi-magic-flash";
    flash.setAttribute("aria-hidden", "true");

    scene.appendChild(flash);

    setTimeout(() => flash.remove(), 1000);

    // Create colourful floating hearts and sparkles.
    const particleCount = 22;

    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        createParticle();
      }, i * 35);
    }

    // Update the message.
    if (sceneLabel) {
      const messages = [
        "♡ Mochi is sending you love!",
        "✨ You make Mochi sparkle!",
        "💗 A little happiness for you!",
        "🌸 Sending you magical hugs!",
        "💫 You're someone's little sunshine!",
        "💕 Mochi wishes you a lovely day!",
        "⭐ You found a little magic!"
      ];

      sceneLabel.textContent =
        messages[(magicCount - 1) % messages.length];
    }

    playMagicSound();

    // Accessible feedback.
    if (magicCount === 1) {
      showToast("✨ You unlocked Mochi's magic!");
    } else if (magicCount % 5 === 0) {
      showToast("💖 Mochi loves your visits!");
    }
  }

  function createParticle() {
    if (!scene) return;

    const particle = document.createElement("span");

    particle.className = "mochi-particle";
    particle.setAttribute("aria-hidden", "true");

    particle.textContent =
      magicParticles[
        Math.floor(Math.random() * magicParticles.length)
      ];

    // Keep particles inside the scene.
    const x = 8 + Math.random() * 84;
    const y = 24 + Math.random() * 52;

    const size = 16 + Math.random() * 20;
    const duration = 1.4 + Math.random() * 1.4;
    const drift = -45 + Math.random() * 90;
    const spin = -40 + Math.random() * 80;

    particle.style.setProperty("--start-x", `${x}%`);
    particle.style.setProperty("--start-y", `${y}%`);
    particle.style.setProperty("--particle-size", `${size}px`);
    particle.style.setProperty("--duration", `${duration}s`);
    particle.style.setProperty("--drift", `${drift}px`);
    particle.style.setProperty("--spin", `${spin}deg`);

    scene.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, (duration + 0.2) * 1000);
  }

  /* ==========================================
     3. CLICK OR KEYBOARD: MOCHI
     ========================================== */

  if (mochi) {
    mochi.addEventListener("click", createMochiMagic);

    mochi.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        createMochiMagic();
      }
    });
  }

  /* ==========================================
     4. MEET MOCHI BUTTON
     ========================================== */

  const meetMochi = $("#meetMochi");

  if (meetMochi) {
    meetMochi.addEventListener("click", () => {
      createMochiMagic();

      $("#homeScene")?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });
  }

  /* ==========================================
     5. CURSOR-REACTIVE MOCHI
     ========================================== */

  if (scene && mochi) {
    scene.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;

      const rect = scene.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const moveX = ((x - centerX) / centerX) * 7;
      const moveY = ((y - centerY) / centerY) * 5;

      mochi.style.setProperty("--cursor-x", `${moveX}px`);
      mochi.style.setProperty("--cursor-y", `${moveY}px`);
    });

    scene.addEventListener("pointerleave", () => {
      mochi.style.setProperty("--cursor-x", "0px");
      mochi.style.setProperty("--cursor-y", "0px");
    });
  }
  
/* ===== BUNNY FOLLOWS THE CURSOR ===== */

const bunnyCursor = document.getElementById("bunnyCursor");

if (bunnyCursor && window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;

    bunnyCursor.style.left = `${event.clientX + 12}px`;
    bunnyCursor.style.top = `${event.clientY + 12}px`;
    bunnyCursor.classList.add("visible");
  });

  document.addEventListener("pointerleave", () => {
    bunnyCursor.classList.remove("visible");
  });

  document.addEventListener("pointerenter", () => {
    bunnyCursor.classList.add("visible");
  });
}

  /* ==========================================
     6. CURSOR SPARKLE TRAIL
     ========================================== */

  let lastSparkleTime = 0;

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;

    const now = performance.now();

    if (now - lastSparkleTime < 100) return;

    lastSparkleTime = now;

    const sparkle = document.createElement("span");

    sparkle.className = "cursor-sparkle";
    sparkle.textContent = Math.random() > 0.5 ? "✦" : "✧";

    sparkle.setAttribute("aria-hidden", "true");

    sparkle.style.left = `${event.clientX}px`;
    sparkle.style.top = `${event.clientY}px`;
    sparkle.style.fontSize = `${10 + Math.random() * 10}px`;

    document.body.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 850);
  });

  /* ==========================================
     7. NIGHT MODE
     ========================================== */

  const nightToggle = $("#navNightToggle");

  function updateNightButton() {
    if (!nightToggle) return;

    const isNight = document.body.classList.contains("night");

    nightToggle.textContent = isNight ? "☀" : "☾";

    nightToggle.setAttribute(
      "aria-label",
      isNight ? "Switch to day mode" : "Switch to night mode"
    );

    nightToggle.setAttribute("aria-pressed", String(isNight));
  }

  if (nightToggle) {
    nightToggle.addEventListener("click", () => {
      document.body.classList.toggle("night");

      updateNightButton();

      showToast(
        document.body.classList.contains("night")
          ? "🌙 Welcome to Mochi's moonlit world!"
          : "☀️ The sunshine is back!"
      );
    });

    updateNightButton();
  }

  /* ==========================================
     8. DREAM PROJECT CARDS
     ========================================== */

  const projects = {
    wish: {
      icon: "✉️",
      title: "Wish Notes",
      description:
        "A pocket-sized place for your wishes, hopes and little thoughts.",
      extra:
        "Mochi's tip: Write down one tiny dream today. Every beautiful journey begins with a wish.",
      kicker: "DREAM 001"
    },

    sprout: {
      icon: "🌱",
      title: "Little Sprout",
      description:
        "A tiny garden where small steps grow into something lovely.",
      extra:
        "Mochi's tip: You don't need to grow quickly. Give yourself time, kindness and sunshine.",
      kicker: "DREAM 002"
    },

    orbit: {
      icon: "🪐",
      title: "Orbit of Dreams",
      description:
        "A little universe connecting ideas, hopes and possibilities.",
      extra:
        "Mochi's tip: Your imagination has no limits. Keep exploring the things that make you curious.",
      kicker: "DREAM 003"
    }
  };

  const projectCards = $$(".project-card");
  const projectDetail = $("#projectDetail");

  function openProject(key) {
    const project = projects[key];

    if (!project || !projectDetail) return;

    projectCards.forEach((card) => {
      const selected = card.dataset.project === key;

      card.setAttribute("aria-expanded", String(selected));
    });

    $("#detailIcon").textContent = project.icon;
    $("#detailTitle").textContent = project.title;
    $("#detailDescription").textContent = project.description;
    $("#detailExtra").textContent = project.extra;
    $("#detailKicker").textContent = project.kicker;

    projectDetail.hidden = false;

    projectDetail.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  projectCards.forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.dataset.project;

      if (card.getAttribute("aria-expanded") === "true") {
        closeProject();
      } else {
        openProject(key);
      }
    });
  });

  function closeProject() {
    if (!projectDetail) return;

    projectDetail.hidden = true;

    projectCards.forEach((card) => {
      card.setAttribute("aria-expanded", "false");
    });
  }

  $("#closeProject")?.addEventListener("click", closeProject);

  /* ==========================================
     9. MOOD MAGIC
     ========================================== */

  const moodSettings = {
    happy: {
      message: "Today is a lovely day for dreaming.",
      caption: "Mochi found a sunny little spot just for you.",
      label: "☀ Mochi is feeling sunny"
    },

    dreamy: {
      message: "Somewhere between the stars, your dreams are waiting.",
      caption: "Mochi is floating through a sleepy, moonlit sky.",
      label: "🌙 Mochi is dreaming among the stars"
    },

    brave: {
      message: "Little steps can lead to the biggest adventures.",
      caption: "Mochi believes in your courage, one tiny step at a time.",
      label: "🌿 Mochi is feeling brave"
    }
  };

  const moodPreview = $("#moodPreview");
  const moodMessage = $("#moodMessage");
  const moodCaption = $("#moodCaption");
  const moodButtons = $$(".mood-button");

   
function setMood(mood) {
  const settings = moodSettings[mood];

  if (!settings) return;

  // 1. Change the complete website theme
  document.body.classList.remove(
    "mood-happy",
    "mood-dreamy",
    "mood-brave"
  );

  document.body.classList.add(`mood-${mood}`);

  // 2. Update the Mochi preview if it exists
  if (moodPreview) {
    moodPreview.classList.remove(
      "mood-happy",
      "mood-dreamy",
      "mood-brave"
    );

    moodPreview.classList.add(`mood-${mood}`);
  }

  // 3. Update the message
  if (moodMessage) {
    moodMessage.textContent = settings.message;
  }

  // 4. Update the caption
  if (moodCaption) {
    moodCaption.textContent = settings.caption;
  }

  // 5. Update the scene label
  if (sceneLabel) {
    sceneLabel.textContent = settings.label;
  }

  // 6. Highlight the selected mood button
  moodButtons.forEach((button) => {
    const selected = button.dataset.mood === mood;

    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  // 7. Show confirmation
  showToast(`${settings.label} ✨`);
}


  moodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setMood(button.dataset.mood);
    });
  });

  /* ==========================================
     10. HIDDEN FLOWER EASTER EGG
     ========================================== */

  const hiddenFlower = $("#hiddenFlower");
  const secretHint = $("#secretHint");
  const secretResult = $("#secretResult");

  let flowerFound = false;

  if (hiddenFlower) {
    hiddenFlower.addEventListener("click", () => {
      if (flowerFound) {
        showToast("🌷 You already found Mochi's secret!");
        return;
      }

      flowerFound = true;

      document.body.classList.add("secret-found");
      hiddenFlower.classList.add("hinted");

      if (secretResult) {
        secretResult.textContent =
          "🌷 You found it! Your little reward is a world full of love, magic and possibilities. ♡";
      }

      hiddenFlower.setAttribute(
        "aria-label",
        "Secret flower discovered"
      );

      showToast("🎉 Secret unlocked! You're a dream explorer!");

      createMochiMagic();
    });
  }

  if (secretHint) {
    secretHint.addEventListener("click", () => {
      if (flowerFound) {
        if (secretResult) {
          secretResult.textContent =
            "✨ The secret flower is yours forever. Keep spreading kindness!";
        }
        return;
      }

      if (secretResult) {
        secretResult.textContent =
          "🌸 Look carefully near the top-left side of the page. A tiny flower is hiding there!";
      }

      hiddenFlower?.classList.add("hinted");

      showToast("🌷 A tiny clue has appeared!");
    });
  }

  /* ==========================================
     11. OPTIONAL MAGICAL SOUND
     ========================================== */

  function playMagicSound() {
    if (!soundEnabled) return;

    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) return;

      if (!audioContext) {
        audioContext = new AudioContextClass();
      }

      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const notes = [659.25, 783.99, 987.77];

      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        const startTime = audioContext.currentTime + index * 0.09;

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(0.0001, startTime);

        gain.gain.exponentialRampToValueAtTime(
          0.07,
          startTime + 0.025
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          startTime + 0.3
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.32);
      });
    } catch (error) {
      console.warn("Magical sound is unavailable.", error);
    }
  }

  const soundToggle = $("#soundToggle");

  if (soundToggle) {
    soundToggle.addEventListener("click", async () => {
      soundEnabled = !soundEnabled;

      soundToggle.textContent = soundEnabled
        ? "🔊 Sound on"
        : "🔇 Sound off";

      soundToggle.setAttribute(
        "aria-pressed",
        String(soundEnabled)
      );

      if (soundEnabled) {
        playMagicSound();
        showToast("🎵 Magical sounds are on!");
      } else {
        showToast("🔇 Magical sounds are off.");
      }
    });
  }

  /* ==========================================
     12. SCROLL REVEAL ANIMATIONS
     ========================================== */

  const revealElements = $$(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* ==========================================
     13. CURRENT YEAR
     ========================================== */

  const year = $("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* ==========================================
     14. KEYBOARD ESCAPE SUPPORT
     ========================================== */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProject();

      if (toast) {
        toast.classList.remove("show");
      }
    }
  });

  /* ==========================================
     15. INITIAL WELCOME
     ========================================== */

  if (sceneLabel) {
    sceneLabel.textContent = "☀ Mochi is feeling sunny";
  }

  console.log("✨ Mochi's World is ready!");
});


/* 🥕 Mochi's Heart + Sparkle Trail */

document.addEventListener("pointermove", (event) => {
  if (event.pointerType === "touch") return;

  const symbols = ["💗", "💖", "✨"];
  const trail = document.createElement("span");

  trail.textContent =
    symbols[Math.floor(Math.random() * symbols.length)];

  trail.style.position = "fixed";
  trail.style.left = `${event.clientX}px`;
  trail.style.top = `${event.clientY}px`;
  trail.style.pointerEvents = "none";
  trail.style.zIndex = "9999";
  trail.style.fontSize = "22px";
  trail.style.transform = "translate(-50%, -50%)";
  trail.style.transition =
    "opacity 0.9s ease, transform 0.9s ease";
  trail.style.opacity = "1";

  document.body.appendChild(trail);

  requestAnimationFrame(() => {
    trail.style.opacity = "0";
    trail.style.transform =
      "translate(-50%, -28px) scale(0.5)";
  });

  setTimeout(() => trail.remove(), 750);
});

/* MOCHI'S WORLD — Scroll Story Reveal */
document.addEventListener("DOMContentLoaded", () => {
  const storyElements = document.querySelectorAll(
    ".reveal, .story-step, .story-ending"
  );

  // If this browser doesn't support IntersectionObserver,
  // keep all content visible.
  if (!("IntersectionObserver" in window)) {
    storyElements.forEach((element) => {
      element.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  storyElements.forEach((element) => {
    observer.observe(element);
  });

  // Activate hiding only after the observer is ready.
  document.documentElement.classList.add("mochi-reveal-ready");

  // Reveal anything already visible on screen.
  storyElements.forEach((element) => {
    const rect = element.getBoundingClientRect();

    if (rect.top < window.innerHeight && rect.bottom > 0) {
      element.classList.add("is-visible");
      observer.unobserve(element);
    }
  });
});

/* =========================================
   MOCHI'S MAGICAL STORY GAME
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const starCount = document.getElementById("mochiStarCount");
  const chapterCount = document.getElementById("mochiChapterCount");
  const message = document.getElementById("mochiGameMessage");
  const stars = [...document.querySelectorAll("#mochiGameStars .game-star")];
  const nextButton = document.getElementById("mochiNextChapter");
  const unlockMessage = document.getElementById("mochiUnlockMessage");
  
const storyChoices = document.getElementById("mochiStoryChoices");
const choiceButtons = document.querySelectorAll(".mochi-choice");

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const choice = button.dataset.choice;

    if (choice === "forest") {
      message.textContent =
        "🌳 Mochi entered the Enchanted Forest and found a hidden fairy!";
    } else if (choice === "moon") {
      message.textContent =
        "🌙 Mochi visited the Moon Garden and discovered a magical moonstone!";
    }

    if (storyChoices) {
      storyChoices.hidden = true;
    }

    unlockMessage.textContent =
      "Wonderful choice! Collect the stars to continue your adventure. ⭐";
  });
});

  if (!starCount || !chapterCount || !message || !nextButton) return;

  let totalStars = Number(localStorage.getItem("mochiTotalStars")) || 0;
  let chapter = Number(localStorage.getItem("mochiChapter")) || 1;
  let collected = new Set();
  let adventureStarted = false;

  const chapterStories = [
    "Mochi found a magical forest! Collect the stars!",
    "Wonderful! Mochi discovered the Moon Garden! 🌙",
    "Amazing! Mochi reached the Rainbow Castle! 🏰",
    "You did it! Mochi's magical adventure continues! 🌈"
  ];

  function updateDisplay() {
    starCount.textContent = totalStars;
    chapterCount.textContent = chapter;

    stars.forEach((star) => {
      const id = star.dataset.star;
      star.classList.toggle("collected", collected.has(id));
      star.disabled = collected.has(id) || !adventureStarted;
    });

    if (collected.size === stars.length) {
      message.textContent = "You collected every star! ✨";
      unlockMessage.textContent = "Chapter complete! Tap below to continue.";
      nextButton.disabled = false;
      nextButton.textContent = "Unlock Next Chapter 🌟";
    } else {
      unlockMessage.textContent =
        `Collect all ${stars.length} stars to unlock the next chapter.`;
      nextButton.disabled = adventureStarted;
      nextButton.textContent = adventureStarted
        ? "Collect the Stars ⭐"
        : "Start Adventure ✨";
    }
  }

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      if (!adventureStarted || collected.has(star.dataset.star)) return;

      collected.add(star.dataset.star);
      totalStars++;
      localStorage.setItem("mochiTotalStars", totalStars);
      document.querySelectorAll("[data-level]").forEach((button) => {
          const level = Number(button.dataset.level);
          const unlocked = level === 1 || totalStars >= (level - 1) * 3;

          button.disabled = !unlocked;

          if (level === 2) {
          button.textContent = `🌙 Level 2 — Moon Garden ${unlocked ? "🔓" : "🔒"}`;
        } else if (level === 3) {
          button.textContent = `🏰 Level 3 — Rainbow Castle ${unlocked ? "🔓" : "🔒"}`;
        }
       });
      updateDisplay();
    });
  });

  
nextButton.addEventListener("click", () => {
  if (!adventureStarted) {
    adventureStarted = true;
    message.textContent = chapterStories[chapter - 1];

    if (storyChoices) {
      storyChoices.hidden = false;
    }

    updateDisplay();
    return;
  }

  if (collected.size !== stars.length) return;

  chapter++;
  localStorage.setItem("mochiChapter", chapter);
  if (chapter > chapterStories.length) chapter = 1;

  collected = new Set();
  adventureStarted = false;

  message.textContent = chapterStories[chapter - 1];

  if (storyChoices) {
    storyChoices.hidden = true;
  }

  updateDisplay();
});

updateDisplay();
});

/* MOCHI LEVEL UNLOCK SYSTEM */
document.addEventListener("DOMContentLoaded", () => {
  const levelButtons = document.querySelectorAll("[data-level]");
  const levelMessage = document.getElementById("mochiLevelMessage");

  if (!levelButtons.length || !levelMessage) return;

  function updateLevels() {
    const stars = Number(localStorage.getItem("mochiTotalStars")) || 0;

    levelButtons.forEach((button) => {
      const level = Number(button.dataset.level);
      const unlocked = level === 1 || stars >= (level - 1) * 3;

      button.disabled = !unlocked;
      button.textContent =
        level === 1 ? "🌳 Level 1 — Forest" :
        level === 2 ? `🌙 Level 2 — Moon Garden ${unlocked ? "🔓" : "🔒"}` :
        `🏰 Level 3 — Rainbow Castle ${unlocked ? "🔓" : "🔒"}`;
    });

    levelMessage.textContent =
      stars >= 6
        ? "Amazing! All 3 levels unlocked! ✨"
        : stars >= 3
        ? "Level 2 unlocked! Collect 3 more stars for Level 3! 🌙"
        : "Collect 3 stars to unlock Level 2! ⭐";
  }

    levelButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled) return;

      const level = Number(button.dataset.level);

      const stories = {
        1: "🌳 Welcome to the Enchanted Forest!",
        2: "🌙 Welcome to the Moon Garden!",
        3: "🏰 Welcome to the Rainbow Castle!"
      };

      levelMessage.textContent = stories[level];
    });
  });
    updateLevels();
});