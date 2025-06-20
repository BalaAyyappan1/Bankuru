"use client";
import React, { useState, useEffect } from 'react';
import { CompanyLogo } from '../ReuseableComponents/Icons';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";

type NavItem = {
  link: string;
  name: string;
  sectionId: string;
};

const menuVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.36, 0.66, 0.04, 1] }
  },
  closed: {
    opacity: 0,
    x: "100%",
    transition: { duration: 0.3, ease: [0.36, 0.66, 0.04, 1] }
  }
};

const itemVariants = {
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.05,
      duration: 0.3,
      ease: "easeOut"
    }
  }),
  closed: (i: number) => ({
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  })
};

const TopNav = () => {
  const [activeSection, setActiveSection] = useState('home-section');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navContents: NavItem[] = [
    {
      link: "#home",
      name: 'Home',
      sectionId: 'home-section'
    },
    {
      link: "#about",
      name: 'About us',
      sectionId: 'about-section'
    },
    {
      link: "#vision",
      name: 'Our Vision',
      sectionId: 'vision-section'
    },
    {
      link: "#journey",
      name: 'Our Journey',
      sectionId: 'journey-section'
    },
    {
      link: "#contact",
      name: 'Contact us',
      sectionId: 'contact-section'
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navContents.map(item => document.getElementById(item.sectionId));
      const scrollPosition = window.scrollY + 100; // Adding offset for navbar height

      for (const section of sections) {
        if (!section) continue;
        
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, 
    sectionId: string
  ) => {
    e.preventDefault();
    setActiveSection(sectionId);
    
    const element = document.getElementById(sectionId);
    
    // Add debugging for contact section
    if (sectionId === 'contact-section') {
      console.log('Contact section clicked');
      console.log('Element found:', element);
      if (element) {
        console.log('Element position:', element.getBoundingClientRect());
        console.log('Page Y Offset:', window.pageYOffset);
        console.log('Element offsetTop:', element.offsetTop);
        console.log('Element offsetHeight:', element.offsetHeight);
      }
    }
    
    if (element) {
      const navbarHeight = 80;
      
      // Use offsetTop instead of getBoundingClientRect for more reliable positioning
      const elementPosition = element.offsetTop;
      
      let offsetPosition;
      
      if (sectionId === 'home-section') {
        offsetPosition = 0;
      } else {
        offsetPosition = elementPosition - navbarHeight;
      }
  
      console.log(`Scrolling to ${sectionId}:`, {
        elementPosition,
        offsetPosition,
        navbarHeight,
        offsetTop: element.offsetTop
      });
  
      // Add a small delay to ensure element is fully rendered
      setTimeout(() => {
        window.scrollTo({
          top: Math.max(0, offsetPosition), // Ensure we don't scroll to negative position
          behavior: 'smooth'
        });
      }, 100);
    } else {
      console.warn(`Section with ID "${sectionId}" not found`);
    }
  };

  return (
    <>
      {/* md:mt-[24px] mt-[20px]  */}
      <header className="fixed w-full z-50  md:px-4 px-2 py-4 lg:px-[72px] gradient-bg">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          {/* Logo */}
          <div className="flex items-start gap-1">
            <Link href="/">
              <Image
                src={CompanyLogo}
                alt="Company Logo"
                width={1000}
                height={1000}
                className="w-[108px] h-[36px]"
                priority
              />
            </Link>

            {/* <span className='font-semibold text-[20px] text-[#FFFDFA] leading-5'>
              Bankuru <br /> Services <br /> Pvt.Ltd.
            </span> */}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex space-x-6">
              {navContents.map((item) => (
                <li key={item.sectionId}>
                  <Link
                    href={item.link}
                    onClick={(e) => handleScrollToSection(e, item.sectionId)}
                    className={`px-1 py-2 text-[16px] tracking-[0.5px] transition-colors leading-[20px]  hover:text-white ${
                      activeSection === item.sectionId
                        ? "text-white font-bold"
                        : "text-[#BEBCBA]"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <motion.button
              onClick={toggleMenu}
              className="text-white p-2 z-50 relative"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 18L18 6M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 12H21M3 6H21M3 18H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#121212] overflow-hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="flex flex-col h-full p-6">
              {/* Header with logo and close button - Commented out as per original */}
              <motion.div
                className="flex justify-between items-center pb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Logo and close button commented out as in original */}
              </motion.div>

              {/* Navigation items */}
              <nav className="flex-1 flex flex-col justify-center">
                <ul className="space-y-4">
                  {navContents.map((item, index) => (
                    <motion.li
                      key={item.sectionId}
                      custom={index}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <Link
                        href={item.link}
                        className={`block py-3 text-center text-2xl font-medium transition-colors duration-200 ${
                          activeSection === item.sectionId
                            ? "text-white font-bold"
                            : "text-gray-600 hover:text-gray-400"
                        }`}
                        onClick={(e) => {
                          handleScrollToSection(e, item.sectionId);
                          toggleMenu();
                        }}
                      >
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-block"
                        >
                          {item.name}
                        </motion.span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopNav;