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
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
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

  // Apply card positions based on current index
  const applyCardPositions = useCallback((targetIndex: number, duration: number = 0.8) => {
    const cardElements = cardsRef.current.filter(Boolean);
    if (cardElements.length === 0) return Promise.resolve();

    const config = {
      stackOffset: 15,
      scaleStep: 0.03,
      opacityStep: 0.2,
    };

    return new Promise<void>((resolve) => {
      gsap.to(cardElements, {
        duration,
        ease: "power2.inOut",
        y: (cardIndex) => {
          const newPosition = (cardIndex - targetIndex + cards.length) % cards.length;
          return newPosition * config.stackOffset;
        },
        zIndex: (cardIndex) => {
          const newPosition = (cardIndex - targetIndex + cards.length) % cards.length;
          return cards.length - newPosition;
        },
        opacity: (cardIndex) => {
          const newPosition = (cardIndex - targetIndex + cards.length) % cards.length;
          return Math.max(0.5, 1 - (newPosition * config.opacityStep));
        },
        scale: (cardIndex) => {
          const newPosition = (cardIndex - targetIndex + cards.length) % cards.length;
          return Math.max(0.85, 1 - (newPosition * config.scaleStep));
        },
        rotation: (cardIndex) => {
          const newPosition = (cardIndex - targetIndex + cards.length) % cards.length;
          return (newPosition - Math.floor(cards.length / 2)) * 0.75;
        },
        force3D: true,
        onComplete: () => {
          resolve();
        }
      });
    });
  }, [cards.length]);

  // Create the perfect rotation animation
  const createPerfectRotation = useCallback(() => {
    const cardElements = cardsRef.current.filter(Boolean);
    if (cardElements.length === 0 || !isAutoPlaying) return null;

    const config = {
      animationDuration: 1.5,
      pauseDuration: 2.5, // Increased pause for better UX
    };

    const masterTimeline = gsap.timeline({
      repeat: -1,
      ease: "power2.inOut",
      onUpdate: () => {
        // Update current index based on timeline progress
        const progress = masterTimeline.progress();
        const totalCycles = cards.length;
        const currentCycle = Math.floor(progress * totalCycles);
        const newIndex = (currentCycle + 1) % cards.length;
        
        // Only update if index actually changed
        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
        }
      }
    });

    // Create smooth rotation cycles
    for (let cycle = 0; cycle < cards.length; cycle++) {
      const cycleTimeline = gsap.timeline();
      const targetIndex = (cycle + 1) % cards.length;

      cycleTimeline.to(cardElements, {
        duration: config.animationDuration,
        ease: "power2.inOut",
        y: (cardIndex) => {
          const newPosition = (cardIndex - targetIndex + cards.length) % cards.length;
          return newPosition * 15;
        },
        zIndex: (cardIndex) => {
          const newPosition = (cardIndex - targetIndex + cards.length) % cards.length;
          return cards.length - newPosition;
        },
        opacity: (cardIndex) => {
          const newPosition = (cardIndex - targetIndex + cards.length) % cards.length;
          return Math.max(0.5, 1 - (newPosition * 0.2));
        },
        scale: (cardIndex) => {
          const newPosition = (cardIndex - targetIndex + cards.length) % cards.length;
          return Math.max(0.85, 1 - (newPosition * 0.03));
        },
        rotation: (cardIndex) => {
          const newPosition = (cardIndex - targetIndex + cards.length) % cards.length;
          return (newPosition - Math.floor(cards.length / 2)) * 0.75;
        },
        force3D: true,
        onStart: () => setIsAnimating(true),
        onComplete: () => setIsAnimating(false)
      });

      cycleTimeline.to({}, { duration: config.pauseDuration });
      masterTimeline.add(cycleTimeline);
    }

    return masterTimeline;
  }, [cards.length, isAutoPlaying, currentIndex]);

  // Desktop: Perfect card rotation animation
  useEffect(() => {
    if (isMobile || !containerRef.current || typeof window === 'undefined' || !isInView) return;

    const cardElements = cardsRef.current.filter(Boolean);
    if (cardElements.length === 0) return;

    const config = {
      stackOffset: 15,
      scaleStep: 0.03,
      opacityStep: 0.2,
      transformOrigin: "50% 50%"
    };

    // Initial stack setup
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
      perspective: 1000,
      transformStyle: 'preserve-3d'
    });

    // Initialize animation with delay
    const timer = setTimeout(() => {
      if (isAutoPlaying) {
        animationRef.current = createPerfectRotation();
      }
    }, 1500);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }
    };
  }, [cards.length, isMobile, isInView, createPerfectRotation, isAutoPlaying]);

  // Mobile: Simple static cards
  useEffect(() => {
    if (!isMobile || !containerRef.current || typeof window === 'undefined') return;

    const cardElements = cardsRef.current.filter(Boolean);
    if (cardElements.length === 0) return;

    if (scrollTlRef.current) {
      scrollTlRef.current.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    }

    gsap.set(cardElements, {
      y: (i) => i * 20,
      opacity: 0,
      scale: 0.97,
      zIndex: (i, target, targets) => targets.length - i,
      transformOrigin: "center center",
      willChange: "transform, opacity",
      filter: "blur(1px)",
    });

    scrollTlRef.current = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%",
        end: "center 10%",
        scrub: 0.1,
        invalidateOnRefresh: true,
      }
    });

    cardElements.forEach((card, index) => {
      if (!card) return;

      gsap.to(card, {
        opacity: 1,
        y: index * 8,
        scale: 1,
        filter: "blur(0px)",
        duration: 1,
        delay: index * 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          end: "top 70%",
          once: true,
          markers: false
        }
      });

      const cardTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "top 15%",
          scrub: 1.5,
          markers: false
        }
      });

      cardTl
        .to(card, {
          y: -index * 40,
          ease: "sine.inOut"
        }, 0)
        .to(card, {
          scale: 1.05,
          zIndex: cardElements.length + index,
          ease: "power1.in"
        }, 0)
        .to(card, {
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          ease: "power1.out"
        }, 0);
    });

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

  // Navigation dot click handler - FIXED
  const goToCard = useCallback(async (index: number) => {
    const now = Date.now();
    
    // Prevent rapid clicks and ignore if already on target card
    if (isMobile || isAnimating || index === currentIndex || now - lastClickTime < 300) {
      return;
    }
    
    setLastClickTime(now);
    setIsAnimating(true);
    setIsAutoPlaying(false); // Stop auto-play when user interacts
    
    // Kill existing animation
    if (animationRef.current) {
      animationRef.current.kill();
      animationRef.current = null;
    }
    
    // Update current index immediately for UI feedback
    setCurrentIndex(index);
    
    // Apply the new card positions
    await applyCardPositions(index, 0.8);
    
    setIsAnimating(false);
    
    // Resume auto-play after a delay
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 3000);
    
  }, [isMobile, isAnimating, currentIndex, lastClickTime, applyCardPositions]);

  // Resume auto-play effect
  useEffect(() => {
    if (!isMobile && isAutoPlaying && !isAnimating && isInView) {
      const timer = setTimeout(() => {
        animationRef.current = createPerfectRotation();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isAutoPlaying, isAnimating, isMobile, isInView, createPerfectRotation]);

  // Cleanup
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
              
              {/* Navigation Dots - ENHANCED */}
              <div className="flex justify-center space-x-3 mt-8">
                {cards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToCard(index)}
                    className={`
                      w-3 h-3 rounded-full transition-all duration-300 border-2
                      ${currentIndex === index
                        ? 'bg-[#FFFDFA] border-[#FFFDFA] scale-110 shadow-lg'
                        : 'bg-transparent border-[#FFFDFA]/50 hover:border-[#FFFDFA]/80 hover:scale-105'
                      }
                      ${isAnimating ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:shadow-md'}
                      focus:outline-none focus:ring-2 focus:ring-[#FFFDFA]/50 focus:ring-offset-2 focus:ring-offset-transparent
                    `}
                    disabled={isAnimating}
                    aria-label={`Go to card ${index + 1}`}
                    style={{
                      transform: currentIndex === index ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.3s ease'
                    }}
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