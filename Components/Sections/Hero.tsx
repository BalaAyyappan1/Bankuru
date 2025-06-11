"use client";
import React, { useState } from 'react';
import { ScrollDownIcon } from '../ReuseableComponents/Icons';
import Image from 'next/image';
import { motion } from "framer-motion";
import RotatingModel from '../Ball';
import Link from 'next/link';

const Hero = () => {
  const [activeSection, setActiveSection] = useState('building-section');



  return (
    <div id='home-section' className="relative bg-transparent md:h-100dvh h-dvh  w-full">
      {/* Middle Contents */}
      <RotatingModel modelPath="/ballasset.glb" />

      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    w-full flex flex-col justify-center items-center text-center px-4 h-full "
      >
        <h1 className="gradient-text xl:text-[70px] lg:text-[60px] md:text-[50px] sm:text-[30px] text-[20px] font-semibold xl:leading-[80px] lg:leading-[70px] md:leading-[70px]  xl:max-w-5xl lg:max-w-4xl md:max-w-3xl sm:max-w-md">
          We build products that solve real-world problems
        </h1>
        <p className="text-[#BEBCBA] xl:text-[20px] lg:text-[20px] md:text-[18px] sm:text-[16px] text-[15px] mt-1">
          Driven by innovation, powered by purpose — we create products that
          make life better
        </p>
        <Link
          href={"#building-section"}
          onClick={(e) => {
            e.preventDefault();
            setActiveSection('building-section');

            const element = document.getElementById('building-section');
            if (element) {
              const navbarHeight = 80;
              const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
              const offsetPosition = elementPosition - navbarHeight;

              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }
          }}
        >
          <button className="bg-transparent border-1 border-[#FFFFFF2E] w-[150px] h-[42px] rounded-[30px] mt-7 cursor-pointer hover:bg-[#FFFFFF33] text-white">
            See our works
          </button>
        </Link>

      </div>

      {/* Bottom Contents */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-row items-center justify-center gap-4 mb-4">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={ScrollDownIcon}
            alt="Scroll Down Icon"
            className="w-3 h-3"
          />
        </motion.div>
        <span className="text-[16px] text-[#DEDCD9]">Scroll Down</span>
      </div>
    </div>
  );
};

export default Hero;
