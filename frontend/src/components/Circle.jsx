import { Book } from 'lucide-react'
import React from 'react'

const Circle = ({category}) => {
  return (
    <div className='flex  items-center justify-center w-[70px] h-[70px]  md:w-[90px] md:h-[90px] flex-col bg-black/10 rounded-full p-4 md:hover:-translate-y-1 cursor-pointer duration-100'>
        <Book/>
        <p>{category}</p>
    </div>
  )
}

export default Circle