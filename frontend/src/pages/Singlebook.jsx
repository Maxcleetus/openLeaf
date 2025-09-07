import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const Singlebook = () => {
  const navigate = useNavigate()
  const { bookid } = useParams()
  const { details } = useAppContext()
  const [oneBook, setOneBook] = useState([])
  const [relBook, setRelBook] = useState([])
  const [loadingDownload, setLoadingDownload] = useState(false) // ✅ new state

  function getOneBook() {
    let book = details.filter(item => item._id == bookid)
    setOneBook(book)
  }

  function relatedBooks() {
    let rel = details.filter(
      book => book.category === oneBook[0].category && book._id !== oneBook[0]._id
    )
    setRelBook(rel)
  }

  // download handler with loading
  async function handleDownload(url, name) {
    setLoadingDownload(true)
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error("Network response was not ok")
      const blob = await res.blob()
      const fileURL = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }))
      const link = document.createElement("a")
      link.href = fileURL
      link.setAttribute("download", `${name || "file"}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => window.URL.revokeObjectURL(fileURL), 1000)
    } catch (err) {
      console.error("Download failed:", err)
      alert("Download failed! Please try again.")
    } finally {
      setLoadingDownload(false)
    }
  }

  // details of one book
  useEffect(() => {
    getOneBook()
  }, [bookid])

  // filter related books
  useEffect(() => {
    if (oneBook.length > 0) {
      relatedBooks()
    }
  }, [oneBook])

  return (
    <div>
      {oneBook.map((item) => (
        <div key={item._id}>
          <div className='flex md:pt-10 md:pb-5 pb-3 flex-col md:flex-row md:gap-12'>
            <div className='flex items-center max-md:justify-center md:bg-[#035DCA]/80 rounded-lg'>
              <div className='max-md:border-2 rounded-lg border-[#035DCA] p-1 max-md:bg-[#035DCA]/80'>
                <img className='w-[300px] h-[400px] rounded-lg' src={item.image} alt={item.name} />
              </div>
            </div>
            <div className='md:border-3 md:bg-white/30 md:border-[#035DCA]/80 w-full md:flex-1 rounded-lg'>
              <div className='flex flex-col items-center'>
                <h1 className='text-xl md:text-3xl font-bold my-2 text-[#1E2939] border-b-1 md:border-b-2 border-[#035DCA]/60 text-center'>
                  {item.name}
                </h1>
                <div className='flex gap-2'>
                  <p className='text-[#1E2939] text-xs md:text-sm bg-[#035DCA]/10 rounded-3xl md:font-medium px-1 md:px-2 md:py-1'>
                    Author : {item.author}
                  </p>
                  <p className='text-[#1E2939] text-xs md:text-sm bg-[#035DCA]/10 rounded-3xl md:font-medium px-1 md:px-2 md:py-1'>
                    Category : {item.category}
                  </p>
                </div>
                <div className='mt-2 pt-1 w-[300px] h-[300px] border-2 md:border-0 border-[#035DCA]/40 rounded-lg md:rounded-0 p-2 text-sm md:text-lg md:px-6 items-center md:h-70 md:w-auto tracking-wider leading-8 font-medium text-gray-500 overflow-y-scroll scrollbar-hidden'>
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Download button */}
          <div className="w-full flex justify-center mt-3">
            <button
              onClick={() => handleDownload(item.pdf, item.name)}
              disabled={loadingDownload} // disable while loading
              className={`bg-[#035DCA]/80 px-2 py-1 md:px-3 md:py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 ${loadingDownload ? "cursor-not-allowed opacity-70" : ""}`}
            >
              {loadingDownload ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 108 8h-4l3 3 3-3h-4z"
                    ></path>
                  </svg>
                  Downloading...
                </>
              ) : (
                "Download"
              )}
            </button>
          </div>
        </div>
      ))}

      <h1 className='text-2xl md:text-3xl font-bold my-4 text-[#1E2939] text-center'>
        Related Books
      </h1>
      <div className='flex overflow-x-scroll scrollbar-hidden gap-6'>
        {relBook.map((item) => (
          <div
            key={item._id}
            className="min-w-[200px] cursor-pointer"
            onClick={() => ( window.scrollTo(0,0), navigate(`/singlebook/${item._id}`))}
          >
            <img
              className='max-w-[200px] rounded-lg border-[#035DCA] p-1 bg-[#035DCA]/80'
              src={item.image}
              alt={item.name}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Singlebook
