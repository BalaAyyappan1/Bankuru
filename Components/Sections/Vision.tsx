"use client";
import React, { useRef } from 'react'
import Image from 'next/image'
import { VisionImage1, VisionImage2 } from '../ReuseableComponents/Icons';
import { motion, useInView } from 'framer-motion';

const Vision = () => {

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  const contents = [
    {
      title: '	Innovation First – We think ahead',
      description: "We constantly push boundaries and explore new technologies to create groundbreaking solutions. Innovation isn't just a buzzword for us—it's our foundation. We invest in research, encourage experimentation, and celebrate creative thinking at every level.",
      image: VisionImage1
    },
    {
      title: '	User-Centric – We solve real problems',
      description: "We design with empathy, putting users at the heart of everything we build. Every product decision begins with understanding user needs. We conduct extensive research, gather feedback, and iterate constantly to ensure our solutions truly serve the people who use them.",
      image: VisionImage2
    },
    {
      title: '	Focus on Purpose - No noise, just purpose',
      description: "Simplicity is the ultimate sophistication. We focus on what truly matters — creating products that are intuitive, efficient, and purposeful.",
      image: VisionImage2
    },
    {
      title: '	Creating Impact - Homegrown Ideas, Global Impact',
      description: "Rooted in India but with a global vision, we create solutions that transcend boundaries. We believe that great ideas can come from anywhere and reach everywhere.",
      image: VisionImage1
    },
  ]



  const getImagePosition = (index: number) => {
    const positions = [
      "2xl:-bottom-25 2xl:-right-20 xl:-bottom-25 xl:-right-20 lg:-bottom-25 lg:-right-20 md:-bottom-25 md:-right-20 bottom-6 -right-15   xl:w-[300px] lg:w-[250px] md:w-[220px] sm:w-[200px] w-[180px]",
      // "2xl:-top-27 2xl:-right-24 xl:-top-26 xl:-right-29 lg:-top-28 lg:-right-23 md:-top-28 md:-right-23 bottom-6 -left-21 xl:left-auto lg:left-auto md:left-auto   xl:w-[300px] lg:w-[250px] md:w-[220px] sm:w-[200px] w-[180px]",
      "2xl:-top-27 2xl:-right-26.5 xl:-top-26 xl:-left-29 lg:-top-28 lg:-right-23 md:-top-28 md:-left-23 bottom-6 -left-24 xl:left-auto lg:left-auto md:left-auto  xl:w-[320px] lg:w-[270px] md:w-[240px] sm:w-[220px] w-[200px]",

      "2xl:-bottom-24 2xl:-left-24 xl:-bottom-24 xl:-left-24 lg:-bottom-24 lg:-left-24 md:-bottom-24 md:-left-24 bottom-10 -right-15  xl:w-[300px] lg:w-[250px] md:w-[220px] sm:w-[200px] w-[180px]",
      "2xl:-top-24 2xl:-left-24 xl:-top-24 xl:-left-24 lg:-top-24 lg:-left-24 md:-top-24 md:-left-24 -top-24 -left-24 xl:w-[320px] lg:w-[270px] md:w-[240px] sm:w-[220px] w-[200px]",
    ];
    return positions[index % positions.length];
  };

  const getTextPosition = (index: number) => {
    const positions = [
      "xl:top-6 xl:left-7 lg:top-6 lg:left-6 md:top-5 md:left-5 bottom-5 left-5  text-start xl:w-[465px] lg:w-[350px] md:w-[250px] sm:w-[450px] w-[310px]",
      "xl:bottom-10 xl:right-10 lg:bottom-7 lg:left-7 md:bottom-2 md:left-6 bottom-2 right-6  xl:text-start lg:text-start md:text-start text-end  xl:w-[465px] lg:w-[350px] md:w-[250px]  sm:w-[450px] w-[310px]",
      "xl:top-10 xl:right-10 lg:top-7 lg:right-7 md:top-5 md:right-5 bottom-5 xl:left-auto lg:left-auto md:left-auto left-5   xl:text-end lg:text-end md:text-end text-start   xl:w-[490px] lg:w-[350px] md:w-[250px]  sm:w-[450px] w-[310px]",
      "xl:bottom-10 xl:right-10 lg:bottom-7 lg:right-7 md:bottom-5 md:right-5 bottom-5 right-5  text-end xl:w-[490px] lg:w-[350px] md:w-[250px] sm:w-[450px] w-[310px]",
    ];
    return positions[index % positions.length];
  };


  return (
    <div id='vision-section' className="relative flex flex-col space-y-15 bg-transparent  w-full">
    
      <motion.h1
      ref={ref}
      initial={{ opacity: 0, y: -50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="font-bold xl:text-[60px] lg:text-[45px] md:text-[35px] text-[30px] text-center  inline-block text-white"
    >
     Our vision
    </motion.h1>

      <div className='grid md:grid-cols-2 grid-cols-1 gap-4 md:px-15 px-5'>
        {contents.map((content, index) => (

          <motion.div
            key={index}
            className="relative flex flex-col items-center justify-center bg-[linear-gradient(220.79deg,_rgba(255,255,255,0.1)_0%,_rgba(45,52,103,0.2)_100%)] rounded-[20px] xl:h-[252px] lg:h-[200px] md:h-[150px] sm:h-[150px] h-[130px]  overflow-hidden group cursor-pointer"
            initial="rest"
            whileHover="hover"
            animate="rest"

            variants={{
              rest: {
                scale: 1,
                y: 0
              },
              hover: {
                scale: 1.02,
                y: -3
              }
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut"
            }}
          >
            <div className={`absolute ${getTextPosition(index)} z-10`}>
              <h2 className="xl:text-[24px] lg:text-[20px] md:text-[15px] sm:text-[12px] text-[12px] text-white font-bold xl:leading-8 lg:leading-6 ">{content.title}</h2>
              <p className="xl:text-[16px] lg:text-[14px] md:text-[12px] sm:text-[10px] text-[12px] text-[#BEBCBA] xl:leading-5 lg:leading-4 md:leading-3.5 sm:leading-3.5 leading-3 mt-1">{content.description}</p>
            </div>

            <motion.div
  className={`absolute ${getImagePosition(index)}`}
  style={{
    animation: index === 1 || index === 2 ? 'rotate 15s linear infinite' : 'none',
    transformOrigin: 'center center',
  }}
  variants={{
    rest: {
      scale: 1,
      y: 0
    },
    hover: {
      scale: 1.1,
      y: -5,

    }
  }}
  transition={{
    duration: 0.4,
    ease: "easeOut",
    type: "spring",
    stiffness: 300,
    damping: 20
  }}
>

            
                <Image src={content.image} alt={content.title} style={{
                  width: '100%',
                  height: 'auto',
                  transformOrigin: 'center center'
                }} />
             

              <style jsx>{`
  @keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

`}</style>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Vision
