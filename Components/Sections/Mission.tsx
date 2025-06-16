"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Group } from '../ReuseableComponents/Icons';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useInView } from 'framer-motion';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Card {
  title: string;
}

const Mission: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTlRef = useRef<gsap.core.Timeline | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const cards: Card[] = [
    {
      title: "We're currently a lean team — and we're always open to passionate interns, collaborators, or early teammates",
    },
    {
      title: "Whether you're a designer, developer, strategist, or just curious and driven — if you believe in what we're building, let's talk"
    },
    {
      title: "No degree? No problem. We care about skill, mindset, and your drive to build — not your resume"
    },
    {
      title: "Remote-friendly | Internships | Early roles Drop a line at [contact@bankuruservices.com]"
    },
    {
      title: "We'll reply to everyone who reaches out. And if you're the right fit — yes, we'll make it work :)"
    }
  ];

  // Enhanced mobile detection
  const checkMobile = useCallback(() => {
    const screenWidth = window.innerWidth;
    const isSmallScreen = screenWidth < 768;
    const isMediumScreen = screenWidth >= 768 && screenWidth < 1024;

    // Only treat as mobile if it's a small screen OR medium screen with touch
    const isMobileDevice = isSmallScreen ||
      (isMediumScreen && 'ontouchstart' in window &&
        /Android.*Mobile|iPhone|iPod/i.test(navigator.userAgent));

    setIsMobile(isMobileDevice);
  }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [checkMobile]);

  // Desktop: Perfect card rotation animation
  useEffect(() => {
    if (isMobile || !containerRef.current || typeof window === 'undefined' || !isInView) return;

    const cardElements = cardsRef.current.filter(Boolean);
    if (cardElements.length === 0) return;

    // Enhanced animation configuration
    const config = {
      stackOffset: 15,
      baseY: 0,
      scaleStep: 0.03,
      opacityStep: 0.2,
      animationDuration: 1.5,
      pauseDuration: 1.5,
      rotationRange: 3,
      perspective: 1000,
      transformOrigin: "50% 50%"
    };

    // Kill existing animation
    if (animationRef.current) {
      animationRef.current.kill();
    }

    // Perfect initial stack setup with perspective
    const setupInitialStack = () => {
      gsap.set(cardElements, {
        y: (index) => index * config.stackOffset,
        x: 0,
        rotation: (index) => (index - Math.floor(cards.length / 2)) * 0.75,
        zIndex: (index) => cards.length - index,
        opacity: (index) => Math.max(0.3, 1 - (index * config.opacityStep)),
        scale: (index) => Math.max(0.85, 1 - (index * config.scaleStep)),
        transformOrigin: config.transformOrigin,
        willChange: 'transform, opacity',
        force3D: true,
        backfaceVisibility: 'hidden',
        perspective: config.perspective,
        transformStyle: 'preserve-3d'
      });
    };

    setupInitialStack();

    // Enhanced smooth rotation with perfect timing
    const createPerfectRotation = () => {
      const masterTimeline = gsap.timeline({
        repeat: -1,
        ease: "power2.inOut",
        onRepeat: () => {
          setCurrentIndex((prev) => (prev + 1) % cards.length);
        }
      });

      // Create smooth rotation cycles
      for (let cycle = 0; cycle < cards.length; cycle++) {
        const cycleTimeline = gsap.timeline();

        // Animate each card to its new position with perfect timing
        cycleTimeline.to(cardElements, {
          duration: config.animationDuration,
          ease: "power2.inOut",
          y: (cardIndex) => {
            const newPosition = (cardIndex - cycle - 1 + cards.length) % cards.length;
            return newPosition * config.stackOffset;
          },
          zIndex: (cardIndex) => {
            const newPosition = (cardIndex - cycle - 1 + cards.length) % cards.length;
            return cards.length - newPosition;
          },
          opacity: (cardIndex) => {
            const newPosition = (cardIndex - cycle - 1 + cards.length) % cards.length;
            return Math.max(0.5, 1 - (newPosition * config.opacityStep));
          },
          scale: (cardIndex) => {
            const newPosition = (cardIndex - cycle - 1 + cards.length) % cards.length;
            return Math.max(0.85, 1 - (newPosition * config.scaleStep));
          },
          rotation: (cardIndex) => {
            const newPosition = (cardIndex - cycle - 1 + cards.length) % cards.length;
            return (newPosition - Math.floor(cards.length / 2)) * 0.75;
          },
          force3D: true,
          onStart: () => setIsAnimating(true),
          onComplete: () => setIsAnimating(false)
        });

        // Perfect pause timing
        cycleTimeline.to({}, { duration: config.pauseDuration });
        masterTimeline.add(cycleTimeline);
      }

      return masterTimeline;
    };

    // Initialize with perfect timing
    const timer = setTimeout(() => {
      animationRef.current = createPerfectRotation();
    }, 1500);

    // Cleanup
    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }
    };
  }, [cards.length, isMobile, isInView]);

  // Mobile: Simple static cards - no complex animations
  useEffect(() => {
    if (!isMobile || !containerRef.current || typeof window === 'undefined') return;

    const cardElements = cardsRef.current.filter(Boolean);
    if (cardElements.length === 0) return;

    // Kill existing timeline and ScrollTriggers
    if (scrollTlRef.current) {
      scrollTlRef.current.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    }

    // Set initial positions with stacking offset
    gsap.set(cardElements, {
      y: (i) => i * 20, // Slightly increased initial offset
      opacity: 0,
      scale: 0.97, // Closer to 1 for smoother transition
      zIndex: (i, target, targets) => targets.length - i,
      transformOrigin: "center center",
      willChange: "transform, opacity",
      filter: "blur(1px)", // Subtle blur for depth
    });

    // Create master timeline
    scrollTlRef.current = gsap.timeline({
      defaults: { ease: "none" }, // No easing = fastest response
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%",
        end: "center 10%",   // Very short scroll distance
        scrub: 0.1,       // Almost immediate follow
        invalidateOnRefresh: true,
      }
    });

    // Animation for each card
    cardElements.forEach((card, index) => {
      if (!card) return;

      // Initial reveal animation with smoother easing and timing
      gsap.to(card, {
        opacity: 1,
        y: index * 8, // Reduced offset for tighter stack
        scale: 1,
        filter: "blur(0px)",
        duration: 1,
        delay: index * 0.1, // Shorter delay for quicker cascade
        ease: "expo.out", // Smoother easing
        scrollTrigger: {
          trigger: card,
          start: "top 90%", // Slightly higher trigger point
          end: "top 70%",
          once: true,
          markers: false
        }
      });

      // Scroll-based animation with improved physics
      const cardTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 85%", // Adjusted trigger points
          end: "top 15%",
          scrub: 1.5, // Smoother scrubbing
          markers: false
        }
      });

      // Enhanced animation sequence
      cardTl
        .to(card, {
          y: -index * 40, // Increased rise for more dramatic effect
          ease: "sine.inOut" // Softer easing
        }, 0)
        .to(card, {
          scale: 1.05,
          zIndex: cardElements.length + index,
          ease: "power1.in"
        }, 0)
        .to(card, {
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)", // Added shadow for depth
          ease: "power1.out"
        }, 0);
    });

    // Add a slight parallax effect to the container for smoother overall feel
    gsap.to(containerRef.current, {
      y: -15,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      }
    });

    return () => {
      if (scrollTlRef.current) {
        scrollTlRef.current.kill();
        scrollTlRef.current = null;
      }
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [cards.length, isMobile]);

  // Enhanced cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }
      if (scrollTlRef.current) {
        scrollTlRef.current.kill();
        scrollTlRef.current = null;
      }
    };
  }, []);

  // Navigation dot click handler for desktop
  const goToCard = (index: number) => {
    if (isMobile || isAnimating) return;
    
    setCurrentIndex(index);
    
    // Pause current animation
    if (animationRef.current) {
      animationRef.current.pause();
    }
    
    // Animate to specific card
    const cardElements = cardsRef.current.filter(Boolean);
    const config = {
      stackOffset: 15,
      scaleStep: 0.03,
      opacityStep: 0.2,
    };
    
    setIsAnimating(true);
    
    gsap.to(cardElements, {
      duration: 0.8,
      ease: "power2.inOut",
      y: (cardIndex) => {
        const newPosition = (cardIndex - index + cards.length) % cards.length;
        return newPosition * config.stackOffset;
      },
      zIndex: (cardIndex) => {
        const newPosition = (cardIndex - index + cards.length) % cards.length;
        return cards.length - newPosition;
      },
      opacity: (cardIndex) => {
        const newPosition = (cardIndex - index + cards.length) % cards.length;
        return Math.max(0.5, 1 - (newPosition * config.opacityStep));
      },
      scale: (cardIndex) => {
        const newPosition = (cardIndex - index + cards.length) % cards.length;
        return Math.max(0.85, 1 - (newPosition * config.scaleStep));
      },
      rotation: (cardIndex) => {
        const newPosition = (cardIndex - index + cards.length) % cards.length;
        return (newPosition - Math.floor(cards.length / 2)) * 0.75;
      },
      force3D: true,
      onComplete: () => {
        setIsAnimating(false);
        // Resume animation after a delay
        setTimeout(() => {
          if (animationRef.current) {
            animationRef.current.resume();
          }
        }, 2000);
      }
    });
  };

  return (
    <div
      ref={containerRef}
      className={`
        relative bg-transparent flex flex-col items-center justify-center mx-auto px-4
        ${isMobile
          ? 'h-[170vh] py-8 space-y-8 max-w-full'
          : 'min-h-screen w-full space-y-15 max-w-7xl'
        }
      `}
      style={{
        willChange: isMobile ? 'auto' : 'auto',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Title */}
      <motion.h1
        ref={ref}
        initial={{ opacity: 0, y: isMobile ? -50 : -30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`
          font-semibold text-center text-[#FFFDFA]
          ${isMobile
            ? 'text-2xl sm:text-3xl leading-tight'
            : 'text-4xl lg:text-5xl mb-12'
          }
        `}
      >
        Join the Mission
      </motion.h1>

      {/* Main content */}
      <div className={`
        flex w-full items-center
        ${isMobile
          ? 'flex-col space-y-8'
          : 'flex-row justify-center space-x-16 lg:space-x-20'
        }
      `}>
        {/* GIF Container */}
        <div className={`
          flex-shrink-0 flex justify-center items-center
          ${isMobile
            ? 'w-full max-w-sm order-2'
            : 'w-1/2 max-w-lg'
          }
        `}>
          {!isMobile && (
            <div className="relative">
              <img
                src="/Mision/f.gif"
                alt="Mission animation"
                width={500}
                height={500}
                className="w-[450px] h-[450px] lg:w-[500px] lg:h-[500px] rounded-2xl object-cover"
                onLoad={() => console.log('GIF loaded successfully')}
                onError={(e) => console.error('GIF failed to load:', e)}
                style={{
                  willChange: 'auto',
                  backfaceVisibility: 'hidden'
                }}
              />
            </div>
          )}
        </div>

        {/* Cards Container */}
        <div className={`
          ${isMobile
            ? 'flex flex-col gap-6 w-full max-w-md mx-auto'
            : 'flex flex-col items-center justify-center relative w-1/2 max-w-[600px] h-[450px]'
          }
        `}>
          {isMobile ? (
            <>
              {cards.map((card, index) => (
                <div
                  key={index}
                  ref={(el) => { cardsRef.current[index] = el; }}
                  className="
                    MissionCard1 flex justify-center items-center text-center font-medium 
                    rounded-[20px] p-5 text-base leading-relaxed w-full 
                    min-h-[140px] backdrop-blur-sm border border-white/10
                  "
                  style={{
                    position: 'relative',
                    willChange: 'auto',
                    backfaceVisibility: 'hidden',
                    wordBreak: 'break-word',
                    hyphens: 'auto',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }}
                >
                  <span className="text-[#FFFDFA] relative z-10 leading-relaxed">
                    {card.title}
                  </span>
                </div>
              ))}
            </>
          ) : (
            // Desktop: Absolutely positioned cards for rotation
            <>
              <div
                className="relative flex items-center justify-center w-full h-full"
                style={{
                  willChange: 'auto',
                  backfaceVisibility: 'hidden',
                  perspective: '1000px'
                }}
              >
                {cards.map((card, index) => (
                  <div
                    key={index}
                    ref={(el) => { cardsRef.current[index] = el; }}
                    className={`
                      ${index % 2 === 0 ? 'MissionCard1' : 'MissionCard2'} 
                      absolute flex justify-center items-center text-center 
                      font-medium rounded-2xl backdrop-blur-sm border border-white/10
                      p-6 text-lg lg:text-xl leading-relaxed w-[500px] h-[180px]
                    `}
                    style={{
                      willChange: 'transform, opacity',
                      backfaceVisibility: 'hidden',
                      transformStyle: 'preserve-3d',
                      top: '50%',
                      left: '50%',
                      marginTop: '-90px',
                      marginLeft: '-250px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}
                  >
                    <span className="relative z-10 text-[#FFFDFA] leading-relaxed">
                      {card.title}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Navigation Dots - Desktop Only */}
              <div className="flex justify-center space-x-3 mt-8">
                {cards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToCard(index)}
                    className={`
                      w-3 h-3 rounded-full transition-all duration-300 border-2
                      ${currentIndex === index
                        ? 'bg-[#FFFDFA] border-[#FFFDFA] scale-110'
                        : 'bg-transparent border-[#FFFDFA]/50 hover:border-[#FFFDFA]/80 hover:scale-105'
                      }
                      ${isAnimating ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    `}
                    disabled={isAnimating}
                    aria-label={`Go to card ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mission;