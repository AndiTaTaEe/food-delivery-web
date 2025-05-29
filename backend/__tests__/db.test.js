import {describe, it, expect, afterAll, beforeAll} from 'vitest';
import mongoose, { mongo } from 'mongoose';
import {connectDB} from '../config/db.js';
import { connectTestDB, closeTestDB, clearTestDB } from './utils/db-handler';
import dotenv from 'dotenv';

dotenv.config({path: '.env.test'});

beforeAll(() => {
    console.log("Test MongoDB URI:", process.env.MONGO_TEST_URI);
    if(!process.env.MONGO_TEST_URI) {
        process.env.MONGO_TEST_URI = 'mongodb://localhost:27017/food-del-test'; // Fallback for local testing
    }
})


describe('Database Connection', () => {
   afterAll(async () => {
    await mongoose.connection.close();
   });

   it('connects to MongoDB successfully through connectDB function', async () => {
    const originalEnv = process.env.MONGO_URI;
    process.env.MONGO_URI = process.env.MONGO_TEST_URI;// Use the test DB URI

    await connectDB();

    expect(mongoose.connection.readyState).toBe(1);

    await mongoose.connection.close();
    process.env.MONGO_URI = originalEnv;
   });

   it('connects to test DB succesfully through connectTestDB function', async () => {
    await connectTestDB();

    expect(mongoose.connection.readyState).toBe(1);
    expect(mongoose.connection.name).toBe('food-del-test');

    await closeTestDB();

});

    it('handles connection errors', async () => {
        const originalEnv = process.env.MONGO_URI;
        process.env.MONGO_URI = 'mongodb://invalid-host:27017/test';
        
        try {
            await connectDB();
            expect(true).toBe(false);
            
        } catch (error) {
            expect(error).toBeDefined();
        }

        process.env.MONGO_URI = originalEnv;
    })

    it ("can reconnect after disconnection", async () => {
        //1st connection
        await connectTestDB();
        expect(mongoose.connection.readyState).toBe(1);

        //disconnection
        await closeTestDB();
        expect(mongoose.connection.readyState).toBe(0);

        await connectTestDB();
        expect(mongoose.connection.readyState).toBe(1);

        await closeTestDB();
    });

    it('applies correct connection options', async () => {
        await connectTestDB();

        const options = mongoose.connection.getClient().options;
        expect(options.serverSelectionTimeoutMS).toBeGreaterThan(0);

        await closeTestDB();
    })

    it('can clear DB collections', async() => {
        await connectTestDB();

        const testModel = mongoose.model('Test', new mongoose.Schema({ name: String }));
        await testModel.create({ name: 'Test Item' });

        let count = await testModel.countDocuments({});
        expect(count).toBe(1);

        await clearTestDB();

        count = await testModel.countDocuments({});
        expect(count).toBe(0);

        await closeTestDB();
    });


    it('connects withing acceptable time limit', async () => {
        const startTime = Date.now();

        await connectTestDB();
        const endTime = Date.now();
        const connectionTime = endTime - startTime;

        expect(connectionTime).toBeLessThan(5500);

        await closeTestDB();
    });

});
