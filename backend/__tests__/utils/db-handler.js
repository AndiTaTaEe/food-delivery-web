import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export async function connectTestDB() {
    const mongoURI = process.env.MONGO_TEST_URI;

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_TEST_URI);
        console.log('Connected to test DB');
    }
}

export async function closeTestDB() {
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('Test DB connection closed');
    }
}

export async function clearTestDB() {
    if (mongoose.connection.readyState!==0) {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            await collections[key].deleteMany({});
        }

        console.log('Cleared test DB collections');
    }
}