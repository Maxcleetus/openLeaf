import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext';
const Singlebook = () => {

  const { bookid } = useParams()
  const { details } = useAppContext()
  const [oneBook, setOneBook] = useState([])

  function getOneBook() {
    let book = details.filter(item => item.id == bookid)
    setOneBook(book)
  }

  useEffect(() => {
    getOneBook()
  }, [bookid])

  return (
    <div>
      {
        oneBook.map((item) => (
          <div>
            <div className='flex md:py-10 flex-col md:flex-row gap-6 md:gap-12 '>
              <div className='p-1 flex items-center max-md:justify-center md:bg-[#035DCA]/80 rounded-lg' >
                <div className='max-md:border-2 rounded-lg border-[#035DCA] p-1 max-md:bg-[#035DCA]/80'>
                  <img className='w-[300px] h-[400px] rounded-lg' src={item.image} alt="" />
                </div>
              </div>
              <div className='border-3 bg-white/30 border-[#035DCA]/80 w-full md:flex-1 rounded-lg'>
                <div className='flex flex-col items-center'>
                  <h1 className='text-3xl font-semibold my-2 text-[#1E2939] border-b-2 border-[#035DCA]/60 '>{item.name}</h1>
                  <div className='flex gap-2'>
                    <p className='text-[#1E2939] text-sm bg-[#035DCA]/10 rounded-3xl font-medium px-2 py-1'>Author : {item.auther}</p>
                    <p className='text-[#1E2939] text-sm bg-[#035DCA]/10 rounded-3xl font-medium px-2 py-1'>Category : {item.category}</p>
                  </div>
                  <div className='mt-2 pt-1 px-6 items-center h-70 tracking-wider leading-8 font-medium text-gray-500 overflow-y-scroll scrollbar-hidden'>
                    <p>{item.description}</p>
                  </div>
                </div>
              </div>

            </div>
            <div>
              <button>Download</button>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default Singlebook