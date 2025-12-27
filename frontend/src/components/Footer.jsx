import React from 'react'
import logo from '../assets/pic/logo5.png'

const Footer = () => {
  return (
    <div>
      <div className='pt-10 pb-2 md:grid md:grid-cols-[2fr_1fr_1fr] gap-12'>
        <div>
          <img className='w-32 md:w-40' src={logo} alt="Read Me Logo" />
          <p className='max-w-[600px] text-sm text-[#1E3929] py-2 tracking-wide leading-5'>
            Read Me is an online note store dedicated to bringing you high-quality notes at your fingertips. 
            We believe in making learning accessible for everyone. Your contributions make this website 
            a powerful and helpful resource for students.
          </p>
        </div>

        <div>
          <p className='md:text-2xl text-gray-800/90 text-lg font-bold'>COMPANY</p>
          <ul className='text-[#1E3929] text-sm space-y-2 md:py-4'>
            <li className='cursor-pointer hover:text-black transition-all'>Home</li>
            <li className='cursor-pointer hover:text-black transition-all'>About Us</li>
            <li className='cursor-pointer hover:text-black transition-all'>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className='md:text-2xl text-lg text-gray-800/90 font-bold py-2 md:py-0'>GET IN TOUCH</p>
          <ul className='text-[#1E3929] text-sm space-y-2 pb-3 md:py-4'>
            <li>+91-000-000-000</li>
            <li>
                <a href="mailto:maxcleetus@gmail.com" className='hover:text-black transition-all'>
                    maxcleetus@gmail.com
                </a>
            </li>
            
            {/* LinkedIn Section with Icon */}
            <li>
              <a 
                href="https://www.linkedin.com/in/max-cleetus/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className=' flex items-center gap-2 group'
              >
                {/* LinkedIn SVG Icon */}
                <svg 
                  className="w-4 h-4 fill-[#1E3929] " 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 448 512"
                >
                  <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <hr className='text-gray-400 h-[1px]' />
      
      <div className="text-center text-gray-500 text-sm pt-3 pb-4">
        &copy; 2025 ReadMe. All rights reserved.
      </div>
    </div>
  )
}

export default Footer