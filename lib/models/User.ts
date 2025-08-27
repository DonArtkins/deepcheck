import bcrypt from "bcryptjs";
import clientPromise from "../mongodb";
import { ObjectId } from "mongodb";
import type {
  User as UserType,
  MongoUser,
  CreateUserData,
} from "@/types/types";

export class User {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  role: string;
  password?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;

  constructor(data: MongoUser) {
    this._id = data._id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.organization = data.organization;
    this.role = data.role;
    this.password = data.password;
    this.passwordResetToken = data.passwordResetToken;
    this.passwordResetExpires = data.passwordResetExpires;
    this.isActive = data.isActive ?? true;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
    this.lastLogin = data.lastLogin;
  }

  // Hash password before saving
  async hashPassword(): Promise<void> {
    if (this.password) {
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  // Compare password for login
  async comparePassword(candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Remove password from user object for API responses
  toJSON(): Omit<
    UserType,
    "password" | "passwordResetToken" | "passwordResetExpires"
  > {
    const {
      password,
      passwordResetToken,
      passwordResetExpires,
      ...userObject
    } = this;
    return {
      ...userObject,
      _id: this._id?.toString(),
    } as Omit<
      UserType,
      "password" | "passwordResetToken" | "passwordResetExpires"
    >;
  }
}

export class UserRepository {
  private collectionName = "users"; // Collection name - this creates 'users' collection in 'deepcheck' database

  async getCollection() {
    const client = await clientPromise;
    const db = client.db("deepcheck"); // Database name from your .env
    return db.collection<MongoUser>(this.collectionName);
  }

  // Create new user
  async create(userData: CreateUserData): Promise<User> {
    try {
      const collection = await this.getCollection();

      // Check if user already exists
      const existingUser = await collection.findOne({
        email: userData.email.toLowerCase(),
      });

      if (existingUser) {
        throw new Error("User already exists with this email");
      }

      const user = new User({
        ...userData,
        email: userData.email.toLowerCase(),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await user.hashPassword();

      const result = await collection.insertOne({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        organization: user.organization,
        role: user.role,
        password: user.password,
        passwordResetToken: user.passwordResetToken,
        passwordResetExpires: user.passwordResetExpires,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: user.lastLogin,
      });

      const newUser = await collection.findOne({ _id: result.insertedId });
      if (!newUser) throw new Error("Failed to create user");

      return new User(newUser);
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    try {
      const collection = await this.getCollection();
      const userData = await collection.findOne({
        email: email.toLowerCase(),
        isActive: true,
      });

      if (!userData) return null;
      return new User(userData);
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  async findById(id: string): Promise<User | null> {
    try {
      const collection = await this.getCollection();
      const userData = await collection.findOne({
        _id: new ObjectId(id),
        isActive: true,
      });

      if (!userData) return null;
      return new User(userData);
    } catch (error) {
      throw error;
    }
  }

  // Update user
  async update(id: string, updateData: Partial<MongoUser>): Promise<User> {
    try {
      const collection = await this.getCollection();

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            ...updateData,
            updatedAt: new Date(),
          },
        }
      );

      if (result.matchedCount === 0) {
        throw new Error("User not found");
      }

      const updatedUser = await this.findById(id);
      if (!updatedUser) throw new Error("Failed to update user");

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  // Update last login - Fixed to handle ObjectId properly
  async updateLastLogin(id: string | ObjectId): Promise<User> {
    const idString = typeof id === "string" ? id : id.toString();
    return await this.update(idString, { lastLogin: new Date() });
  }

  // Set password reset token
  async setPasswordResetToken(
    email: string,
    token: string,
    expires: Date
  ): Promise<boolean> {
    try {
      const collection = await this.getCollection();

      const result = await collection.updateOne(
        { email: email.toLowerCase() },
        {
          $set: {
            passwordResetToken: token,
            passwordResetExpires: expires,
            updatedAt: new Date(),
          },
        }
      );

      return result.matchedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  // Find user by reset token
  async findByResetToken(token: string): Promise<User | null> {
    try {
      const collection = await this.getCollection();
      const userData = await collection.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() },
        isActive: true,
      });

      if (!userData) return null;
      return new User(userData);
    } catch (error) {
      throw error;
    }
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      const user = await this.findByResetToken(token);
      if (!user || !user._id) {
        throw new Error("Invalid or expired reset token");
      }

      const hashedPassword = await bcrypt.hash(
        newPassword,
        parseInt(process.env.BCRYPT_SALT_ROUNDS || "12")
      );

      const collection = await this.getCollection();
      await collection.updateOne(
        { _id: user._id },
        {
          $set: {
            password: hashedPassword,
            updatedAt: new Date(),
          },
          $unset: {
            passwordResetToken: "",
            passwordResetExpires: "",
          },
        }
      );

      return true;
    } catch (error) {
      throw error;
    }
  }
}

export const userRepository = new UserRepository();
