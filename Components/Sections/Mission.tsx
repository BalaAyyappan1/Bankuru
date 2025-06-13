"use client";
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Group } from '../ReuseableComponents/Icons';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

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

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      const screenWidth = window.innerWidth;
      const isSmallScreen = screenWidth < 768;
      const isMediumScreen = screenWidth >= 768 && screenWidth < 1024;
      
      // Only treat as mobile if it's a small screen OR medium screen with touch
      const isMobileDevice = isSmallScreen || 
        (isMediumScreen && 'ontouchstart' in window && 
         /Android.*Mobile|iPhone|iPod/i.test(navigator.userAgent));
      
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    // Updated ScrollTrigger settings - shorter range so animation completes faster
    const scrollTriggerConfig = {
      trigger: containerRef.current,
      start: isMobile ? "top 90%" : "center 80%",
      // Reduced end point so animation completes in less scroll distance
      end: isMobile ? "center 30%" : "center 40%", 
      scrub: isMobile ? 1.5 : 1, // Faster scrub for quicker completion
      refreshPriority: isMobile ? -2 : -1,
      // Add pin settings to hold the section while animating
      pin: false,
      anticipatePin: 1,
    };

    tlRef.current = gsap.timeline({
      scrollTrigger: scrollTriggerConfig
    });

    const cardElements = cardsRef.current.filter(Boolean);
    
    // Mobile-optimized initial positioning
    const initialOffset = isMobile ? 100 : 200;
    const staggerDistance = isMobile ? 15 : 30;
    
    gsap.set(cardElements, {
      y: (index) => initialOffset + (index * staggerDistance),
      zIndex: (index) => cards.length - index,
      willChange: 'transform',
      force3D: true
    });

    // Updated animation - cards stack more quickly with tighter timing
    cardElements.forEach((card, index) => {
      if (!card) return;

      // Tighter timing so all cards animate within the scroll range
      const startTime = index * (isMobile ? 0.25 : 0.2);
      const yTarget = index === 0 ? 0 : -(index * (isMobile ? 80 : 120));

      tlRef.current!.to(card, {
        y: yTarget,
        zIndex: cards.length + index,
        duration: isMobile ? 1.2 : 1.0, // Shorter duration for quicker completion
        ease: "power2.out",
        force3D: true
      }, startTime);
    });

    // Add a callback when animation completes
    tlRef.current.eventCallback("onComplete", () => {
      console.log("Cards stacking animation completed");
      // Optional: You can trigger any additional logic here when stacking is done
    });

    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
    };
  }, [cards.length, isMobile]);

  // Cleanup ScrollTriggers on unmount
  useEffect(() => {
    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`
        relative bg-transparent flex flex-col items-center justify-center mx-auto px-4
        ${isMobile 
          ? 'h-[70vh] mt-50 py-8 md:space-y-6 max-w-full' 
          : 'h-[100vh] space-y-15 max-w-6xl'
        }
      `}
      style={{ 
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }}
    >
      <h1 className={`
        font-semibold text-center
        ${isMobile 
          ? 'text-2xl sm:text-3xl leading-tight text-[#FFFDFA]' 
          : 'text-[42px] text-[#FFFDFA]'
        }
      `}>
        Join the Mission
      </h1>
      
      <div className={`
        flex w-full items-center
        ${isMobile 
          ? 'flex-col space-y-6' 
          : 'flex-row justify-between'
        }
      `}>
        {/* GIF Container */}
        <div className={`
          flex-shrink-0
          ${isMobile 
            ? 'w-full max-w-sm' 
            : 'w-auto'
          }
        `}>
          <Image
            src="/Mision/f.gif"
            alt="Mission animation"
            width={500}
            height={500}
            className={`
              rounded-lg
              ${isMobile 
                ? 'hidden' 
                : 'h-[500px] w-[500px] object-cover'
              }
            `}
            style={{
              willChange: 'auto',
              backfaceVisibility: 'hidden'
            }}
            priority
             // Add this to prevent Next.js from optimizing the GIF
          />
        </div>

        {/* Cards Container */}
        <div 
          className={`
            flex flex-col gap-4
            ${isMobile 
              ? 'w-full h-auto min-h-[200px]' 
              : 'ml-6 -mt-25 h-[150px] max-w-[550px]'
            }
          `}
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
        >
          {cards.map((card, index) => (
            <div
              key={index}
              ref={(el) => { cardsRef.current[index] = el; }}
              className={`
                MissionCard${(index % 2) + 1} 
                flex justify-center items-center text-center 
                font-medium rounded-[20px] backdrop-blur-[20px] p-4
                ${isMobile 
                  ? 'text-sm sm:text-base leading-tight w-full min-h-[120px] max-w-md mx-auto' 
                  : 'text-[20px] leading-[100%] w-[550px] min-h-[150px]'
                }
              `}
              style={{ 
                position: 'relative',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                // Ensure text remains readable on mobile
                wordBreak: 'break-word',
                hyphens: 'auto'
              }}
            >
              {card.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mission;