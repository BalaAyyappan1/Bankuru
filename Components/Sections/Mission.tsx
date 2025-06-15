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
      stackOffset: 15, // Increased for better depth
      baseY: 0,
      scaleStep: 0.03, // More pronounced scaling
      opacityStep: 0.2, // More pronounced opacity change
      animationDuration: 1.5, // Slower for smoother transition
      pauseDuration: 1.5, // Longer pause to read
      rotationRange: 3, // Slightly more rotation
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

  // Mobile: Scroll-triggered stack animation
  useEffect(() => {
    if (!isMobile || !containerRef.current || typeof window === 'undefined') return;

    // Updated ScrollTrigger settings
    const scrollTriggerConfig = {
      trigger: containerRef.current,
      start: "top 90%",
      end: "center 30%", 
      scrub: 1.5,
      refreshPriority: -2,
      pin: false,
      anticipatePin: 1,
    };

    scrollTlRef.current = gsap.timeline({
      scrollTrigger: scrollTriggerConfig
    });

    const cardElements = cardsRef.current.filter(Boolean);
    
    // Mobile-optimized initial positioning
    const initialOffset = 100;
    const staggerDistance = 15;
    
    gsap.set(cardElements, {
      y: (index) => initialOffset + (index * staggerDistance),
      zIndex: (index) => cards.length - index,
      willChange: 'transform',
      force3D: true
    });

    // Updated animation - cards stack more quickly with tighter timing
    cardElements.forEach((card, index) => {
      if (!card) return;

      const startTime = index * 0.25;
      const yTarget = index === 0 ? 0 : -(index * 120);

      scrollTlRef.current!.to(card, {
        y: yTarget,
        zIndex: cards.length + index,
        duration: 1.2,
        ease: "power2.out",
        force3D: true
      }, startTime);
    });

    return () => {
      if (scrollTlRef.current) {
        scrollTlRef.current.kill();
        scrollTlRef.current = null;
      }
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

  return (
    <div 
      ref={containerRef} 
      className={`
        relative bg-transparent flex flex-col items-center justify-center mx-auto px-4
        ${isMobile 
          ? 'h-[70vh] md:mt-50 mt-80 py-8 md:space-y-6 max-w-full' 
          : 'min-h-screen w-full space-y-15 max-w-7xl'
        }
      `}
      style={{ 
        willChange: isMobile ? 'transform' : 'auto',
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
          ? 'flex-col space-y-6' 
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
              <Image
                src="/Mision/f.gif"
                alt="Mission animation"
                width={500}
                height={500}
                className="w-[450px] h-[450px] lg:w-[500px] lg:h-[500px] rounded-2xl  object-cover"
                style={{
                  willChange: 'auto',
                  backfaceVisibility: 'hidden'
                }}
                priority
                unoptimized
              />
            </div>
          )}
        </div>

        {/* Cards Container */}
        <div className={`
          ${isMobile 
            ? 'flex flex-col gap-4 w-full h-auto min-h-[200px] order-1' 
            : 'flex flex-col items-center justify-center relative w-1/2 max-w-[600px] h-[450px]'
          }
        `}>
          {isMobile ? (
            <>
              {cards.map((card, index) => (
                <div
                  key={index}
                  ref={(el) => { cardsRef.current[index] = el; }}
                  className="MissionCard${(index % 2) + 1} mt-2 flex justify-center items-center text-center font-medium rounded-[20px] p-4 text-sm sm:text-base leading-tight w-full md:min-h-[120px] max-w-md mx-auto"
                  style={{ 
                    position: 'relative',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)',
                    wordBreak: 'break-word',
                    hyphens: 'auto'
                  }}
                >
                  <span className="text-[#FFFDFA]">{card.title}</span>
                </div>
              ))}
            </>
          ) : (
            // Desktop: Absolutely positioned cards for rotation
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
                    MissionCard${(index % 2) + 1} 
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Mission;