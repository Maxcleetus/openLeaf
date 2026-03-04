import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import { useParams, useNavigate } from 'react-router-dom';
import { FilterIcon } from 'lucide-react';

const categories = [
  { id: 'cse', name: 'Computer Science' },
  { id: 'eee', name: 'Electrical' },
  { id: 'ec', name: 'Electronics' },
  { id: 'robo', name: 'Robotics' },
  { id: 'civil', name: 'Civil' },
  { id: 'mech', name: 'Mechanical' },
  { id: 'other', name: 'Others' },
];

const semesterCategories = new Set(['cse', 'eee', 'ec', 'robo', 'civil', 'mech']);
const semesters = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];

const Allbooks = () => {
  const { cat, subcat } = useParams();
  const { details } = useAppContext();
  const navigate = useNavigate();
  const [filter, setFilter] = useState([]);
  const [filBtn, setFilBtn] = useState(false);

  useEffect(() => {
    const sourceData = Array.isArray(details) ? details : [];
    let filteredData = sourceData;

    if (cat) {
      filteredData = filteredData.filter((book) => book.category === cat);
    }

    if (subcat) {
      filteredData = filteredData.filter((book) => book.semester === subcat);
    }

    setFilter(filteredData);
  }, [cat, subcat, details]);

  return (
    <div className='px-2 sm:px-4 md:px-10'>
      <h1 className='text-gray-500 py-4'>Browse books by category.</h1>

      <div className='flex flex-col md:flex-row gap-4 md:gap-6'>
        <div className='flex flex-col gap-4 md:sticky md:top-4 h-fit md:min-w-[250px]'>
          <div className='md:hidden flex items-center gap-1'>
            <button
              type='button'
              onClick={() => setFilBtn((prev) => !prev)}
              className={`flex items-center gap-2 ${filBtn ? 'bg-gray-400' : 'bg-[#035DCA]'} text-white px-3 py-2 rounded-md cursor-pointer`}
            >
              <FilterIcon size={16} />
              <p className='text-sm font-medium'>Categories</p>
            </button>
          </div>

          <div className={`${filBtn ? 'flex' : 'hidden'} md:flex flex-col gap-2`}>
            {categories.map((item) => (
              <div key={item.id}>
                <button
                  type='button'
                  onClick={() => (cat === item.id ? navigate('/allbook') : navigate(`/allbook/${item.id}`))}
                  className={`w-full text-left rounded-lg border border-[#D1D5DB] text-gray-600 font-medium px-4 py-2 cursor-pointer transition-all ${cat === item.id ? 'bg-blue-50 border-blue-400 text-blue-600' : 'bg-white hover:bg-gray-50'}`}
                >
                  {item.name}
                </button>

                {cat === item.id && semesterCategories.has(item.id) && (
                  <div className='mt-2 grid grid-cols-4 md:grid-cols-2 gap-2'>
                    {semesters.map((sem) => (
                      <button
                        type='button'
                        key={sem}
                        onClick={() => (subcat === sem ? navigate(`/allbook/${item.id}`) : navigate(`/allbook/${item.id}/${sem}`))}
                        className={`text-center text-xs py-1.5 border rounded-md cursor-pointer ${subcat === sem ? 'bg-blue-50 border-blue-400 text-blue-600' : 'bg-gray-50 text-gray-500'}`}
                      >
                        {sem}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className='flex-1 min-w-0'>
          <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'>
            {filter.length > 0 ? (
              filter.map((item) => (
                <button
                  key={item._id}
                  type='button'
                  onClick={() => {
                    window.scrollTo(0, 0);
                    navigate(`/singlebook/${item._id}`);
                  }}
                  className='text-left cursor-pointer transition-transform hover:scale-[1.02]'
                >
                  <Card name={item.name} image={item.image} />
                </button>
              ))
            ) : (
              <p className='col-span-full text-gray-500 py-10 text-center'>No books found for this selection.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Allbooks;
