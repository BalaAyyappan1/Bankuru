"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Begining, One, Way } from '../ReuseableComponents/Icons';

const JourneyMobile = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && pathRef.current) {
      // Calculate the total length of the path
      const path = pathRef.current;
      const length = path.getTotalLength();
      
      // Set up the initial state
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      
      // Trigger the animation
      setTimeout(() => {
        path.style.transition = 'stroke-dashoffset 2s ease-in-out';
        path.style.strokeDashoffset = '0';
      }, 100);
    }
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      id="journeyMobile-section"
      className="relative min-h-screen w-full overflow-hidden py-8 sm:py-12 md:py-16"
    >
      <h1 className="text-[24px] text-[#FFFDFA] font-semibold text-center mb-8 sm:mb-12 md:mb-16 px-4">
        Our Journey
      </h1>

      {/* SVG Line Container */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-20 sm:top-24 md:top-32 h-full z-0">
        <svg 
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
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
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

          {/* Animated glowing line */}
          <path
            ref={pathRef}
            d="M10 50 L10 180 M10 410 L10 525 M10 755 L10 880 M10 1110 L10 1240 M10 1400 L10 1540 M10 1700 L10 1930"
            stroke="url(#glowGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow)"
            style={{
              opacity: isVisible ? 1 : 0,
              willChange: 'stroke-dashoffset'
            }}
          />
        </svg>
      </div>

      {/* Rest of your content remains the same */}
      <div className="relative z-10 max-w-sm mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center">
          <div style={{ height: "110px" }}></div>

          {/* The beginning - positioned at first segment */}
          <div
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

          {/* Spacer to align with second segment */}
          <div style={{ height: "90px" }}></div>

          {/* Way In - positioned at second segment */}
          <div className="flex flex-col items-center text-center space-y-4 py-6 sm:py-8">
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

          {/* Spacer to align with third segment */}
          <div style={{ height: "95px" }}></div>

          {/* Milestone 01 - positioned at third segment */}
          <div className="flex flex-col items-center text-center space-y-4 py-6 sm:py-8">
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

          {/* Spacer to align with fourth segment */}
          <div style={{ height: "105px" }}></div>

          {/* Q3 2025 - positioned at fourth segment */}
          <div className="flex flex-col items-center text-center space-y-2 py-4 sm:py-8">
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

          {/* Spacer to align with fifth segment */}
          <div style={{ height: "100px" }}></div>

          {/* Future - positioned at fifth segment */}
          <div className="flex flex-col items-center text-center space-y-2 mt-3 py-6 sm:py-8 mt-5">
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