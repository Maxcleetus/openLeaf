import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare,  
  User, 
  Calendar, 
  ArrowLeft,
  Send,
  Paperclip,
  Trash2,
  Loader2
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// API service for discussion details
const discussionDetailService = {
  // Get single discussion by ID
  async getDiscussionById(id) {
    try {
      console.log(`📡 Fetching discussion ${id} from backend...`);
      const response = await fetch(`http://localhost:3000/api/discussions/${id}`);
      
      if (!response.ok) {
        console.error('❌ Response not OK:', response.status, response.statusText);
        throw new Error(`Failed to fetch discussion: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Discussion response:', result);
      
      // Extract data from response format
      if (result.success && result.data) {
        return result.data;
      } else if (result._id || result.id) {
        return result; // If returned directly
      } else {
        console.error('❌ Unexpected response format:', result);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('❌ Error in getDiscussionById:', error);
      throw error;
    }
  },

  // Add comment to discussion
  async addComment(discussionId, commentData) {
    try {
      console.log(`📤 Adding comment to discussion ${discussionId}:`, commentData);
      const response = await fetch(`http://localhost:3000/api/discussions/${discussionId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add comment');
      }
      
      const result = await response.json();
      console.log('✅ Add comment response:', result);
      
      // Return the updated discussion
      if (result.success && result.data) {
        return result.data;
      } else if (result._id || result.id) {
        return result;
      } else {
        return result;
      }
    } catch (error) {
      console.error('❌ Error adding comment:', error);
      throw error;
    }
  },

  // Upvote discussion
  async upvoteDiscussion(discussionId) {
    try {
      console.log(`👍 Upvoting discussion ${discussionId}`);
      const response = await fetch(`http://localhost:3000/api/discussions/${discussionId}/upvote`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upvote discussion');
      }
      
      const result = await response.json();
      console.log('✅ Upvote response:', result);
      
      if (result.success && result.data) {
        return result.data;
      } else if (result._id || result.id) {
        return result;
      } else {
        return result;
      }
    } catch (error) {
      console.error('❌ Error upvoting discussion:', error);
      throw error;
    }
  },

  // Upvote comment
  async upvoteComment(discussionId, commentId) {
    try {
      console.log(`👍 Upvoting comment ${commentId} in discussion ${discussionId}`);
      const response = await fetch(`http://localhost:3000/api/discussions/${discussionId}/comments/${commentId}/upvote`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upvote comment');
      }
      
      const result = await response.json();
      console.log('✅ Upvote comment response:', result);
      
      if (result.success && result.data) {
        return result.data;
      } else if (result._id || result.id) {
        return result;
      } else {
        return result;
      }
    } catch (error) {
      console.error('❌ Error upvoting comment:', error);
      throw error;
    }
  },
};

const DiscussionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState({
    content: '',
    authorName: '',
    authorEmail: '',
    image: null,
    imagePreview: null
  });

  const commentFileInputRef = useRef(null);

  // Load discussion details from API
  useEffect(() => {
    fetchDiscussionDetails();
  }, [id]);

  const fetchDiscussionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🔄 Fetching discussion details for ID: ${id}`);
      
      const discussion = await discussionDetailService.getDiscussionById(id);
      console.log('📥 Discussion loaded:', discussion);
      
      // Process the discussion data
      const processedTopic = {
        ...discussion,
        createdAt: new Date(discussion.createdAt),
        comments: (discussion.comments || []).map(comment => ({
          ...comment,
          createdAt: new Date(comment.createdAt)
        }))
      };
      
      setSelectedTopic(processedTopic);
      console.log('✅ Discussion set in state');
    } catch (error) {
      console.error('❌ Error fetching discussion:', error);
      setError('Failed to load discussion: ' + error.message);
      setSelectedTopic(null);
      
      // Redirect if discussion not found
      if (error.message.includes('404') || error.message.includes('not found')) {
        setTimeout(() => navigate('/discuss'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.content.trim() || !selectedTopic) return;

    try {
      setSubmitting(true);
      setError(null);
      
      // Prepare comment data
      const commentData = {
        content: newComment.content,
        authorName: newComment.authorName || 'Anonymous',
        authorEmail: newComment.authorEmail || '',
        image: newComment.imagePreview || null
      };

      console.log('📤 Sending comment:', commentData);
      
      // Send to backend
      const updatedDiscussion = await discussionDetailService.addComment(
        selectedTopic._id || selectedTopic.id,
        commentData
      );
      
      console.log('✅ Comment added, updated discussion:', updatedDiscussion);
      
      // Update state with the new discussion data
      const processedTopic = {
        ...updatedDiscussion,
        createdAt: new Date(updatedDiscussion.createdAt),
        comments: (updatedDiscussion.comments || []).map(comment => ({
          ...comment,
          createdAt: new Date(comment.createdAt)
        }))
      };
      
      setSelectedTopic(processedTopic);
      
      // Reset form
      setNewComment({ 
        content: '', 
        authorName: '', 
        authorEmail: '',
        image: null, 
        imagePreview: null 
      });
    } catch (error) {
      console.error('❌ Error adding comment:', error);
      setError('Failed to add comment: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async () => {
    if (!selectedTopic) return;

    try {
      setError(null);
      const updatedDiscussion = await discussionDetailService.upvoteDiscussion(
        selectedTopic._id || selectedTopic.id
      );
      
      // Update the upvotes in state
      setSelectedTopic(prev => ({
        ...prev,
        upvotes: updatedDiscussion.upvotes || prev.upvotes + 1
      }));
    } catch (error) {
      console.error('❌ Error upvoting discussion:', error);
      setError('Failed to upvote discussion: ' + error.message);
    }
  };

  const handleCommentVote = async (commentId) => {
    if (!selectedTopic) return;

    try {
      setError(null);
      const updatedDiscussion = await discussionDetailService.upvoteComment(
        selectedTopic._id || selectedTopic.id,
        commentId
      );
      
      // Find and update the specific comment
      setSelectedTopic(prev => {
        const updatedComments = (prev.comments || []).map(comment => {
          if (comment._id === commentId || comment.id === commentId) {
            return {
              ...comment,
              upvotes: (comment.upvotes || 0) + 1
            };
          }
          return comment;
        });
        
        return {
          ...prev,
          comments: updatedComments
        };
      });
    } catch (error) {
      console.error('❌ Error upvoting comment:', error);
      setError('Failed to upvote comment: ' + error.message);
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
      setNewComment({
        ...newComment,
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
    setNewComment({
      ...newComment,
      image: null,
      imagePreview: null
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E9E9E9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading discussion...</p>
        </div>
      </div>
    );
  }

  if (!selectedTopic) {
    return (
      <div className="min-h-screen bg-[#E9E9E9] flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Discussion Not Found</h3>
          <p className="text-gray-500 mb-4">
            {error || "The discussion you're looking for doesn't exist."}
          </p>
          <Link
            to="/discuss"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Discussions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E9E9E9] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/discuss"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Discussions
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Main Discussion */}
        <div className="bg-white rounded-xl shadow-lg p-6 border mb-8">
          {/* Post Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{selectedTopic.author?.name || 'Anonymous'}</p>
              <p className="text-gray-500 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {selectedTopic.createdAt.toLocaleDateString()} at {selectedTopic.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Post Content */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{selectedTopic.title}</h1>
          <p className="text-gray-700 text-lg mb-8 whitespace-pre-line">{selectedTopic.content}</p>

          {/* Post Image */}
          {selectedTopic.image && (
            <div className="mb-8">
              <img 
                src={selectedTopic.image} 
                alt="Post" 
                className="w-full max-h-[500px] object-cover rounded-lg"
              />
            </div>
          )}

          
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border">
          {/* Add Comment */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Your Comment</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name (optional)"
                  value={newComment.authorName}
                  onChange={(e) => setNewComment({...newComment, authorName: e.target.value})}
                  disabled={submitting}
                />
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Email (optional)"
                  value={newComment.authorEmail}
                  onChange={(e) => setNewComment({...newComment, authorEmail: e.target.value})}
                  disabled={submitting}
                />
              </div>

              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-none"
                placeholder="Share your thoughts..."
                value={newComment.content}
                onChange={(e) => setNewComment({...newComment, content: e.target.value})}
                disabled={submitting}
              />
              
              {/* Comment Image Upload */}
              {newComment.imagePreview ? (
                <div className="relative inline-block">
                  <img 
                    src={newComment.imagePreview} 
                    alt="Preview" 
                    className="w-48 h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    disabled={submitting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => commentFileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  <Paperclip className="w-4 h-4" />
                  Attach Photo (optional)
                </button>
              )}
              
              <input
                type="file"
                ref={commentFileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                className="hidden"
                disabled={submitting}
              />

              <div className="flex justify-end">
                <button
                  onClick={handleAddComment}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!newComment.content.trim() || submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Post Comment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Comments ({selectedTopic.comments?.length || 0})
            </h3>
            
            {(!selectedTopic.comments || selectedTopic.comments.length === 0) ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {selectedTopic.comments.map(comment => {
                  const commentId = comment._id || comment.id;
                  const commentDate = comment.createdAt ? new Date(comment.createdAt) : new Date();
                  
                  return (
                    <div key={commentId} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-gray-900">{comment.author?.name || 'Anonymous'}</p>
                              <p className="text-sm text-gray-500">
                                {commentDate.toLocaleDateString()} at {commentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4 whitespace-pre-line">{comment.content}</p>
                      
                      {/* Comment Image */}
                      {comment.image && (
                        <div className="mb-4 ">
                          <img 
                            src={comment.image} 
                            alt="Comment" 
                            className=" h-auto rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetail;