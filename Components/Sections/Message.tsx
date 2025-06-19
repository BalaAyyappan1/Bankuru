"use client";
import React, { useRef } from 'react'
import Image from 'next/image';
import { BioAlphaLogo, BuildingImage1, PlaceHolder } from '../ReuseableComponents/Icons';
import { motion, useInView } from "framer-motion";

const Message = () => {
  // Create separate refs for each animated element
  const titleRef = useRef(null);
  const containerRef = useRef(null);
  const ceoTitleRef = useRef(null);

  // Create separate useInView hooks for each element
  const isTitleInView = useInView(titleRef, { once: false, margin: '-100px 0px' });
  const isContainerInView = useInView(containerRef, { once: false, margin: '-100px 0px' });
  const isCeoTitleInView = useInView(ceoTitleRef, { once: false, margin: '-100px 0px' });

  return (
    <div className="relative bg-transparent w-full h-[34vh] px-6 md:px-16">
      <div className="flex flex-col md:-space-y-5 -space-y-2">
        <motion.h1
          ref={titleRef}
          initial={{ opacity: 0, y: -30 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-bold xl:text-[60px] lg:text-[45px] md:text-[35px] text-[30px] text-center gradient-text-alt2 inline-block"
        >
          More coming soon
        </motion.h1>
        <p className="xl:text-[30px] lg:text-[25px] md:text-[20px] text-[18px] text-center gradient-text-alt1 inline-block mt-3">
          built in India, made for the world
        </p>
      </div>
        
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isContainerInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-[#FFFFFF33] md:h-[242px] xl:max-w-6xl lg:max-w-5xl md:max-w-4xl max-w-md mx-auto flex justify-center items-center rounded-[20px] xl:mt-[80px] lg:mt-[80px] md:mt-[70px] mt-[50px]"
      >
        <div className="flex flex-col justify-between space-y-5 md:space-y-0 items-start h-full w-full xl:px-[73px] lg:px-[53px] md:px-[43px] px-[25px] py-8">
          <motion.h1
            ref={ceoTitleRef}
            initial={{ opacity: 0, x: -20 }}
            animate={isCeoTitleInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-bold xl:text-[42px] lg:text-[35px] md:text-[30px] text-[20px] md:text-start text-center w-full text-white"
          >
            A Message from Our CEO
          </motion.h1>
          <div className="flex md:flex-row flex-col space-y-5 justify-between items-center w-full">
            <div className="flex flex-row justify-center space-x-2 items-center">
              <Image src={PlaceHolder} alt='new image' className='md:w-20 md:h-20 w-15 h-15' />
              <div>
                <h1 className='whitespace-nowrap xl:text-[24px] lg:text-[20px] md:text-[18px] text-[18px] text-[#FFFDFA]'>
                  John Deo
                </h1>
                <p className='xl:text-[18px] lg:text-[16px] md:text-[14px] text-[12px] text-[#FFFDFA]'>
                  CEO
                </p>
              </div>
            </div>
            <p className='xl:max-w-2xl lg:max-w-2xl md:max-w-xl max-w-[290px] xl:text-[20px] lg:text-[18px] md:text-[16px] text-[12px] text-[#BEBCBA] xl:leading-6 lg:leading-5 md:leading-5'>
              Hi, I'm John Doe, the founder of Bankuru Services. I started this journey with a vision to build solutions that truly make life better — not just for markets, but for people. If you're someone who believes in this vision too
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Message;