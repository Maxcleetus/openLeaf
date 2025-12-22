import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { toast, ToastContainer } from 'react-toastify'
import { FaLinkedin } from 'react-icons/fa' 
import 'react-toastify/dist/ReactToastify.css'

const Singlebook = () => {
  const navigate = useNavigate()
  const { bookid } = useParams()
  const { details } = useAppContext()
  
  const [oneBook, setOneBook] = useState([])
  const [relBook, setRelBook] = useState([])
  const [loadingDownload, setLoadingDownload] = useState(false)
  
  // Social States
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(false)

  const API_BASE_URL = "https://open-leaf.vercel.app/api/common"; 

  const getOneBook = async () => {
    const book = details.find(item => item._id === bookid)
    if (book) {
      setOneBook([book])
      const localLiked = localStorage.getItem(`liked_${bookid}`)
      setLiked(localLiked === 'true')

      try {
        const response = await fetch(`${API_BASE_URL}/details`);
        if (response.ok) {
          const allData = await response.json();
          const currentBook = allData.find(b => b._id === bookid);
          if (currentBook) {
            setLikeCount(currentBook.likes || 0);
            setComments(currentBook.comments || []);
          }
        }
      } catch (err) {
        console.error("Error fetching social data:", err);
        setLikeCount(book.likes || 0);
        setComments(book.comments || []);
      }
    }
  }

  const handleLike = async () => {
    const previousLiked = liked
    const previousCount = likeCount
    const newLikedStatus = !liked
    
    setLiked(newLikedStatus)
    setLikeCount(prev => newLikedStatus ? prev + 1 : prev - 1)

    if (newLikedStatus) {
      localStorage.setItem(`liked_${bookid}`, 'true')
    } else {
      localStorage.removeItem(`liked_${bookid}`)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${bookid}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liked: newLikedStatus })
      })
      if (!response.ok) throw new Error()
      toast.success(newLikedStatus ? 'Book liked! ❤️' : 'Like removed')
    } catch (err) {
      setLiked(previousLiked)
      setLikeCount(previousCount)
      previousLiked ? localStorage.setItem(`liked_${bookid}`, 'true') : localStorage.removeItem(`liked_${bookid}`)
      toast.error("Failed to update like")
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return toast.error('Please enter a comment')
    const commentBody = { text: newComment.trim(), user: "You" }
    try {
      const response = await fetch(`${API_BASE_URL}/${bookid}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentBody)
      })
      if (!response.ok) throw new Error()
      const savedComment = await response.json()
      setComments(prev => [savedComment, ...prev])
      setNewComment('')
      toast.success('Comment added!')
    } catch (err) {
      toast.error("Failed to post comment")
    }
  }

  async function handleDownload(url, name) {
    if (!url) return toast.error("No file available to download")
    setLoadingDownload(true)
    try {
      const res = await fetch(url, { mode: 'cors' })
      const blob = await res.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = `${name || "book"}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success("Download started ✅")
    } catch (err) {
      window.open(url, "_blank")
      toast.error("Opened in new tab")
    } finally {
      setLoadingDownload(false)
    }
  }

  useEffect(() => {
    getOneBook()
  }, [bookid, details])

  useEffect(() => {
    if (oneBook.length > 0) {
      const rel = details.filter(
        book => book.category === oneBook[0].category && book._id !== oneBook[0]._id
      )
      setRelBook(rel)
    }
  }, [oneBook, details])

  return (
    <div className="px-4 md:px-12 lg:px-24">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {oneBook.map((item) => (
        <div key={item._id}>
          <div className='flex md:pt-10 md:pb-5 pb-3 flex-col md:flex-row md:gap-12'>
            {/* RESTORED PREVIOUS BOOK COVER SIZE */}
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
                
                <div className='flex gap-2 mb-2'>
                  <p className='text-[#1E2939] text-xs md:text-sm bg-[#035DCA]/10 rounded-3xl md:font-medium px-2 py-1'>
                    Author : {item.author}
                  </p>
                  <p className='text-[#1E2939] text-xs md:text-sm bg-[#035DCA]/10 rounded-3xl md:font-medium px-2 py-1'>
                    Category : {item.category}
                  </p>
                </div>

                {/* Description Box */}
                <div className='mt-2 pt-1 w-[300px] h-[220px] border-2 md:border-0 border-[#035DCA]/40 rounded-lg md:rounded-0 p-3 text-sm md:text-lg md:px-6 items-center md:h-56 md:w-auto tracking-wider leading-8 font-medium text-gray-500 overflow-y-scroll scrollbar-hidden'>
                  <p>{item.description}</p>
                </div>

                {/* --- ATTENTION GRABBING LINKEDIN SECTION --- */}
                <div className="w-full px-6 py-4">
                  <div className="bg-white border-2 border-[#0077B5]/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#0077B5] p-2 rounded-lg text-white">
                        <FaLinkedin size={24} />
                      </div>
                      <div>
                        <h4 className="text-[#1E2939] font-bold text-sm md:text-base text-left">Enjoyed the writing?</h4>
                        <p className="text-gray-500 text-xs text-left">Connect with <span className="font-semibold text-[#0077B5]">{item.author}</span> on LinkedIn</p>
                      </div>
                    </div>
                    <a 
                      href={item.linkedin || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(item.author)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0077B5] hover:bg-[#005a8a] text-white px-6 py-2 rounded-full font-bold text-sm transition-all transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-2"
                    >
                      View Profile
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Interaction Buttons */}
          <div className="flex justify-center items-center gap-4 mt-3 flex-wrap">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${liked ? 'bg-red-100 text-red-600' : 'bg-[#035DCA]/10 text-[#035DCA] hover:bg-[#035DCA]/20'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={liked ? "currentColor" : "none"} stroke="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#035DCA]/10 text-[#035DCA] font-medium hover:bg-[#035DCA]/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" />
              </svg>
              <span>{comments.length} Comments</span>
            </button>

            <button
              onClick={() => handleDownload(item.pdf, item.name)}
              disabled={loadingDownload}
              className={`bg-[#035DCA]/80 px-8 py-2 rounded-lg text-white font-bold flex items-center justify-center gap-2 hover:bg-[#035DCA] ${loadingDownload ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loadingDownload ? "Downloading..." : "Download"}
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-8 max-w-2xl mx-auto border-t pt-6">
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#035DCA]/40 outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button onClick={handleAddComment} className="px-6 py-2 bg-[#035DCA] text-white rounded-lg font-semibold">Post</button>
              </div>
              <div className="space-y-4">
                {comments.length > 0 ? comments.map((comment, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-xl border">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span className="font-bold text-gray-700">{comment.user}</span>
                      <span>{new Date(comment.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                )) : (
                  <p className="text-center text-gray-400 py-6">No comments yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Related Books */}
      <h1 className='text-2xl md:text-3xl font-bold my-4 text-[#1E2939] text-center'>
        Related Books
      </h1>
      <div className='flex overflow-x-scroll scrollbar-hidden gap-6 pb-8'>
        {relBook.map((item) => (
          <div
            key={item._id}
            className="min-w-[200px] cursor-pointer"
            onClick={() => { window.scrollTo(0,0); navigate(`/singlebook/${item._id}`) }}
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

export default Singlebook;