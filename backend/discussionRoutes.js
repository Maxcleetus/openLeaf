import express from 'express';
import {
  createDiscussion,
  getAllDiscussions,
  getDiscussion,
  addComment,
  upvoteDiscussion,
  upvoteComment,
  searchDiscussions,
  getDiscussionStats,
  deleteDiscussionComment,
  deleteDiscussion,
  updateDiscussion,
  updateDiscussionComment
} from './discussionController.js';

const router = express.Router();

// Public routes
router.post('/', createDiscussion);
router.get('/', getAllDiscussions);
router.get('/search/:query', searchDiscussions);
router.get('/stats/summary', getDiscussionStats);
router.get('/:id', getDiscussion);
router.post('/:id/comments', addComment);
router.post('/:id/upvote', upvoteDiscussion);
router.post('/:discussionId/comments/:commentId/upvote', upvoteComment);

// Update routes
router.put('/:id', updateDiscussion);
router.put('/:discussionId/comments/:commentId', updateDiscussionComment);

// Delete routes
router.delete('/:id', deleteDiscussion);
router.delete('/:discussionId/comments/:commentId', deleteDiscussionComment);

export default router;