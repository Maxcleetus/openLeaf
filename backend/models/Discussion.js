import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: { 
    type: String, 
    required: true,
    trim: true 
  },
  image: { 
    type: String 
  },
  author: {
    name: { 
      type: String, 
      required: true,
      default: "Anonymous"
    },
    email: { 
      type: String,
      lowercase: true,
      trim: true
    }
  },
  upvotes: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const discussionSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 200
  },
  content: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 5000
  },
  image: { 
    type: String 
  },
  author: {
    name: { 
      type: String, 
      required: true,
      default: "Anonymous"
    },
    email: { 
      type: String,
      lowercase: true,
      trim: true
    }
  },
  tags: [{ 
    type: String,
    trim: true,
    lowercase: true
  }],
  comments: [commentSchema],
  upvotes: { 
    type: Number, 
    default: 0 
  },
  views: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Index for search functionality
discussionSchema.index({
  title: 'text',
  content: 'text',
  tags: 'text'
});

// Index for sorting
discussionSchema.index({ createdAt: -1 });
discussionSchema.index({ upvotes: -1 });

const Discussion = mongoose.model('Discussion', discussionSchema);
export default Discussion;