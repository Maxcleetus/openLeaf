import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Footer from './components/Footer'
import Allbooks from './pages/Allbooks'
import Preloader from './components/Preloader'
import Singlebook from './pages/Singlebook'

const App = () => {

  const [loader,setLoader] = useState(true)

  useEffect(()=>{
    const timer = setTimeout(()=>{
        setLoader(false)
    },1500)
    return ()=> clearTimeout(timer)
  },[])
  if(loader) return <Preloader/>

  return (
    <div className='px-4 md:px-8 lg:px-48 bg-[#E9E9E9] min-h-screen' >
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/allbook' element={<Allbooks/>}/>
        <Route path='/allbook/:cat' element={<Allbooks/>}/>
        <Route path='/singlebook/:bookid' element={<Singlebook/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App