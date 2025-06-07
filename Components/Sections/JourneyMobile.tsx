"use client";
import React, { useEffect, useRef } from 'react'
import Image from 'next/image';
import { Begining, One, Way } from '../ReuseableComponents/Icons';

const JourneyMobile = () => {
  const dottedLineRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef(null)

  useEffect(() => {
    const segments = dottedLineRef.current?.querySelectorAll('.glow-segment');
    if (!segments || segments.length === 0) return;

    // Calculate total length and set up each segment
    let totalLength = 0;
    const segmentLengths: number[] = [];
    
    
    segments.forEach(segment => {
      // Calculate length manually for line elements
      const x1 = parseFloat(segment.getAttribute('x1') || '0');
      const y1 = parseFloat(segment.getAttribute('y1') || '0');
      const x2 = parseFloat(segment.getAttribute('x2') || '0');
      const y2 = parseFloat(segment.getAttribute('y2') || '0');
      const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      
      segmentLengths.push(length);
      totalLength += length;
      
      // Set initial state for each segment
      segment.style.strokeDasharray = `${length}`;
      segment.style.strokeDashoffset = `${length}`;
    });

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const container = containerRef.current;
          if (!container) {
            ticking = false;
            return;
          }

          const rect = container.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // Calculate scroll progress - when container comes into view
          const containerTop = rect.top;
          const containerHeight = rect.height;
          
          // Start animation when container is 80% visible from bottom
          const startPoint = windowHeight * 0.8;
          // End animation when container top reaches 20% from top
          const endPoint = windowHeight * 0.2;
          
          // Calculate progress based on how much of container has scrolled past
          let progress = 0;
          if (containerTop <= startPoint) {
            const scrolled = startPoint - containerTop;
            const totalScrollDistance = containerHeight + startPoint - endPoint;
            progress = Math.max(0, Math.min(1, scrolled / totalScrollDistance));
          }
          
          // Animate segments sequentially based on progress
          const totalSegments = segmentLengths.length;
          segmentLengths.forEach((length, index) => {
            // Each segment gets an equal portion of the total progress
            const segmentStart = index / totalSegments;
            const segmentEnd = (index + 1) / totalSegments;
            
            let segmentProgress = 0;
            if (progress >= segmentStart) {
              segmentProgress = Math.min(1, (progress - segmentStart) / (segmentEnd - segmentStart));
            }
            
            // Calculate the dash offset
            const offset = length * (1 - segmentProgress);
            segments[index].style.strokeDashoffset = `${offset}`;
          });
          
          ticking = false;
        });
        ticking = true;
      }
    };

    // Add passive listeners for better mobile performance
    const scrollOptions = { passive: true };
    window.addEventListener('scroll', handleScroll, scrollOptions);
    window.addEventListener('touchmove', handleScroll, scrollOptions);
    
    // Handle resize events
    const handleResize = () => {
      setTimeout(handleScroll, 100);
    };
    window.addEventListener('resize', handleResize);
    
    // Initial call with delay to ensure DOM is ready
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [])

  return (
    <div
      ref={containerRef}
      id="journeyMobile-section"
      className="relative min-h-screen w-full overflow-hidden py-8 sm:py-12 md:py-16"
    >
      <h1 className="text-2xl xs:text-3xl sm:text-[24px] md:text-[24px] text-[#FFFDFA] font-semibold text-center mb-8 sm:mb-12 md:mb-16 px-4">
        Our Journey
      </h1>

      {/* SVG Straight Line - Perfectly Centered */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-20 sm:top-24 md:top-32 h-full z-0">
        <svg 
          width="4" 
          height="2200" 
          className="overflow-visible"
          style={{ willChange: 'transform' }}
        >
          <defs>
            <linearGradient id="glowGradientMobile" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#56549B" stopOpacity="1" />
              <stop offset="100%" stopColor="#7FB3D3" stopOpacity="1" />
            </linearGradient>
            <filter id="glowMobile" x="-200%" y="-200%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background dotted line segments with gaps */}
          <g
            stroke="#BDD1FE"
            strokeWidth="2"
            strokeDasharray="8,8"
            strokeLinecap="round"
            opacity="0.4"
          >
            <line x1="2" y1="50" x2="2" y2="180" />
            <line x1="2" y1="410" x2="2" y2="525" />
            <line x1="2" y1="755" x2="2" y2="880" />
            <line x1="2" y1="1110" x2="2" y2="1240" />
            <line x1="2" y1="1400" x2="2" y2="1540" />
            <line x1="2" y1="1700" x2="2" y2="1930" />
          </g>

          {/* Animated glowing line segments with gaps */}
          <g
            ref={dottedLineRef}
            stroke="url(#glowGradientMobile)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#glowMobile)"
            style={{ willChange: 'stroke-dashoffset' }}
          >
            <line className="glow-segment" x1="2" y1="50" x2="2" y2="180" />
            <line className="glow-segment" x1="2" y1="410" x2="2" y2="525" />
            <line className="glow-segment" x1="2" y1="755" x2="2" y2="880" />
            <line className="glow-segment" x1="2" y1="1110" x2="2" y2="1240" />
            <line className="glow-segment" x1="2" y1="1400" x2="2" y2="1540" />
            <line className="glow-segment" x1="2" y1="1700" x2="2" y2="1930" />
          </g>
        </svg>
      </div>

      {/* Content positioned to align with line segments */}
      <div className="relative z-10 max-w-sm mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center">
          <div style={{ height: "110px" }}></div>

          {/* The beginning - positioned at first segment */}
          <div
            className="flex flex-col items-center text-center space-y-4 py-6 sm:py-8 mt-8"
            style={{ marginTop: "45px" }}
          >
            <h1 className="text-[24px] text-[#FFFDFA]">The Begining</h1>

            <div className="relative mb-4">
              <Image
                src={Begining}
                alt="begining"
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
          <div className="flex flex-col items-center text-center space-y-4 py-6 sm:py-8">
            <div className="w-24 h-12 xs:w-28 xs:h-14 sm:w-32 sm:h-16 rounded-lg flex items-center justify-center mb-4">
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
          <div className="flex flex-col items-center text-center space-y-4 py-6 sm:py-8">
            <div className="w-24 h-12 xs:w-28 xs:h-14 sm:w-32 sm:h-16 rounded-lg flex items-center justify-center mb-4">
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

export default JourneyMobile