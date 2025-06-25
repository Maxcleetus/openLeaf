import React from 'react';
import heroImg from '../assets/pic/hero222.png'; // Replace with your actual hero image
import { NavLink } from 'react-router-dom';

const Home = () => {
  return (
    <section className="relative bg-blue-600 max-md:pt-5 md:py-16 px-6 md:px-12 lg:px-24 md:mt-5 rounded-2xl md:flex flex-col-reverse md:flex-row items-center justify-between gap-10">
      <div className="text-left max-w-xl space-y-2 md:space-y-6 ">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
            Discover Your Next Great Read
          </h1>
          <p className="text-[#E9E9E9]/80 text-[18px] font-medium tracking-wider">
            Browse, search, and read thousands of books from all genres — curated by readers like you. Whether you love thrillers, classics, or new releases, we've got something for every book lover.
          </p>

          <div className=' items-center hidden md:flex'>
              <ul className="text-left list-disc list-inside marker:text-[#E9E9E9] text-[#E9E9E9]/80 text-lg space-y-1">
                <li>Instant access to 100+ eBooks</li>
                <li>Completely Free</li>
                <li>Downloadable</li>
              </ul>
              <NavLink to='/allbook'>
                <div className="pt-2">
                  <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full shadow transition-all duration-200">
                    Browse Books
                  </button>
                </div>
              </NavLink>
          </div>
          
          <p className="text-lg text-gray-300">
            Start your reading journey today — no sign-up required.
          </p>
      </div>

      <div className="max-w-md ">
        <img src={heroImg} alt="Books" className="w-[850px] block" />
      </div>
    </section>
  );
};

export default  Home;
