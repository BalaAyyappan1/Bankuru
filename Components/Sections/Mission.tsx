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
  const videoRef = useRef<HTMLVideoElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const lastProgressRef = useRef<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);

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
      const isMobileDevice = window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Optimized video update function with mobile considerations
  const updateVideo = useCallback((progress: number) => {
    if (!videoRef.current || !isVideoLoaded) return;
    
    // Reduce video updates on mobile for better performance
    const threshold = isMobile ? 0.05 : 0.01;
    const progressDiff = Math.abs(progress - lastProgressRef.current);
    if (progressDiff < threshold) return;
    
    lastProgressRef.current = progress;
    
    const videoDuration = videoRef.current.duration;
    if (videoDuration && !isNaN(videoDuration)) {
      // Use requestAnimationFrame for smoother video scrubbing
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = progress * videoDuration;
        }
      });
    }
  }, [isMobile, isVideoLoaded]);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    let rafId: number;
    
    // Mobile-optimized ScrollTrigger settings
    const scrollTriggerConfig = {
      trigger: containerRef.current,
      start: isMobile ? "top 90%" : "center 80%",
      end: isMobile ? "bottom 10%" : "bottom 20%",
      scrub: isMobile ? 1 : 0.5, // Slower scrub on mobile for better performance
      refreshPriority: isMobile ? -2 : -1,
      onUpdate: (self: any) => {
        // Throttle updates more aggressively on mobile
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          updateVideo(self.progress);
        });
      },
      onEnter: () => {
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }
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

    // Mobile-optimized animation parameters
    cardElements.forEach((card, index) => {
      if (!card) return;

      const startTime = index * (isMobile ? 0.15 : 0.1);
      const yTarget = index === 0 ? 0 : -(index * (isMobile ? 80 : 120));

      tlRef.current!.to(card, {
        y: yTarget,
        zIndex: cards.length + index,
        duration: isMobile ? 0.8 : 0.6,
        ease: "power2.out",
        force3D: true
      }, startTime);
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (tlRef.current) {
        tlRef.current.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [cards.length, updateVideo, isMobile]);

  // Enhanced video load handler for mobile
  const handleVideoLoad = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      // Optimize preload strategy for mobile
      videoRef.current.preload = isMobile ? 'metadata' : 'auto';
      setIsVideoLoaded(true);
    }
  }, [isMobile]);

  // Handle video error on mobile
  const handleVideoError = useCallback(() => {
    console.warn('Video failed to load on mobile device');
    setIsVideoLoaded(false);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`
        relative bg-transparent flex flex-col items-center justify-center mx-auto px-4
        ${isMobile 
          ? 'h-[90vh] mt-50 py-8 md:space-y-6 max-w-full' 
          : 'h-screen space-y-15 max-w-6xl'
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
          ? 'text-2xl sm:text-3xl leading-tight' 
          : 'text-[42px]'
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
        {/* Video Container */}
        <div className={`
          flex-shrink-0
          ${isMobile 
            ? 'w-full max-w-sm' 
            : 'w-auto'
          }
        `}>
          <video 
            ref={videoRef}
            className={`
              rounded-lg
              ${isMobile 
                ? 'w-full h-auto aspect-square max-w-[300px] mx-auto' 
                : 'h-[500px] w-[500px]'
              }
            `}
            muted
            playsInline
            preload={isMobile ? 'metadata' : 'auto'}
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            style={{
              willChange: 'auto',
              backfaceVisibility: 'hidden'
            }}
          >
            <source src="/fam.webm" type="video/webm" />
            <source src="/fam.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Cards Container */}
        <div 
          className={`
            flex flex-col gap-4
            ${isMobile 
              ? 'w-full h-auto min-h-[200px]' 
              : 'ml-6 h-[150px] max-w-[550px]'
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

      {/* Mobile-specific loading indicator */}
      
    </div>
  );
};

export default Mission;