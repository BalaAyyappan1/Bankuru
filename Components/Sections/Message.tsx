import React from 'react'
import Image from 'next/image';
import { BioAlphaLogo, BuildingImage1, PlaceHolder } from '../ReuseableComponents/Icons';


const Message = () => {
  return (
    <div className="relative bg-transparent w-full h-[467px] px-6 md:px-0">
      <div className="flex flex-col md:-space-y-5 -space-y-2">
        <h1 className="font-bold xl:text-[60px] lg:text-[45px] md:text-[35px] text-[30px] text-center gradient-text-alt2 inline-block">
          More coming soon
        </h1>
        <p className="xl:text-[30px] lg:text-[25px] md:text-[20px] text-[18px] text-center gradient-text-alt1 inline-block">
          built in India, made for the world
        </p>
      </div>


      <div className="bg-[#FFFFFF33] md:h-[242px] xl:max-w-6xl lg:max-w-5xl md:max-w-4xl max-w-md mx-auto flex justify-center items-center rounded-[20px] xl:mt-[125px] lg:mt-[90px] md:mt-[70px] mt-[50px]">
        <div className="flex flex-col justify-between space-y-5 md:space-y-0  items-start h-full w-full xl:px-[73px] lg:px-[53px] md:px-[43px] px-[25px] py-8 ">
          <h1 className='font-bold xl:text-[42px] lg:text-[35px] md:text-[30px] text-[20px] md:text-start text-center w-full'>A Message from Our CEO</h1>
          <div className="flex md:flex-row flex-col space-y-5 justify-between items-center w-full">
            <div className="flex flex-row justify-center space-x-2 items-center">
              <Image src={PlaceHolder} alt='new image' className='md:w-20 md:h-20 w-15 h-15' />
              <div>
                <h1 className='whitespace-nowrap xl:text-[24px] lg:text-[20px] md:text-[18px] text-[18px] text-[#FFFDFA]'>
                  John Deo
                </h1>
                <p className='xl:text-[18px] lg:text-[16px] md:text-[14px] text-[12px]  text-[#FFFDFA] '>
                  CEO
                </p>
              </div>
            </div>
            <p className='xl:max-w-2xl lg:max-w-2xl md:max-w-xl max-w-[290px] xl:text-[20px] lg:text-[18px] md:text-[16px] text-[12px] text-[#BEBCBA] xl:leading-6 lg:leading-5 md:leading-5'>
              Hi, I'm John Doe, the founder of Bankuru Services. I started this journey with a vision to build solutions that truly make life better — not just for markets, but for people. If you're someone who believes in this vision too
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message
