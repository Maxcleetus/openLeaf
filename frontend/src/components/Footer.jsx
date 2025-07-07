import React from 'react'
import logo from '../assets/pic/logo5.png'
const Footer = () => {
  return (
    <div>
      <div className='pt-10 pb-2 md:grid md:grid-cols-[2fr_1fr_1fr] gap-12'>
        <div>
          <img className='w-32 md:w-40' src={logo} alt="" />
          <p className='max-w-[600px] text-sm text-[#1E3929] py-2 tracking-wide'>Read Me is an online bookstore dedicated to bringing you the best books at your fingertips. From timeless classics to the latest bestsellers, we make reading easy, affordable, and enjoyable.</p>
        </div>
        <div>
          <p className='md:text-2xl text-gray-800/90 text-lg font-bold'>COMPANY</p>
          <ul className='text-[#1E3929] text-sm space-y-2 md:py-4'>
            <li>Home</li>
            <li>About Us</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div>
          <p className='md:text-2xl text-lg text-gray-800/90 font-bold py-2 md:py-0'>GET IN TOUCH</p>
          <ul className='text-[#1E3929] text-sm space-y-2 pb-3 md:py-4'>
            <li>+91-000-000-000</li>
            <li><a href="mailto:maxcleetus@gmail.com">maxcleetus@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <hr className=' text-gray-400 h-[8px]' />
      <div class="text-center text-gray-500 text-sm pt-3 pb-4">
        &copy; 2025 ReadMe. All rights reserved.
      </div>
    </div>


  )
}

export default Footer