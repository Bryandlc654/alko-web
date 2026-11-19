"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type ScrollTriggerApi = typeof import("gsap/ScrollTrigger").ScrollTrigger;

/**
 * Comportamientos e animaciones del sitio original portados a React.
 *
 * Es agnóstico de datos: cualquier interactividad que dependa de contenido se
 * lee de atributos `data-*` en el DOM, de modo que puede montarse una sola vez
 * en el layout y funcionar en todas las rutas.
 *
 * Cubre: sliders (hero y showcase), fases, sectores, revelados con
 * GSAP/ScrollTrigger, parallax y la sección de imagen expandible con el scroll.
 */
export default function SiteScripts() {
  const pathname = usePathname();
  // Al navegar, la ruta nueva se monta primero con app/loading.tsx y el contenido llega
  // después, sin que cambie la ruta. Si el efecto solo dependiera de `pathname`, no vería esos
  // bloques y se quedarían invisibles (opacity 0). Se vuelve a inicializar cuando aparecen
  // bloques `.reveal-*` que todavía no se han preparado.
  const [domVersion, setDomVersion] = useState(0);
  useEffect(() => {
    let frame = 0;
    const observer = new MutationObserver(() => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (document.querySelector(".reveal-item:not([data-reveal-ready]), .reveal-scale:not([data-reveal-ready])")) {
          setDomVersion((v) => v + 1);
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const timers: number[] = [];
    const intervals: number[] = [];
    const cleanups: Array<() => void> = [];
    let cancelled = false;
    let scrollTrigger: ScrollTriggerApi | null = null;

    const addEvent = (
      target: EventTarget,
      type: string,
      handler: EventListenerOrEventListenerObject,
      options?: AddEventListenerOptions,
    ) => {
      target.addEventListener(type, handler, options);
      cleanups.push(() => target.removeEventListener(type, handler, options));
    };

    /* ---------- Carousel del hero ---------- */
    const slides = document.querySelectorAll(".hero-slide");
    const prevBtn = document.getElementById("prev-slide-btn");
    const nextBtn = document.getElementById("next-slide-btn");
    let currentSlide = 0;
    let autoSlideTimer: number | null = null;

    function showSlide(index: number) {
      slides.forEach((slide, i) => {
        const img = slide.querySelector("img");
        if (i === index) {
          slide.classList.remove("opacity-0", "pointer-events-none");
          slide.classList.add("opacity-100");
          if (img) {
            img.classList.remove("scale-100");
            img.classList.add("scale-105");
          }
        } else {
          slide.classList.remove("opacity-100");
          slide.classList.add("opacity-0", "pointer-events-none");
          if (img) {
            img.classList.remove("scale-105");
            img.classList.add("scale-100");
          }
        }
      });
      currentSlide = index;
    }

    const nextSlide = () => showSlide((currentSlide + 1) % slides.length);
    const prevSlide = () => showSlide((currentSlide - 1 + slides.length) % slides.length);

    if (nextBtn && prevBtn && slides.length > 1) {
      const startAutoSlide = () => {
        autoSlideTimer = window.setInterval(nextSlide, 6000);
        intervals.push(autoSlideTimer);
      };
      const resetAutoSlide = () => {
        if (autoSlideTimer) window.clearInterval(autoSlideTimer);
        startAutoSlide();
      };
      addEvent(nextBtn, "click", () => {
        nextSlide();
        resetAutoSlide();
      });
      addEvent(prevBtn, "click", () => {
        prevSlide();
        resetAutoSlide();
      });
      startAutoSlide();
    }

    /* ---------- GSAP (cargado en diferido para no bloquear la carga inicial) ---------- */
    const allAnimated = Array.from(document.querySelectorAll(".reveal-item, .reveal-scale"));
    allAnimated.forEach((el) => el.setAttribute("data-reveal-ready", ""));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Lo que ya está en pantalla aparece sin esperar a GSAP (con la transición CSS):
    // si no, el contenido principal queda invisible hasta que se descarga la librería.
    const viewportBottom = window.innerHeight;
    const animatedElements = allAnimated.filter((el) => {
      if (prefersReducedMotion || el.getBoundingClientRect().top < viewportBottom) {
        el.classList.add("is-visible");
        return false;
      }
      return true;
    });

    if (!prefersReducedMotion) {
      const runGsap = async () => {
        // Justo después de un despliegue en Render el trozo de GSAP puede fallar (el archivo ya no
        // existe o llega cortado). Se reintenta una vez y, si sigue fallando, se muestra todo sin
        // animación: el contenido nunca debe quedarse invisible.
        const loadGsap = () => Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        let modules: Awaited<ReturnType<typeof loadGsap>>;
        try {
          modules = await loadGsap().catch(
            () => new Promise<Awaited<ReturnType<typeof loadGsap>>>((resolve, reject) => {
              timers.push(setTimeout(() => loadGsap().then(resolve, reject), 1500) as unknown as number);
            }),
          );
        } catch {
          animatedElements.forEach((el) => el.classList.add("is-visible"));
          return;
        }
        const [{ default: gsap }, { ScrollTrigger }] = modules;
        if (cancelled) return;
        scrollTrigger = ScrollTrigger;

        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({ ignoreMobileResize: true });

        // Retraso explícito de cada elemento (style.transitionDelay), si lo tiene.
        const explicitDelay = new Map<Element, number>();
        animatedElements.forEach((el) => {
          const rawDelay = (el as HTMLElement).style.transitionDelay;
          if (rawDelay) {
            explicitDelay.set(el, parseFloat(rawDelay) / (rawDelay.indexOf("ms") > -1 ? 1000 : 1));
          }
          (el as HTMLElement).style.transition = "none";
          (el as HTMLElement).style.transitionDelay = "0ms";
        });

        // Los elementos que entran en pantalla a la vez (antetítulo, título, texto…) aparecen
        // escalonados en lugar de todos de golpe. Con tope, para que una rejilla larga no tarde.
        ScrollTrigger.batch(animatedElements, {
          start: "top 88%",
          once: true,
          onEnter: (batch) => {
            batch.forEach((el, i) => {
              const isScale = el.classList.contains("reveal-scale");
              gsap.fromTo(
                el,
                { autoAlpha: 0, y: isScale ? 46 : 34, scale: isScale ? 0.96 : 1 },
                {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  duration: isScale ? 1.2 : 0.95,
                  ease: "power3.out",
                  delay: explicitDelay.get(el) ?? Math.min(i * 0.09, 0.45),
                  // Al terminar se pasa a la clase final y se quitan los estilos en línea, para
                  // que no quede una capa de composición por elemento. La transición CSS sigue
                  // anulada en línea, así que el cambio no se anima de nuevo.
                  onComplete: () => {
                    el.classList.add("is-visible");
                    gsap.set(el, { clearProps: "transform,opacity,visibility" });
                  },
                },
              );
            });
          },
        });

        /* Parallax del hero */
        const hero = document.querySelector("header.hero");
        const heroSlider = document.getElementById("hero-slider");
        const heroContent = hero ? hero.querySelector(".max-w-3xl") : null;

        if (hero && heroSlider) {
          heroSlider.style.top = "-15%";
          gsap.to(heroSlider, {
            yPercent: 10,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
          });
        }
        if (hero && heroContent) {
          gsap.to(heroContent, {
            yPercent: -20,
            autoAlpha: 0,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
          });
        }

        /*
         * Parallax de la portada (HomeHero) y de las imágenes con <Parallax>. Solo mueve
         * `transform` (lo resuelve la GPU, sin recalcular el diseño) y solo desde tableta: en
         * móvil el scroll táctil gana más con no tener trabajo extra que con el efecto.
         */
        const mm = gsap.matchMedia();
        cleanups.push(() => mm.revert());
        mm.add("(min-width: 768px)", () => {
          const homeHero = document.querySelector<HTMLElement>("[data-hero-parallax]");
          const homeBg = homeHero?.querySelector<HTMLElement>("[data-hero-bg]");
          const homeFg = homeHero?.querySelector<HTMLElement>("[data-hero-fg]");
          if (homeHero && homeBg) {
            // La foto baja a menos velocidad que la página: se queda «detrás».
            gsap.to(homeBg, {
              yPercent: 22,
              ease: "none",
              scrollTrigger: { trigger: homeHero, start: "top top", end: "bottom top", scrub: true },
            });
          }
          if (homeHero && homeFg) {
            // El titular sube un poco más rápido y se desvanece antes de salir.
            gsap.to(homeFg, {
              y: -90,
              autoAlpha: 0,
              ease: "none",
              scrollTrigger: { trigger: homeHero, start: "top top", end: "75% top", scrub: true },
            });
          }

          gsap.utils.toArray<HTMLElement>("[data-parallax-layer]").forEach((layer) => {
            const container = layer.parentElement;
            if (!container) return;
            const strength = Number(container.dataset.parallax) || 12;
            // La capa sobresale strength/2 % del contenedor por arriba y por abajo; su recorrido
            // (en % de su propia altura) se limita a eso para que nunca asome un borde.
            const travel = (strength / 2 / (100 + strength)) * 100;
            gsap.fromTo(
              layer,
              { yPercent: -travel },
              {
                yPercent: travel,
                ease: "none",
                scrollTrigger: { trigger: container, start: "top bottom", end: "bottom top", scrub: 0.4 },
              },
            );
          });
        });

        /* Parallax de imágenes (marcado antiguo: data-parallax con la imagen dentro, sin capa) */
        function setupParallax(img: HTMLImageElement, strength: number) {
          const container = img.parentElement;
          if (!container || container.dataset.parallaxReady === "1") return;
          container.dataset.parallaxReady = "1";
          container.style.overflow = "hidden";

          const wrapper = document.createElement("div");
          wrapper.style.position = "absolute";
          wrapper.style.left = "0";
          wrapper.style.right = "0";
          wrapper.style.top = `-${strength}%`;
          wrapper.style.bottom = `-${strength}%`;
          wrapper.style.willChange = "transform";

          container.insertBefore(wrapper, img);
          wrapper.appendChild(img);

          gsap.fromTo(
            wrapper,
            { yPercent: -strength * 0.5 },
            {
              yPercent: strength * 0.5,
              ease: "none",
              scrollTrigger: { trigger: container, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }

        Array.from(document.querySelectorAll<HTMLImageElement>("[data-parallax] img"))
          .filter((img) => !img.closest("[data-parallax-layer]"))
          .forEach((img) => {
            const strength = Number((img.parentElement?.dataset.parallax as string) || "10") || 10;
            setupParallax(img, strength);
          });

        /* Parallax del showcase */
        const showcaseSlider = document.getElementById("showcase-slider");
        const workshop = document.getElementById("workshop");
        if (showcaseSlider && workshop) {
          showcaseSlider.style.top = "-8%";
          showcaseSlider.style.bottom = "-8%";
          gsap.fromTo(
            showcaseSlider,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: { trigger: workshop, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }

        ScrollTrigger.refresh();
      };

      // GSAP no hace falta para el primer pintado: se carga cuando la página ya ha
      // terminado y el navegador está libre (o antes, si el usuario empieza a hacer scroll).
      let gsapStarted = false;
      const startGsap = () => {
        if (gsapStarted || cancelled) return;
        gsapStarted = true;
        void runGsap();
      };
      const scheduleGsap = () => {
        if ("requestIdleCallback" in window) {
          const id = window.requestIdleCallback(startGsap, { timeout: 2000 });
          cleanups.push(() => window.cancelIdleCallback(id));
        } else {
          timers.push(setTimeout(startGsap, 200) as unknown as number);
        }
      };
      addEvent(window, "scroll", startGsap, { once: true, passive: true });
      if (document.readyState === "complete") scheduleGsap();
      else addEvent(window, "load", scheduleGsap, { once: true });
    }

    /* ---------- Interactividad de fases ---------- */
    const phaseTabs = Array.from(document.querySelectorAll<HTMLElement>(".process-tab"));
    const phaseImages = Array.from(document.querySelectorAll<HTMLElement>("[data-phase-img]"));
    const detailText = document.getElementById("phase-detail-text");

    function activatePhase(idx: number) {
      const tab = phaseTabs[idx];
      if (!tab) return;

      const nextText = tab.dataset.text ?? "";

      phaseTabs.forEach((t, i) => {
        const badge = t.querySelector(".phase-badge");
        const phaseTitle = t.querySelector(".phase-title");
        if (!badge || !phaseTitle) return;

        if (i === idx) {
          badge.classList.remove("text-stone-400");
          badge.classList.add("text-stone-900");
          phaseTitle.classList.remove("text-stone-400", "border-transparent");
          phaseTitle.classList.add("text-stone-900", "border-stone-900");
        } else {
          badge.classList.remove("text-stone-900");
          badge.classList.add("text-stone-400");
          phaseTitle.classList.remove("text-stone-900", "border-stone-900");
          phaseTitle.classList.add("text-stone-400", "border-transparent");
        }
      });

      phaseImages.forEach((img, i) => {
        const active = i === idx;
        img.classList.toggle("opacity-100", active);
        img.classList.toggle("opacity-0", !active);
        if (active) img.removeAttribute("aria-hidden");
        else img.setAttribute("aria-hidden", "true");
      });

      if (detailText && nextText) {
        detailText.style.opacity = "0.2";
        timers.push(
          window.setTimeout(() => {
            detailText.textContent = nextText;
            detailText.style.opacity = "1";
          }, 180),
        );
      }
    }

    phaseTabs.forEach((tab) => {
      addEvent(tab, "click", () => activatePhase(parseInt(tab.dataset.phase || "0", 10)));
      addEvent(tab, "mouseenter", () => activatePhase(parseInt(tab.dataset.phase || "0", 10)));
    });

    /* ---------- Interactividad de sectores (dual state) ---------- */
    const serviceRows = document.querySelectorAll(".service-row");
    serviceRows.forEach((row) => {
      const activate = () => {
        if (row.classList.contains("is-active")) return;
        serviceRows.forEach((r) => r.classList.remove("is-active"));
        row.classList.add("is-active");
      };
      addEvent(row, "mouseenter", activate);
      addEvent(row, "click", activate);
    });

    /* ---------- Showcase slider ---------- */
    const showcaseSlides = document.querySelectorAll(".showcase-slide");
    const showcaseDots = document.querySelectorAll(".showcase-dot");
    const showcasePrevBtn = document.getElementById("showcase-prev-btn");
    const showcaseNextBtn = document.getElementById("showcase-next-btn");
    const showcaseCard = document.getElementById("showcase-card");
    const showcaseSection = document.getElementById("workshop");
    let currentShowcaseIndex = 0;
    let showcaseAutoTimer: number | null = null;
    let cardFadeTimeout: number | null = null;
    let isHoveringCard = false;

    function showCard(autoFade = true) {
      if (!showcaseCard) return;
      showcaseCard.classList.add("is-visible");
      if (cardFadeTimeout) window.clearTimeout(cardFadeTimeout);
      if (autoFade) {
        cardFadeTimeout = window.setTimeout(() => {
          if (!isHoveringCard) showcaseCard.classList.remove("is-visible");
        }, 3500);
      }
    }

    function hideCard() {
      if (!showcaseCard || isHoveringCard) return;
      showcaseCard.classList.remove("is-visible");
    }

    function renderShowcaseSlide(index: number) {
      if (!showcaseSlides.length) return;
      currentShowcaseIndex = index;

      showcaseSlides.forEach((slide, i) => {
        const img = slide.querySelector("img");
        if (i === index) {
          slide.classList.remove("opacity-0", "pointer-events-none", "z-0");
          slide.classList.add("opacity-100", "z-10");
          if (img) {
            img.classList.remove("scale-100");
            img.classList.add("scale-105");
          }
        } else {
          slide.classList.remove("opacity-100", "z-10");
          slide.classList.add("opacity-0", "pointer-events-none", "z-0");
          if (img) {
            img.classList.remove("scale-105");
            img.classList.add("scale-100");
          }
        }
      });

      showcaseDots.forEach((dot, i) => {
        if (i === index) {
          dot.className =
            "showcase-dot w-2.5 h-2.5 bg-paper transition-all duration-300 focus:outline-none";
        } else {
          dot.className =
            "showcase-dot w-2.5 h-2.5 border border-white/60 bg-transparent hover:border-white transition-all duration-300 focus:outline-none";
        }
      });

      showCard(true);
    }

    if (showcaseSection) {
      addEvent(showcaseSection, "mouseenter", () => showCard(true));
      addEvent(showcaseSection, "mousemove", () => showCard(true));
      addEvent(showcaseSection, "mouseleave", () => {
        if (!isHoveringCard) {
          if (cardFadeTimeout) window.clearTimeout(cardFadeTimeout);
          hideCard();
        }
      });
    }

    if (showcaseCard) {
      addEvent(showcaseCard, "mouseenter", () => {
        isHoveringCard = true;
        if (cardFadeTimeout) window.clearTimeout(cardFadeTimeout);
        showcaseCard.classList.add("is-visible");
      });
      addEvent(showcaseCard, "mouseleave", () => {
        isHoveringCard = false;
        cardFadeTimeout = window.setTimeout(() => {
          showcaseCard.classList.remove("is-visible");
        }, 1800);
      });
    }

    const nextShowcase = () =>
      renderShowcaseSlide((currentShowcaseIndex + 1) % showcaseSlides.length);
    const prevShowcase = () =>
      renderShowcaseSlide(
        (currentShowcaseIndex - 1 + showcaseSlides.length) % showcaseSlides.length,
      );

    if (showcaseNextBtn && showcasePrevBtn) {
      addEvent(showcaseNextBtn, "click", () => {
        nextShowcase();
        resetShowcaseAuto();
      });
      addEvent(showcasePrevBtn, "click", () => {
        prevShowcase();
        resetShowcaseAuto();
      });
    }

    showcaseDots.forEach((dot) => {
      addEvent(dot, "click", () => {
        renderShowcaseSlide(parseInt(dot.getAttribute("data-slide") || "0", 10));
        resetShowcaseAuto();
      });
    });

    const startShowcaseAuto = () => {
      showcaseAutoTimer = window.setInterval(nextShowcase, 7000);
      intervals.push(showcaseAutoTimer);
    };
    const resetShowcaseAuto = () => {
      if (showcaseAutoTimer) window.clearInterval(showcaseAutoTimer);
      startShowcaseAuto();
    };
    if (showcaseSlides.length > 1) startShowcaseAuto();
    showCard(true);

    /* ---------- Sección de imagen expandible con el scroll ---------- */
    const scrollSection = document.getElementById("experiencia");
    const imgContainer = document.getElementById("expand-image-container");
    const imgBox = document.getElementById("expand-img-box");
    const imgTarget = document.getElementById("expand-target-image");
    const stage1 = document.getElementById("expand-stage-1");
    const stage2 = document.getElementById("expand-stage-2");
    const metricClients = document.getElementById("metric-num-clients");
    const metricAwards = document.getElementById("metric-num-awards");

    let countAnimated = false;

    const easeInOutQuad = (x: number) =>
      x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

    function animateNumbers() {
      if (countAnimated) return;
      countAnimated = true;

      const duration = 1400;
      const startTime = performance.now();
      // Cada cifra anima hasta su propio valor (data-target); las que no son un entero simple
      // (p. ej. «1.450») se muestran tal cual.
      const metrics = [metricClients, metricAwards]
        .filter((el): el is HTMLElement => !!el)
        .map((el) => ({ el, final: el.dataset.target || el.textContent || "", target: Number(el.dataset.target) }))
        .filter((metric) => Number.isInteger(metric.target) && metric.target > 0);

      function step(now: number) {
        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / duration);
        const easeP = 1 - Math.pow(1 - p, 3);

        for (const metric of metrics) {
          metric.el.textContent = p < 1 ? String(Math.floor(metric.target * easeP)) : metric.final;
        }

        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    function updateExpandingSection() {
      if (!scrollSection || !imgContainer || !imgBox) return;

      const rect = scrollSection.getBoundingClientRect();
      const totalScrollable = scrollSection.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const rawP = -rect.top / totalScrollable;
      const progress = Math.min(1, Math.max(0, rawP));
      const easeP = easeInOutQuad(progress);

      const containerW = imgContainer.clientWidth;
      const containerH = imgContainer.clientHeight;
      const isDesktop = window.innerWidth >= 1024;

      if (isDesktop) {
        const startW = Math.min(315, containerW * 0.65);
        const startH = Math.min(415, containerH * 0.56);
        const startLeft = Math.max(36, containerW * 0.12);
        const startBottom = Math.max(36, containerH * 0.08);

        const curW = startW + (containerW - startW) * easeP;
        const curH = startH + (containerH - startH) * easeP;
        const curLeft = startLeft * (1 - easeP);
        const curBottom = startBottom * (1 - easeP);

        imgBox.style.width = `${curW}px`;
        imgBox.style.height = `${curH}px`;
        imgBox.style.left = `${curLeft}px`;
        imgBox.style.bottom = `${curBottom}px`;
        imgBox.style.transform = "none";
      } else {
        const startW = Math.min(containerW * 0.85, 320);
        const startH = Math.min(containerH * 0.8, 260);

        const curW = startW + (containerW - startW) * easeP;
        const curH = startH + (containerH - startH) * easeP;
        const curLeft = (containerW - curW) / 2;

        imgBox.style.width = `${curW}px`;
        imgBox.style.height = `${curH}px`;
        imgBox.style.left = `${curLeft}px`;
        imgBox.style.bottom = "0px";
        imgBox.style.transform = "none";
      }

      if (imgTarget) {
        const scale = 1.05 - 0.05 * easeP;
        imgTarget.style.transform = `scale(${scale})`;
      }

      if (stage1 && stage2) {
        if (progress <= 0.18) {
          stage1.style.opacity = "1";
          stage1.style.transform = "translateY(0)";
          stage1.style.pointerEvents = "auto";
          stage2.style.opacity = "0";
          stage2.style.transform = "translateY(24px)";
          stage2.style.pointerEvents = "none";
        } else if (progress > 0.18 && progress < 0.48) {
          const pOut = (progress - 0.18) / 0.3;
          stage1.style.opacity = `${1 - pOut}`;
          stage1.style.transform = `translateY(-${pOut * 24}px)`;
          stage1.style.pointerEvents = "none";
          stage2.style.opacity = "0";
          stage2.style.transform = "translateY(24px)";
          stage2.style.pointerEvents = "none";
        } else {
          stage1.style.opacity = "0";
          stage1.style.transform = "translateY(-24px)";
          stage1.style.pointerEvents = "none";

          const pIn = Math.min(1, (progress - 0.48) / 0.35);
          stage2.style.opacity = `${pIn}`;
          stage2.style.transform = `translateY(${(1 - pIn) * 24}px)`;
          stage2.style.pointerEvents = "auto";

          if (pIn > 0.4) animateNumbers();
        }
      }

      if (progress < 0.25) countAnimated = false;
    }

    let isScrollTicking = false;
    const onScrollExpand = () => {
      if (!isScrollTicking) {
        window.requestAnimationFrame(() => {
          updateExpandingSection();
          isScrollTicking = false;
        });
        isScrollTicking = true;
      }
    };
    addEvent(window, "scroll", onScrollExpand, { passive: true });
    addEvent(window, "resize", updateExpandingSection);
    updateExpandingSection();

    /* ---------- Cleanup ---------- */
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      intervals.forEach((i) => window.clearInterval(i));
      cleanups.forEach((fn) => fn());
      scrollTrigger?.getAll().forEach((t) => t.kill());
      document
        .querySelectorAll<HTMLElement>("[data-parallax-ready]")
        .forEach((el) => delete el.dataset.parallaxReady);
    };
  }, [pathname, domVersion]);

  return null;
}
