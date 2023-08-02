// db.js
import mongoose from 'mongoose'

const DB_URI = 'mongodb://127.0.0.1:27017/estrellaData'

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('Connected to MongoDB successfully!')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}

// Optionally, you can export the mongoose object to use it for defining models.
export default mongoose
