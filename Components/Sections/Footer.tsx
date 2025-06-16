"use client";
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { CompanyLogo, InstaLogo, LinkLogo, xLogo, YouLogo } from '../ReuseableComponents/Icons';
import Image from 'next/image';
import Link from 'next/link';

interface FormData {
  name: string;
  email: string;
  contact: string;
  website: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  contact?: string;
  website?: string;
  message?: string;
}

const Footer = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    contact: '',
    website: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedField, setFocusedField] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const mobileContents = [
    {
      link: 'google.com', name: 'Licensing'
    },
    {
      link: 'google.com', name: 'Terms & Condiiton'
    },
    {
      link: 'google.com', name: 'Privacy Policy'
    },
    {
      link: 'google.com', name: 'Cookie Ploicy'
    },

  ]

  const contents = [
    {
      image: LinkLogo
    },

    {
      image: InstaLogo
    },
    {
      image: xLogo
    },
    {
      image: YouLogo
    },
  ]


  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.contact.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.contact = 'Please enter a valid contact number';
    }

    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          contact: '',
          website: '',
          message: ''
        });
        setErrors({});
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFocus = (field: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFocusedField(field);
  };

  const handleBlur = (): void => {
    setFocusedField('');
  };

  const handleInputChangeEvent = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    handleInputChange(field, e.target.value);
  };

  const getInputClassName = (field: keyof FormData): string => {
    const baseClass = "border-b bg-transparent outline-none transition-colors pb-2 w-full text-white placeholder-white/40";
    const focusClass = focusedField === field ? 'border-white/30' : 'border-white/16';
    const errorClass = errors[field] ? 'border-red-500/50' : '';

    return `${baseClass} ${errorClass || focusClass} focus:border-white/30`;
  };

  return (
    <div id='contact-section' className="w-full md:bg-[#0C0C0C] bg-transparent">
      <div  className="relative w-full hidden md:block">

        {/* video */}
        <div className="relative w-full h-[200px] overflow-hidden">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="https://res.cloudinary.com/dek8wxl7o/video/upload/v1749279396/elements_tlntt0.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black opacity-10 z-10"></div>

          {/* Centered text */}
          <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-semibold z-20">
            Be part of the journey
          </div>
        </div>


        {/* Footer */}
        <div className='flex flex-col space-y-5 justify-center bg-[#0C0C0C] items-center w-full '>
          <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-[25px] md:h-[545px] h-auto mt-5 px-[23px]">
            {/* Left side */}
            <div className="bg-[#2D34674A] h-full flex flex-col space-y-5 justify-center items-center rounded-[28px]">
              <div className="flex flex-row gap-5 items-center justify-center p-4">
                <Image
                  src={CompanyLogo}
                  alt="Company Logo"
                  className="w-[672px] h-[92px] object-contain"
                />
                {/* <h1 className='font-bold text-[30px] leading-8 text-[#FFFDFA]'>
                  Bankuru Services <br />
                  Pvt. Ltd.
                </h1> */}
              </div>

              <div className='flex flex-col text-center text-[#807F7D]'>
                <span>Email : contact@bankuruservices.com</span>
                <span>Phone No. : 144 - 23940193</span>
                <span>Address : 123 Innovation Drive, Tech City, TC 12345</span>
              </div>


              <div className='pb-5 md:pb-5 text-white'>
                © Designed &  Developed by  <Link href={'https://www.theinternetcompany.one/'} target="_blank" rel="noopener noreferrer" className='hover:underline'>TIC GLOBAL</Link>.
              </div>
            </div>




            {/* Right side */}
            <div className="bg-[#121212] w-full flex flex-col items-center justify-center rounded-[28px] px-6 py-8">
              <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-6" suppressHydrationWarning>
                {/* Name Field */}
                <div className="flex flex-col space-y-2">
                  <label
                    htmlFor="name"
                    className="text-[12px] font-medium text-[#BDBDBD] tracking-[2px] uppercase"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChangeEvent('name')}
                    onFocus={handleFocus('name')}
                    onBlur={handleBlur}
                    className={`w-full ${getInputClassName('name')}`}
                    disabled={isSubmitting}
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    suppressHydrationWarning
                  />
                  {errors.name && (
                    <span id="name-error" className="text-red-400 text-xs mt-1">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email Field */}
                <div className="flex flex-col space-y-2">
                  <label
                    htmlFor="email"
                    className="text-[12px] font-medium text-[#BDBDBD] tracking-[2px] uppercase"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChangeEvent('email')}
                    onFocus={handleFocus('email')}
                    onBlur={handleBlur}
                    className={`w-full ${getInputClassName('email')}`}
                    disabled={isSubmitting}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    suppressHydrationWarning
                  />
                  {errors.email && (
                    <span id="email-error" className="text-red-400 text-xs mt-1">
                      {errors.email}
                    </span>
                  )}
                </div>


                <div className="flex flex-col sm:flex-row items-start justify-between gap-6 sm:gap-6 md:gap-8">
                  <div className="flex flex-col space-y-3 sm:space-y-4 w-full">
                    <label
                      htmlFor="contact"
                      className="text-[12px] font-medium text-[#BDBDBD] tracking-[2px] uppercase"
                    >
                      Contact Number
                    </label>
                    <input
                      id="contact"
                      type="tel"
                      required
                      value={formData.contact}
                      onChange={handleInputChangeEvent('contact')}
                      onFocus={handleFocus('contact')}
                      onBlur={handleBlur}
                      className={getInputClassName('contact')}
                      disabled={isSubmitting}
                      aria-invalid={errors.contact ? 'true' : 'false'}
                      aria-describedby={errors.contact ? 'contact-error' : undefined}
                      suppressHydrationWarning
                    />
                    {errors.contact && (
                      <span id="contact-error" className="text-red-400 text-xs mt-1">
                        {errors.contact}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col space-y-3 sm:space-y-4 w-full">
                    <label
                      htmlFor="website"
                      className="text-[12px] font-medium text-[#BDBDBD] tracking-[2px] uppercase"
                    >
                      Website (Optional)
                    </label>
                    <input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChangeEvent('website')}
                      onFocus={handleFocus('website')}
                      onBlur={handleBlur}
                      className={getInputClassName('website')}
                      disabled={isSubmitting}
                      aria-invalid={errors.website ? 'true' : 'false'}
                      aria-describedby={errors.website ? 'website-error' : undefined}
                      suppressHydrationWarning
                    />
                    {errors.website && (
                      <span id="website-error" className="text-red-400 text-xs mt-1">
                        {errors.website}
                      </span>
                    )}
                  </div>
                </div>

                {/* Message Field */}
                <div className="flex flex-col space-y-3 sm:space-y-4">
                  <label
                    htmlFor="message"
                    className="text-[12px] font-medium text-[#BDBDBD] tracking-[2px] uppercase"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={handleInputChangeEvent('message')}
                    onFocus={handleFocus('message')}
                    onBlur={handleBlur}
                    className={getInputClassName('message')}
                    rows={3}
                    disabled={isSubmitting}
                    aria-invalid={errors.message ? 'true' : 'false'}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    suppressHydrationWarning
                  />
                  {errors.message && (
                    <span id="message-error" className="text-red-400 text-xs mt-1">
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className='bg-transparent border-1 border-[#FFFFFF2E] w-full px-4 py-3 rounded-[30px] mt-7 cursor-pointer hover:bg-[#FFFFFF33] text-white'
                  suppressHydrationWarning
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </form>
            </div>

          </div>


          <div className="grid grid-cols-2 w-full h-[80px] rounded-[28px] md:grid-cols-4 gap-4 px-[48.5px] mb-5">
            {contents.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-center bg-[#121212] rounded-lg  transition-colors duration-200"
              >
                <Image
                  src={item.image}
                  alt={`Social icon ${index}`}
                  className="h-8 w-8 object-contain"
                />
              </div>
            ))}
          </div>



        </div>
      </div>


      {/* mobile */}
      <div  className="relative w-full block md:hidden px-5 -mt-50 ">
        <div className=" h-full flex flex-col space-y-10 justify-center items-start rounded-[28px] px-5 bg-[#2D34674A]">
          <div className="flex flex-row gap-2 items-start justify-center  mt-8 ">

            <h1 className='font-bold text-[30px] leading-8 text-white'>
              Be Part of the Journey
            </h1>
          </div>

          <div className='flex flex-col text-start text-[#807F7D]'>
            <span>Email : contact@bankuruservices.com</span>
            <span>Phone No. : 144 - 23940193</span>
            <span>Address : 123 Innovation Drive, Tech City, TC 12345</span>
          </div>


          <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-6 bg-transparent" suppressHydrationWarning>
            {/* Name Field */}
            <div className="flex flex-col space-y-2 ">
              <label
                htmlFor="name-mobile"
                className="text-[12px] font-medium text-[#BDBDBD] tracking-[2px] uppercase"
              >
                Name
              </label>
              <input
                id="name-mobile"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChangeEvent('name')}
                onFocus={handleFocus('name')}
                onBlur={handleBlur}
                className={`w-full ${getInputClassName('name')}`}
                disabled={isSubmitting}
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'name-error-mobile' : undefined}
                suppressHydrationWarning
              />
              {errors.name && (
                <span id="name-error-mobile" className="text-red-400 text-xs mt-1">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="email-mobile"
                className="text-[12px] font-medium text-[#BDBDBD] tracking-[2px] uppercase"
              >
                Email
              </label>
              <input
                id="email-mobile"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChangeEvent('email')}
                onFocus={handleFocus('email')}
                onBlur={handleBlur}
                className={`w-full ${getInputClassName('email')}`}
                disabled={isSubmitting}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error-mobile' : undefined}
                suppressHydrationWarning
              />
              {errors.email && (
                <span id="email-error-mobile" className="text-red-400 text-xs mt-1">
                  {errors.email}
                </span>
              )}
            </div>


            <div className="flex flex-col sm:flex-row items-start justify-between gap-6 sm:gap-6 md:gap-8">
              <div className="flex flex-col space-y-3 sm:space-y-4 w-full">
                <label
                  htmlFor="contact-mobile"
                  className="text-[12px] font-medium text-[#BDBDBD] tracking-[2px] uppercase"
                >
                  Contact Number
                </label>
                <input
                  id="contact-mobile"
                  type="tel"
                  required
                  value={formData.contact}
                  onChange={handleInputChangeEvent('contact')}
                  onFocus={handleFocus('contact')}
                  onBlur={handleBlur}
                  className={getInputClassName('contact')}
                  disabled={isSubmitting}
                  aria-invalid={errors.contact ? 'true' : 'false'}
                  aria-describedby={errors.contact ? 'contact-error-mobile' : undefined}
                  suppressHydrationWarning
                />
                {errors.contact && (
                  <span id="contact-error-mobile" className="text-red-400 text-xs mt-1">
                    {errors.contact}
                  </span>
                )}
              </div>

              <div className="flex flex-col space-y-3 sm:space-y-4 w-full">
                <label
                  htmlFor="website-mobile"
                  className="text-[12px] font-medium text-[#BDBDBD] tracking-[2px] uppercase"
                >
                  Website (Optional)
                </label>
                <input
                  id="website-mobile"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChangeEvent('website')}
                  onFocus={handleFocus('website')}
                  onBlur={handleBlur}
                  className={getInputClassName('website')}
                  disabled={isSubmitting}
                  aria-invalid={errors.website ? 'true' : 'false'}
                  aria-describedby={errors.website ? 'website-error-mobile' : undefined}
                  suppressHydrationWarning
                />
                {errors.website && (
                  <span id="website-error-mobile" className="text-red-400 text-xs mt-1">
                    {errors.website}
                  </span>
                )}
              </div>
            </div>

            {/* Message Field */}
            <div className="flex flex-col space-y-3 sm:space-y-4">
              <label
                htmlFor="message-mobile"
                className="text-[12px] font-medium text-[#BDBDBD] tracking-[2px] uppercase"
              >
                Message
              </label>
              <textarea
                id="message-mobile"
                required
                value={formData.message}
                onChange={handleInputChangeEvent('message')}
                onFocus={handleFocus('message')}
                onBlur={handleBlur}
                className={getInputClassName('message')}
                rows={3}
                disabled={isSubmitting}
                aria-invalid={errors.message ? 'true' : 'false'}
                aria-describedby={errors.message ? 'message-error-mobile' : undefined}
                suppressHydrationWarning
              />
              {errors.message && (
                <span id="message-error-mobile" className="text-red-400 text-xs mt-1">
                  {errors.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className='bg-transparent border-1 border-[#FFFFFF2E] max-w-md mx-auto px-8 py-3 rounded-[30px] mt-7 cursor-pointer hover:bg-[#FFFFFF33] text-white'
              suppressHydrationWarning
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>


          <div className='flex flex-col items-center justify-center w-[237px] mx-auto space-y-5 bg-transparent'>
            <div className='flex flex-wrap items-center justify-center gap-4 text-center'>
              {mobileContents.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="text-sm text-[#807F7D] text-[10px] cursor-pointer  hover:underline whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </div>




            <p className='pb-5 md:pb-5 text-[12px] text-white'>
              © Designed &  Developed by  <Link href={'https://www.theinternetcompany.one/'} target="_blank" rel="noopener noreferrer" className='hover:underline'>TIC GLOBAL</Link>.
            </p>
          </div>


        </div>

      </div>
    </div>

  );
};

export default Footer;