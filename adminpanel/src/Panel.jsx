// src/components/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  MessageSquare, 
  Users, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  TrendingUp,
  Eye as EyeIcon,
  Heart,
  Calendar,
  FileText,
  Save,
  Upload,
  Link
} from "lucide-react";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:3000/api";

const Panel = () => {
  const [activeTab, setActiveTab] = useState("books");
  const [books, setBooks] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalDiscussions: 0,
    totalComments: 0,
    totalLikes: 0,
    totalViews: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [showAddBook, setShowAddBook] = useState(false);
  const [editingComment, setEditingComment] = useState(null);

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchBooks(),
        fetchDiscussions(),
      ]);
      await fetchStats();
    } catch (error) {
      toast.error("Failed to load data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/common/details`);
      const data = await response.json();
      setBooks(data || []);
      
      // Extract all comments from books
      const allBookComments = data.flatMap(book => 
        (book.comments || []).map(comment => ({
          ...comment,
          sourceType: "book",
          sourceId: book._id,
          sourceTitle: book.name,
          bookId: book._id
        }))
      );
      setComments(prev => [...allBookComments]);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const fetchDiscussions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/discussions`);
      const data = await response.json();
      setDiscussions(data.data || []);
      
      // Extract all comments from discussions
      const allDiscussionComments = data.data.flatMap(discussion => 
        (discussion.comments || []).map(comment => ({
          ...comment,
          sourceType: "discussion",
          sourceId: discussion._id,
          sourceTitle: discussion.title,
          discussionId: discussion._id
        }))
      );
      setComments(prev => [...prev, ...allDiscussionComments]);
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  };

  const fetchStats = async () => {
    try {
      // Get discussion stats
      const statsRes = await fetch(`${API_BASE_URL}/discussions/stats/summary`);
      const statsData = await statsRes.json();
      
      // Calculate book stats
      const bookStats = {
        totalBooks: books.length,
        totalBookLikes: books.reduce((sum, book) => sum + (book.likes || 0), 0),
        totalBookComments: books.reduce((sum, book) => sum + (book.comments?.length || 0), 0)
      };

      setStats({
        totalBooks: bookStats.totalBooks,
        totalDiscussions: statsData.data?.totalDiscussions || 0,
        totalComments: statsData.data?.totalComments + bookStats.totalBookComments || 0,
        totalLikes: statsData.data?.totalUpvotes + bookStats.totalBookLikes || 0,
        totalViews: statsData.data?.totalViews || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Handle delete item
  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      let url = "";
      
      if (itemToDelete.type === "book") {
        url = `${API_BASE_URL}/common/book/${itemToDelete.id}`;
      } else if (itemToDelete.type === "discussion") {
        url = `${API_BASE_URL}/discussions/${itemToDelete.id}`;
      } else if (itemToDelete.type === "comment") {
        if (itemToDelete.sourceType === "book") {
          url = `${API_BASE_URL}/common/book/${itemToDelete.sourceId}/comment/${itemToDelete.id}`;
        } else {
          url = `${API_BASE_URL}/discussions/${itemToDelete.sourceId}/comments/${itemToDelete.id}`;
        }
      }

      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        toast.success("Item deleted successfully");
        
        // Update local state
        if (itemToDelete.type === "book") {
          setBooks(books.filter(book => book._id !== itemToDelete.id));
        } else if (itemToDelete.type === "discussion") {
          setDiscussions(discussions.filter(d => d._id !== itemToDelete.id));
        } else if (itemToDelete.type === "comment") {
          setComments(comments.filter(c => c._id !== itemToDelete.id));
        }
        
        setShowDeleteModal(false);
        setItemToDelete(null);
        fetchStats();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete");
      }
    } catch (error) {
      toast.error(`Failed to delete item: ${error.message}`);
      console.error("Delete error:", error);
    }
  };

  // Handle update item
  const handleUpdate = async (type, id, data, commentId = null) => {
    try {
      let url = "";
      
      if (type === "book") {
        url = `${API_BASE_URL}/common/book/${id}`;
      } else if (type === "discussion") {
        url = `${API_BASE_URL}/discussions/${id}`;
      } else if (type === "comment") {
        if (data.sourceType === "book") {
          url = `${API_BASE_URL}/common/book/${data.sourceId}/comment/${id}`;
        } else {
          url = `${API_BASE_URL}/discussions/${data.discussionId}/comments/${id}`;
        }
      }

      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast.success(`${type} updated successfully`);
        
        // Update local state
        if (type === "book") {
          setBooks(books.map(book => 
            book._id === id ? { ...book, ...data } : book
          ));
        } else if (type === "discussion") {
          setDiscussions(discussions.map(discussion => 
            discussion._id === id ? { ...discussion, ...data } : discussion
          ));
        } else if (type === "comment") {
          setComments(comments.map(comment => 
            comment._id === id ? { ...comment, ...data } : comment
          ));
        }
        
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update");
      }
    } catch (error) {
      toast.error(`Failed to update ${type}: ${error.message}`);
      console.error("Update error:", error);
      return false;
    }
  };

  // Filter data based on search and category
  const getFilteredData = () => {
    let data = [];
    
    if (activeTab === "books") {
      data = books.filter(book => {
        const matchesSearch = book.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            book.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });
    } else if (activeTab === "discussions") {
      data = discussions.filter(discussion => {
        const matchesSearch = discussion.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            discussion.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            discussion.author?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });
    } else if (activeTab === "comments") {
      data = comments.filter(comment => {
        const matchesSearch = comment.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            comment.author?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            comment.text?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });
    }
    
    return data;
  };

  // Pagination
  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Categories from books
  const categories = ["all", ...new Set(books.map(book => book.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📚 Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage books, discussions, and comments</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Total Books</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBooks}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Total Discussions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalDiscussions}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Total Comments</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalComments}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Total Likes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalLikes}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Heart className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-white p-2 rounded-xl shadow-sm mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeTab === "books" 
              ? "bg-blue-600 text-white shadow-md" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("books")}
        >
          <BookOpen className="h-5 w-5" />
          Books ({books.length})
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeTab === "discussions" 
              ? "bg-blue-600 text-white shadow-md" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("discussions")}
        >
          <MessageSquare className="h-5 w-5" />
          Discussions ({discussions.length})
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeTab === "comments" 
              ? "bg-blue-600 text-white shadow-md" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("comments")}
        >
          <Users className="h-5 w-5" />
          Comments ({comments.length})
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {activeTab === "books" && (
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border-none bg-transparent focus:ring-0 outline-none text-gray-700"
            >
              <option value="all">All Categories</option>
              {categories.filter(cat => cat !== "all").map(cat => (
                <option key={cat} value={cat} className="capitalize">{cat}</option>
              ))}
            </select>
          </div>
        )}
        
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2">
          <span className="text-gray-600 text-sm">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border-none bg-transparent focus:ring-0 outline-none text-gray-700"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        {activeTab === "books" && (
          <BooksTable 
            books={paginatedData}
            onEdit={(book) => {
              setItemToEdit({ type: "book", data: book });
              setShowEditModal(true);
            }}
            onDelete={(book) => {
              setItemToDelete({ type: "book", id: book._id });
              setShowDeleteModal(true);
            }}
          />
        )}
        
        {activeTab === "discussions" && (
          <DiscussionsTable 
            discussions={paginatedData}
            onEdit={(discussion) => {
              setItemToEdit({ type: "discussion", data: discussion });
              setShowEditModal(true);
            }}
            onDelete={(discussion) => {
              setItemToDelete({ type: "discussion", id: discussion._id });
              setShowDeleteModal(true);
            }}
          />
        )}
        
        {activeTab === "comments" && (
          <CommentsTable 
            comments={paginatedData}
            onEdit={(comment) => setEditingComment(comment)}
            onDelete={(comment) => {
              setItemToDelete({ 
                type: "comment", 
                id: comment._id,
                sourceType: comment.sourceType,
                sourceId: comment.sourceId
              });
              setShowDeleteModal(true);
            }}
          />
        )}
        
        {paginatedData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {activeTab === "books" ? <BookOpen className="h-16 w-16 mx-auto" /> :
               activeTab === "discussions" ? <MessageSquare className="h-16 w-16 mx-auto" /> :
               <Users className="h-16 w-16 mx-auto" />}
            </div>
            <p className="text-gray-500 text-lg">No {activeTab} found</p>
            <p className="text-gray-400 mt-2">Try changing your search or filter</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-2 text-gray-400">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-10 h-10 rounded-lg font-medium ${
                      currentPage === totalPages
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Add New Book</h2>
              <button 
                onClick={() => setShowAddBook(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal
          itemToDelete={itemToDelete}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}

      {/* Edit Book/Discussion Modal */}
      {showEditModal && itemToEdit && (
        <EditModal 
          item={itemToEdit}
          onClose={() => {
            setShowEditModal(false);
            setItemToEdit(null);
          }}
          onSuccess={(updatedData) => {
            handleUpdate(itemToEdit.type, itemToEdit.data._id, updatedData);
            setShowEditModal(false);
            setItemToEdit(null);
          }}
        />
      )}

      {/* Edit Comment Modal */}
      {editingComment && (
        <EditCommentModal
          comment={editingComment}
          onClose={() => setEditingComment(null)}
          onSuccess={(updatedData) => {
            handleUpdate("comment", editingComment._id, updatedData);
            setEditingComment(null);
          }}
        />
      )}
    </div>
  );
};

// Books Table Component
const BooksTable = ({ books, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cover</th>
          <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
          <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
          <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
          <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
          <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
          <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {books.map(book => (
          <tr key={book._id} className="hover:bg-gray-50 transition-colors">
            <td className="py-4 px-6">
              <img 
                src={book.image} 
                alt={book.name}
                className="w-16 h-24 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/64x96?text=No+Image";
                }}
              />
            </td>
            <td className="py-4 px-6">
              <div>
                <div className="font-medium text-gray-900">{book.name}</div>
                <div className="text-sm text-gray-500 mt-1 line-clamp-2">{book.description}</div>
                {book.semester && (
                  <div className="text-xs text-gray-400 mt-1">Semester: {book.semester}</div>
                )}
              </div>
            </td>
            <td className="py-4 px-6">
              <div className="text-gray-900">{book.author}</div>
              {book.linkedin && (
                <a 
                  href={book.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
                >
                  <Link className="h-3 w-3" />
                  LinkedIn
                </a>
              )}
            </td>
            <td className="py-4 px-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {book.category}
              </span>
            </td>
            <td className="py-4 px-6">
              <div className="flex items-center gap-1 text-gray-700">
                <Heart className="h-4 w-4 text-red-500" />
                {book.likes || 0}
              </div>
            </td>
            <td className="py-4 px-6">
              <div className="flex items-center gap-1 text-gray-700">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                {book.comments?.length || 0}
              </div>
            </td>
            <td className="py-4 px-6">
              <div className="flex items-center gap-2">
                <a 
                  href={book.pdf} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View PDF"
                >
                  <Eye className="h-5 w-5" />
                </a>
                <button 
                  onClick={() => onEdit(book)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => onDelete(book)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Discussions Table Component
const DiscussionsTable = ({ discussions, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
          <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
          <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
          <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
          <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {discussions.map(discussion => (
          <tr key={discussion._id} className="hover:bg-gray-50 transition-colors">
            <td className="py-4 px-6">
              <div>
                <div className="font-medium text-gray-900 mb-1">{discussion.title}</div>
                <div className="text-sm text-gray-500 line-clamp-2">{discussion.content}</div>
              </div>
            </td>
            <td className="py-4 px-6">
              <div>
                <div className="font-medium text-gray-900">{discussion.author?.name || "Anonymous"}</div>
                <div className="text-sm text-gray-500">{discussion.author?.email}</div>
              </div>
            </td>
            <td className="py-4 px-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">{discussion.upvotes || 0} upvotes</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <EyeIcon className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-700">{discussion.views || 0} views</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-purple-500" />
                  <span className="text-gray-700">{discussion.comments?.length || 0} comments</span>
                </div>
              </div>
            </td>
            <td className="py-4 px-6">
              <div className="flex flex-wrap gap-2">
                {discussion.tags?.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
                {discussion.tags?.length > 3 && (
                  <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                    +{discussion.tags.length - 3}
                  </span>
                )}
              </div>
            </td>
            <td className="py-4 px-6">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onEdit(discussion)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => onDelete(discussion)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Comments Table Component
const CommentsTable = ({ comments, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
          <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
          <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
          <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {comments.map(comment => (
          <tr key={comment._id} className="hover:bg-gray-50 transition-colors">
            <td className="py-4 px-6">
              <div className="max-w-xs">
                <p className="text-gray-900 line-clamp-2">
                  {comment.content || comment.text}
                  {comment.image && <span className="text-blue-500 ml-1">📷</span>}
                </p>
              </div>
            </td>
            <td className="py-4 px-6">
              <div>
                <div className="font-medium text-gray-900">{comment.author?.name || comment.user}</div>
                {comment.author?.email && (
                  <div className="text-sm text-gray-500">{comment.author.email}</div>
                )}
              </div>
            </td>
            <td className="py-4 px-6">
              <div className="flex flex-col">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-1 ${
                  comment.sourceType === 'book' 
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {comment.sourceType}
                </span>
                <span className="text-sm text-gray-600 truncate max-w-[150px]">
                  {comment.sourceTitle}
                </span>
              </div>
            </td>
            <td className="py-4 px-6">
              <div className="text-sm text-gray-500">
                {new Date(comment.createdAt || comment.timestamp).toLocaleDateString()}
                <div className="text-xs text-gray-400">
                  {new Date(comment.createdAt || comment.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </td>
            <td className="py-4 px-6">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onEdit(comment)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => onDelete(comment)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Delete Modal Component
const DeleteModal = ({ itemToDelete, onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl w-full max-w-md">
      <div className="p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
          <Trash2 className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
          Confirm Delete
        </h3>
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Edit Modal Component
const EditModal = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(item.data);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({...formData, image: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({...formData, pdf: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Prepare payload - remove empty fields
      const payload = { ...formData };
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined || payload[key] === "") {
          delete payload[key];
        }
      });

      await onSuccess(payload);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Edit {item.type}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          {item.type === "book" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Book Name *</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                  <input
                    type="text"
                    value={formData.author || ""}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category || ""}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                  <input
                    type="text"
                    value={formData.semester || ""}
                    onChange={(e) => setFormData({...formData, semester: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., 1st, 2nd"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={formData.linkedin || ""}
                    onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                  <div className="flex items-center gap-4">
                    {formData.image && (
                      <img 
                        src={formData.image} 
                        alt="Current cover" 
                        className="w-20 h-28 object-cover rounded-lg border"
                      />
                    )}
                    <div>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Upload className="h-4 w-4" />
                        Change Image
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      {imageFile && (
                        <p className="text-xs text-gray-500 mt-1">{imageFile.name}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PDF File</label>
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <FileText className="h-4 w-4" />
                        Change PDF
                        <input 
                          type="file" 
                          accept=".pdf" 
                          onChange={handlePdfChange}
                          className="hidden"
                        />
                      </label>
                      {pdfFile ? (
                        <p className="text-xs text-gray-500 mt-1">{pdfFile.name}</p>
                      ) : formData.pdf && (
                        <a 
                          href={formData.pdf} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 mt-1 block"
                        >
                          View current PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                <textarea
                  value={formData.content || ""}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(formData.tags) ? formData.tags.join(", ") : formData.tags || ""}
                  onChange={(e) => setFormData({
                    ...formData, 
                    tags: e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag)
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g., programming, books, education"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discussion Image</label>
                <div className="flex items-center gap-4">
                  {formData.image && (
                    <img 
                      src={formData.image} 
                      alt="Current image" 
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Upload className="h-4 w-4" />
                    {formData.image ? 'Change Image' : 'Add Image'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Update
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Comment Modal Component
const EditCommentModal = ({ comment, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    content: comment.content || comment.text || "",
    user: comment.author?.name || comment.user || "",
    email: comment.author?.email || ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = comment.sourceType === "book" 
        ? { text: formData.content, user: formData.user }
        : { 
            content: formData.content, 
            author: { 
              name: formData.user, 
              email: formData.email 
            } 
          };

      await onSuccess(payload);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Edit Comment</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
                placeholder="Enter comment text..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author Name *
              </label>
              <input
                type="text"
                value={formData.user}
                onChange={(e) => setFormData({...formData, user: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
                placeholder="Enter author name"
              />
            </div>
            
            {comment.sourceType === "discussion" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter email address"
                />
              </div>
            )}
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Source:</span> {comment.sourceTitle}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Type:</span> {comment.sourceType}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Comment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Panel;