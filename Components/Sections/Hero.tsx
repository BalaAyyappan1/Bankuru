"use client";
import React from 'react';
import { ScrollDownIcon } from '../ReuseableComponents/Icons';
import Image from 'next/image';
import { motion } from "framer-motion";
import RotatingModel from '../Ball';

const Hero = () => {


  return (
    <div className="relative bg-transparent h-screen w-full">
      {/* Middle Contents */}
      <RotatingModel modelPath="/ballmodel.glb" />
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    w-full flex flex-col justify-center items-center text-center px-4"
      >
        <h1 className="gradient-text text-[70px] font-semibold leading-[80px] max-w-5xl">
          We build products that solve real-world problems
        </h1>
        <p className="text-[#BEBCBA] text-[20px] mt-1">
          Driven by innovation, powered by purpose — we create products that
          make life better
        </p>

        <button className="bg-transparent border-1 border-[#FFFFFF2E] w-[150px] h-[42px] rounded-[30px] mt-7 cursor-pointer hover:bg-[#FFFFFF33]">
          See our works
        </button>
      </div>

      {/* Bottom Contents */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-row items-center justify-center gap-4 mb-4">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image src={ScrollDownIcon} alt="Scroll Down Icon" className='w-3 h-3'/>
        </motion.div>
        <span className="text-[16px] text-[#DEDCD9]">
          Scroll Down
        </span>
      </div>


    </div>
  );
};

export default Hero;
