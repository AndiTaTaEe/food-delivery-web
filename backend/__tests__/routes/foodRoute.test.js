import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import foodModel from "../../models/foodModel.js";
import app from "../../server.js";
import { connectTestDB, closeTestDB, clearTestDB } from "../utils/db-handler";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Food API endpoints", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  //GET /api/food/list tests
  describe("GET /api/food/list", () => {
    it("returns empty array when no food items exist", async () => {
      const response = await request(app).get("/api/food/list");

      expect(response.status).toBe(200);
      expect(response.body.succes).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
      expect(response.body.data).toEqual([]);
    });

    it("returns correct list of food items when they exist", async () => {
      const testImagePath = path.join(
        __dirname,
        "..",
        "test-files",
        "test-image.png"
      );

      if (!fs.existsSync(testImagePath)) {
        console.error(`Test image not found at the mentioned path: ${testImagePath}`);
        fs.mkdirSync(path.join(__dirname, "..", "test-files"), {
          recursive: true,
        });
        const fallbackImagePath = path.join(
          __dirname,
          "..",
          "test-files",
          "test-image.png"
        );
        fs.writeFileSync(
          fallbackImagePath,
          Buffer.from(
            "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q==",
            "base64"
          )
        );
      }

      await request(app)
        .post("/api/food/add")
        .field("name", "Pizza")
        .field("description", "Delicious Italian pizza")
        .field("price", 12.99)
        .field("category", "Italian")
        .attach("image", testImagePath);

      await request(app)
        .post("/api/food/add")
        .field("name", "Burger")
        .field("description", "Juicy beef burger")
        .field("price", 8.99)
        .field("category", "Fast Food")
        .attach("image", testImagePath);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await request(app).get("/api/food/list");

      expect(response.status).toBe(200);
      expect(response.body.succes).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
      const names = response.body.data.map((item) => item.name);
      expect(names).toContain("Pizza");
      expect(names).toContain("Burger");
    });

    it("verifies if the response has the expected format", async () => {
      const testImagePath = path.join(
        __dirname,
        "..",
        "test-files",
        "test-image.png"
      );
      await request(app)
        .post("/api/food/add")
        .field("name", "Pizza")
        .field("description", "Delicious Italian pizza")
        .field("price", 12.99)
        .field("category", "Italian")
        .attach("image", testImagePath);

      const response = await request(app).get("/api/food/list");

      expect(response.status).toBe(200);
      expect(response.body.succes).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0]).toHaveProperty("_id");
      expect(response.body.data[0]).toHaveProperty("name");
      expect(response.body.data[0]).toHaveProperty("description");
      expect(response.body.data[0]).toHaveProperty("price");
      expect(response.body.data[0]).toHaveProperty("category");
      expect(response.body.data[0]).toHaveProperty("image");
    });
  });

  describe("POST /api/food/add", () => {
    it("creates new item with all fields", async () => {
      const testImagePath = path.join(
        __dirname,
        "..",
        "test-files",
        "test-image.png"
      );

      if (!fs.existsSync(testImagePath)) {
        console.error(`Test image not found at the mentioned path: ${testImagePath}`);
        fs.mkdirSync(path.join(__dirname, "..", "test-files"), {
          recursive: true,
        });
        const fallbackImagePath = path.join(
          __dirname,
          "..",
          "test-files",
          "test-image.png"
        );
        fs.writeFileSync(
          fallbackImagePath,
          Buffer.from(
            "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q==",
            "base64"
          )
        );
      }
      await request(app)
        .post("/api/food/add")
        .field("name", "Pizza")
        .field("description", "Delicious Italian pizza")
        .field("price", 12.99)
        .field("category", "Italian")
        .attach("image", testImagePath);

      const foodItems = await foodModel.find({});
      expect(foodItems.length).toBe(1);
      expect(foodItems[0].name).toBe("Pizza");
      expect(foodItems[0].description).toBe("Delicious Italian pizza");
      expect(foodItems[0].price).toBe(12.99);
      expect(foodItems[0].category).toBe("Italian");
    });

    it("fails when required fields are missing", async () => {
      const testImagePath = path.join(
        __dirname,
        "..",
        "test-files",
        "test-image.png"
      );

      if (!fs.existsSync(testImagePath)) {
        console.error("Test image not found at the mentioned path");
        fs.mkdirSync(path.join(__dirname, "..", "test-files"), {
          recursive: true,
        });
        const fallbackImagePath = path.join(
          __dirname,
          "..",
          "test-files",
          "test-image.png"
        );
        fs.writeFileSync(
          fallbackImagePath,
          Buffer.from(
            "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q==",
            "base64"
          )
        );
      }
      const response = await request(app)
        .post("/api/food/add")
        .field("description", "Delicious Italian pizza")
        .field("price", 12.99)
        .field("category", "Italian")
        .attach("image", testImagePath);

        expect(response.status).toBe(200);
        expect(response.body.succes).toBe(false);
        expect(response.body.message).toBe("Error");

    });

  });
  describe("POST /api/food/remove", () => {
    it("removes existing item", async () => {
      const testImagePath = path.join(
        __dirname,
        "..",
        "test-files",
        "test-image.png"
      );

      if (!fs.existsSync(testImagePath)) {
        console.error("Test image not found at the mentioned path");
        fs.mkdirSync(path.join(__dirname, "..", "test-files"), {
          recursive: true,
        });
        const fallbackImagePath = path.join(
          __dirname,
          "..",
          "test-files",
          "test-image.png"
        );
        fs.writeFileSync(
          fallbackImagePath,
          Buffer.from(
            "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q==",
            "base64"
          )
        );
      }
      await request(app)
        .post("/api/food/add")
        .field("name", "Pizza")
        .field("description", "Delicious Italian pizza")
        .field("price", 12.99)
        .field("category", "Italian")
        .attach("image", testImagePath);

     const foodItem = await foodModel.findOne({name: "Pizza"});
     expect(foodItem).not.toBeNull();

     const foodItemID = foodItem._id;
     const removeResponse = await request(app).post("/api/food/remove").send({
        id: foodItemID,
      });

      expect(removeResponse.status).toBe(200);
      expect(removeResponse.body.succes).toBe(true);
     

      const deletedFoodItem = await foodModel.findById(foodItemID);
      expect(deletedFoodItem).toBeNull();
    });
    it("fails when an item doesnt exist", async () => {
      const testImagePath = path.join(
        __dirname,
        "..",
        "test-files",
        "test-image.png"
      );

      if (!fs.existsSync(testImagePath)) {
        console.error("Test image not found at the mentioned path");
        fs.mkdirSync(path.join(__dirname, "..", "test-files"), {
          recursive: true,
        });
        const fallbackImagePath = path.join(
          __dirname,
          "..",
          "test-files",
          "test-image.png"
        );
        fs.writeFileSync(
          fallbackImagePath,
          Buffer.from(
            "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q==",
            "base64"
          )
        );
      }
      await request(app)
        .post("/api/food/add")
        .field("name", "Pizza")
        .field("description", "Delicious Italian pizza")
        .field("price", 12.99)
        .field("category", "Italian")
        .attach("image", testImagePath);

      const foodItem = await foodModel.findOne({name: "Pizza"});
      expect(foodItem).not.toBeNull();

       const foodItemID = foodItem._id.toString();
       const removeResponse = await request(app).post("/api/food/remove").send({
          id: foodItemID + "123",
        });

      expect(removeResponse.status).toBe(200);
      expect(removeResponse.body.succes).toBe(false);
      expect(removeResponse.body.message).toBe("Error")
    })
    
    it("returns appropriate error for invalid IDs", async () => {
      const invalidID = "507f1f77bcf86cd799439011"; // Properly formatted but non-existent ObjectId

      const response = await request(app)
        .post("/api/food/remove").send({id: invalidID});

      expect(response.status).toBe(200);
      expect(response.body.succes).toBe(false);
    })

  });

  })

  
  
