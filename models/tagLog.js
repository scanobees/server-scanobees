import mongoose from "mongoose";

const tagLogSchema = new mongoose.Schema({
  batch: { 
    type: String, 
    required: true,
  },
  type: { 
    type: String, 
    required: true,
    enum: ['car', 'bike', 'tag', 'keytag', 'businesscard', 'pettag', 'reviewcard']
  },
  
  count: { 
    type: Number, 
    required: true 
  },
  serials: { 
    type: [String], // Array of serial numbers
    required: true 
  },
  verifiedSerials: { 
    type: [String], // Array of verified serial numbers
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model("TagLog", tagLogSchema);
