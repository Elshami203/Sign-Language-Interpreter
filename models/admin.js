import { ObjectId } from 'mongodb';
import getDB from './connection.js';

class Admin {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = 'admin';
    this.createdAt = new Date();
  }

  // Save admin to database
  async save() {
    const db = getDB();
    const result = await db.collection('admins').insertOne(this);
    return result;
  }

  // Find admin by email
  static async findByEmail(email) {
    const db = getDB();
    return db.collection('admins').findOne({ email });
  }

  // Find admin by ID
  static async findById(id) {
    const db = getDB();
    return db.collection('admins').findOne({ _id: new ObjectId(id) });
  }

  // Update admin
  static async updateAdmin(id, updateData) {
    const db = getDB();
    const result = await db.collection('admins').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return result;
  }

  // Delete admin
  static async deleteAdmin(id) {
    const db = getDB();
    const result = await db.collection('admins').deleteOne({ _id: new ObjectId(id) });
    return result;
  }

  // Get all admins
  static async getAllAdmins() {
    const db = getDB();
    return db.collection('admins').find().toArray();
  }
}

export default Admin;