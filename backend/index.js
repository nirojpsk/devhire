import app from "./app.js";
import connectDB from "./db/connectDB.js";
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is up and running on port ${PORT}`);
    });
});