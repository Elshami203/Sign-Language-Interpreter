import db from "./connection.js";
import { ObjectId } from "mongodb";

const deafUserCollection = db().collection("deafUsers"); // Ensure `db()` is called after connectDB()

export const createDeafUser = async (userData) => {
  return await deafUserCollection.insertOne(userData);
};

export const getAllDeafUsers = async () => {
  return await deafUserCollection.find().toArray();
};

export const getDeafUserById = async (id) => {
  return await deafUserCollection.findOne({ _id: new ObjectId(id) });
};

export const updateDeafUser = async (id, updateData) => {
  return await deafUserCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
};

export const deleteDeafUser = async (id) => {
  return await deafUserCollection.deleteOne({ _id: new ObjectId(id) });
};

export const getDeafUserByEmail = async (email) => {
  return await deafUserCollection.findOne({ email });
};