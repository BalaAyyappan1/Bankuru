"use client";
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image';
import { Begining, Way } from '../ReuseableComponents/Icons';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Journey = () => {
  const dottedLineRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    // Get all the path elements (multiple segments)
    const paths = dottedLineRef.current?.querySelectorAll('.animated-segment');
    if (!paths || paths.length === 0) return;

    // Calculate total length of all segments
    let totalLength = 0;
    const segmentLengths = [];
    
    paths.forEach(path => {
      const length = path.getTotalLength();
      segmentLengths.push(length);
      totalLength += length;
    });

    // Set initial state for all segments
    paths.forEach(path => {
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length
      });
    });

    // Create timeline for sequential animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "bottom center",
        scrub: 1,
      }
    });

    // Animate each segment sequentially
    let currentProgress = 0;
    segmentLengths.forEach((length, index) => {
      const segmentDuration = length / totalLength;
      
      tl.to(paths[index], {
        strokeDashoffset: 0,
        duration: segmentDuration,
        ease: "none"
      }, currentProgress);
      
      currentProgress += segmentDuration;
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [])

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
          width="100%"
          height="100%"
          viewBox="0 0 100 200"
          preserveAspectRatio="xMidYMin meet"
          className="overflow-visible"
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

          {/* Background dotted paths (static) - exactly as your original */}
          <path
            d="M50 10 
               L50 30 
               L30 40
               L30 47"
            fill="none"
            stroke="#BDD1FE"
            strokeWidth="0.2"
            strokeDasharray="1,1"
            strokeLinecap="round"
            opacity="0.3"
          />

          <path
            d="M30 55  
               L30 60    
               L70 80
               L70 88"
            fill="none"
            stroke="#BDD1FE"
            strokeWidth="0.2"
            strokeDasharray="1,1"
            strokeLinecap="round"
            opacity="0.3"
          />

          <path
            d="M70 94  
               L70 100  
               L40 120 
               L40 135"
            fill="none"
            stroke="#BDD1FE"
            strokeWidth="0.2"
            strokeDasharray="1,1"
            strokeLinecap="round"
            opacity="0.3"
          />

          <path
            d="M40 142  
               L40 160
               L50 166"
            fill="none"
            stroke="#BDD1FE"
            strokeWidth="0.2"
            strokeDasharray="1,1"
            strokeLinecap="round"
            opacity="0.3"
          />

          <path
            d="M50 166      
               L50 170
               L40 175
               L40 185"
            fill="none"
            stroke="#BDD1FE"
            strokeWidth="0.2"
            strokeDasharray="1,1"
            strokeLinecap="round"
            opacity="0.3"
          />

          {/* Animated glowing line segments - matching your gaps exactly */}
          <g ref={dottedLineRef}>
            <path
              className="animated-segment"
              d="M50 10 
                 L50 30 
                 L30 40
                 L30 47"
              fill="none"
              stroke="url(#glowGradient)"
              strokeWidth="0.4"
              strokeLinecap="round"
              filter="url(#glow)"
            />

            <path
              className="animated-segment"
              d="M30 55  
                 L30 60    
                 L70 80
                 L70 88"
              fill="none"
              stroke="url(#glowGradient)"
              strokeWidth="0.4"
              strokeLinecap="round"
              filter="url(#glow)"
            />

            <path
              className="animated-segment"
              d="M70 94  
                 L70 100  
                 L40 120 
                 L40 135"
              fill="none"
              stroke="url(#glowGradient)"
              strokeWidth="0.4"
              strokeLinecap="round"
              filter="url(#glow)"
            />

            <path
              className="animated-segment"
              d="M40 142  
                 L40 160
                 L50 166"
              fill="none"
              stroke="url(#glowGradient)"
              strokeWidth="0.4"
              strokeLinecap="round"
              filter="url(#glow)"
            />

            <path
              className="animated-segment"
              d="M50 170      
                 L40 175
                 L40 185"
              fill="none"
              stroke="url(#glowGradient)"
              strokeWidth="0.4"
              strokeLinecap="round"
              filter="url(#glow)"
            />
          </g>
        </svg>
      </div>

      {/* The beginning */}
      <div className="absolute top-80 left-45 w-full flex flex-row justify-center items-center gap-8 px-4">
        <span className="text-[#FFFDFA] text-[24px] font-semibold text-right">
          The Beginning
        </span>

        <div className="relative">
          <Image
            src={Begining}
            alt="begining"
            width={200}
            height={200}
            className="w-[100px] h-[100px]"
          />
        </div>

        <span className="text-[#BEBCBA] text-[20px] w-1/3 text-left">
          Founded in 2024, Bankuru Services Private Limited began with a simple
          mission — to build impactful products that serve people, not just
          markets.
        </span>
      </div>

      {/* way */}
      <div className="absolute top-151 right-40 w-full flex flex-row justify-center items-center gap-8 px-4">
        <span className="text-[#BEBCBA] text-[20px] w-1/3 text-left">
          From an idea to a growing ecosystem, our goal is to launch ventures
          that are bold, practical, and globally scalable — starting right here
          in India.
        </span>

        <div className="relative">
          <Image
            src={Way}
            alt="begining"
            width={200}
            height={200}
            className="w-[100px] h-[100px]"
          />
        </div>

        <span className="text-[#FFFDFA] text-[24px] font-semibold text-right">
          What's Ahead?
        </span>
      </div>

      {/* one */}
      <div className="absolute top-235 left-15 w-full flex flex-row justify-center items-center gap-8 px-4">
        <span className="text-white text-lg w-1/4 text-right">
          Milestone One
        </span>

        <span className="text-[#BEBCBA] text-[20px] w-1/3 text-left">
          Meet Bio Alpha International—our ESG & sustainability consultancy
          that's already helping organizations build responsible, growth-driving
          strategies.
        </span>
      </div>

      {/* q3 */}
      <div className="absolute bottom-36 left-30 w-full flex flex-row justify-center items-center gap-8 px-4">
        <span className="text-white text-lg w-1/4 text-right">Q3 2025</span>

        <span className="text-[#BEBCBA] text-[20px] w-1/3 text-left">
          After months of research, development, and testing, we are about to
          launch our first product AI-powered mobile App in 2025.This milestone
          marks the start of our journey to build impactful solutions.
        </span>
      </div>

      {/* 2026 */}
      <div className="absolute bottom-13 left-7 w-full flex flex-row justify-center items-center gap-8 px-4">
        <span className="text-white text-lg w-1/4 text-right">2026</span>

        <span className="text-[#BEBCBA] text-[20px] w-1/3 text-left">
          Scaling globally ("New verticals & partnerships")
        </span>
      </div>
    </div>
  );
}

export default Journey