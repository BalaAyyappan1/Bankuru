import React from 'react';
import { BioAlphaLogo, BuildingImage1, BuildingImage2, QuickCook } from '../ReuseableComponents/Icons';
import Image from "next/image";

const Building = () => {
  return (
    <div id='building-section' className="relative bg-transparent w-full px-4 py-10">
      {/* Header Section */}
      <div className="flex flex-col justify-center items-center space-y-2 text-center px-2">
        <h1 className="xl:text-[42px] lg:text-[32px] md:text-[28px] text-[24px] font-semibold text-[#FFFDFA]">
          What We're Building
        </h1>
        <p className="text-base sm:text-lg md:text-[20px] text-[#BEBCBA]">
          We’re currently developing innovative digital products that combine <br className="hidden sm:inline" />
          real user needs with the power of modern AI
        </p>
      </div>

      {/* Images with Content Overlay */}
      <div className="flex flex-col items-center justify-center space-y-10 max-w-6xl mx-auto mt-10 w-full">

        {/* Image Block 1 */}
        <div className="relative w-full xl:max-w-6xl lg:max-w-5xl md:max-w-4xl rounded-[20px] overflow-hidden">
          <Image
            src={BuildingImage1}
            alt="AI Tools"
            className="w-full md:h-full h-[300px]"
          />
          <div className='absolute inset-0  flex md:flex-row flex-col-reverse mt-10 justify-between items-center text-center md:px-24 py-6 space-y-2'>
            <div className=" flex flex-col justify-center md:items-start items-center text-center px-4 md:py-6 py-3  md:space-y-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl text-start font-semibold text-white">
                Bio Alpha International
              </h2>
              <p className="text-sm sm:text-base md:text-start text-center text-[#BEBCBA] max-w-md">
                An ecosystem around sustainable consulting and environmental impact, blending expertise with technology
              </p>
              <button className="bg-transparent border-1 border-[#FFFFFF2E] w-[120px] h-[40px] rounded-[30px] md:mt-7 mt-3 cursor-pointer hover:bg-[#FFFFFF33] text-white">
                View
              </button>
            </div>

            <Image src={BioAlphaLogo} alt="BioAlphaLogo" className='w-80 ' />
          </div>

        </div>

        {/* Image Block 2 */}
        <div className="relative w-full xl:max-w-6xl lg:max-w-5xl md:max-w-4xl rounded-[20px] overflow-hidden">
          <Image
            src={BuildingImage2}
            alt="AI Tools"
            className="w-full md:h-full h-[320px]"
          />
          <div className='absolute inset-0  flex md:flex-row flex-col md:mt-10 justify-between items-center text-center md:px-24 md:py-6 md:-mt-10 md:space-y-2'>
            <Image src={QuickCook} alt="QuickCook" className='md:w-90 md:h-auto  w-34 h-[600px] ' />

            <div className=" flex flex-col justify-center md:items-end  items-center text-center px-4 md:py-6 md:py-3  pb-10  md:space-y-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl text-end font-semibold text-white ">
                Quick 2 Cook
              </h2>
              <p className="text-sm sm:text-base md:text-end text-center text-[#BEBCBA] max-w-md">
                Launching August 2025, this mobile app helps busy students and professionals simplify
                meal prep with smart recipes, pantry tracking, and easy cooking guides—all in one tap
              </p>
              <button className="bg-transparent border-1 border-[#FFFFFF2E] w-[161px] h-[41px] rounded-[30px] md:mt-7 mt-3 cursor-pointer hover:bg-[#FFFFFF33] text-white">
                Keep me update
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Building;
