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
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="relative flex-1 w-full h-full">
            <Image
              src={Circle1}
              alt={`Background ${index + 1}`}
              className={`object-cover xl:w-full lg:w-full md:w-full sm:w-full  xl:h-full lg:h-[110%] md:h-[120%] sm:h-full  ${
                index === 0
                  ? "scale-135 opacity-100"
                  : index === 1
                  ? " opacity-30 "
                  : "opacity-50 scale-115"
              }`}
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