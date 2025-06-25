import React from 'react';
import logo from '../assets/pic/logo5.png' 
import pre from '../assets/pic/load.svg'
const Preloader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <img className='w-32 md:w-60' src={logo} alt="" />
      <img className='w-24 md:w-32' src={pre} alt="" />
    </div>
  );
};

export default Preloader;
