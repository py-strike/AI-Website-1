(function ($) {
  "use strict";

  var $window = $(window);
  var $body = $("body");
  var $document = $(document);

  // ============================
  // Preloader
  // ============================
  $(window).on("load", function () {
    $("#preloader").fadeOut(400);
  });

  // ============================
  // Menu handling
  // ============================
  var $menuContainer = $("#menu-container");
  var $overlay = $("#overlay");
  var $openBtn = $("#open-menu-button");

  var media = window.matchMedia("(width < 992px)");

  // Main menu functions
  function openMenu() {
    $menuContainer.addClass("show");
    $overlay.addClass("show");
    $openBtn.attr("aria-expanded", "true");
  }

  function closeMenu() {
    $menuContainer.removeClass("show");
    $overlay.removeClass("show");
    $openBtn.attr("aria-expanded", "false");

    // Close all submenus when closing main menu
    closeAllSubmenus();
  }

  // Submenu functions
  function toggleSubmenu(event, linkElement) {
    // Only prevent default and handle clicks on mobile
    if ($window.width() <= 992) {
      event.preventDefault();
      event.stopPropagation();

      var $linkElement = $(linkElement);
      var $menuItem = $linkElement.parent();
      var $submenu = $menuItem.find(".submenu");

      // Check if this submenu is currently open
      var isCurrentlyOpen = $menuItem.hasClass("active");

      // Close other open submenus
      var $allMenuItems = $(".menu-item");
      $allMenuItems.each(function () {
        var $item = $(this);
        if ($item[0] !== $menuItem[0]) {
          $item.removeClass("active");
          var $otherSubmenu = $item.find(".submenu");
          if ($otherSubmenu.length) {
            $otherSubmenu.removeClass("show");
          }
        }
      });

      // Toggle current submenu
      if (isCurrentlyOpen) {
        $menuItem.removeClass("active");
        $submenu.removeClass("show");
      } else {
        $menuItem.addClass("active");
        $submenu.addClass("show");
      }
    }
  }

  function closeAllSubmenus() {
    var $allMenuItems = $(".menu-item");
    var $allSubmenus = $(".submenu");

    $allMenuItems.removeClass("active");
    $allSubmenus.removeClass("show");
  }

  // Handle window resize
  function handleResize() {
    if ($window.width() > 992) {
      closeMenu();
    }
  }

  // ============================
  // Partner Swiper
  // ============================
  function initializePartnerSwiper() {
    setTimeout(function () {
      if (typeof Swiper !== "undefined") {
        try {
          var partnerSwiper = new Swiper(".partner-swiper", {
            slidesPerView: 2,
            spaceBetween: 20,
            loop: true,
            autoplay: {
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            },
            speed: 1500,
            effect: "slide",
            grabCursor: true,
            breakpoints: {
              320: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 25,
              },
              1200: {
                slidesPerView: 5,
                spaceBetween: 44,
              },
            },
          });

          partnerSwiper.autoplay.start();
        } catch (error) {
          console.error("Error initializing Swiper:", error);
        }
      } else {
        console.error("Swiper not loaded!");
      }
    }, 100);
  }

  // ============================
  // Testimonials Swiper
  // ============================
  function initializeTestimonialsSwiper() {
    document.addEventListener("DOMContentLoaded", function () {
      new Swiper(".testimonials-swiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        navigation: {
          nextEl: ".testimonial-nav-next",
          prevEl: ".testimonial-nav-prev",
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          // 992: {
          //   slidesPerView: 2,
          // },
        },
      });
    });
  }

  // ============================
  // Event Listeners Setup
  // ============================
  function setupEventListeners() {
    // Menu overlay click handler
    $overlay.on("click", closeMenu);

    // Escape key handler
    $document.on("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Window resize handler
    $window.on("resize", handleResize);

    // Close menu button handler
    $("#close-menu-button").on("click", function (e) {
      e.preventDefault();
      closeMenu();
    });

    // Submenu click handlers (delegated)
    $document.on("click", ".menu-item > a", function (e) {
      toggleSubmenu(e, this);
    });

    // Open menu button handler
    $openBtn.on("click", function (e) {
      e.preventDefault();
      openMenu();
    });

    // hero tabs event listeners
    initializeHeroTabs();
  }

  // ============================
  // Hero Image Scroll Animation
  // ============================
  // 1. PARALLAX ZOOM WITH CLIP PATH REVEAL
  function heroParallaxZoomReveal() {
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.fromTo(
        ".hero-img",
        {
          scale: 1.5,
          yPercent: -30,
          clipPath: "inset(40% 20% 40% 20%)", // Starts cropped from all sides
          filter: "brightness(0.6) contrast(1.2)",
        },
        {
          scale: 1,
          yPercent: 0,
          clipPath: "inset(0% 0% 0% 0%)", // Fully revealed
          filter: "brightness(1) contrast(1)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".hero-img-container",
            start: "top bottom",
            end: "bottom 20%",
            scrub: 1.2,
          },
        }
      );

      // Animate floating icons with magnetic effect
      gsap.fromTo(
        ".hero-icon",
        {
          scale: 0,
          rotation: 180,
          opacity: 0,
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "elastic.out(1, 0.3)",
          scrollTrigger: {
            trigger: ".hero-img-container",
            start: "top 80%",
            end: "top 40%",
            scrub: 0.5,
          },
        }
      );
    }
  }

  /* Testimonials Swiper Initialization Start */
  function testimonialsInit() {
    var $testimonialsSwiper = $(".testimonials-swiper");

    if ($testimonialsSwiper.length && typeof Swiper !== "undefined") {
      var testimonialsSwiper = new Swiper(".testimonials-swiper", {
        slidesPerView: 2,
        spaceBetween: 30,
        loop: true,
        navigation: {
          nextEl: ".testimonial-nav-next",
          prevEl: ".testimonial-nav-prev",
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          992: {
            slidesPerView: 2,
          },
        },
      });

      // Custom navigation buttons
      $(".testimonial-nav-prev").on("click", function () {
        testimonialsSwiper.slidePrev();
      });

      $(".testimonial-nav-next").on("click", function () {
        testimonialsSwiper.slideNext();
      });
    }
  }
  /* Testimonials Swiper Initialization End */

  // ============================
  // Hero Tab Functionality
  // ============================
  function initializeHeroTabs() {
    var $tabButtons = $(".tab-btn");
    var $heroImage = $("#hero-image");

    var imageSources = {
      img1: "images/hero-img-1.webp",
      img2: "images/hero-img-2.png",
      img3: "images/hero-img-3.png",
    };

    if ($tabButtons.length === 0 || $heroImage.length === 0) return;

    $tabButtons.on("click", function () {
      var $clickedBtn = $(this);
      var targetImg = $clickedBtn.data("img");

      if ($heroImage.attr("src") === imageSources[targetImg]) return; // skip if same

      // Active state for tabs
      $tabButtons.removeClass("tab-btn-active");
      $clickedBtn.addClass("tab-btn-active");

      // Trigger fade-out animation
      $heroImage.addClass("fade-out");

      // When fade-out finishes → swap image → fade-in
      $heroImage.one("transitionend", function () {
        $heroImage.attr("src", imageSources[targetImg]);
        $heroImage.removeClass("fade-out").addClass("fade-in");

        // Clean up fade-in class after animation
        setTimeout(() => $heroImage.removeClass("fade-in"), 400);
      });
    });
  }

  // ============================
  // Counter
  // ============================
  function initializeCounter() {
    if ($(".counter").length) {
      $(".counter").counterUp({
        delay: 10,
        time: 1700,
      });
    }
  }

  // ============================
  // Text Animation
  // ============================
  function initTextAnimations() {
    // Check if GSAP and SplitText are available
    if (typeof gsap === "undefined" || typeof SplitText === "undefined") {
      console.warn("GSAP or SplitText not loaded");
      return;
    }

    if ($(".text-anime-4").length) {
      let staggerAmount = 0.02;
      let translateXValue = 15;
      let delayValue = 0.15;
      let easeType = "power3.out";
      let animatedTextElements = document.querySelectorAll(".text-anime-4");

      animatedTextElements.forEach((element) => {
        let animationSplitText = new SplitText(element, {
          type: "chars, words",
        });

        gsap.from(animationSplitText.chars, {
          duration: 1.1,
          delay: delayValue,
          x: translateXValue,
          opacity: 0,
          stagger: staggerAmount,
          ease: easeType,
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
          },
        });
      });
    }

    // Style 2: Smooth Character Cascade - Refined character-by-character reveal
    // Sophisticated timing for premium feel
    if ($(".text-anime-2").length) {
      let staggerAmount = 0.015;
      let translateYValue = 15;
      let delayValue = 0.1;
      let easeType = "power3.out";
      let animatedTextElements = document.querySelectorAll(".text-anime-2");

      animatedTextElements.forEach((element) => {
        let animationSplitText = new SplitText(element, {
          type: "chars, words",
        });
        gsap.from(animationSplitText.chars, {
          duration: 0.8,
          delay: delayValue,
          y: translateYValue,
          opacity: 0,
          stagger: staggerAmount,
          ease: easeType,
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
          },
        });
      });
    }

    // Style 3: Precision Reveal - Clean vertical emergence with subtle depth
    // Enterprise-grade animation with layered lines
    if ($(".text-anime-3").length) {
      let animatedTextElements = document.querySelectorAll(".text-anime-3");

      animatedTextElements.forEach((element) => {
        // Reset if needed
        if (element.animation) {
          element.animation.progress(1).kill();
          element.split.revert();
        }

        element.split = new SplitText(element, {
          type: "lines, words",
          linesClass: "split-line",
        });

        // Set initial state for lines
        gsap.set(element.split.lines, {
          opacity: 0,
          y: 30,
        });

        element.animation = gsap.to(element.split.lines, {
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
          },
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          stagger: 0.15,
        });
      });
    }

    // Style 5: Contrast Fade - Eye-catching blur to focus transition
    // Professional depth effect with crisp reveal
    if ($(".text-anime-5").length) {
      let staggerAmount = 0.025;
      let delayValue = 0.1;
      let animatedTextElements = document.querySelectorAll(".text-anime-5");

      animatedTextElements.forEach((element) => {
        let animationSplitText = new SplitText(element, {
          type: "chars, words",
        });

        gsap.from(animationSplitText.chars, {
          duration: 0.4,
          delay: delayValue,
          opacity: 0,
          filter: "blur(10px)",
          scale: 0.95,
          stagger: staggerAmount,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
          },
        });
      });
    }

    // Style 6: Layered Emergence - Sophisticated word-by-word with depth
    // Premium stacked reveal with subtle scale
    if ($(".text-anime-6").length) {
      let staggerAmount = 0.1;
      let delayValue = 0.2;
      let animatedTextElements = document.querySelectorAll(".text-anime-6");

      animatedTextElements.forEach((element) => {
        let animationSplitText = new SplitText(element, {
          type: "words",
        });

        gsap.from(animationSplitText.words, {
          duration: 1,
          delay: delayValue,
          opacity: 0,
          y: 25,
          scale: 0.92,
          stagger: staggerAmount,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
          },
        });
      });
    }

    // Style 7: Spotlight Reveal - Attention-grabbing clip-path emergence
    // Modern masked animation with professional execution
    if ($(".text-anime-7").length) {
      let staggerAmount = 0.06;
      let delayValue = 0.15;
      let animatedTextElements = document.querySelectorAll(".text-anime-7");

      animatedTextElements.forEach((element) => {
        let animationSplitText = new SplitText(element, {
          type: "words",
        });

        gsap.set(animationSplitText.words, {
          clipPath: "inset(0% 100% 0% 0%)",
        });

        gsap.to(animationSplitText.words, {
          duration: 1.2,
          delay: delayValue,
          clipPath: "inset(0% 0% 0% 0%)",
          stagger: staggerAmount,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
          },
        });
      });
    }
  }

  // ============================
  // Initialization
  // ============================
  function initialize() {
    // Setup all event listeners
    setupEventListeners();

    // Handle initial resize
    handleResize();

    // Initialize partner swiper
    initializePartnerSwiper();

    // Init AOS
    if (typeof AOS !== "undefined") {
      AOS.init({
        offset: 100,
        duration: 400,
        easing: "ease-in-out",
        anchorPlacement: "top-bottom",
        disable: "mobile",
        once: true,
      });
    }

    //  Init Counter
    initializeCounter();

    //  Init Testimonials
    testimonialsInit();

    // Init Text Animations
    initTextAnimations();
  }

  // ============================
  // Document Ready & Window Load
  // ============================
  $document.ready(function () {
    initialize();
  });

  // Additional initialization after full page load
  // $window.on("load", function () {
  // });
})(jQuery);
