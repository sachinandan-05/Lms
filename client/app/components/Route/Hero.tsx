import React from 'react';
import { BiSearch } from 'react-icons/bi';
import Image from 'next/image';
import bannerImg from '../../../public/heroImage/banner-img-1.png';

type Props = {};

const Hero: React.FC<Props> = () => {
  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row items-center justify-center relative p-4 lg:p-8">
      <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end relative">
        <div className="w-48 h-48 sm:w-72 sm:h-72 lg:w-[600px] lg:h-[600px] hero_animation rounded-full flex items-center justify-center">
          <Image
            src={bannerImg}
            alt="Banner"
            className="object-contain w-3/4 h-3/4 lg:w-[85%] lg:h-full z-10"
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center mt-8 lg:mt-0">
        <div className="bounce-once">
          <h2 className="dark:text-white text-[#000000c7] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold px-3 w-full font-Josefin py-2 leading-tight lg:leading-[75px]">
            Improve Your Online Learning Experience Better Instantly
          </h2>
        </div>


        <p className="dark:text-[#edfff4] text-[#000000ac] font-Josefin text-base sm:text-lg md:text-xl lg:text-2xl w-full sm:w-3/4 lg:w-[78%] mt-4">
          We have <span className="text-[#FFD700]">40k+</span> Online courses & <span className="text-[#FFD700]">500k+</span> Online registered students. Find your desired Courses from them.
        </p>
        <div className="w-full flex items-center justify-center mt-6 lg:mt-8 ">

          <input
            type="search"
            placeholder="Search Courses..."
            className="bg-slate-200 border-none dark:bg-[#575757] dark:placeholder-[#ffffffdd] rounded-l-[5px] p-2 py-1 w-2/3 sm:w-3/4 lg:w-2/3  outline-none h-8 lg:h-10   text-black dark:text-white "
          />
          <button className="bg-[#39c1f3] rounded-r-[5px] p-2 h-8 lg:h-10 cursor-pointer  px-4 ">
            <BiSearch className="text-white " />
          </button>


        </div>
      </div>
    </div>
  );
};

export default Hero;
