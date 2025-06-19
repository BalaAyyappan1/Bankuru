"use client";
import React, { useRef } from 'react';
import { BioAlphaLogo, BuildingImage1, BuildingImage2, QuickCook } from '../ReuseableComponents/Icons';
import Image from "next/image";
import { motion, useInView, stagger } from 'framer-motion';

const Building = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const block1Ref = useRef(null);
  const block2Ref = useRef(null);
  
  const isContainerInView = useInView(containerRef, { once: false, margin: '-100px 0px' });
  const isTitleInView = useInView(titleRef, { once: false, margin: '-100px 0px' });
  const isBlock1InView = useInView(block1Ref, { once: false, margin: '-100px 0px' });
  const isBlock2InView = useInView(block2Ref, { once: false, margin: '-100px 0px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <div id='building-section' className="relative bg-transparent w-full px-4 py-10">
      {/* Header Section */}
      <motion.div
        ref={containerRef}
        initial="hidden"
        animate={isContainerInView ? "show" : "hidden"}
        variants={containerVariants}
        className="flex flex-col justify-center items-center space-y-2 text-center px-2"
      >
        <motion.h1
          ref={titleRef}
          variants={itemVariants}
          className="font-bold xl:text-[60px] lg:text-[45px] md:text-[35px] text-[30px] text-center text-white inline-block gradient-text-alt3"
        >
          What We're Building
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-base sm:text-lg md:text-[20px] text-[#BEBCBA]"
        >
          We're currently developing innovative digital products that combine <br className="hidden sm:inline" />
          real user needs with the power of modern AI
        </motion.p>
      </motion.div>

      {/* Images with Content Overlay */}
      <div className="flex flex-col items-center justify-center space-y-10 max-w-6xl mx-auto mt-10 w-full">
        {/* Image Block 1 */}
        <motion.div
          ref={block1Ref}
          initial="hidden"
          animate={isBlock1InView ? "visible" : "hidden"}
          variants={slideInLeft}
          className="relative w-full xl:max-w-6xl lg:max-w-5xl md:max-w-4xl rounded-[20px] overflow-hidden"
        >
          <Image
            src={BuildingImage1}
            alt="AI Tools"
            className="w-full md:h-full h-[300px] object-cover"
          />
          <div className='absolute inset-0 flex md:flex-row flex-col-reverse mt-10 justify-between items-center text-center md:px-24 py-6 space-y-2'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isBlock1InView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col justify-center md:items-start items-center text-center px-4 md:py-6 py-3 md:space-y-2"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl text-start font-semibold text-white">
                Bio Alpha International
              </h2>
              <p className="text-sm sm:text-base md:text-start text-center text-[#BEBCBA] max-w-md">
                An ecosystem around sustainable consulting and environmental impact, blending expertise with technology
              </p>
              <motion.button
  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
  whileTap={{ scale: 0.95 }}
  className="bg-transparent border-1 border-[#FFFFFF2E] w-[120px] h-[40px] rounded-[30px] md:mt-7 mt-3 cursor-pointer text-white"
  onClick={() => window.open("https://www.thebioalpha.com/", "_blank", "noopener,noreferrer")}
>
  View
</motion.button>


            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isBlock1InView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Image src={BioAlphaLogo} alt="BioAlphaLogo" className='w-80' />
            </motion.div>
          </div>
        </motion.div>

        {/* Image Block 2 */}
        <motion.div
          ref={block2Ref}
          initial="hidden"
          animate={isBlock2InView ? "visible" : "hidden"}
          variants={slideInRight}
          className="relative w-full xl:max-w-6xl lg:max-w-5xl md:max-w-4xl rounded-[20px] overflow-hidden"
        >
          <Image
            src={BuildingImage2}
            alt="AI Tools"
            className="w-full md:h-full h-[320px] object-cover"
          />
          <div className='absolute inset-0 flex md:flex-row flex-col md:mt-10 justify-between items-center text-center md:px-24 md:py-6 md:-mt-10 md:space-y-2'>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isBlock2InView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Image src={QuickCook} alt="QuickCook" className='md:w-90 md:h-auto w-34 h-[150px]' />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isBlock2InView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col justify-center md:items-end items-center text-center px-4 md:py-6 md:py-3 pb-10 md:space-y-2"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl text-end font-semibold text-white">
                Quick 2 Cook
              </h2>
              <p className="text-sm sm:text-base md:text-end text-center text-[#BEBCBA] max-w-md">
                Launching August 2025, this mobile app helps busy students and professionals simplify
                meal prep with smart recipes, pantry tracking, and easy cooking guides—all in one tap
              </p>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-1 border-[#FFFFFF2E] w-[161px] h-[41px] rounded-[30px] md:mt-7 mt-3 cursor-pointer text-white"
                onClick={() => window.open("https://quick2cook-launch-page.lovable.app/", "_blank", "noopener,noreferrer")}
              >
                Keep me updated
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Building;