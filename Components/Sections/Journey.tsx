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
  const animationsRef = useRef<any[]>([]);
  
  // Refs for each milestone point
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const beginningRef = useRef<HTMLDivElement | null>(null);
  const whatsAheadRef = useRef<HTMLDivElement | null>(null);
  const milestoneOneRef = useRef<HTMLDivElement | null>(null);
  const q3Ref = useRef<HTMLDivElement | null>(null);
  const year2026Ref = useRef<HTMLDivElement | null>(null);

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
        if (trigger.trigger === containerRef.current || 
            trigger.trigger === titleRef.current ||
            trigger.trigger === beginningRef.current ||
            trigger.trigger === whatsAheadRef.current ||
            trigger.trigger === milestoneOneRef.current ||
            trigger.trigger === q3Ref.current ||
            trigger.trigger === year2026Ref.current) {
          trigger.kill();
        }
      });
    };

    const initializeAnimations = () => {
      if (!dottedLineRef.current || !containerRef.current) return;

      // Initialize SVG path animations (existing code)
      const paths = dottedLineRef.current.querySelectorAll('.animated-segment');
      if (paths && paths.length > 0) {
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

        // Create sequential scroll-triggered animations for paths
        paths.forEach((path, index) => {
          const pathElement = path as SVGPathElement;
          const length = pathLengths[index];

          // Calculate sequential trigger points
          const segmentHeight = 20; // Each segment takes 20% of container height
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
      }

      // Initialize text animations for milestone points
      const milestoneElements = [
        { ref: titleRef, delay: 0 },
        { ref: beginningRef, delay: 0.1 },
        { ref: whatsAheadRef, delay: 0.2 },
        { ref: milestoneOneRef, delay: 0.3 },
        { ref: q3Ref, delay: 0.4 },
        { ref: year2026Ref, delay: 0.5 }
      ];

      milestoneElements.forEach(({ ref, delay }) => {
        if (ref.current) {
          // Set initial state - invisible and slightly moved down
          gsap.set(ref.current, {
            opacity: 0,
            y: 50,
            scale: 0.95
          });

          // Create scroll-triggered animation
          const animation = gsap.to(ref.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: delay,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              end: "top 65%",
              toggleActions: "play none none reverse",
              once: false, // Allow reverse animation when scrolling up
              invalidateOnRefresh: true
            }
          });

          animationsRef.current.push(animation);
        }
      });
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
  }, []); 

  return (
    <div
      ref={containerRef}
      id="journey-section"
      className="relative bg-transparent min-h-screen w-full overflow-hidden py-8 px-4"
      style={{ height: '160vh' }}
    >
      {/* Title */}
      <h1 
        ref={titleRef}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-semibold text-center mb-8"
      >
        Journey
      </h1>

      {/* SVG Glowing Line */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-full h-full">
        <svg
          ref={dottedLineRef}
          width="100%"
          height="100%"
          viewBox="0 0 100 200"
          preserveAspectRatio="xMidYMin meet"
          className="overflow-visible"
          style={{ pointerEvents: "none" }}
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
              d="M50 173 L40 177 L40 185"
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
              d="M50 173 L40 177 L40 185"
              fill="none"
              stroke="url(#glowGradient)"
              strokeWidth="0.6"
              strokeLinecap="round"
              filter="url(#glow)"
            />
          </g>
        </svg>
      </div>

      {/* The Beginning */}
      <div 
        ref={beginningRef}
        className="absolute top-[26.5%] left-[2%] w-full flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 px-4"
      >
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 xl:max-w-6xl max-w-4xl w-full">
          <span className="text-[#FFFDFA] xl:text-[24px] lg:text-[20px] font-semibold text-right md:flex-1">
            The Begining
          </span>
          <div className="flex-shrink-0">
            <Image
              src={Begining}
              alt="beginning"
              width={100}
              height={100}
            />
          </div>
          <span className="text-[#BEBCBA] xl:text-[20px] lg:text-[18px] w-1/3 text-left md:flex-1">
            Founded in 2024, Bankuru Services Private Limited began with a simple
            mission — to build impactful products that serve people, not just
            markets.
          </span>
        </div>
      </div>

      {/* What's Ahead */}
      <div 
        ref={whatsAheadRef}
        className="absolute top-[46%] -left-[3%] w-full flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 px-4"
      >
        <div className="flex flex-col md:flex-row-reverse items-center gap-4 md:gap-8 xl:max-w-6xl max-w-4xl w-full">
          <span className="text-[#FFFDFA] xl:text-[24px] lg:text-[20px] font-semibold text-left md:flex-1">
            What's Ahead?
          </span>
          <div className="flex-shrink-0">
            <Image
              src={Way}
              alt="way ahead"
              width={100}
              height={100}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28"
            />
          </div>
          <span className="text-[#BEBCBA] xl:text-[20px] lg:text-[18px] w-1/3 text-left md:flex-1">
            From an idea to a growing ecosystem, our goal is to launch ventures
            that are bold, practical, and globally scalable — starting right here
            in India.
          </span>
        </div>
      </div>

      {/* Milestone One */}
      <div 
        ref={milestoneOneRef}
        className="absolute top-[70.5%] left-[10%] w-full flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 px-4"
      >
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 xl:max-w-6xl max-w-4xl w-full">
          <span className="text-[#FFFDFA] xl:text-[24px] lg:text-[20px] font-semibold md:text-right md:flex-1">
            Milestone One
          </span>
          <div className="flex-shrink-0">
            <Image
              src={One}
              alt="milestone one"
              width={90}
              height={90}
              className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24"
            />
          </div>
          <span className="text-[#BEBCBA] xl:text-[20px] lg:text-[18px] w-1/3 text-left md:flex-1">
            Meet Bio Alpha International—our ESG & sustainability consultancy
            that's already helping organizations build responsible, growth-driving
            strategies.
          </span>
        </div>
      </div>

      {/* Q3 2025 */}
      <div 
        ref={q3Ref}
        className="absolute top-[85%] left-[16.5%] w-full flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 px-4"
      >
        <div className="flex flex-col md:flex-row items-center gap-4 xl:gap-8 xl:max-w-3xl lg:max-w-xl w-full">
          <span className="text-[#FFFDFA] xl:text-[24px] lg:text-[20px] font-semibold text-center md:text-right md:w-1/4 flex-shrink-0">
            Q3 2025
          </span>
          <span className="text-[#BEBCBA] xl:text-[20px] lg:text-[18px] w-1/3 text-left md:flex-1">
            After months of research, development, and testing, we are about to
            launch our first product AI-powered mobile App in 2025. This milestone
            marks the start of our journey to build impactful solutions.
          </span>
        </div>
      </div>

      {/* 2026 */}
      <div 
        ref={year2026Ref}
        className="absolute -bottom-1 xl:left-[16%] left-[16%] w-full flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 px-4"
      >
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 max-w-6xl w-full">
          <span className="text-[#FFFDFA] xl:text-[24px] lg:text-[20px] font-semibold text-center md:text-right md:w-1/4 flex-shrink-0">
            2026
          </span>
          <span className="text-[#BEBCBA] xl:text-[20px] lg:text-[18px] w-1/3 text-left flex-1">
            Scaling globally ("New verticals & partnerships")
          </span>
        </div>
      </div>
    </div>
  );
}

export default Journey;