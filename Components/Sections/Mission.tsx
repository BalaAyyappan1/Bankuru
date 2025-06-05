"use client";
import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    // Create timeline
    tlRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=150%", 
        scrub: 1,
        pin: true, // Pin the section
        pinSpacing: true, // Add spacing after pinned section
        anticipatePin: 1,
        onUpdate: (self) => {
          // Control video playback based on scroll progress
          if (videoRef.current) {
            const progress = self.progress;
            const videoDuration = videoRef.current.duration;
            
            if (videoDuration && !isNaN(videoDuration)) {
              videoRef.current.currentTime = progress * videoDuration;
            }
          }
        },
        onEnter: () => {
          // Ensure video is ready to play
          if (videoRef.current) {
            videoRef.current.pause();
          }
        }
      }
    });

    // Set initial positions - all cards start from bottom (hidden)
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      if (index === 0) {
        // First card starts from bottom and moves to its position
        gsap.set(card, {
          y: 200,
          zIndex: cards.length + 1
        });
        
        // First card animates into view first
        tlRef.current!.to(card, {
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        }, 0);
      } else {
        // Other cards start from way bottom
        gsap.set(card, {
          y: 200 + (index * 50), // Stagger starting positions
          zIndex: cards.length - index
        });

        // Each card comes up one by one with delay
        tlRef.current!.to(card, {
          y: -(index * 160),           // Moves each card upwards
          zIndex: cards.length + index, // Ensure each next card is higher in zIndex
          duration: 0.4,
          ease: "power2.out"
        }, index * 0.15);
        // Staggered timing
      }
    });

    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [cards.length]);

  // Handle video load
  const handleVideoLoad = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div ref={containerRef} className="relative bg-transparent flex flex-col space-y-15 items-center justify-center h-screen max-w-6xl mx-auto">
      <h1 className='text-[42px] font-semibold'>Join the Mission</h1>
      <div className="flex flex-row w-full items-center justify-between">
        <video 
          ref={videoRef}
          className="h-[500px] w-[500px]" 
          muted
          playsInline
          preload="metadata"
          onLoadedData={handleVideoLoad}
        >
          <source src="/Mision/anim.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="flex flex-col gap-4 ml-6 h-[150px] max-w-[550px]">
  {cards.map((card, index) => (
    <div
      key={index}
      ref={(el) => { cardsRef.current[index] = el; }}
      className={`MissionCard${(index % 2) + 1} 
        flex justify-center items-center text-center 
        text-[20px] leading-[100%] w-[550px] min-h-[150px] 
        font-medium p-4 rounded-[20px] backdrop-blur-[20px]`}
      style={{ position: 'relative' }}
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