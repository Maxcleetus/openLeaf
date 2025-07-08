import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FilterIcon } from 'lucide-react';
const Allbooks = () => {
  const { cat } = useParams()
  const { details } = useAppContext()
  const navigate = useNavigate()
  const [filter, setFilter] = useState([])
  const [filBtn, setFilBtn] = useState(false)
  console.log(filBtn)

  function filterBooks() {
    if (cat) {
      setFilter(details.filter(book => book.category === cat))
    } else {
      setFilter(details)
    }
  }

  useEffect(() => {
    filterBooks()
  }, [cat, details])


  return (
    <div>
      <div>
        <h1 className='text-gray-500 py-2'>Browse books by category.</h1>
        <div className='md:flex'>
          <div className='md:hidden flex  mb-3 items-center gap-1'>
            <div onClick={() => setFilBtn(!filBtn)} className={`flex items-center gap-1 ${filBtn ? 'bg-gray-400' : 'bg-[#035DCA]/50'}  text-white px-2 py-1 rounded`}>
              <FilterIcon size="12px" />
              <p className='text-sm'>Filter</p>
            </div>
          </div>
          <div className='space-y-2 hidden md:block'>
            <p onClick={() => cat === 'story' ? navigate(`/allbook`) : navigate(`/allbook/story`)} className={` rounded-lg border-2 border-[#D1D5DB] text-gray-500 font-medium min-w-full md:min-w-[250px] px-2 py-1 ${cat == 'story' ? 'bg-gray-300' : 'bg-white'} `}>Story</p>
            <p onClick={() => cat === 'code' ? navigate(`/allbook`) : navigate(`/allbook/code`)} className={` rounded-lg border-2 border-[#D1D5DB] text-gray-500 font-medium min-w-full md:min-w-[250px] px-2 py-1 ${cat == 'code' ? 'bg-gray-300' : 'bg-white'} `}>Code</p>
            <p onClick={() => cat === 'notes' ? navigate(`/allbook`) : navigate(`/allbook/notes`)} className={` rounded-lg border-2 border-[#D1D5DB] text-gray-500 font-medium min-w-full md:min-w-[250px] px-2 py-1 ${cat == 'notes' ? 'bg-gray-300' : 'bg-white'} `}>Notes</p>
            <p onClick={() => cat === 'selfdev' ? navigate(`/allbook`) : navigate(`/allbook/selfdev`)} className={` rounded-lg border-2 border-[#D1D5DB] text-gray-500 font-medium min-w-full md:min-w-[250px] px-2 py-1 ${cat == 'selfdev' ? 'bg-gray-300' : 'bg-white'} `}>Selfdev</p>
            <p onClick={() => cat === 'novel' ? navigate(`/allbook`) : navigate(`/allbook/novel`)} className={` rounded-lg border-2 border-[#D1D5DB] text-gray-500 font-medium min-w-full md:min-w-[250px] px-2 py-1 ${cat == 'novel' ? 'bg-gray-300' : 'bg-white'} `}>Novel</p>
          </div>
          {
            filBtn ? <div className='space-y-2'>
              <p onClick={() => cat === 'story' ? navigate(`/allbook`) : navigate(`/allbook/story`)} className={` rounded-lg border-2 border-[#D1D5DB] text-gray-500 font-medium min-w-full md:min-w-[250px] px-2 py-1 ${cat == 'story' ? 'bg-gray-300' : 'bg-white'} `}>Story</p>
              <p onClick={() => cat === 'code' ? navigate(`/allbook`) : navigate(`/allbook/code`)} className={` rounded-lg border-2 border-[#D1D5DB] text-gray-500 font-medium min-w-full md:min-w-[250px] px-2 py-1 ${cat == 'code' ? 'bg-gray-300' : 'bg-white'} `}>Code</p>
              <p onClick={() => cat === 'notes' ? navigate(`/allbook`) : navigate(`/allbook/notes`)} className={` rounded-lg border-2 border-[#D1D5DB] text-gray-500 font-medium min-w-full md:min-w-[250px] px-2 py-1 ${cat == 'notes' ? 'bg-gray-300' : 'bg-white'} `}>Notes</p>
              <p onClick={() => cat === 'selfdev' ? navigate(`/allbook`) : navigate(`/allbook/selfdev`)} className={` rounded-lg border-2 border-[#D1D5DB] text-gray-500 font-medium min-w-full md:min-w-[250px] px-2 py-1 ${cat == 'selfdev' ? 'bg-gray-300' : 'bg-white'} `}>Selfdev</p>
              <p onClick={() => cat === 'novel' ? navigate(`/allbook`) : navigate(`/allbook/novel`)} className={` rounded-lg border-2 border-[#D1D5DB] text-gray-500 font-medium min-w-full md:min-w-[250px] px-2 py-1 ${cat == 'novel' ? 'bg-gray-300' : 'bg-white'} `}>Novel</p>
            </div> : null
          }
          <div>
            <div className={`grid gap-4 ${filBtn ? 'py-6' : ''}  md:py-0 md:pl-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-5`}>
              {filter.map((item, index) => {
                return (
                  <div onClick={() => navigate(`/singlebook/${item.id}`)}>
                    <Card name={item.name} image={item.image} />
                  </div>
                )
              })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Allbooks