import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import foodModel from "../../models/foodModel.js";
import {
  connectTestDB,
  closeTestDB,
  clearTestDB,
} from "../utils/db-handler.js";

describe("Food Model tests", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it("creating and saving a food item", async () => {
    const foodItem = new foodModel({
      name: "Pizza",
      description: "delicious italian pizza",
      price: 12.99,
      image: "pizza.png",
      category: "Italian",
    });

    const savedFoodItem = await foodItem.save();

    expect(savedFoodItem._id).toBeDefined();
    expect(savedFoodItem.name).toBe(foodItem.name);
    expect(savedFoodItem.description).toBe(foodItem.description);
    expect(savedFoodItem.price).toBe(foodItem.price);
    expect(savedFoodItem.image).toBe(foodItem.image);
    expect(savedFoodItem.category).toBe(foodItem.category);
  });

  it("failing when required field is missing", async () => {
    const foodItemWithoutName = new foodModel({
      description: "delicious italian pizza",
      price: 12.99,
      image: "pizza.png",
      category: "Italian",
    });

    await expect(foodItemWithoutName.save()).rejects.toThrow();
  });

  it("failing when price is not a number", async () => {
    const foodItemWithInvalidPrice = new foodModel({
      name: "Pizza",
      description: "delicious italian pizza",
      price: "twelve ninety-nine",
      image: "pizza.png",
      category: "Italian",
    });

    await expect(foodItemWithInvalidPrice.save()).rejects.toThrow();
  });

  it("can find a food item by name", async () => {
    const foodItem = new foodModel({
      name: "Pizza",
      description: "delicious italian pizza",
      price: 12.99,
      image: "pizza.png",
      category: "Italian",
    });

    await foodItem.save();

    await new Promise(resolve => setTimeout(resolve,1000));

    const foundFoodItem = await foodModel.findOne({ name: "Pizza" });
    expect(foundFoodItem).not.toBeNull();

    if(foundFoodItem){
      expect(foundFoodItem.name).toBe(foodItem.name);
    } else {
      throw new Error("Food item not found by name");
    }
   
  });

  it("can update a food item", async () => {
    const foodItem = new foodModel({
      name: "Pizza",
      description: "delicious italian pizza",
      price: 12.99,
      image: "pizza.png",
      category: "Italian",
    });

    await foodItem.save();

    const updatedFoodItem = await foodModel.findByIdAndUpdate(
        foodItem._id,
        {   name: 'Pasta',
            price: 14.99
        },
        {new:true}
    );

    expect(updatedFoodItem).toBeDefined();
    expect(updatedFoodItem._id.toString()).toBe(foodItem._id.toString());
    expect(updatedFoodItem.name).toBe("Pasta");
    expect(updatedFoodItem.price).toBe(14.99);
  });

  it("can delete a food item", async() => {
    const foodItem = new foodModel({
        name: "Pizza",
        description: "delicious italian pizza",
        price: 12.99,
        image: "pizza.png",
        category: "Italian",
      });

    const savedFoodItem = await foodItem.save();

    await foodModel.findByIdAndDelete(savedFoodItem._id);

    const deletedItem = await foodModel.findById(savedFoodItem._id);
    expect(deletedItem).toBeNull();

  });

  it("rejects if something is missing from the food item", async () => {
    const foodItem = new foodModel({
      name: "Pizza",
      description: "delicious italian pizza",
      price: 12.99,
      image: "pizza.png",
    });

    await expect(foodItem.save()).rejects.toThrow(/category.*required/);
  });

  it("fails when price has negative value", async() => {
    const foodItem = new foodModel({
        name: "Pizza",
        description: "delicious italian pizza",
        price: -12.99,
        image: "pizza.png",
        category: "Italian",
      });

    await expect(foodItem.save()).rejects.toThrow(/price.*positive/);
  })


});
