// components/BGLinesLayout.tsx
import React, { ReactNode } from 'react';
import Image from 'next/image';
import { BGLine } from '../ReuseableComponents/Icons';


interface BGLinesLayoutProps {
  children: ReactNode;

}

const BGLinesLayout: React.FC<BGLinesLayoutProps> = ({ children}) => {
  return (
    <div className="relative min-h-screen overflow-hidden w-full">
      <div className="absolute inset-0 -z-50 flex flex-col h-full">
        {Array.from({ length: 50 }).map((_, index) => (
          <div key={index} className="relative flex-1 w-full">
            <Image
              src={BGLine}
              alt={`Background ${index + 1}`}
              className="object-cover w-full"
              width={1000}
              height={1000}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default BGLinesLayout;