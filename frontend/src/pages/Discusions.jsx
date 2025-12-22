import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  User, 
  Calendar, 
  Plus,
  Search,
  Eye,
  X,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';

// API service for discussions
const discussionService = {
  // Create new discussion
  async createDiscussion(discussionData) {
    const response = await fetch('https://open-leaf.vercel.app/api/discussions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discussionData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create discussion');
    }
    return response.json();
  },

  // Get all discussions
  async getDiscussions() {
    try {
      const response = await fetch('https://open-leaf.vercel.app/api/discussions');
      
      if (!response.ok) {
        console.error('❌ Response not OK:', response.status, response.statusText);
        throw new Error(`Failed to fetch discussions: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
     
      
      // Your backend returns: { success: true, count: X, total: X, data: [...] }
      if (result.success && Array.isArray(result.data)) {
        return result.data;
      } 
      // Fallback: if data is directly an array
      else if (Array.isArray(result)) {
        return result;
      } 
      // If it's an object but data is array
      else if (result.data && Array.isArray(result.data)) {
        return result.data;
      }
      else {
        console.error('❌ Unexpected response format:', result);
        return [];
      }
    } catch (error) {
      console.error('❌ Error in getDiscussions:', error);
      throw error;
    }
  },

  // Search discussions
  async searchDiscussions(query) {
    try {
      const response = await fetch(`https://open-leaf.vercel.app/api/discussions/search/${query}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to search discussions');
      }
      
      const result = await response.json();
      
      // Handle the same response format as getAllDiscussions
      if (result.success && Array.isArray(result.data)) {
        return result.data;
      } else if (Array.isArray(result)) {
        return result;
      } else if (result.data && Array.isArray(result.data)) {
        return result.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }
};

const Discussions = () => {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState({
    title: '',
    content: '',
    authorName: '',
    authorEmail: '',
    tags: '',
    image: null,
    imagePreview: null
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  // Load discussions on component mount
  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      setError(null);
 
      
      const data = await discussionService.getDiscussions();

      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setTopics(data);
        
      } else {
        console.error('❌ Data is not an array:', data);
        setTopics([]);
        setError('Invalid data format received from server');
      }
    } catch (error) {
      console.error('❌ Error fetching discussions:', error);
      setError('Failed to load discussions: ' + error.message);
      setTopics([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!newTopic.title.trim() || !newTopic.content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setError(null);
      
      // Prepare data to send to backend
      const discussionData = {
        title: newTopic.title,
        content: newTopic.content,
        authorName: newTopic.authorName || 'Anonymous',
        authorEmail: newTopic.authorEmail || '',
        tags: newTopic.tags || ''
      };

      // If image preview exists (base64), add it to data
      if (newTopic.imagePreview) {
        discussionData.image = newTopic.imagePreview;
      }

      console.log('📤 Sending discussion data:', discussionData);
      
      // Send to backend
      const response = await discussionService.createDiscussion(discussionData);
      
      
      // Extract the created discussion from response
      let createdTopic;
      if (response.data) {
        createdTopic = response.data; // If backend returns { data: {...} }
      } else if (response.success && response.data) {
        createdTopic = response.data; // If backend returns { success: true, data: {...} }
      } else {
        createdTopic = response; // If backend returns the discussion directly
      }
      
      // Update local state with new discussion
      setTopics(prevTopics => {
        const newTopics = [createdTopic, ...prevTopics];
        
        return newTopics;
      });
      
      // Reset form
      setNewTopic({ 
        title: '', 
        content: '', 
        authorName: '', 
        authorEmail: '',
        tags: '',
        image: null, 
        imagePreview: null 
      });
      setShowTopicForm(false);
    } catch (error) {
      console.error('❌ Error creating topic:', error);
      setError('Failed to create discussion: ' + error.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (2MB max for base64)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPG, PNG, GIF, and WebP images are allowed');
      return;
    }

    // Convert file to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewTopic({
        ...newTopic,
        image: file,
        imagePreview: reader.result
      });
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setNewTopic({
      ...newTopic,
      image: null,
      imagePreview: null
    });
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      fetchDiscussions();
    } else {
      try {
        setLoading(true);
        const results = await discussionService.searchDiscussions(query);
        
        // Ensure results is an array
        const filteredResults = Array.isArray(results) ? results : [];
        setTopics(filteredResults);
      } catch (error) {
        console.error('Error searching topics:', error);
        setError('Failed to search discussions: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Always ensure filteredTopics is an array
  const filteredTopics = Array.isArray(topics) 
    ? (searchQuery.trim() === '' 
        ? topics 
        : topics.filter(topic => 
            topic && topic.title && topic.content &&
            (topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             topic.content.toLowerCase().includes(searchQuery.toLowerCase()))
          ))
    : [];

  if (loading && topics.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading discussions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Community Discussions</h1>
                <p className="text-gray-600 mt-1">Share ideas, photos, and learn together</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 md:w-64"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowTopicForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden md:inline">New Post</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        

        <div className="grid grid-cols-1 gap-6">
          {/* Posts List & Creation */}
          <div className="space-y-6">
            {/* New Post Form */}
            {showTopicForm && (
              <div className="bg-gray-100 rounded-xl shadow-lg p-6 border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
                  <button
                    onClick={() => {
                      setShowTopicForm(false);
                      setError(null);
                    }}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleCreateTopic} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Post title*"
                      value={newTopic.title}
                      onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your name (optional)"
                      value={newTopic.authorName}
                      onChange={(e) => setNewTopic({...newTopic, authorName: e.target.value})}
                    />
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Email (optional)"
                      value={newTopic.authorEmail}
                      onChange={(e) => setNewTopic({...newTopic, authorEmail: e.target.value})}
                    />
                  </div>

                  <div>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] resize-none"
                      placeholder="What's on your mind?*"
                      value={newTopic.content}
                      onChange={(e) => setNewTopic({...newTopic, content: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tags (comma separated, e.g., react, javascript)"
                      value={newTopic.tags}
                      onChange={(e) => setNewTopic({...newTopic, tags: e.target.value})}
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-3">
                    {newTopic.imagePreview ? (
                      <div className="relative">
                        <img 
                          src={newTopic.imagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                      >
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">Click to upload photo (optional)</p>
                        <p className="text-sm text-gray-400 mt-1">Max 2MB • JPG, PNG, GIF, WebP</p>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      className="hidden"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowTopicForm(false);
                        setError(null);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      disabled={!newTopic.title.trim() || !newTopic.content.trim()}
                    >
                      Post
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Posts List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Posts ({filteredTopics.length})
              </h2>
              
              {filteredTopics.length === 0 ? (
                <div className="text-center py-12 bg-gray-100 rounded-lg border">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {searchQuery.trim() ? 'No discussions found' : 'No discussions yet. Create the first one!'}
                  </p>
                </div>
              ) : (
                filteredTopics.map((topic, index) => {
                  // Add defensive checks for each topic
                  if (!topic) return null;
                  
                  const topicId = topic._id || topic.id || `temp-${index}`;
                  const authorName = topic.author?.name || topic.authorName || 'Anonymous';
                  const createdAt = topic.createdAt ? new Date(topic.createdAt) : new Date();
                  
                  return (
                    <Link
                      key={topicId}
                      to={`/discuss/${topicId}`}
                      className="block"
                    >
                      <div className="bg-blue-50 rounded-lg border transition-all hover:shadow-md cursor-pointer">
                        <div className="p-5">
                          {/* Post Header */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{authorName}</p>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {createdAt.toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Post Content */}
                          <h3 className="font-bold text-gray-900 text-lg mb-3">
                            {topic.title || 'Untitled Discussion'}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {topic.content || 'No content'}
                          </p>

                          {/* Post Image */}
                          {topic.image && (
                            <div className="mb-4">
                              <img 
                                src={topic.image} 
                                alt="Post" 
                                className="w-full h-48 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}

                          
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discussions;