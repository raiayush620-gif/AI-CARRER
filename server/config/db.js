const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('\n❌ FATAL ERROR: MONGODB_URI is not defined in your .env file!');
            console.error('👉 Please create a .env file in the server folder and add your MongoDB Connection String.\n');
            process.exit(1);
        }
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
