import mongoose from 'mongoose'

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.models.Job || mongoose.model('Job', JobSchema)