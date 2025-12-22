import React, { useState } from "react"
import { Upload, BookOpen, FileText, User, Tag, GraduationCap, Linkedin } from "lucide-react" // Added Linkedin icon
import { toast } from "react-toastify"

const categories = ['cse','eee','ec','robo','civil','mech','other']
const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"]

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
    linkedin: "", // 1. Added LinkedIn to state
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
    } else {
      setBookData((prev) => ({ ...prev, image: null }))
      setImagePreview(null)
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
      linkedin: "", // 2. Reset LinkedIn field
    })
    setImagePreview(null)
    setPdfName("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const base64Image = await fileToBase64(bookData.image);
      const base64Pdf = await fileToBase64(bookData.pdf);

      const payload = {
        name: bookData.name,
        image: base64Image, 
        pdf: base64Pdf,
        description: bookData.description,
        author: bookData.author,
        category: bookData.category,
        semester: bookData.semester,
        linkedin: bookData.linkedin, // 3. Added LinkedIn to payload
      };

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="">Select Semester</option>
                    {semesters.map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                    ))}
                </select>
            </div>

            {/* LinkedIn Profile - NEW FIELD */}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px] resize-none"
          />
        </div>

        {/* Files */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Book Cover Image</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-gray-50">
                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover rounded-lg" alt="Preview" /> : <Upload className="text-gray-400" />}
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2"><FileText className="h-4 w-4" /> PDF File</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-gray-50">
                <FileText className="w-8 h-8 mb-2 text-gray-400" />
                <span className="text-xs text-center px-2">{pdfName || "Upload PDF"}</span>
                <input type="file" accept=".pdf" onChange={handlePdfChange} className="hidden" />
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button type="submit" className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Add Book & Profile</button>
          <button type="button" onClick={resetForm} className="flex-1 sm:flex-none border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100">Reset Form</button>
        </div>
      </form>
    </div>
  )
}