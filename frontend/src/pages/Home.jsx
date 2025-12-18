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
            Discover Your Next Great Read
          </h1>

          <div className="block md:flex items-end">
            <ul className="text-left list-disc list-inside marker:text-[#E9E9E9] text-[#E9E9E9] text-[16px] md:text-lg space-y-2 max-md:py-2  md:space-y-1">
              <li>Instant access to 100+ eBooks</li>
              <li>Completely Free</li>
              <li>Downloadable</li>
            </ul>
            <NavLink to="/allbook" className="hidden md:block">
              <div className="pt-2 ">
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-full shadow transition-all duration-200">
                  Browse Books
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
                Browse Books
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
            Simply browse through our extensive list of trusted books.
          </p>
        </div>
        <div className="grid gap-4 py-4 md:py-12 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {details.map((item, index) => {
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
          })}
        </div>
        <div className="flex items-center justify-center">
          <NavLink onClick={() => window.scrollTo(0, 0)} to="/allbook">
            <button  className="px-5 py-2 md:py-3 md:px-7 bg-[#035DCA]/50 text-white font-semibold rounded-2xl">
              More
            </button>
          </NavLink>
        </div>
      </section>

      {/* 🚀 Contribute Section */}
      <section className="mt-10 md:mt-16 py-10 px-6 md:px-12 lg:px-24 rounded-2xl text-center">
        <h1 className="md:text-3xl text-lg font-bold text-gray-800 leading-tight">
          Contribute to Our Library
        </h1>
        <p className="md:text-[16px] text-gray-600 text-sm mt-3 max-w-[700px] mx-auto">
          Have a book, notes, or resources to share? Contribute and help others in their reading journey.  
          Your contribution makes knowledge accessible for everyone 
        </p>
        <div className="mt-6">
          <NavLink onClick={() => window.scrollTo(0, 0)} to="/contact">
            <button  className="px-5 py-2 md:py-3 md:px-7 bg-[#035DCA]/50 text-white font-semibold rounded-2xl">
              Contribute Now
            </button>
          </NavLink>
        </div>
      </section>
    </div>
  );
};

export default Home;
