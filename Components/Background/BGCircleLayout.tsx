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
      <div className="absolute inset-0 -z-50 flex flex-col h-full -mt-130">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="relative flex-1 w-full h-full">
            <Image
              src={Circle1}
              alt={`Background ${index + 1}`}
             
              className={`object-cover ${
                index === 0 
                  ? 'scale-135 opacity-100' 
                  : index === 1 
                  ? 'scale-100 opacity-50' 
                  : 'scale-100 opacity-50'
              }`}
              priority={index === 0}
            />
          </div>
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default BGCircleLayout;