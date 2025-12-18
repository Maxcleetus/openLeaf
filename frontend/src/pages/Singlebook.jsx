import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Singlebook = () => {
  const navigate = useNavigate()
  const { bookid } = useParams()
  const { details } = useAppContext()
  const [oneBook, setOneBook] = useState([])
  const [relBook, setRelBook] = useState([])
  const [loadingDownload, setLoadingDownload] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [viewCount, setViewCount] = useState(0)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(false)

  // Get single book details
  function getOneBook() {
    const book = details.filter(item => item._id === bookid)
    setOneBook(book)
    if (book.length > 0) {
      // Initialize from localStorage or book data
      const storedLikes = localStorage.getItem(`book_${bookid}_liked`)
      const storedLikeCount = localStorage.getItem(`book_${bookid}_likeCount`)
      const storedViews = localStorage.getItem(`book_${bookid}_views`)
      const storedComments = localStorage.getItem(`book_${bookid}_comments`)
      
      setLiked(storedLikes === 'true')
      setLikeCount(storedLikeCount ? parseInt(storedLikeCount) : book[0].likes || 0)
      
      // Initialize view count
      let views = storedViews ? parseInt(storedViews) : book[0].views || 0
      views += 1 // Increment view count on each visit
      setViewCount(views)
      localStorage.setItem(`book_${bookid}_views`, views.toString())
      
      setComments(storedComments ? JSON.parse(storedComments) : book[0].comments || [])
    }
  }

  // Get related books
  function relatedBooks() {
    if (oneBook.length === 0) return
    const rel = details.filter(
      book => book.category === oneBook[0].category && book._id !== oneBook[0]._id
    )
    setRelBook(rel)
  }

  // Handle like/unlike
  const handleLike = () => {
    const newLiked = !liked
    setLiked(newLiked)
    const newCount = newLiked ? likeCount + 1 : likeCount - 1
    setLikeCount(newCount)
    
    // Save to localStorage
    localStorage.setItem(`book_${bookid}_liked`, newLiked)
    localStorage.setItem(`book_${bookid}_likeCount`, newCount)
    
    toast.success(newLiked ? 'Book liked! ❤️' : 'Like removed')
  }

  // Handle comment submission
  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment')
      return
    }
    
    const comment = {
      id: Date.now(),
      text: newComment.trim(),
      timestamp: new Date().toISOString(),
      user: 'You' // In a real app, this would be actual user data
    }
    
    const updatedComments = [comment, ...comments]
    setComments(updatedComments)
    setNewComment('')
    
    // Save to localStorage
    localStorage.setItem(`book_${bookid}_comments`, JSON.stringify(updatedComments))
    
    toast.success('Comment added!')
  }

  // Download handler with loading & toast
  async function handleDownload(url, name) {
    if (!url) return toast.error("No file available to download")
    setLoadingDownload(true)

    try {
      const res = await fetch(url, { mode: 'cors' })
      if (!res.ok) throw new Error("Network response was not ok")
      const blob = await res.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = blobUrl
      link.download = `${name || "file"}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000)

      toast.success("Book downloaded successfully ✅")
    } catch (err) {
      console.error("Download failed:", err)
      window.open(url, "_blank")
      toast.error("Download failed! Opened in new tab instead ❌")
    } finally {
      setLoadingDownload(false)
    }
  }

  // Effects
  useEffect(() => {
    getOneBook()
  }, [bookid, details])

  useEffect(() => {
    relatedBooks()
  }, [oneBook])

  return (
    <div className="px-4 md:px-12 lg:px-24">
      <ToastContainer position="top-right" autoClose={3000} />
      
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

          {/* Interaction Buttons - Like, Comment, Download */}
          <div className="flex justify-center items-center gap-4 mt-3 flex-wrap">
            {/* Views Counter */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#035DCA]/10 text-[#035DCA] rounded-lg">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span>{viewCount} {viewCount === 1 ? 'View' : 'Views'}</span>
            </div>

            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${liked ? 'bg-red-100 text-red-600' : 'bg-[#035DCA]/10 text-[#035DCA] hover:bg-[#035DCA]/20'}`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill={liked ? "currentColor" : "none"}
                stroke="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
            </button>

            {/* Comment Toggle Button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#035DCA]/10 text-[#035DCA] font-medium hover:bg-[#035DCA]/20 transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
            </button>

            {/* Download Button */}
            <button
              onClick={() => handleDownload(item.pdf, item.name)}
              disabled={loadingDownload}
              className={`bg-[#035DCA]/80 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 hover:bg-[#035DCA] transition-colors ${loadingDownload ? "cursor-not-allowed opacity-70" : ""}`}
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
                <>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  Download
                </>
              )}
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-6 max-w-2xl mx-auto">
              {/* Add Comment */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 border border-[#035DCA]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#035DCA]/50"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-[#035DCA]/80 text-white rounded-lg hover:bg-[#035DCA] transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map((comment) => (
                    <div 
                      key={comment.id} 
                      className="bg-white/50 border border-[#035DCA]/20 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-[#1E2939]">{comment.user}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  ))
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
            onClick={() => (window.scrollTo(0,0), navigate(`/singlebook/${item._id}`))}
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