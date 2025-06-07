// components/BGCircleLayout.tsx
import React, { ReactNode } from 'react';
import Image from 'next/image';
import { Circle1 } from '@/Components/ReuseableComponents/Icons';

interface BGCircleLayoutProps {
  children: ReactNode;
}

const BGCircleLayout: React.FC<BGCircleLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden w-full ">
      <div className="absolute inset-0 -z-50 flex flex-col h-full 2xl:-mt-130 lg:-mt-90 md:-mt-70 sm:-mt-50 -mt-20">
        {Array.from({ length: 15 }).map((_, index) => (
          <div key={index} className="relative flex-1 w-full h-full">
            <Image
              src={Circle1}
              alt={`Background ${index + 1}`}
              width={1000}
              height={1000}

              className={`object-cover xl:w-full lg:w-full md:w-full sm:w-full 
                xl:h-full lg:h-[110%] md:h-[120%] h-full  w-[]
                ${
                  index === 0
                    ? "md:scale-135 scale-200 opacity-100"
                    : index === 1
                    ? "opacity-40 md:scale-135 scale-180"
                    : index === 2
                    ? "opacity-60 md:scale-135 scale-100 "
                    : index === 3
                    ? "opacity-30 md:scale-110 scale-180 "
                    : index === 4
                    ? "opacity-30 scale-125"
                       : index === 5
                    ? "opacity-30 scale-105"
                    : index === 6
                    ? "opacity-30 scale-185"
                    : index === 7
                    ? "opacity-30 scale-185"
                    : index === 8
                    ? "opacity-30 scale-185" 
                     : index === 9
                    ? "opacity-30 scale-185"
                     : index === 10
                    ? "opacity-30 scale-185"
                     : index === 11
                    ? "opacity-30 scale-185"
                     : index === 12
                    ? "opacity-30 scale-185"
                     : index === 13
                    ? "opacity-30 scale-185"
                     : index === 14
                    ? "opacity-30 scale-185"
                    : ""
                }
                `}
              
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

export default BGCircleLayout;