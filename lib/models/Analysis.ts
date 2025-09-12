import clientPromise from "../mongodb";
import { ObjectId } from "mongodb";

export interface AnalysisResult {
  id?: string;
  _id?: ObjectId;
  userId: string;
  filename: string;
  mediaType: "image" | "video" | "audio";
  mediaUrl: string;
  cloudinaryId: string;
  fileSize: number;
  uploadDate: Date;
  status: "pending" | "processing" | "completed" | "failed";
  isDeepfake?: boolean;
  confidence?: number;
  processingTime?: number;
  detectionMethod?: string;
  anomalies?: Array<{
    type: string;
    severity: "low" | "medium" | "high";
    description: string;
  }>;
  analysis?: {
    faceRegions?: number;
    anomalies?: number;
    neuralNetworkScores?: {
      faceSwapDetection?: number;
      faceReenactmentDetection?: number;
      speechSynthesisDetection?: number;
      overallManipulation?: number;
    };
    frameAnalysis?: Array<{
      frame: number;
      confidence: number;
      anomaly: string;
    }>;
  };
  metadata?: {
    codec?: string;
    framerate?: number;
    bitrate?: string;
    colorSpace?: string;
    duration?: number;
    dimensions?: {
      width: number;
      height: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

// Create a type for data needed to create new analysis (without auto-generated fields)
export type CreateAnalysisData = Omit<
  AnalysisResult,
  "_id" | "id" | "createdAt" | "updatedAt"
>;

export class AnalysisRepository {
  private collectionName = "analyses";

  async getCollection() {
    const client = await clientPromise;
    const db = client.db("deepcheck");
    return db.collection<AnalysisResult>(this.collectionName);
  }

  // Create new analysis record - Fixed parameter type
  async create(analysisData: CreateAnalysisData): Promise<AnalysisResult> {
    try {
      const collection = await this.getCollection();

      const newAnalysis = {
        ...analysisData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(newAnalysis);

      const created = await collection.findOne({ _id: result.insertedId });
      if (!created) throw new Error("Failed to create analysis record");

      return {
        ...created,
        id: created._id?.toString(),
      };
    } catch (error) {
      throw error;
    }
  }

  // Update analysis with AI results
  async updateWithResults(
    id: string,
    results: Partial<AnalysisResult>
  ): Promise<AnalysisResult | null> {
    try {
      const collection = await this.getCollection();

      const updateData = {
        ...results,
        updatedAt: new Date(),
      };

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        throw new Error("Analysis record not found");
      }

      const updated = await collection.findOne({ _id: new ObjectId(id) });
      return updated ? { ...updated, id: updated._id?.toString() } : null;
    } catch (error) {
      throw error;
    }
  }

  // Get analysis by ID
  async findById(id: string): Promise<AnalysisResult | null> {
    try {
      const collection = await this.getCollection();
      const analysis = await collection.findOne({ _id: new ObjectId(id) });

      return analysis ? { ...analysis, id: analysis._id?.toString() } : null;
    } catch (error) {
      throw error;
    }
  }

  // Get analyses by user ID
  async findByUserId(
    userId: string,
    limit = 10,
    skip = 0
  ): Promise<AnalysisResult[]> {
    try {
      const collection = await this.getCollection();
      const analyses = await collection
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .toArray();

      return analyses.map((analysis) => ({
        ...analysis,
        id: analysis._id?.toString(),
      }));
    } catch (error) {
      throw error;
    }
  }

  // Get all analyses with pagination
  async findAll(limit = 10, skip = 0): Promise<AnalysisResult[]> {
    try {
      const collection = await this.getCollection();
      const analyses = await collection
        .find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .toArray();

      return analyses.map((analysis) => ({
        ...analysis,
        id: analysis._id?.toString(),
      }));
    } catch (error) {
      throw error;
    }
  }

  // Delete analysis
  async delete(id: string): Promise<boolean> {
    try {
      const collection = await this.getCollection();
      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }
}

export const analysisRepository = new AnalysisRepository();
