import { ObjectId } from 'mongodb';
import getDB from './connection.js';

class Translation {
  constructor(type, input, output) {
    this.type = type; // 'audio' or 'gesture'
    this.input = input;
    this.output = output;
    this.timestamp = new Date();
    this.status = "completed";
  }

  // Save translation to database
  async save() {
    const db = getDB();
    const result = await db.collection('translations').insertOne(this);
    return result;
  }

  // Find translation by ID
  static async findById(id) {
    const db = getDB();
    return db.collection('translations').findOne({ _id: new ObjectId(id) });
  }

  // Get all translations
  static async getAllTranslations() {
    const db = getDB();
    return db.collection('translations').find().toArray();
  }

  // Get translations by type
  static async getTranslationsByType(type) {
    const db = getDB();
    return db.collection('translations').find({ type }).toArray();
  }

  // Get translations by user ID 
  static async getTranslationsByUserId(userId) {
    const db = getDB();
    return db.collection('translations').find({ userId: new ObjectId(userId) }).toArray();
  }

  // Update translation
  static async updateTranslation(id, updateData) {
    const db = getDB();
    const result = await db.collection('translations').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return result;
  }

  // Delete translation
  static async deleteTranslation(id) {
    const db = getDB();
    const result = await db.collection('translations').deleteOne({ _id: new ObjectId(id) });
    return result;
  }

  // Convert to JSON format
  toJSON() {
    return {
      id: this._id,
      type: this.type,
      input: this.input,
      output: this.output,
      timestamp: this.timestamp,
      status: this.status,
    };
  }
}

export default Translation;

