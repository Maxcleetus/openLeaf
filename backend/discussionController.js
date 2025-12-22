// discussionController.js
import Discussion from './models/Discussion.js';

// Helper function to validate base64 image
const validateBase64Image = (base64String) => {
  if (!base64String) return false;
  
  // Check if it's a valid base64 image string
  const base64Regex = /^data:image\/(png|jpg|jpeg|gif|webp);base64,[A-Za-z0-9+/]+=*$/;
  return base64Regex.test(base64String);
};

// Helper to process tags
const processTags = (tagsString) => {
  if (!tagsString) return [];
  
  return tagsString
    .split(',')
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0)
    .slice(0, 10); // Limit to 10 tags
};

// @desc    Create a new discussion
// @route   POST /api/discussions
// @access  Public
export const createDiscussion = async (req, res) => {
  try {
    const { title, content, authorName, authorEmail, tags, image } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and content are required' 
      });
    }

    // Validate image if provided
    if (image && !validateBase64Image(image)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid image format. Please upload a valid JPG, PNG, GIF, or WebP image.' 
      });
    }

    // Create discussion object
    const discussionData = {
      title,
      content,
      author: {
        name: authorName || 'Anonymous',
        email: authorEmail || ''
      },
      tags: processTags(tags)
    };

    // Add image if provided
    if (image) {
      discussionData.image = image;
    }

    // Create and save discussion
    const discussion = new Discussion(discussionData);
    await discussion.save();

    res.status(201).json({
      success: true,
      data: discussion,
      message: 'Discussion created successfully'
    });
  } catch (error) {
    console.error('Error creating discussion:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Get all discussions
// @route   GET /api/discussions
// @access  Public
export const getAllDiscussions = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = req.query.sortBy || '-createdAt';
    const validSortFields = ['createdAt', 'upvotes', 'views'];
    const sortField = sortBy.replace('-', '');
    const sortOrder = sortBy.startsWith('-') ? -1 : 1;
    
    if (!validSortFields.includes(sortField)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sort field'
      });
    }

    const sort = {};
    sort[sortField] = sortOrder;

    // Query building
    let query = Discussion.find().select('-comments');

    // Search functionality
    if (req.query.search) {
      query = query.find({
        $text: { $search: req.query.search }
      });
    }

    // Filter by tags
    if (req.query.tags) {
      const tags = req.query.tags.split(',').map(tag => tag.trim().toLowerCase());
      query = query.find({ tags: { $in: tags } });
    }

    // Execute query with pagination and sorting
    const discussions = await query
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Discussion.countDocuments(query.getFilter());

    res.status(200).json({
      success: true,
      count: discussions.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: discussions
    });
  } catch (error) {
    console.error('Error fetching discussions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single discussion
// @route   GET /api/discussions/:id
// @access  Public
export const getDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Increment views
    discussion.views += 1;
    await discussion.save();

    res.status(200).json({
      success: true,
      data: discussion
    });
  } catch (error) {
    console.error('Error fetching discussion:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid discussion ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add comment to discussion
// @route   POST /api/discussions/:id/comments
// @access  Public
export const addComment = async (req, res) => {
  try {
    const { content, authorName, authorEmail, image } = req.body;
    const { id } = req.params;

    // Validate required fields
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    // Validate image if provided
    if (image && !validateBase64Image(image)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format'
      });
    }

    // Find discussion
    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Create comment object
    const comment = {
      content,
      author: {
        name: authorName || 'Anonymous',
        email: authorEmail || ''
      },
      image: image || null
    };

    // Add comment to discussion
    discussion.comments.push(comment);
    await discussion.save();

    // Get the newly added comment
    const newComment = discussion.comments[discussion.comments.length - 1];

    res.status(201).json({
      success: true,
      data: newComment,
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid discussion ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Upvote a discussion
// @route   POST /api/discussions/:id/upvote
// @access  Public
export const upvoteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    discussion.upvotes += 1;
    await discussion.save();

    res.status(200).json({
      success: true,
      data: { upvotes: discussion.upvotes },
      message: 'Discussion upvoted successfully'
    });
  } catch (error) {
    console.error('Error upvoting discussion:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid discussion ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Upvote a comment
// @route   POST /api/discussions/:discussionId/comments/:commentId/upvote
// @access  Public
export const upvoteComment = async (req, res) => {
  try {
    const { discussionId, commentId } = req.params;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    const comment = discussion.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    comment.upvotes += 1;
    await discussion.save();

    res.status(200).json({
      success: true,
      data: { upvotes: comment.upvotes },
      message: 'Comment upvoted successfully'
    });
  } catch (error) {
    console.error('Error upvoting comment:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Search discussions
// @route   GET /api/discussions/search/:query
// @access  Public
export const searchDiscussions = async (req, res) => {
  try {
    const { query } = req.params;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const discussions = await Discussion.find({
      $text: { $search: query }
    })
    .select('-comments')
    .sort({ score: { $meta: 'textScore' } })
    .limit(20);

    res.status(200).json({
      success: true,
      count: discussions.length,
      data: discussions
    });
  } catch (error) {
    console.error('Error searching discussions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get discussion stats
// @route   GET /api/discussions/stats/summary
// @access  Public
export const getDiscussionStats = async (req, res) => {
  try {
    const totalDiscussions = await Discussion.countDocuments();
    const totalComments = await Discussion.aggregate([
      { $project: { commentsCount: { $size: "$comments" } } },
      { $group: { _id: null, total: { $sum: "$commentsCount" } } }
    ]);
    const totalUpvotes = await Discussion.aggregate([
      { $group: { _id: null, total: { $sum: "$upvotes" } } }
    ]);
    const totalViews = await Discussion.aggregate([
      { $group: { _id: null, total: { $sum: "$views" } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalDiscussions,
        totalComments: totalComments[0]?.total || 0,
        totalUpvotes: totalUpvotes[0]?.total || 0,
        totalViews: totalViews[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update a discussion
// @route   PUT /api/discussions/:id
// @access  Public
export const updateDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags, image } = req.body;
    
    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Validate image if provided
    if (image && !validateBase64Image(image)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid image format' 
      });
    }

    // Update fields
    if (title !== undefined) discussion.title = title;
    if (content !== undefined) discussion.content = content;
    if (image !== undefined) discussion.image = image;
    if (tags !== undefined) {
      discussion.tags = processTags(tags);
    }

    discussion.updatedAt = new Date();
    await discussion.save();

    res.status(200).json({
      success: true,
      data: discussion,
      message: 'Discussion updated successfully'
    });
  } catch (error) {
    console.error('Error updating discussion:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid discussion ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update a comment
// @route   PUT /api/discussions/:discussionId/comments/:commentId
// @access  Public
export const updateDiscussionComment = async (req, res) => {
  try {
    const { discussionId, commentId } = req.params;
    const { content, image } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    const comment = discussion.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Validate image if provided
    if (image && !validateBase64Image(image)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid image format' 
      });
    }

    // Update comment
    comment.content = content;
    if (image !== undefined) comment.image = image;

    await discussion.save();

    res.status(200).json({
      success: true,
      data: comment,
      message: 'Comment updated successfully'
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete a discussion
// @route   DELETE /api/discussions/:id
// @access  Public
export const deleteDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const discussion = await Discussion.findByIdAndDelete(id);
    
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Discussion deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting discussion:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid discussion ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/discussions/:discussionId/comments/:commentId
// @access  Public
export const deleteDiscussionComment = async (req, res) => {
  try {
    const { discussionId, commentId } = req.params;
    
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Check if comment exists
    const commentExists = discussion.comments.id(commentId);
    if (!commentExists) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Remove the comment
    discussion.comments.pull({ _id: commentId });
    await discussion.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};