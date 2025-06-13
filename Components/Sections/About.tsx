import React from 'react'
import Image from 'next/image';
import BuildingModel from '../Building3d';

const About = () => {
  return (
    <div
      id="about-section"
      className="flex items-center justify-center bg-transparent w-full h-[34vh] "
    >
      <div className="flex lg:flex-row flex-col justify-between items-center mx-auto w-full max-w-7xl px-8">
        {/* contents */}
        <div className="flex flex-col space-y-5 lg:max-w-[50%] lg:justify-start justify-center lg:items-start  items-center">
          <h1 className="text-[#FFFDFA] font-semibold xl:text-[42px] lg:text-[32px] md:text-[28px] text-[24px]">
            About us
          </h1>
          <p className="text-[#BEBCBA] xl:text-[20px] lg:text-[18px] md:text-[16px] ipad10:text-[100px] text-[12px] xl:leading-6 lg:leading-5 md:leading-4 leading-3 lg:text-start text-center">
            Bankuru Services Private Limited is a modern startup studio based in
            Hyderabad, India. We focus on designing scalable, impactful
            solutions across industries — rooted in innovation, simplicity, and
            long-term vision. We're currently building behind the scenes to
            create tools, platforms, and experiences that redefine how people
            live, work, and connect.
          </p>
        </div>

        {/* 3D model */}
        <div className="max-w-[50%] ">
          {/* <BuildingModel modelPath="/About/building 02.glb" /> */}
            <Image
              src="/bo.gif"
              alt="new"
              width={1000}
              height={1000}
              className='object-cover w-full md:h-[500px] h-[230px]'
            />
        </div>
      </div>
    </div>
  );
}

export default About
