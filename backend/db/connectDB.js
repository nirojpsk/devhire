import mongoose from 'mongoose';
async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to the DB at", conn.connection.host);

    } catch (err) {
        console.log("Error connecting to the database", err.message);
        process.exit(1);
    }
}

export default connectDB;