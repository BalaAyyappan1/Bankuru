"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useInView } from 'framer-motion';

// Register ScrollTrigger plugin once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Card {
  title: string;
}

const Mission: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayPausedRef = useRef<boolean>(false);
  const isInitializedRef = useRef<boolean>(false);
  const lastAnimationTime = useRef<number>(0);
  
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-50px' });

  // Memoized cards data
  const cards: Card[] = useMemo(() => [
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
  ], []);

  // Optimized mobile detection with debouncing
  const checkMobile = useCallback(() => {
    const now = Date.now();
    if (now - lastAnimationTime.current < 100) return; // Throttle resize events
    
    const screenWidth = window.innerWidth;
    const isSmallScreen = screenWidth < 768;
    const isMediumScreen = screenWidth >= 768 && screenWidth < 1024;

    const isMobileDevice = isSmallScreen ||
      (isMediumScreen && 'ontouchstart' in window &&
        /Android.*Mobile|iPhone|iPod/i.test(navigator.userAgent));

    setIsMobile(prev => prev !== isMobileDevice ? isMobileDevice : prev);
  }, []);

  // Optimized resize handler
  useEffect(() => {
    checkMobile();
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150); // Debounce resize
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [checkMobile]);

  // Memoized animation config
  const animationConfig = useMemo(() => ({
    stackOffset: 15,
    scaleStep: 0.03,
    opacityStep: 0.2,
    transformOrigin: "50% 50%",
    duration: 0.8,
    ease: "power2.inOut"
  }), []);

  // Optimized animate to index function
  const animateToIndex = useCallback((targetIndex: number, duration: number = 0.8) => {
    const now = Date.now();
    if (now - lastAnimationTime.current < 50) return Promise.resolve(); // Prevent spam
    lastAnimationTime.current = now;

    const cardElements = cardsRef.current.filter(Boolean);
    if (cardElements.length === 0 || isAnimating) return Promise.resolve();

    setIsAnimating(true);

    return new Promise<void>((resolve) => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
          resolve();
        }
      });

      tl.to(cardElements, {
        duration,
        ease: animationConfig.ease,
        y: (cardIndex) => {
          const newPosition = (cardIndex - targetIndex + cards.length) % cards.length;
          return newPosition * animationConfig.stackOffset;
        },
        zIndex: (cardIndex) => {
          const newPosition = (cardIndex - targetIndex + cards.length) % cards.length;
          return cards.length - newPosition;
        },
        opacity: (cardIndex) => {
          const newPosition = (cardIndex - targetIndex + cards.length) % cards.length;
          return Math.max(0.5, 1 - (newPosition * animationConfig.opacityStep));
        },
        scale: (cardIndex) => {
          const newPosition = (cardIndex - targetIndex + cards.length) % cards.length;
          return Math.max(0.85, 1 - (newPosition * animationConfig.scaleStep));
        },
        rotation: (cardIndex) => {
          const newPosition = (cardIndex - targetIndex + cards.length) % cards.length;
          return (newPosition - Math.floor(cards.length / 2)) * 0.5;
        }
      });
    });
  }, [cards.length, animationConfig, isAnimating]);

  // Optimized auto-play function
  const startAutoPlay = useCallback(() => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }

    if (!isAutoPlaying || isMobile || !isInView || autoPlayPausedRef.current || isAnimating) return;

    autoPlayIntervalRef.current = setInterval(() => {
      if (!isAutoPlaying || isMobile || !isInView || autoPlayPausedRef.current || isAnimating) {
        if (autoPlayIntervalRef.current) {
          clearInterval(autoPlayIntervalRef.current);
          autoPlayIntervalRef.current = null;
        }
        return;
      }

      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % cards.length;
        animateToIndex(nextIndex, 1.0);
        return nextIndex;
      });
    }, 3000); // Increased interval to 3s for smoother experience
  }, [isAutoPlaying, isMobile, isInView, cards.length, animateToIndex, isAnimating]);

  // Auto-play effect with cleanup
  useEffect(() => {
    const timer = setTimeout(() => {
      startAutoPlay();
    }, 500); // Delay initial auto-play

    return () => {
      clearTimeout(timer);
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
    };
  }, [startAutoPlay]);

  // Desktop initialization - run once
  useEffect(() => {
    if (isMobile || !containerRef.current || typeof window === 'undefined' || 
        !isInView || isInitializedRef.current) return;

    const cardElements = cardsRef.current.filter(Boolean);
    if (cardElements.length === 0) return;

    // Set initial positions immediately without animation
    gsap.set(cardElements, {
      y: (index) => index * animationConfig.stackOffset,
      x: 0,
      rotation: (index) => (index - Math.floor(cards.length / 2)) * 0.75,
      zIndex: (index) => cards.length - index,
      opacity: (index) => Math.max(0.5, 1 - (index * animationConfig.opacityStep)),
      scale: (index) => Math.max(0.85, 1 - (index * animationConfig.scaleStep)),
      transformOrigin: animationConfig.transformOrigin,
      force3D: true
    });

    isInitializedRef.current = true;
  }, [cards.length, isMobile, isInView, animationConfig]);

  // Mobile scroll animations - optimized
  useEffect(() => {
    if (!isMobile || !containerRef.current || typeof window === 'undefined') return;

    const cardElements = cardsRef.current.filter(Boolean);
    if (cardElements.length === 0) return;

    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(st => st.kill());

    // Initial setup for mobile cards
    gsap.set(cardElements, {
      y: (i) => i * 20,
      opacity: 0,
      scale: 0.97,
      zIndex: (i, target, targets) => targets.length - i,
      force3D: true
    });

    // Animate cards in sequence
    cardElements.forEach((card, index) => {
      if (!card) return;

      gsap.to(card, {
        opacity: 1,
        y: index * 8,
        scale: 1,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "top 70%",
          once: true,
          toggleActions: "play none none none"
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [cards.length, isMobile]);

  // Optimized navigation function
  const goToCard = useCallback(async (targetIndex: number) => {
    if (isMobile || isAnimating || targetIndex === currentIndex) return;

    // Pause auto-play temporarily
    autoPlayPausedRef.current = true;
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }

    setCurrentIndex(targetIndex);
    await animateToIndex(targetIndex, 0.6);

    // Resume auto-play after delay
    setTimeout(() => {
      autoPlayPausedRef.current = false;
      if (isAutoPlaying && !isMobile && isInView) {
        startAutoPlay();
      }
    }, 2000);
  }, [isMobile, isAnimating, currentIndex, animateToIndex, isAutoPlaying, isInView, startAutoPlay]);

  // Optimized card click handler
  const handleCardClick = useCallback((cardIndex: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!isMobile && !isAnimating) {
      const nextIndex = cardIndex === currentIndex 
        ? (currentIndex + 1) % cards.length 
        : cardIndex;
      goToCard(nextIndex);
    }
  }, [isMobile, currentIndex, goToCard, cards.length, isAnimating]);

  // Mobile tap handler with haptic feedback
  const handleMobileCardTap = useCallback((cardIndex: number) => {
    if (!isMobile) return;
    
    const cardElement = cardsRef.current[cardIndex];
    if (cardElement) {
      gsap.to(cardElement, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }

    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [isMobile]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
      ScrollTrigger.getAll().forEach(st => st.kill());
      gsap.killTweensOf("*");
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`
        relative bg-transparent flex flex-col items-center justify-center mx-auto px-4
        ${isMobile
          ? 'h-[170vh] py-8 space-y-8 max-w-full'
          : 'min-h-screen w-full mt-80 space-y-15 max-w-7xl'
        }
      `}
      style={{
        contain: 'layout style paint',
        willChange: 'auto'
      }}
    >
      {/* Title */}
      <motion.h1
        ref={ref}
        initial={{ opacity: 0, y: isMobile ? -50 : -30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? -50 : -30 }}
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
        {/* GIF Container - Desktop only */}
        {!isMobile && (
          <div className="flex-shrink-0 w-1/2 max-w-lg flex justify-center items-center">
            <div className="relative">
              <img
                src="/Mision/f.gif"
                alt="Mission animation"
                width={500}
                height={500}
                className="w-[450px] h-[450px] lg:w-[500px] lg:h-[500px] rounded-2xl object-cover"
                loading="lazy"
                style={{
                  willChange: 'auto',
                  contain: 'layout style paint'
                }}
              />
            </div>
          </div>
        )}

        {/* Cards Container */}
        <div className={`
          ${isMobile
            ? 'flex flex-col gap-6 w-full max-w-md mx-auto'
            : 'flex flex-col items-center justify-center relative w-1/2 max-w-[600px] h-[450px]'
          }
        `}>
          {isMobile ? (
            // Mobile cards
            <>
              {cards.map((card, index) => (
                <div
                  key={index}
                  ref={(el) => { cardsRef.current[index] = el; }}
                  className="
                    MissionCard1 flex justify-center items-center text-center font-medium 
                    rounded-[20px] p-5 text-base leading-relaxed w-full 
                    min-h-[140px] backdrop-blur-sm 
                    cursor-pointer select-none
                  "
                  style={{
                    contain: 'layout style paint',
                    willChange: 'transform',
                    touchAction: 'manipulation'
                  }}
                  onClick={() => handleMobileCardTap(index)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleMobileCardTap(index);
                  }}
                >
                  <span className="text-[#FFFDFA] relative z-10 leading-relaxed">
                    {card.title}
                  </span>
                </div>
              ))}
            </>
          ) : (
            // Desktop cards
            <>
              <div
                className="relative flex items-center justify-center w-full h-full"
                style={{
                  contain: 'layout style paint',
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
                      font-medium rounded-2xl backdrop-blur-sm 
                      p-6 text-lg lg:text-xl leading-relaxed w-[500px] h-[180px]
                      cursor-pointer select-none transition-shadow duration-200
                     
                    `}
                    style={{
                      contain: 'layout style paint',
                      willChange: 'transform, opacity',
                      top: '50%',
                      left: '50%',
                      marginTop: '-90px',
                      marginLeft: '-250px',
                      touchAction: 'manipulation'
                    }}
                    onClick={(e) => handleCardClick(index, e)}
                  >
                    <span className="relative z-10 text-[#FFFDFA] leading-relaxed">
                      {card.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center space-x-3 mt-8">
                {cards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToCard(index)}
                    className={`
                      w-3 h-3 rounded-full transition-all duration-300 border-2
                      ${currentIndex === index
                        ? 'bg-[#FFFDFA] border-[#FFFDFA] scale-110'
                        : 'bg-transparent border-[#FFFDFA]/50 hover:border-[#FFFDFA]/80'
                      }
                      ${isAnimating ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      focus:outline-none focus:ring-2 focus:ring-[#FFFDFA]/50
                    `}
                    disabled={isAnimating}
                    aria-label={`Go to card ${index + 1}`}
                    style={{ touchAction: 'manipulation' }}
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