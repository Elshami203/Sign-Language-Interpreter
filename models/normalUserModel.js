import db from "./connection.js";
import { ObjectId } from "mongodb";

const getNormalUserCollection = () => db().collection("normalUsers");

export const createNormalUser = async (userData) => {
  return await getNormalUserCollection().insertOne(userData);
};

export const getAllNormalUsers = async () => {
  return await getNormalUserCollection().find().toArray();
};

export const getNormalUserById = async (id) => {
  return await getNormalUserCollection().findOne({ _id: new ObjectId(id) });
};

export const getNormalUserByEmail = async (email) => {
  return await getNormalUserCollection().findOne({ email });
};

export const updateNormalUser = async (id, updateData) => {
  return await getNormalUserCollection().updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
};

export const deleteNormalUser = async (id) => {
  return await getNormalUserCollection().deleteOne({ _id: new ObjectId(id) });
};
