import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "File title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    fileName: {
      type: String,
      required: [true, "File name is required"],
      trim: true,
    },

    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
    },

    filePublicId: {
      type: String,
      required: [true, "File Public ID is required"],
    },

    // Thumbnail
    thumbnailUrl: {
      type: String,
      required: [true, "Thumbnail is required"],
    },

    thumbnailPublicId: {
      type: String,
      required: [true, "Thumbnail Public ID is required"],
    },

    fileType: {
      type: String,
      default: "application/pdf",
      enum: ["application/pdf"],
    },

    fileSize: {
      type: Number,
      required: [true, "File size is required"],
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("File", fileSchema);