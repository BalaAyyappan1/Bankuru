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
  const videoScrollTriggerRef = useRef<ScrollTrigger | null>(null);
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

  // Fixed video update function - now properly scrubs through video
  const updateVideo = useCallback((progress: number) => {
    if (!videoRef.current || !isVideoLoaded) return;
    
    const videoDuration = videoRef.current.duration;
    if (!videoDuration || isNaN(videoDuration)) return;
    
    // Calculate target time based on scroll progress
    const targetTime = Math.max(0, Math.min(progress * videoDuration, videoDuration - 0.1));
    
    // Only update if there's a meaningful difference
    const currentTime = videoRef.current.currentTime;
    const timeDiff = Math.abs(targetTime - currentTime);
    const threshold = isMobile ? 0.1 : 0.05; // Minimum time difference to update
    
    if (timeDiff >= threshold) {
      try {
        videoRef.current.currentTime = targetTime;
        lastProgressRef.current = progress;
      } catch (error) {
        console.warn('Error updating video time:', error);
      }
    }
  }, [isMobile, isVideoLoaded]);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;
    
    // Clean up existing video ScrollTrigger
    if (videoScrollTriggerRef.current) {
      videoScrollTriggerRef.current.kill();
    }
    
    // Create a separate ScrollTrigger just for video scrubbing only when video is loaded
    if (isVideoLoaded) {
      videoScrollTriggerRef.current = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          updateVideo(self.progress);
        },
        onEnter: () => {
          console.log('Video scroll trigger entered');
        },
        onLeave: () => {
          console.log('Video scroll trigger left');
        }
      });
    }

    return () => {
      if (videoScrollTriggerRef.current) {
        videoScrollTriggerRef.current.kill();
        videoScrollTriggerRef.current = null;
      }
    };
  }, [updateVideo, isVideoLoaded]);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    // Mobile-optimized ScrollTrigger settings for cards animation
    const scrollTriggerConfig = {
      trigger: containerRef.current,
      start: isMobile ? "top 90%" : "center 80%",
      end: isMobile ? "bottom 10%" : "bottom 20%",
      scrub: isMobile ? 1 : 0.5,
      refreshPriority: isMobile ? -2 : -1,
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
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
      // Note: videoScrollTriggerRef cleanup is handled in the separate useEffect
    };
  }, [cards.length, isMobile]);

  // Cleanup all ScrollTriggers on unmount
  useEffect(() => {
    return () => {
      if (videoScrollTriggerRef.current) {
        videoScrollTriggerRef.current.kill();
      }
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, []);

  // Enhanced video load handler
  const handleVideoLoad = useCallback(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Ensure video is ready for scrubbing
      video.currentTime = 0;
      video.muted = true;
      video.preload = 'auto';
      
      // Test if video duration is available
      if (video.duration && !isNaN(video.duration)) {
        console.log('Video loaded successfully, duration:', video.duration);
        setIsVideoLoaded(true);
      } else {
        // If duration not available, try again after a short delay
        setTimeout(() => {
          if (video.duration && !isNaN(video.duration)) {
            console.log('Video duration loaded after delay:', video.duration);
            setIsVideoLoaded(true);
          }
        }, 100);
      }
    }
  }, []);

  // Handle when video can play through
  const handleVideoCanPlayThrough = useCallback(() => {
    if (videoRef.current && !isVideoLoaded) {
      console.log('Video can play through');
      setIsVideoLoaded(true);
    }
  }, [isVideoLoaded]);

  // Handle video error on mobile
  const handleVideoError = useCallback(() => {
    console.warn('Video failed to load');
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
                ? 'hidden' 
                : 'h-[500px] w-[500px]'
              }
            `}
            muted
            playsInline
            preload="auto"
            onLoadedData={handleVideoLoad}
            onLoadedMetadata={handleVideoLoad}
            onCanPlayThrough={handleVideoCanPlayThrough}
            onError={handleVideoError}
            style={{
              willChange: 'auto',
              backfaceVisibility: 'hidden'
            }}
          >
            <source src="/final.webm" type="video/webm" />
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
    </div>
  );
};

export default Mission;