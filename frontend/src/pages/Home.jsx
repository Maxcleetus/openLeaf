import React from 'react';
import heroImg from '../assets/pic/hero222.png'; // Replace with your actual hero image
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Circle from '../components/Circle';
import Card from '../components/Card';

const Home = () => {
  const { details } = useAppContext();
  const limit = 8;
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-blue-600 max-md:pt-5 px-6 md:px-12 lg:px-24 md:mt-5 rounded-2xl md:flex flex-col-reverse md:flex-row items-center justify-between gap-5">
        <div className="text-left max-w-xl space-y-2 md:space-y-6 ">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
            Discover Your Next Great Notes
          </h1>

          <div className="block md:flex items-end">
            <ul className="text-left list-disc list-inside marker:text-[#E9E9E9] text-[#E9E9E9] text-[16px] md:text-lg space-y-2 max-md:py-2  md:space-y-1">
              <li>Instant access to Notes</li>
              <li>Contribute</li>
              <li>Downloadable</li>
            </ul>
            <NavLink to="/allbook" className="hidden md:block">
              <div className="pt-2 ">
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-full shadow transition-all duration-200">
                  Browse Notes
                </button>
              </div>
            </NavLink>
          </div>

          <p className="text-[16px] md:text-lg text-[#E9E9E9]">
            Start your reading journey today — no sign-up required.
          </p>

          <NavLink to="/allbook" className="flex md:hidden ">
            <div className="pt-2 ">
              <button className="bg-gray-700 hover:bg-gray-600 text-white text-[16px] px-3 py-1 md:px-6 md:py-2 rounded-full shadow transition-all duration-200">
                Browse Notes
              </button>
            </div>
          </NavLink>
        </div>

        <div>
          <img src={heroImg} alt="Books" className="block" />
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="flex flex-col items-center justify-center">
          <h1 className="md:text-3xl text-lg pt-3 md:pt-6 pb-2 text-center font-bold text-gray-800 leading-tight">
            Find By Category
          </h1>
          <p className="md:text-[16px] text-gray-600 text-sm text-center max-w-[700px]">
            A concise reference list of all categories—perfect for quickly locating or jumping to specific content areas.
          </p>
        </div>
        <div>
          <div className="flex scrollbar-hidden items-center justify-start md:justify-center overflow-x-scroll gap-6 py-4 md:py-6 md:mb-5">
            <div onClick={() => navigate(`/allbook/cse`)}>
              <Circle category="cse" />
            </div>
            <div onClick={() => navigate(`/allbook/eee`)}>
              <Circle category="eee" />
            </div>
            <div onClick={() => navigate(`/allbook/ec`)}>
              <Circle category="ec" />
            </div>
            <div onClick={() => navigate(`/allbook/robo`)}>
              <Circle category="robo" />
            </div>
            <div onClick={() => navigate(`/allbook/civil`)}>
              <Circle category="civil" />
            </div>
            <div onClick={() => navigate(`/allbook/mech`)}>
              <Circle category="mech" />
            </div>
            <div onClick={() => navigate(`/allbook/other`)}>
              <Circle category="other" />
            </div>
          </div>
        </div>
      </section>

      {/* Prime Reads Section */}
      <section>
        <div className="flex flex-col items-center justify-center">
          <h1 className="md:text-3xl text-lg pt-3 md:pt-6 pb-2 text-center font-bold text-gray-800 leading-tight">
            Prime Reads
          </h1>
          <p className="md:text-[16px] text-gray-600 text-sm text-center max-w-[700px]">
            Simply browse through our extensive list of trusted Notes.
          </p>
        </div>
        <div className="grid gap-4 py-4 md:py-12 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {details ? details.map((item, index) => {
            for (let i = 0; i < limit; i++) {
              if (index < limit) {
                return (
                  <div
                    key={item._id}
                    onClick={() => (
                      window.scrollTo(0, 0),
                      navigate(`/singlebook/${item._id}`)
                    )}
                  >
                    <Card name={item.name} image={item.image} />
                  </div>
                );
              }
            }
          }) : <div className='bold text-lg font-semibold '>Notes not found</div>}
        </div>
        <div className="flex items-center justify-center">
          <NavLink onClick={() => window.scrollTo(0, 0)} to="/allbook">
            <button className="px-5 py-2 md:py-3 md:px-7 bg-[#035DCA]/50 text-white font-semibold rounded-2xl">
              More
            </button>
          </NavLink>
        </div>
      </section>

      {/* 🚀 Enhanced Contribute Section */}
      <section className="mt-10 md:mt-16 py-10 px-6 md:px-12 lg:px-24 text-center">
        {/* Main Heading */}
        <h1 className="md:text-3xl text-lg font-bold text-gray-800 leading-tight">
          Contribute to Our Library
        </h1>

        {/* Description */}
        <p className="md:text-[16px] text-gray-600 text-sm mt-3 max-w-[700px] mx-auto">
          Have a book, notes, or resources to share? Contribute and help others in their reading journey.
          Your contribution makes knowledge accessible for everyone.
        </p>

        {/* Process Steps with Icons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center bg-white">
              <svg className="w-6 h-6 text-[#035DCA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-gray-700 font-medium">Upload Resources</span>
          </div>

          <div className="hidden sm:block text-gray-400 text-xl">→</div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center bg-white">
              <svg className="w-6 h-6 text-[#035DCA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-gray-700 font-medium">Help Students</span>
          </div>

          <div className="hidden sm:block text-gray-400 text-xl">→</div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center bg-white">
              <svg className="w-6 h-6 text-[#035DCA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-700 font-medium">Make Impact</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-8">
          <NavLink
            onClick={() => window.scrollTo(0, 0)}
            to="/contact"
            className="inline-flex items-center gap-3 px-5 py-2 md:py-3 md:px-7 bg-blue-600/60 text-white font-semibold rounded-2xl hover:bg-[#035DCA]/80 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Contribute Now
          </NavLink>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-gray-500 text-sm">
          <p>PDFs, lecture notes, assignments - all formats welcome</p>
        </div>
      </section>

      {/* 🎯 Discussion & Doubts Section */}
      <section className="mt-5 md:mt-8 py-10 px-6 md:px-12 lg:px-24  rounded-3xl">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="md:text-3xl text-xl font-bold text-gray-800 leading-tight">
            Got Questions? Join the Discussion
          </h1>

          {/* Description */}
          <p className="md:text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Stuck on a topic? Connect with peers and experts in our vibrant discussion forum.
            Ask doubts, share insights, and get answers from the community.
          </p>

          {/* Features Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Ask Doubts</h3>
              <p className="text-gray-600 text-sm">
                Get clarity on confusing topics from subject experts
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Live Discussions</h3>
              <p className="text-gray-600 text-sm">
                Participate in real-time conversations with peers
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Resource Sharing</h3>
              <p className="text-gray-600 text-sm">
                Share additional notes, tips, and study materials
              </p>
            </div>
          </div>

          

          {/* CTA Button */}
          <div className="mt-10">
            <NavLink
              onClick={() => window.scrollTo(0, 0)}
              to="/discuss"
              className="inline-flex items-center gap-3 px-8 py-3 md:py-4 md:px-10 bg-[#035DCA]/50 text-white font-semibold rounded-2xl  transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              Join Discussion Forum
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </NavLink>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-gray-500 text-sm">
            <p>Connect • Discuss • Learn Together</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
