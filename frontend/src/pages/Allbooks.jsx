import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import { useParams, useNavigate } from 'react-router-dom';
import { FilterIcon } from 'lucide-react';

const Allbooks = () => {
  const { cat, subcat } = useParams(); // Added subcat from URL
  const { details } = useAppContext();
  const navigate = useNavigate();
  const [filter, setFilter] = useState([]);
  const [filBtn, setFilBtn] = useState(false);

  // List of semesters for the subcategory menu
  const semesters = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];

  useEffect(() => {
    let filteredData = details;

    if (cat) {
      filteredData = filteredData.filter(book => book.category === cat);
    }
    
    // If a semester (subcat) is selected, filter by semester as well
    if (subcat) {
      filteredData = filteredData.filter(book => book.semester === subcat);
    }

    setFilter(filteredData);
  }, [cat, subcat, details]);

  return (
    <div className='px-4 md:px-10'>
      <h1 className='text-gray-500 py-4'>Browse books by category.</h1>
      
      <div className='flex flex-col md:flex-row gap-6'>
        
        {/* --- Sidebar / Filter Section --- */}
        <div className='flex flex-col gap-4 min-w-[250px]'>
          
          {/* Mobile Filter Toggle */}
          <div className='md:hidden flex items-center gap-1'>
            <div onClick={() => setFilBtn(!filBtn)} className={`flex items-center gap-2 ${filBtn ? 'bg-gray-400' : 'bg-[#035DCA]'} text-white px-3 py-2 rounded-md cursor-pointer`}>
              <FilterIcon size="16px" />
              <p className='text-sm font-medium'>Categories</p>
            </div>
          </div>

          {/* Main Categories Menu */}
          <div className={`${filBtn ? 'flex' : 'hidden'} md:flex flex-col gap-2`}>
            {[
              { id: 'cse', name: 'Computer Science' },
              { id: 'eee', name: 'Electrical' },
              { id: 'ec', name: 'Electronics' },
              { id: 'robo', name: 'Robotics' },
              { id: 'civil', name: 'Civil' },
              { id: 'mech', name: 'Mechanical' },
              { id: 'other', name: 'Others' }
            ].map((item) => (
              <div key={item.id}>
                <p 
                  onClick={() => cat === item.id ? navigate('/allbook') : navigate(`/allbook/${item.id}`)}
                  className={`rounded-lg border border-[#D1D5DB] text-gray-600 font-medium px-4 py-2 cursor-pointer transition-all ${cat === item.id ? 'bg-blue-50 border-blue-400 text-blue-600' : 'bg-white hover:bg-gray-50'}`}
                >
                  {item.name}
                </p>

                {/* --- Subcategory (Semester) Logic --- */}
                {cat === 'cse' && item.id === 'cse' && (
                  <div className=' mt-2 grid grid-cols-2 gap-2 animate-in fade-in duration-300'>
                    {semesters.map((sem) => (
                      <p
                        key={sem}
                        onClick={() => subcat === sem ? navigate('/allbook/cse') : navigate(`/allbook/cse/${sem}`)}
                        className={`text-center text-xs py-1.5 border rounded-md cursor-pointer ${subcat === sem ? 'bg-blue-50 border-blue-400 text-blue-600' : 'bg-gray-50 text-gray-500'}`}
                      >
                        {sem}
                      </p>
                    ))}
                  </div>
                )}
                {cat === 'eee' && item.id === 'eee' && (
                  <div className=' mt-2 grid grid-cols-2 gap-2 animate-in fade-in duration-300'>
                    {semesters.map((sem) => (
                      <p
                        key={sem}
                        onClick={() => subcat === sem ? navigate('/allbook/eee') : navigate(`/allbook/eee/${sem}`)}
                        className={`text-center text-xs py-1.5 border rounded-md cursor-pointer ${subcat === sem ? 'bg-blue-50 border-blue-400 text-blue-600' : 'bg-gray-50 text-gray-500'}`}
                      >
                        {sem}
                      </p>
                    ))}
                  </div>
                )}
                {cat === 'ec' && item.id === 'ec' && (
                  <div className=' mt-2 grid grid-cols-2 gap-2 animate-in fade-in duration-300'>
                    {semesters.map((sem) => (
                      <p
                        key={sem}
                        onClick={() => subcat === sem ? navigate('/allbook/ec') : navigate(`/allbook/ec/${sem}`)}
                        className={`text-center text-xs py-1.5 border rounded-md cursor-pointer ${subcat === sem ?'bg-blue-50 border-blue-400 text-blue-600' : 'bg-gray-50 text-gray-500'}`}
                      >
                        {sem}
                      </p>
                    ))}
                  </div>
                )}
                {cat === 'civil' && item.id === 'civil' && (
                  <div className=' mt-2 grid grid-cols-2 gap-2 animate-in fade-in duration-300'>
                    {semesters.map((sem) => (
                      <p
                        key={sem}
                        onClick={() => subcat === sem ? navigate('/allbook/civil') : navigate(`/allbook/civil/${sem}`)}
                        className={`text-center text-xs py-1.5 border rounded-md cursor-pointer ${subcat === sem ? 'bg-blue-50 border-blue-400 text-blue-600' : 'bg-gray-50 text-gray-500'}`}
                      >
                        {sem}
                      </p>
                    ))}
                  </div>
                )}
                {cat === 'robo' && item.id === 'robo' && (
                  <div className=' mt-2 grid grid-cols-2 gap-2 animate-in fade-in duration-300'>
                    {semesters.map((sem) => (
                      <p
                        key={sem}
                        onClick={() => subcat === sem ? navigate('/allbook/robo') : navigate(`/allbook/robo/${sem}`)}
                        className={`text-center text-xs py-1.5 border rounded-md cursor-pointer ${subcat === sem ? 'bg-blue-50 border-blue-400 text-blue-600' : 'bg-gray-50 text-gray-500'}`}
                      >
                        {sem}
                      </p>
                    ))}
                  </div>
                )}
                {cat === 'mech' && item.id === 'mech' && (
                  <div className=' mt-2 grid grid-cols-2 gap-2 animate-in fade-in duration-300'>
                    {semesters.map((sem) => (
                      <p
                        key={sem}
                        onClick={() => subcat === sem ? navigate('/allbook/mech') : navigate(`/allbook/mech/${sem}`)}
                        className={`text-center text-xs py-1.5 border rounded-md cursor-pointer ${subcat === sem ? 'bg-blue-50 border-blue-400 text-blue-600' : 'bg-gray-50 text-gray-500'}`}
                      >
                        {sem}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* --- Books Display Grid --- */}
        <div className='flex-1'>
          <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {filter ? (
              filter.map((item) => (
                <div 
                  key={item._id} 
                  onClick={() => { window.scrollTo(0,0); navigate(`/singlebook/${item._id}`); }}
                  className='cursor-pointer transform transition-hover hover:scale-[1.02]'
                >
                  <Card name={item.name} image={item.image} />
                </div>
              ))
            ) : (
              <p className='col-span-full text-gray-400 italic py-10 text-center'>No books found for this selection.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Allbooks;