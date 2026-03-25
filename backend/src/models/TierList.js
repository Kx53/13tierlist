import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true, maxlength: 100 },
  imageUrl: { type: String, maxlength: 2048 },
}, { _id: false });

const tierSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true, maxlength: 20 },
  color: { type: String, required: true, match: /^#[0-9a-fA-F]{6}$/ },
  items: { type: [itemSchema], default: [] },
}, { _id: false });

const tierListSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  editTokenHash: {
    type: String,
    required: true,
  },
  tiers: {
    type: [tierSchema],
    default: [],
  },
  unrankedItems: {
    type: [itemSchema],
    default: [],
  },
}, {
  timestamps: true,
});

const TierList = mongoose.model('TierList', tierListSchema);

export default TierList;
