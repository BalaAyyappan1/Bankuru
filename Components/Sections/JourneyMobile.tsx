"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Begining, One, Way } from '../ReuseableComponents/Icons';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const JourneyMobile = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGSVGElement>(null);
  const animationsRef = useRef<any[]>([]);
  
  // Refs for each milestone point
  const titleRef = useRef<HTMLHeadingElement>(null);
  const beginningRef = useRef<HTMLDivElement>(null);
  const whatsAheadRef = useRef<HTMLDivElement>(null);
  const milestoneOneRef = useRef<HTMLDivElement>(null);
  const q3Ref = useRef<HTMLDivElement>(null);
  const year2026Ref = useRef<HTMLDivElement>(null);

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
      if (!pathRef.current || !containerRef.current) return;

      // Initialize SVG path animations
      const paths = pathRef.current.querySelectorAll('.animated-segment');
      if (paths && paths.length > 0) {
        // Reset all paths and store their lengths
        paths.forEach((path, index) => {
          const pathElement = path as SVGPathElement;
          const length = pathElement.getTotalLength();
          
          // Set initial state - completely hidden
          gsap.set(pathElement, {
            strokeDasharray: length,
            strokeDashoffset: length,
            opacity: 1
          });
        });

        // Create one master timeline for all path animations
        const masterTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });

        // Add each path animation to the timeline sequentially
        paths.forEach((path, index) => {
          const pathElement = path as SVGPathElement;
          const length = pathElement.getTotalLength();

          // Add animation to timeline with smooth sequential flow
          masterTimeline.to(pathElement, {
            strokeDashoffset: 0,
            duration: 1,
            ease: "none",
          }, index * 0.8); // Slight overlap for smooth flow
        });

        animationsRef.current.push(masterTimeline);
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
              once: false,
              invalidateOnRefresh: true
            }
          });

          animationsRef.current.push(animation);
        }
      });
    };

    // Initialize with proper timing
    const timeouts: NodeJS.Timeout[] = [];
    
    // Wait for DOM to be ready
    timeouts.push(setTimeout(initializeAnimations, 100));
    
    // Backup initialization
    timeouts.push(setTimeout(() => {
      initializeAnimations();
      ScrollTrigger.refresh();
    }, 300));

    // Handle window load
    const handleLoad = () => {
      setTimeout(() => {
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
      id="journeyMobile-section"
      className="relative min-h-screen w-full overflow-hidden py-8 sm:py-12 md:py-16"
    >
      <h1 
        ref={titleRef}
        className="text-[24px] text-[#FFFDFA] font-semibold text-center mb-8 sm:mb-12 md:mb-16 px-4"
      >
        Our Journey
      </h1>

      {/* SVG Line Container */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-20 sm:top-24 md:top-32 h-full z-0">
        <svg 
          ref={pathRef}
          width="20" 
          height="2200" 
          className="overflow-visible"
          viewBox="0 0 20 2200"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="glowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7FB3D3" stopOpacity="1" />
              <stop offset="50%" stopColor="#56549B" stopOpacity="1" />
              <stop offset="100%" stopColor="#7FB3D3" stopOpacity="1" />
            </linearGradient>
            
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Static dotted line - always visible */}
          <g
            stroke="#BDD1FE"
            strokeWidth="2"
            strokeDasharray="8,8"
            strokeLinecap="round"
            opacity="0.4"
          >
            <line x1="10" y1="50" x2="10" y2="180" />
            <line x1="10" y1="410" x2="10" y2="525" />
            <line x1="10" y1="755" x2="10" y2="880" />
            <line x1="10" y1="1110" x2="10" y2="1240" />
            <line x1="10" y1="1400" x2="10" y2="1540" />
            <line x1="10" y1="1700" x2="10" y2="1930" />
          </g>

          {/* Animated glowing line segments */}
          <g>
            <path
              className="animated-segment"
              d="M10,50 L10,180"
              stroke="url(#glowGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              filter="url(#glow)"
            />
            <path
              className="animated-segment"
              d="M10,410 L10,525"
              stroke="url(#glowGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              filter="url(#glow)"
            />
            <path
              className="animated-segment"
              d="M10,755 L10,880"
              stroke="url(#glowGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              filter="url(#glow)"
            />
            <path
              className="animated-segment"
              d="M10,1110 L10,1240"
              stroke="url(#glowGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              filter="url(#glow)"
            />
            <path
              className="animated-segment"
              d="M10,1400 L10,1540"
              stroke="url(#glowGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              filter="url(#glow)"
            />
            <path
              className="animated-segment"
              d="M10,1700 L10,1930"
              stroke="url(#glowGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              filter="url(#glow)"
            />
          </g>
        </svg>
      </div>

      {/* Content with milestone points */}
      <div className="relative z-10 max-w-sm mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center">
          <div style={{ height: "110px" }}></div>

          {/* The beginning */}
          <div
            ref={beginningRef}
            className="flex flex-col items-center text-center space-y-4 py-6 sm:py-8 mt-8"
            style={{ marginTop: "45px" }}
          >
            <h1 className="text-[24px] text-[#FFFDFA]">The Beginning</h1>

            <div className="relative mb-4">
              <Image
                src={Begining}
                alt="beginning"
                width={120}
                height={120}
                className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-[120px] md:h-[120px]"
              />
            </div>

            <p className="text-gray-500 text-xs xs:text-sm leading-relaxed max-w-xs">
              Founded in 2024, Bankuru Services Private Limited began with a
              simple mission — to build impactful products that serve people,
              not just markets.
            </p>
          </div>

          <div style={{ height: "90px" }}></div>

          {/* What's Ahead */}
          <div 
            ref={whatsAheadRef}
            className="flex flex-col items-center text-center space-y-4 py-6 sm:py-8"
          >
            <h1 className="text-[24px] text-[#FFFDFA]">What's Ahead?</h1>
            <div className="relative mb-4">
              <Image
                src={Way}
                alt="way"
                width={120}
                height={120}
                className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-[120px] md:h-[120px]"
              />
            </div>

            <p className="text-gray-500 text-xs xs:text-sm leading-relaxed max-w-xs">
              From an idea to a growing ecosystem, our goal is to launch
              ventures that are bold, practical, and globally scalable —
              starting right here in India.
            </p>
          </div>

          <div style={{ height: "95px" }}></div>

          {/* Milestone One */}
          <div 
            ref={milestoneOneRef}
            className="flex flex-col items-center text-center space-y-4 py-6 sm:py-8"
          >
            <h1 className="text-[24px] text-[#FFFDFA]">Milestone One</h1>

            <div className="relative mb-4">
              <Image
                src={One}
                alt="milestone"
                width={120}
                height={120}
                className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-[120px] md:h-[120px]"
              />
            </div>

            <p className="text-gray-500 text-xs xs:text-sm leading-relaxed max-w-xs">
              Meet Bio Alpha International—our ESG & sustainability consultancy
              that's already helping organizations build responsible,
              growth-driving strategies.
            </p>
          </div>

          <div style={{ height: "105px" }}></div>

          {/* Q3 2025 */}
          <div 
            ref={q3Ref}
            className="flex flex-col items-center text-center space-y-2 py-4 sm:py-8"
          >
            <div className="w-24 h-12 xs:w-28 xs:h-14 sm:w-32 sm:h-16 rounded-lg flex items-center justify-center mb-2">
              <h1 className="text-[24px] text-[#FFFDFA]">Q3 2025</h1>
            </div>

            <p className="text-gray-500 text-xs xs:text-sm leading-relaxed max-w-xs">
              After months of research, development, and testing, we are about
              to launch our first product AI-powered mobile App in 2025. This
              milestone marks the start of our journey to build impactful
              solutions.
            </p>
          </div>

          <div style={{ height: "100px" }}></div>

          {/* 2026 */}
          <div 
            ref={year2026Ref}
            className="flex flex-col items-center text-center space-y-2 mt-3 py-6 sm:py-8 mt-5"
          >
            <div className="w-24 h-12 xs:w-28 xs:h-14 sm:w-32 sm:h-16 rounded-lg flex items-center justify-center mb-2">
              <h1 className="text-[24px] text-[#FFFDFA]">2026</h1>
            </div>

            <p className="text-gray-500 text-xs xs:text-sm leading-relaxed max-w-xs">
              Scaling globally ("New verticals & partnerships")
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JourneyMobile;