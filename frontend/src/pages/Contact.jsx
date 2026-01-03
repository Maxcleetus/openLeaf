import React, { useState } from "react"
import { Upload, BookOpen, FileText, User, Tag, GraduationCap, Linkedin, Loader2, Image as ImageIcon } from "lucide-react"
import { toast } from "react-toastify"

const categories = ['cse','eee','ec','robo','civil','mech','other']
const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"]

// Default book cover image
const DEFAULT_BOOK_COVER = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=500&fit=crop&auto=format"

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default function Contact() {
  const [bookData, setBookData] = useState({
    name: "",
    image: null,
    pdf: null,
    description: "",
    author: "",
    category: "",
    semester: "",
    linkedin: "",
  })

  const [imagePreview, setImagePreview] = useState(DEFAULT_BOOK_COVER) // Set default image
  const [pdfName, setPdfName] = useState("")
  const [loading, setLoading] = useState(false)
  const [useDefaultCover, setUseDefaultCover] = useState(true) // Track if using default image

  const handleInputChange = (field, value) => {
    setBookData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setBookData((prev) => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result)
        setUseDefaultCover(false) // User uploaded custom image
      }
      reader.readAsDataURL(file)
    } else {
      setBookData((prev) => ({ ...prev, image: null }))
      setImagePreview(DEFAULT_BOOK_COVER) // Reset to default
      setUseDefaultCover(true)
    }
  }

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setBookData((prev) => ({ ...prev, pdf: file }))
      setPdfName(file.name)
    } else {
      setBookData((prev) => ({ ...prev, pdf: null }))
      setPdfName("")
    }
  }

  const resetForm = () => {
    setBookData({
      name: "",
      image: null,
      pdf: null,
      description: "",
      author: "",
      category: "",
      semester: "",
      linkedin: "",
    })
    setImagePreview(DEFAULT_BOOK_COVER) // Reset to default
    setPdfName("")
    setUseDefaultCover(true)
  }

  const useDefaultBookCover = () => {
    setBookData((prev) => ({ ...prev, image: null }))
    setImagePreview(DEFAULT_BOOK_COVER)
    setUseDefaultCover(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      toast.info("Converting files, please wait...");
      
      // If using default cover, we'll send the URL instead of converting to base64
      let base64Image = null;
      if (bookData.image) {
        base64Image = await fileToBase64(bookData.image);
      } else if (useDefaultCover) {
        // For default cover, we can either:
        // 1. Send the URL (backend needs to handle URL)
        // 2. Or fetch and convert to base64
        // Let's fetch and convert to be consistent
        try {
          const response = await fetch(DEFAULT_BOOK_COVER);
          const blob = await response.blob();
          base64Image = await fileToBase64(blob);
        } catch (err) {
          // If fetch fails, send URL
          base64Image = DEFAULT_BOOK_COVER;
        }
      }
      
      const base64Pdf = await fileToBase64(bookData.pdf);

      const payload = {
        name: bookData.name,
        image: base64Image, 
        pdf: base64Pdf,
        description: bookData.description,
        author: bookData.author,
        category: bookData.category,
        semester: bookData.semester,
        linkedin: bookData.linkedin,
        useDefaultCover: useDefaultCover, // Let backend know if default cover was used
      };

      toast.info("Uploading book data...");
      
      const response = await fetch("https://open-leaf.vercel.app/api/common/addBook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload) 
      });

      if (!response.ok) {
        let errorMessage = `Failed to upload book: ${response.status}`;
        try {
            const errorBody = await response.json();
            if (errorBody.message) errorMessage = errorBody.message;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      toast.success("Book and Author Profile uploaded successfully");
      resetForm();
    } catch (error) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Add New Book & Author Profile</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
            {/* Book Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Book Name *</label>
              <input
                  id="name"
                  type="text"
                  value={bookData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Author Name */}
            <div className="space-y-2">
              <label htmlFor="author" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" /> Author *
              </label>
              <input
                  id="author"
                  type="text"
                  value={bookData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
            {/* Category */}
            <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4" /> Category *
                </label>
                <select
                    id="category"
                    value={bookData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                    ))}
                </select>
            </div>

            {/* Semester */}
            <div className="space-y-2">
                <label htmlFor="semester" className="text-sm font-medium flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" /> Semester *
                </label>
                <select
                    id="semester"
                    value={bookData.semester}
                    onChange={(e) => handleInputChange("semester", e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                    <option value="">Select Semester</option>
                    {semesters.map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                    ))}
                </select>
            </div>

            {/* LinkedIn Profile */}
            <div className="space-y-2">
                <label htmlFor="linkedin" className="text-sm font-medium flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-blue-700" /> Author's LinkedIn
                </label>
                <input
                    id="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={bookData.linkedin}
                    onChange={(e) => handleInputChange("linkedin", e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
            </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <textarea
            id="description"
            value={bookData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px] resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Files */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Book Cover Image */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Book Cover Image</label>
              {!useDefaultCover && (
                <button
                  type="button"
                  onClick={useDefaultBookCover}
                  disabled={loading}
                  className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  Use default cover
                </button>
              )}
            </div>
            
            <div className="relative">
              <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-gray-50 overflow-hidden ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>
                {/* Image Preview */}
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={imagePreview} 
                      className="w-full h-full object-cover"
                      alt="Book cover preview"
                    />
                    {useDefaultCover && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs text-center">
                        Default Book Cover
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4">
                    <Upload className="text-gray-400 mb-2" size={24} />
                    <span className="text-sm text-gray-500">Click to upload cover image</span>
                  </div>
                )}
                
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                  disabled={loading}
                />
              </label>
              
              {/* Default cover indicator */}
              {useDefaultCover && (
                <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <ImageIcon size={16} />
                  <span>Using default book cover</span>
                </div>
              )}
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              {useDefaultCover 
                ? "A default book cover will be used. Upload your own or keep default."
                : "Custom cover uploaded. Click image to change."}
            </p>
          </div>

          {/* PDF File */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" /> 
              PDF File *
            </label>
            
            <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-gray-50 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>
              <div className="flex flex-col items-center justify-center p-4">
                <FileText className="w-10 h-10 mb-3 text-gray-400" />
                {pdfName ? (
                  <>
                    <span className="text-sm font-medium text-gray-700 text-center px-2 truncate max-w-full">
                      {pdfName}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">Click to change PDF</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-gray-500">Upload PDF file</span>
                    <span className="text-xs text-gray-400 mt-1">Required field</span>
                  </>
                )}
              </div>
              
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handlePdfChange} 
                className="hidden" 
                disabled={loading}
                required
              />
            </label>
            
            <p className="text-xs text-gray-500 text-center">
              {pdfName ? "PDF file selected" : "Upload the book content in PDF format"}
            </p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Uploading...
              </>
            ) : (
              "Add Book & Profile"
            )}
          </button>
          
          <button 
            type="button" 
            onClick={resetForm} 
            disabled={loading}
            className="flex-1 sm:flex-none border border-gray-300 px-4 py-3 rounded-md hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
          >
            Reset Form
          </button>
        </div>
      </form>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <div className="text-center">
              <p className="font-medium">Uploading Book</p>
              <p className="text-sm text-gray-500">Please wait while we process your files...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}