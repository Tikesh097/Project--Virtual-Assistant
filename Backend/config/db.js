import mongoose from "mongoose"

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB Connected Succesfully ✅")
    } catch (error) {
        console.error(error)
    }
}

export default  connectDb;