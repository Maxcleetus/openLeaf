import React, { useState } from 'react'
import logo from '../assets/pic/logo5.png'
import { NavLink } from 'react-router-dom'
import { Menu, XIcon } from 'lucide-react'
const Navbar = () => {


  const [isOpen,setIsOpen] = useState(false)


  return (
    <div>
      <div className='flex flex-col md:flex-row justify-between md:items-center gap-4 py-4'>
        <div className='flex items-center justify-between md:block'>
          <img className='w-24 sm:w-32 md:w-40' src={logo} alt="" />
          {isOpen? <XIcon className='md:hidden text-[#035DCA] z-10' onClick={()=>setIsOpen(false)}/> : <Menu onClick={()=>setIsOpen(true)} className='md:hidden text-[#035DCA]'/> }
        </div>
        <div
        className={`md:hidden absolute inset-0 bg-[#E9E9E9] flex items-center justify-center transition-all duration-300 ease-out overflow-hidden ${
          isOpen ? 'min-h-full opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <img className='w-24 sm:w-32 md:w-40 absolute top-4 left-4' src={logo} alt="" />
        <ul className='mt-2 flex flex-col text-center text-lg'>
          <NavLink onClick={()=>setIsOpen(false)} to='/'className={({isActive})=>`py-2 ${isActive?'bg-[#035DCA]/50 rounded-lg' : ''}`}>
            HOME
          </NavLink>
          <NavLink onClick={()=>setIsOpen(false)} to='/allbook' className={({isActive})=>`py-2 px-2 ${isActive?'bg-[#035DCA]/50 rounded-lg' : 'border-0'}`}> 
            ALL-BOOKS
          </NavLink>
          <NavLink onClick={()=>setIsOpen(false)} to='/contact' className={({isActive})=>`py-2 ${isActive?'bg-[#035DCA]/50 rounded-lg' : 'border-0'}`}> 
            CONTACT
          </NavLink>
        </ul>
      </div>
        <div className='md:flex gap-6 text-lg font-medium hidden'>
          <NavLink to='/' className={({isActive})=>` ${isActive?'border-b-2 border-b-[#035DCA]/50' : 'border-0'}`}>
            HOME
          </NavLink>
          <NavLink to='/allbook' className={({isActive})=>`${isActive?'border-b-2 border-b-[#035DCA]/50' : 'border-0'}`}> 
            ALL-BOOKS
          </NavLink>
          <NavLink to='/contact' className={({isActive})=>`${isActive?'border-b-2 border-b-[#035DCA]/50' : 'border-0'}`}> 
            CONTACT
          </NavLink>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search books..."
            className=" px-3 py-1 md:px-4 md:py-2 w-full rounded-full border border-gray-400 focus:outline-none focus:ring-2 focus:text-[#035DCA]"
          />
        </div>
      </div>
      <hr className= 'hidden md:block text-[#035DCA] h-[8px]' />
    </div>

  )
}

export default Navbar