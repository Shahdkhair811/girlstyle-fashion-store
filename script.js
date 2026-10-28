document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // Navbar Toggle
  // =========================
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  function setMenu(open) {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.toggle("active", open);
    menuToggle.setAttribute("aria-expanded", String(open));

    const icon = menuToggle.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars", !open);
      icon.classList.toggle("fa-xmark", open);
    }
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      setMenu(!navLinks.classList.contains("active"));
    });

    // Keyboard support (the toggle is a div with role="button")
    menuToggle.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setMenu(!navLinks.classList.contains("active"));
      }
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    // Close on Escape or when clicking outside
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenu(false);
    });

    document.addEventListener("click", (event) => {
      if (navbar && !navbar.contains(event.target)) setMenu(false);
    });

    // Reset when resizing back to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) setMenu(false);
    });
  }

  // Navbar scroll effect
  function handleNavbarScroll() {
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 50);
    }
  }

  window.addEventListener("scroll", handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // =========================
  // Shared helpers
  // =========================
  function animateButton(button) {
    button.style.transform = "scale(0.95)";

    setTimeout(() => {
      button.style.transform = "";
    }, 200);
  }

  // Replays the fade-in animation. "backwards" (not "forwards") so the
  // final state doesn't override the :hover transform of the cards.
  function replayFadeIn(element) {
    element.style.animation = "none";
    void element.offsetWidth; // force reflow
    element.style.animation = "fadeInUp 0.6s ease-out backwards";
  }

  function applyFilter(items, activeAttr, filter) {
    items.forEach((item) => {
      const shouldShow =
        filter === "all" || item.getAttribute(activeAttr) === filter;

      item.style.display = shouldShow ? "" : "none";

      if (shouldShow) {
        replayFadeIn(item);
      } else {
        item.style.animation = "";
      }
    });
  }

  // =========================
  // Cart Counter
  // =========================
  function updateCartCount() {
    const cartCount = document.querySelector(".cart-count");

    if (!cartCount) return;

    const currentCount = Number.parseInt(cartCount.textContent.trim(), 10);
    const count = Number.isNaN(currentCount) ? 0 : currentCount;

    cartCount.textContent = String(count + 1);
    cartCount.style.animation = "none";

    // Restart animation
    void cartCount.offsetWidth;

    cartCount.style.animation = "pulse 2s infinite";
  }

  // Cart icon shouldn't jump to the top of the page
  const cartLink = document.querySelector(".cart");
  if (cartLink) {
    cartLink.addEventListener("click", (event) => event.preventDefault());
  }

  // Add to cart buttons
  document.querySelectorAll(".product-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      animateButton(button);
      updateCartCount();
    });
  });

  // =========================
  // Collection Filters
  // =========================
  const filterTabs = document.querySelectorAll(".filter-tab");
  const collectionCards = document.querySelectorAll(".collection-card");

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");

      applyFilter(collectionCards, "data-category", tab.getAttribute("data-filter"));
    });
  });

  // Collection card hover effects
  collectionCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.zIndex = "10";
    });

    card.addEventListener("mouseleave", () => {
      card.style.zIndex = "";
    });
  });

  // View collection buttons (cards + featured collection)
  document.querySelectorAll(".collection-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      animateButton(button);

      const collectionName = button
        .closest(".collection-info, .featured-content")
        ?.querySelector(".collection-name, .featured-title")
        ?.textContent?.trim();

      if (collectionName) {
        alert(`Opening ${collectionName} collection!`);
      }
    });
  });

  // =========================
  // Countdown Timers
  // =========================

  // Set each deadline ONCE, not on every update
  const countdownEnd = Date.now() + 2 * 24 * 60 * 60 * 1000;
  const flashSaleEnd = Date.now() + 2 * 60 * 60 * 1000;

  const pad = (value) => String(value).padStart(2, "0");

  function updateCountdown() {
    const distance = Math.max(0, countdownEnd - Date.now());

    const values = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };

    Object.entries(values).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = pad(value);
    });
  }

  function updateFlashSale() {
    const flashTimer = document.getElementById("flash-timer");

    if (!flashTimer) return;

    const distance = Math.max(0, flashSaleEnd - Date.now());

    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    flashTimer.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  function updateTimers() {
    updateCountdown();
    updateFlashSale();
  }

  updateTimers();
  setInterval(updateTimers, 1000);

  // =========================
  // Sale Category Filters
  // =========================
  const saleCategories = document.querySelectorAll(".sale-category");
  const saleProducts = document.querySelectorAll(".sale-product");

  saleCategories.forEach((category) => {
    category.addEventListener("click", () => {
      saleCategories.forEach((item) => item.classList.remove("active"));
      category.classList.add("active");

      applyFilter(saleProducts, "data-category", category.getAttribute("data-category"));
    });
  });

  // =========================
  // Sale Product Buttons
  // =========================
  document.querySelectorAll(".sale-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      animateButton(button);

      const productName = button
        .closest(".product-info, .mega-content")
        ?.querySelector(".product-title, .mega-title")
        ?.textContent?.trim();

      if (productName) {
        updateCartCount();
        alert(`Added ${productName} to your cart!`);
      }
    });
  });

  // Sale product hover effects
  saleProducts.forEach((product) => {
    product.addEventListener("mouseenter", () => {
      product.style.zIndex = "10";
    });

    product.addEventListener("mouseleave", () => {
      product.style.zIndex = "";
    });
  });

  // =========================
  // Newsletter
  // =========================
  const newsletterForm = document.querySelector(".newsletter-form");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      alert("Thanks for subscribing!");
      newsletterForm.reset();
    });
  }
});
