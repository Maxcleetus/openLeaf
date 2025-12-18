import React from 'react'

const Card = ({ name, image }) => {
  return (
    <div >
      <div className=' flex items-center justify-center' >
        <div className='border-2 rounded-lg bg-[#035DCA]/20 hover:bg-gray-300  duration-300 p-1 md:p-2 border-blue-200'>
          <img className='w-64 rounded-lg h-64 md:h-80' src={image} alt="" />
          <p className='text-center bg-amber-50/10 font-bold max-md:text-sm p-2 rounded-b-md'>{name}</p>
        </div>
      </div>
    </div>
  )
}

export default Card