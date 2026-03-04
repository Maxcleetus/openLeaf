import React from 'react'

const Card = ({ name, image }) => {
  return (
    <div>
      <div className='flex items-center justify-center'>
        <div className='w-full border-2 rounded-lg bg-[#035DCA]/20 hover:bg-gray-300 duration-300 p-1 md:p-2 border-blue-200'>
          <img className='w-full rounded-lg h-44 sm:h-56 md:h-80 object-cover' src={image} alt={name} />
          <p className='text-center bg-amber-50/10 font-bold text-xs sm:text-sm p-2 rounded-b-md line-clamp-2'>{name}</p>
        </div>
      </div>
    </div>
  )
}

export default Card
