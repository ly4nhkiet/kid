gsap.registerPlugin(ScrollTrigger, Flip, CustomEase);

gsap.config({
  nullTargetWarn: false,
  trialWarn: false,
});

// --- GLOBAL - CUSTOM EASE
let panelEase = CustomEase.create("moxieEase", "0.19, 1, 0.22, 1");
let buttonEase = CustomEase.create("buttonEase", "0.785, 0.135, 0.15, 0.86");

// --- GLOBAL - SPLIT TEXT
let splitText;

function runSplit() {
  splitText = new SplitType("[split-text]", {
    types: "words, chars",
  });
}

// --- GLOBAL - RELOAD AT THE TOP
$(window).on("beforeunload", function () {
  history.scrollRestoration = "manual";
});

// --- GLOBAL - FADE
function fade() {
  gsap.set("[fade]", { opacity: 0, y: "4em" });

  let elements = $("[fade]");
  elements.each(function (index, element) {
    ScrollTrigger.create({
      trigger: element,
      start: "-50% bottom",
      onEnter: function () {
        staggerAnimation(element, index);
      },
      once: true,
    });
  });

  function staggerAnimation(element, index) {
    gsap.fromTo(
      element,
      { autoAlpha: 0, y: "4em" },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power4.out",
        delay: index * 0.05,
      }
    );
  }
}

// --- GLOBAL - PARALLAX
function parallax() {
  gsap.utils.toArray("[parallax-container]").forEach(container => {
    const img = container.querySelector(".c-img");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        scrub: true,
      },
    });

    tl.fromTo(
      img,
      {
        yPercent: -5,
        ease: "none",
      },
      {
        yPercent: 5,
        ease: "none",
      }
    );
  });
}

// --- GLOBAL - BUTTONS HOVER EFFECT
function buttonHover() {
  $("[data-btn='wrap']").each(function () {
    const clipEl = $(this)
      .find("[data-btn='clip']")
      .attr("aria-hidden", "true");
    const durationSetting = 0.4;
    const easeSetting = "power2.inOut";

    function getPercentTop(el, e) {
      let elTop = el.offset().top - $(window).scrollTop();
      let mouseTop = e.pageY - $(window).scrollTop() - elTop;
      return (mouseTop / el.innerHeight()) * 100;
    }

    function getPercentLeft(el, e) {
      let elLeft = el.offset().left;
      let mouseLeft = e.pageX - elLeft;
      return (mouseLeft / el.innerWidth()) * 100;
    }

    let initialBorderColor = $(this).css("border");

    $(this).on("mouseenter", function (e) {
      let percentTop = getPercentTop($(this), e);
      let percentLeft = getPercentLeft($(this), e);
      gsap.set(clipEl, { display: "flex" });
      gsap.fromTo(
        clipEl,
        { clipPath: `circle(0% at ${percentLeft}% ${percentTop}%)` },
        {
          clipPath: `circle(141.4% at ${percentLeft}% ${percentTop}%)`,
          duration: durationSetting,
          ease: easeSetting,
        }
      );
      gsap.to($(this), {
        border: "1px solid rgba(253, 109, 16, 0.90)",
        duration: durationSetting,
        ease: easeSetting,
      });
    });
    $(this).on("mouseleave", function (e) {
      let percentTop = getPercentTop($(this), e);
      let percentLeft = getPercentLeft($(this), e);
      gsap.to(clipEl, {
        clipPath: `circle(0% at ${percentLeft}% ${percentTop}%)`,
        overwrite: true,
        duration: durationSetting,
        ease: easeSetting,
      });
      gsap.to($(this), {
        border: initialBorderColor,
        duration: durationSetting,
        ease: easeSetting,
      });
    });
  });
}

// --- MATCHMEDIA
let mm = gsap.matchMedia();

// --- HEADER SCROLL
function headerScroll() {
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".c-body",
      start: "400 top",
      end: "+=1",
      onEnter: () => {
        tl.play();
      },
      onLeaveBack: () => {
        tl.reverse();
      },
    },
    defaults: {
      ease: "power3.inOut",
      duration: 0.4,
    },
  });

  tl.to(".c-header", {
    backgroundColor: "rgba(23, 11, 47, 0.2)",
    backdropFilter: "blur(4px)",
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
    borderRight: "1px solid rgba(255, 255, 255, 0.2)",
  });
}

// --- CLIENTS - MARQUEE
function clientMarquee() {
  const marquees = document.querySelectorAll(".c-marquee");

  if (marquees.length === 0) return;

  marquees.forEach(marquee => {
    const marqueeWrap = marquee.querySelector(".c-marquee-wrap");
    const marqueeItems = marquee.querySelectorAll(".c-marquee-item");
    const marqueeDuration = marqueeItems.length * 6;

    // Clone and append marqueeWrap
    const marqueeWrapClone = marqueeWrap.cloneNode(true);
    marquee.append(marqueeWrapClone);

    const tl = gsap.timeline();

    tl.to(marquee.querySelectorAll(".c-marquee-wrap"), {
      x: "-100%",
      ease: "none",
      repeat: -1,
      duration: 400,
    });
  });
}

// --- CLIENTS - MARQUE LIGHT
function marqueeLight() {
  let tl = gsap.timeline({ defaults: { duration: 0.2 }, repeat: -1 });

  const items = document.querySelectorAll(".c-img.contain.highlight");

  items.forEach((item, index) => {
    tl.to(item, { opacity: 1, ease: "power1.in" }, index * 0.2);
    tl.to(item, { opacity: 0, ease: "power1.out" }, "+=0.1");
  });
}

// --- CLIENTS - MARQUEE HOVER
function marqueeItemHover() {
  $(".c-marquee-item").each(function () {
    let tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.inOut", duration: 1 },
    });

    tl.to($(this), {
      "--marquee-item-odd-opacity": 0.3,
      "--marquee-item-even-opacity": 0.4,
      "--marquee-item-odd-light": "100%",
      "--marquee-item-even-light": "100%",
    });

    $(this).on("mouseenter", function () {
      tl.restart();
    });

    $(this).on("mouseleave", function () {
      tl.reverse();
    });
  });
}

// --- PRODUCT IMAGE TELEPORT
function productImageTeleport() {
  let yOffset = "13.5em"; // Default value

  // Check if the current domain is the .com domain
  if (
    window.location.hostname === "www.k-id.com" &&
    window.location.pathname.endsWith("/ja")
  ) {
    yOffset = "20em";
  }

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".c-img-contain.product-location",
      start: "bottom bottom",
      end: "top 10%",
      endTrigger: ".c-block-item.featured",
      scrub: true,
    },
  });

  tl.fromTo(
    ".c-img-contain.product-location",
    { y: "-48.8em" },
    { y: yOffset, ease: "none" }
  );
  tl.fromTo(
    ".c-img-contain.product-control",
    { rotation: 7, y: "1.6em" },
    {
      rotation: 15,
      y: "3em",
    },
    0
  );
  tl.fromTo(
    ".c-img-contain.product-control",
    { opacity: 1 },
    { opacity: 0 },
    0.2
  );

  tl.fromTo(".c-block-title_lt.featured", { opacity: 0 }, { opacity: 1 }, 0.4);
  tl.fromTo(".c-block-sub.featured", { opacity: 0 }, { opacity: 1 }, 0.4);
}

// --- TEAM SECTION - THEME SWITCH
function teamThemeSwitch() {
  gsap.to(".c-section.team", {
    scrollTrigger: {
      trigger: ".c-section.team",
      start: "30% bottom",
      end: "bottom center",
      onEnter: function () {
        document
          .querySelector(".c-section.team")
          .setAttribute("data-theme", "light");
      },
    },
  });
}

/// --- TEAM SECTION - THEME SWITCH MOBILE
function teamThemeSwitchMobile() {
  $(".c-section.team").attr("data-theme", "light");
}

// --- HEADER - DYNAMIC ACTIVE LINK
function headerDynamicActiveLink() {
  let activeEl = $(".c-nav-active");
  let navLinks = $(".c-nav-link");
  let sections = $(".c-section");
  let isClickScrolling = false;
  let currentPath = window.location.pathname;

  navLinks.on("click", function () {
    isClickScrolling = true;
    let state = Flip.getState(activeEl);
    activeEl.appendTo($(this));
    Flip.from(state, {
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: function () {
        setTimeout(function () {
          isClickScrolling = false;
        }, 700);
      },
    });
  });

  sections.each(function () {
    let sectionID = $(this).attr("id");
    let sectionLink = window.location.origin + currentPath + "/#" + sectionID;
    let targetLink = $(`.c-nav-link[href="/#${sectionID}"]`);
    if (targetLink.length > 0) {
      targetLink.attr("href", sectionLink);
    }

    ScrollTrigger.create({
      trigger: this,
      start: "top 50%",
      end: "bottom 50%",
      onEnter: function () {
        if (!isClickScrolling) {
          let state = Flip.getState(activeEl);
          activeEl.appendTo(targetLink);
          Flip.from(state, {
            duration: 0.4,
            ease: "power2.inOut",
          });
        }
      },
      onEnterBack: function () {
        if (!isClickScrolling) {
          let state = Flip.getState(activeEl);
          activeEl.appendTo(targetLink);
          Flip.from(state, {
            duration: 0.4,
            ease: "power2.inOut",
          });
        }
      },
    });
  });
}

function scrollToCurrentHash() {
  // Get the current hash from the URL
  let currentHash = window.location.hash;

  // Find the .c-nav-link that matches the current hash
  let targetNavLink = $(`.c-nav-link[href="${currentHash}"]`);

  // Check if the target nav link exists
  if (targetNavLink.length > 0) {
    // Trigger a click event on the target nav link
    targetNavLink.click();
  }
}

// --- CAREERS AND NEWS LINKS
function localizationLinkFix() {
  let currentPath = window.location.pathname;
  let currentOrigin = window.location.origin;
  let navLinkFix = $(".c-nav-link");
  if (
    window.location.href.includes("/ja") &&
    window.location.href !== "https://k-id-development.webflow.io/ja" &&
    !window.location.hash
  ) {
    navLinkFix.eq(0).attr("href", "/ja/#tech-section");
    navLinkFix.eq(1).attr("href", "/ja/#team-section");
    navLinkFix.eq(4).attr("href", "/ja/#demo-section");
    // console.log("ja");
  } else if (
    window.location.href.includes("/zh") &&
    window.location.href !== "https://k-id-development.webflow.io/zh" &&
    !window.location.hash
  ) {
    navLinkFix.eq(0).attr("href", "/zh/#tech-section");
    navLinkFix.eq(1).attr("href", "/zh/#team-section");
    navLinkFix.eq(4).attr("href", "/zh/#demo-section");
    // console.log("zh");
  } else if (
    window.location.href.includes("/") &&
    window.location.href !== "https://k-id-development.webflow.io/" &&
    !window.location.hash &&
    !window.location.pathname.includes("/ja") &&
    !window.location.pathname.includes("/zh")
  ) {
    navLinkFix.eq(0).attr("href", "/#tech-section");
    navLinkFix.eq(1).attr("href", "/#team-section");
    navLinkFix.eq(4).attr("href", "/#demo-section");
    // console.log("en");
  } else {
    scrollToCurrentHash();
  }
}

// --- HEADER DROPDOWN
function headerDropdown() {
  $(".c-dropdown-wrap").each(function () {
    let buttonEl = $(this).find(".c-btn");
    let dropdownEl = $(this).find(".c-dropdown");
    let buttonArrow = $(this).find(".c-icon.nav-arrow");

    let tl = gsap.timeline({
      paused: true,
      defaults: {
        ease: "power3.inOut",
        duration: 0.8,
      },
    });

    gsap.set(dropdownEl, {
      autoAlpha: 1,
      clipPath: "inset(0% 0% 100% 0%)",
    });

    tl.to(dropdownEl, {
      clipPath: "inset(0% 0% 0% 0%)",
      height: "auto",
    });

    tl.to(buttonArrow, { rotate: 180 }, 0);

    buttonEl.on("click", function (e) {
      e.stopPropagation();
      $(this).toggleClass("is-open");
      if ($(this).hasClass("is-open")) {
        tl.restart();
      } else {
        tl.reverse();
      }
    });

    $(document).mouseup(function (e) {
      if ($(e.target).closest(".c-btn").length === 0) {
        $(".c-btn.is-open").click();
      }
    });
  });
}

// --- DROPDOWN LINK - HOVER EFFECT
function dropdownHover() {
  $(".c-dropdown-link").each(function () {
    let iconCircle = $(this).find(".c-icon.dropdown-circle");
    let iconArrow = $(this).find(".c-icon.dropdown-arrow");

    let tl = gsap.timeline({
      paused: true,
      defaults: {
        ease: "power4.inOut",
        duration: 0.8,
      },
    });

    gsap.set(iconArrow, { x: -6 });

    tl.to(iconCircle, { width: 16, height: 16 });
    tl.to(iconArrow, { autoAlpha: 1, x: 0 }, 0);
    tl.to($(this), { backgroundColor: "rgba(217, 217, 217, 0.10)" }, 0);

    $(this).on("mouseenter", function () {
      tl.restart();
    });

    $(this).on("mouseleave", function () {
      tl.reverse();
    });
  });
}

// --- REMOVE EMPTY PARAGRAPHS
function emptyParagraphs() {
  $(".t-rich-text p").each(function () {
    if ($(this).text().length < 2) {
      $(this).text(function () {
        return $(this)
          .text()
          .replace(/(^[\s\u200d]*$)/g, "removeEmptyParagraph");
      });
    }
  });
  $("p:contains('removeEmptyParagraph')").remove();
}

// --- FOOTER STRUCTURE
function footerStructure() {
  $("[terms-desktop-location]").css("display", "none");
  $("[year-tablet-location]").css("display", "none");
  $("[terms-link]").prependTo("[privacy-tablet-location]");
  $("[year-txt]").prependTo("[rights-tablet-location]");
  $("[site-by-txt]").text("By PaperTiger");
}

// --- HEADER MOBILE
function headerMobile() {
  let headerEl = $(".c-header_center");
  let headerNav = $(".c-header-nav");
  let contactButton = $(".c-header-contact");
  let headerTrigger = $(".c-nav-btn");
  let headerTriggerText = headerTrigger.find(".t-micro-1");
  let pageOverlay = $(".c-team-panel-overlay");

  contactButton.appendTo(headerNav);

  let tl = gsap.timeline({
    paused: true,
    defaults: { ease: "power3.inOut", duration: 0.6 },
  });

  gsap.set(headerEl, { height: 0 });

  tl.to(headerEl, { autoAlpha: 1, height: "auto" });

  tl.to(".o-page-wrapper", { autoAlpha: 0.2 }, 0);

  headerTrigger.on("click", function () {
    $(this).toggleClass("is-open");
    if ($(this).hasClass("is-open")) {
      headerTriggerText.text("close");
      lenis.stop();
      tl.restart();
    } else {
      headerTriggerText.text("menu");
      lenis.start();
      tl.reverse();
    }
  });
}

// --- LOADER
function loader() {
  let tl = gsap.timeline({ defaults: { ease: panelEase, duration: 1.6 } });

  gsap.set(".c-img-contain.hero-bg", {
    clipPath: "inset(100% 0% 0% 0%)",
    autoAlpha: 1,
  });
  gsap.set(".c-img-contain.hero-bg .c-img", { scale: 1.3 });
  gsap.set(".c-hm-hero_lt", { autoAlpha: 1 });
  gsap.set(".c-hm-hero_lt .char", { autoAlpha: 0, yPercent: 60 });
  gsap.set(".c-hm-hero_rt", { yPercent: 20 });
  gsap.set(".c-cta-card", { yPercent: 5, autoAlpha: 0 });
  gsap.set(".c-header", { autoAlpha: 0 });
  gsap.set(".c-hm-hero_lt .char", { perspective: 2000 });

  tl.to(".c-img-contain.hero-bg", { clipPath: "inset(0% 0% 0% 0%)" });

  tl.to(".c-img-contain.hero-bg .c-img", { scale: 1, duration: 2 }, "<");

  tl.to(".c-shape-wrap", { autoAlpha: 1 }, "<");

  tl.fromTo(
    ".c-hm-hero_lt .char",
    {
      "will-change": "opacity, transform",
      autoAlpha: 0,
      rotationX: -90,
      yPercent: 50,
    },
    {
      duration: 0.8,
      autoAlpha: 1,
      rotationX: 0,
      yPercent: 0,
      stagger: {
        each: 0.02,
        from: 0,
      },
    },
    0
  );

  tl.to(".c-hm-hero_rt", { yPercent: 0, autoAlpha: 1 }, "<0.2");
  tl.to(".c-cta-card", { yPercent: 0, autoAlpha: 1 }, "<0.2");
  tl.to(".c-header", { autoAlpha: 1 }, "<0.4");
}

// --- MODAL
function modal() {
  let modalTriggers = $("[modal-trigger]");

  modalTriggers.on("click", function () {
    let modalId = $(this).attr("trigger-el");
    let modal = $(modalId);

    $(".c-modal").removeClass("is-open");
    modal.addClass("is-open");

    lenis.stop();

    modal.find(".c-modal-close").on("click", function () {
      modal.removeClass("is-open");
      lenis.start();
    });

    $(document).on("keydown", function (e) {
      if (e.key === "Escape") {
        modal.find(".c-modal-close").click();
      }
    });
  });
}

// --- FAQ ACCORDIONS
function faqAccordions() {
  const faqItems = document.querySelectorAll(".c-faq-item");
  let active = null;

  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const answer = item.querySelector(".c-faq-answer");
    const arrowWrap = item.querySelector(".c-faq-arrow");
    const arrow = item.querySelector(".c-faq-arrow .c-icon");

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.inOut", duration: 0.5 },
    });

    tl.to(answer, { height: "auto" });
    tl.to(arrowWrap, { backgroundColor: "rgba(255, 255, 255, 0.2)" }, 0);
    tl.to(arrow, { rotation: 180 }, 0);

    item.tl = tl;

    item.addEventListener("click", function () {
      if (active === item) {
        tl.reverse();
        active = null;
      } else {
        if (active) active.tl.reverse();
        tl.play();
        active = item;
      }
    });
  });

  faqItems[0].click();
}
faqAccordions();

// --- COOKIES SETTINGS LINK
function cookiesSettingsLink() {
  const settings = document.querySelector(".fs-cc-prefs_component");
  const link = document.querySelector("[cookie-settings]");

  if (!link || !settings) return;

  link.addEventListener("click", function () {
    link.classList.toggle("is-open");
    if (link.classList.contains("is-open")) {
      settings.style.display = "flex";
    } else {
      settings.style.display = "none";
    }
  });
}

// --- RETURN TO TOP
function returnToTop() {
  const links = document.querySelectorAll(".c-back-top");

  links.forEach(link => {
    link.addEventListener("click", function () {
      gsap.to("body", { opacity: 0, duration: 0.2 });

      setTimeout(() => {
        lenis.scrollTo("body", {
          top: 0,
          duration: 0.1,
          lock: true,
          onComplete: () => {
            gsap.to("body", { opacity: 1, duration: 0.2 });

            //   backTopLinks.forEach(link => {
            //     gsap.set(link, { opacity: 0 });
            //   });
          },
        });
      }, 300);
    });
  });
}

// --- PAGES
let homePage = document.querySelector("[home-page]");
function scrollPatent() {
  $(window).on('scroll', function() {
    let scrollTop = $(window).scrollTop();
    $('.scroll-patten').each(function() {
        $(this).attr('style', `transform: translateX(${scrollTop}px)`);
    });
  });
}
// --- INIT
function init() {
  clientMarquee();
  headerDropdown();
  marqueeLight();
  headerScroll();
  // emptyParagraphs();
  runSplit();
  loader();
  marqueeItemHover();
  parallax();
  modal();
  faqAccordions();
  cookiesSettingsLink();
  returnToTop();
  scrollPatent();
}
init();

// --- MATCHMEDIA - DESKTOP
mm.add("(min-width: 992px)", () => {
  productImageTeleport();
  dropdownHover();
  fade();
  buttonHover();
  return () => {
    //
  };
});

// --- MATCHMEDIA - TABLET AND MOBILE
mm.add("(max-width: 991px)", () => {
  headerMobile();
  return () => {
    $(".c-header-contact").appendTo(".c-header_rt");
    $(".c-nav-btn").unbind();
    $(".c-nav-btn").removeClass("is-open");
    $(".c-nav-btn .t-micro-1").text("menu");
  };
});