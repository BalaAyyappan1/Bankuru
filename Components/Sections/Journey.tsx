"use client";
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image';
import { Begining, Way, One } from '../ReuseableComponents/Icons';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Journey = () => {
  const dottedLineRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const animationsRef = useRef<any[]>([]);

  useEffect(() => {
    // Cleanup function
    const cleanup = () => {
      // Kill all animations created by this component
      animationsRef.current.forEach(animation => {
        if (animation && animation.kill) {
          animation.kill();
        }
      });
      animationsRef.current = [];

      // Kill ScrollTrigger instances for this container
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === containerRef.current) {
          trigger.kill();
        }
      });
    };

    // Initial cleanup
    cleanup();

    const initializeAnimations = () => {
      if (!dottedLineRef.current || !containerRef.current) return;

      const paths = dottedLineRef.current.querySelectorAll('.animated-segment');
      if (!paths || paths.length === 0) return;

      // Reset all paths and store their lengths
      const pathLengths: number[] = [];
      paths.forEach((path, index) => {
        const pathElement = path as SVGPathElement;
        const length = pathElement.getTotalLength();
        pathLengths[index] = length;
        
        // Set initial state
        gsap.set(pathElement, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 1
        });
      });

      // Create sequential scroll-triggered animations
      paths.forEach((path, index) => {
        const pathElement = path as SVGPathElement;
        const length = pathLengths[index];

        // Calculate sequential trigger points
        const segmentHeight = 25; // Each segment takes 20% of container height
        const startPoint = index * segmentHeight;
        const endPoint = startPoint + segmentHeight;

        const animation = gsap.to(pathElement, {
          strokeDashoffset: 0,
          duration: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: `top+=${startPoint}% center`,
            end: `top+=${endPoint}% center`,
            scrub: 1,
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
            refreshPriority: -1,
            onUpdate: (self) => {
              // Ensure sequential animation - only animate current segment when previous is complete
              const progress = self.progress;
              
              // Check if previous segments are complete
              let canAnimate = true;
              if (index > 0) {
                for (let i = 0; i < index; i++) {
                  const prevPath = paths[i] as SVGPathElement;
                  const prevOffset = parseFloat(prevPath.style.strokeDashoffset || '0');
                  const prevLength = pathLengths[i];
                  // If previous segment isn't fully animated (offset should be 0), don't animate this one
                  if (prevOffset > prevLength * 0.05) { // Allow 5% tolerance
                    canAnimate = false;
                    break;
                  }
                }
              }
              
              if (canAnimate) {
                const currentOffset = length * (1 - progress);
                gsap.set(pathElement, { strokeDashoffset: currentOffset });
              }
            }
          }
        });

        animationsRef.current.push(animation);
      });

      setIsReady(true);
    };

    // Multiple initialization attempts to ensure it works
    const timeouts: NodeJS.Timeout[] = [];
    
    // Immediate attempt
    timeouts.push(setTimeout(initializeAnimations, 0));
    
    // Backup attempts
    timeouts.push(setTimeout(initializeAnimations, 100));
    timeouts.push(setTimeout(initializeAnimations, 300));
    
    // Final attempt with refresh
    timeouts.push(setTimeout(() => {
      initializeAnimations();
      ScrollTrigger.refresh();
    }, 500));

    // Handle window load
    const handleLoad = () => {
      setTimeout(() => {
        initializeAnimations();
        ScrollTrigger.refresh();
      }, 100);
    };

    // Handle resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      }
    };

    // Add event listeners
    window.addEventListener('load', handleLoad);
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cleanup();
    };
  }, []); // Empty dependency array - run once on mount

  // Force refresh when component is ready
  useEffect(() => {
    if (isReady) {
      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 50);
      return () => clearTimeout(refreshTimer);
    }
  }, [isReady]);

  return (
    <div
      ref={containerRef}
      id="journey-section"
      className="relative bg-transparent h-[160vh] w-full overflow-hidden"
    >
      <h1 className="text-[42px] text-[#FFFDFA] font-semibold text-center">
        Journey
      </h1>

      {/* SVG Glowing Line */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full mt-5">
        <svg
          ref={dottedLineRef}
          width="100%"
          height="100%"
          viewBox="0 0 100 200"
          preserveAspectRatio="xMidYMin meet"
          className="overflow-visible"
          style={{ pointerEvents: 'none' }}
        >
          {/* Define gradient and glow effect */}
          <defs>
            <linearGradient id="glowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#56549B" stopOpacity="1" />
              <stop offset="100%" stopColor="#7FB3D3" stopOpacity="1" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background dotted paths (static) */}
          <g opacity="0.3">
            <path
              d="M50 10 L50 30 L30 40 L30 47"
              fill="none"
              stroke="#BDD1FE"
              strokeWidth="0.2"
              strokeDasharray="1,1"
              strokeLinecap="round"
            />
            <path
              d="M30 55 L30 60 L70 80 L70 88"
              fill="none"
              stroke="#BDD1FE"
              strokeWidth="0.2"
              strokeDasharray="1,1"
              strokeLinecap="round"
            />
            <path
              d="M70 94 L70 100 L40 120 L40 135"
              fill="none"
              stroke="#BDD1FE"
              strokeWidth="0.2"
              strokeDasharray="1,1"
              strokeLinecap="round"
            />
            <path
              d="M40 142 L40 160 L50 166"
              fill="none"
              stroke="#BDD1FE"
              strokeWidth="0.2"
              strokeDasharray="1,1"
              strokeLinecap="round"
            />
            <path
              d="M50 166 L50 170 L40 175 L40 185"
              fill="none"
              stroke="#BDD1FE"
              strokeWidth="0.2"
              strokeDasharray="1,1"
              strokeLinecap="round"
            />
          </g>

          {/* Animated glowing line segments */}
          <g>
            <path
              className="animated-segment"
              d="M50 10 L50 30 L30 40 L30 47"
              fill="none"
              stroke="url(#glowGradient)"
              strokeWidth="0.6"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            <path
              className="animated-segment"
              d="M30 55 L30 60 L70 80 L70 88"
              fill="none"
              stroke="url(#glowGradient)"
              strokeWidth="0.6"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            <path
              className="animated-segment"
              d="M70 94 L70 100 L40 120 L40 135"
              fill="none"
              stroke="url(#glowGradient)"
              strokeWidth="0.6"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            <path
              className="animated-segment"
              d="M40 142 L40 160 L50 166"
              fill="none"
              stroke="url(#glowGradient)"
              strokeWidth="0.6"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            <path
              className="animated-segment"
              d="M50 170 L40 175 L40 185"
              fill="none"
              stroke="url(#glowGradient)"
              strokeWidth="0.6"
              strokeLinecap="round"
              filter="url(#glow)"
            />
          </g>
        </svg>
      </div>

      {/* The beginning */}
      <div className="absolute xl:top-81 xl:left-45 lg:top-70 lg:left-45 md:top-83 md:left-35 w-full flex flex-row justify-center items-center gap-8 px-4">
        <span className="text-[#FFFDFA] xl:text-[24px] lg:text-[20px] font-semibold text-right">
          The Beginning
        </span>
        <div className="relative">
          <Image
            src={Begining}
            alt="beginning"
            width={200}
            height={200}
            className="w-[100px] h-[100px]"
          />
        </div>
        <span className="text-[#BEBCBA] xl:text-[20px] lg:text-[18px] w-1/3 text-left">
          Founded in 2024, Bankuru Services Private Limited began with a simple
          mission — to build impactful products that serve people, not just
          markets.
        </span>
      </div>

      {/* What's Ahead */}
      <div className="absolute xl:top-151 xl:right-40 lg:top-131 lg:right-40 md:top-155 md:right-30 w-full flex flex-row justify-center items-center gap-8 px-4">
        <span className="text-[#BEBCBA] xl:text-[20px] lg:text-[18px] w-1/3 text-left">
          From an idea to a growing ecosystem, our goal is to launch ventures
          that are bold, practical, and globally scalable — starting right here
          in India.
        </span>
        <div className="relative">
          <Image
            src={Way}
            alt="way ahead"
            width={200}
            height={200}
            className="w-[100px] h-[100px]"
          />
        </div>
        <span className="text-[#FFFDFA] xl:text-[24px] lg:text-[20px] font-semibold text-right">
          What's Ahead?
        </span>
      </div>

      {/* Milestone One */}
      <div className="absolute xl:top-235 lg:top-26 xl:left-35 lg:left-25 md:top-241 md:left-35 w-full flex flex-row justify-center items-center gap-8 px-4">
        <span className="text-[#FFFDFA] xl:text-[24px] lg:text-[20px] w-1/4 text-right">
          Milestone One
        </span>
        <div className="relative">
          <Image
            src={One}
            alt="milestone one"
            width={200}
            height={200}
            className="w-[90px] h-[90px]"
          />
        </div>
        <span className="text-[#BEBCBA] xl:text-[20px] lg:text-[18px] w-1/3 text-left">
          Meet Bio Alpha International—our ESG & sustainability consultancy
          that's already helping organizations build responsible, growth-driving
          strategies.
        </span>
      </div>

      {/* Q3 2025 */}
      <div className="absolute xl:bottom-36 xl:left-30 lg:bottom-28 lg:left-28 md:bottom-37 md:left-25 w-full flex flex-row justify-center items-center gap-8 px-4">
        <span className="text-white xl:text-[24px] lg:text-[20px] w-1/4 text-right">Q3 2025</span>
        <span className="text-[#BEBCBA] xl:text-[20px] lg:text-[18px] w-1/3 text-left">
          After months of research, development, and testing, we are about to
          launch our first product AI-powered mobile App in 2025. This milestone
          marks the start of our journey to build impactful solutions.
        </span>
      </div>

      {/* 2026 */}
      <div className="absolute xl:bottom-13 xl:left-7 lg:bottom-6 lg:left-8 md:bottom-12 w-full flex flex-row justify-center items-center gap-8 px-4">
        <span className="text-white xl:text-[24px] lg:text-[20px] w-1/4 text-right">2026</span>
        <span className="text-[#BEBCBA] xl:text-[20px] lg:text-[18px] w-1/3 text-left">
          Scaling globally ("New verticals & partnerships")
        </span>
      </div>
    </div>
  );
}

export default Journey