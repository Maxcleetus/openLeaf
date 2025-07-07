import React from 'react'

const Card = ({ name, image }) => {
  return (
    <div >
      <div className=' flex items-center justify-center' >
        <div className='border-2 shadow-2xl shadow-[#035DCA]/30 rounded-lg bg-[#035DCA]/50 hover:bg-gray-500 hover:border-gray-500 duration-300 p-1 md:p-2 border-[#035DCA]'>
          <img className='w-64 rounded-lg h-64 md:h-80' src={image} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Card