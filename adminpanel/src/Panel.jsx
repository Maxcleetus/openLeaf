import React, { useState } from "react"
import { Upload, BookOpen, FileText, User, Tag } from "lucide-react"
import { toast } from "react-toastify"

const categories = [
  "notes",
  "novel",
  "story",
  "code",
  "selfdev",
]

export default function BookInputForm() {
  const [bookData, setBookData] = useState({
    name: "",
    image: null,
    pdf: null,
    description: "",
    author: "",
    category: "",
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [pdfName, setPdfName] = useState("")

  const handleInputChange = (field, value) => {
    setBookData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setBookData((prev) => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onload = (event) => setImagePreview(event.target?.result)
      reader.readAsDataURL(file)
    }
  }

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setBookData((prev) => ({ ...prev, pdf: file }))
      setPdfName(file.name)
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
    })
    setImagePreview(null)
    setPdfName("")
  }

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Prepare form data for files + text
    const formData = new FormData();
    formData.append("name", bookData.name);
    formData.append("image", bookData.image);
    formData.append("pdf", bookData.pdf);
    formData.append("description", bookData.description);
    formData.append("author", bookData.author);
    formData.append("category", bookData.category);

    // Get token (adjust based on your auth flow)
    const token = localStorage.getItem("token"); 

    // Send to backend
    const response = await fetch("http://localhost:3000/api/common/addBook", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Send token for authentication
      },
      body: formData // Send FormData instead of plain object
    });

    if (!response.ok) {
      throw new Error(`Failed to upload book: ${response.status}`);
    }

    const data = await response.json();
    toast.success("Book upload successfully");
    console.log("Book uploaded successfully:", data);

    // Reset form after successful upload
    resetForm();
  } catch (error) {
    console.error("Error uploading book:", error);
  }
};



  return (
    <div className="w-full border border-gray-200 rounded-lg shadow p-6 bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Add New Book</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Book Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Book Name *</label>
          <input
            id="name"
            type="text"
            placeholder="Enter book name"
            value={bookData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Author */}
        <div className="space-y-2">
          <label htmlFor="author" className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            Author *
          </label>
          <input
            id="author"
            type="text"
            placeholder="Enter author name"
            value={bookData.author}
            onChange={(e) => handleInputChange("author", e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Category *
          </label>
          <select
            id="category"
            value={bookData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter book description"
            value={bookData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px] resize-none"
          />
        </div>

        {/* File Uploads */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Image Upload */}
          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium">
              Book Cover Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500 text-center">Click to upload image</p>
                  </div>
                )}
                <input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* PDF Upload */}
          <div className="space-y-2">
            <label htmlFor="pdf" className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              PDF File
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="pdf"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileText className="w-8 h-8 mb-2 text-gray-400" />
                  {pdfName ? (
                    <p className="text-sm text-gray-800 font-medium text-center px-2">{pdfName}</p>
                  ) : (
                    <p className="text-sm text-gray-500 text-center">Click to upload PDF</p>
                  )}
                </div>
                <input id="pdf" type="file" accept=".pdf" onChange={handlePdfChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Book
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 sm:flex-none border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  )
}
