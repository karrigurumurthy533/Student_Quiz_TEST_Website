import File from "../models/FilesModel.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const uploadBuffer = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Upload PDF + Thumbnail
export const uploadFile = async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.files?.file || !req.files?.thumbnail) {
      return res.status(400).json({
        success: false,
        message: "PDF and Thumbnail are required",
      });
    }

    const pdfFile = req.files.file[0];
    const thumbnailFile = req.files.thumbnail[0];

    // Upload PDF
    const pdfResult = await uploadBuffer(pdfFile.buffer, {
      folder: "student-test/files",
      resource_type: "raw",
    });

    // Upload Thumbnail
    const thumbnailResult = await uploadBuffer(thumbnailFile.buffer, {
      folder: "student-test/thumbnails",
      resource_type: "image",
    });

    const file = await File.create({
      title,

      fileName: pdfFile.originalname,

      fileUrl: pdfResult.secure_url,
      filePublicId: pdfResult.public_id,

      thumbnailUrl: thumbnailResult.secure_url,
      thumbnailPublicId: thumbnailResult.public_id,

      fileType: pdfFile.mimetype,
      fileSize: pdfFile.size,

      uploadedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Delete PDF
    await cloudinary.uploader.destroy(file.filePublicId, {
      resource_type: "raw",
    });

    // Delete Thumbnail
    await cloudinary.uploader.destroy(file.thumbnailPublicId);

    await file.deleteOne();

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllFiles = async (req, res) => {
  try {
    const files = await File.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: files.length,
      files: files.map((file) => ({
        _id: file._id,
        title: file.title,
        fileName: file.fileName,
        fileUrl: file.fileUrl,
        thumbnailUrl: file.thumbnailUrl,
        fileType: file.fileType,
        fileSize: file.fileSize,
        uploadedBy: file.uploadedBy,
        createdAt: file.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getSingleFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id)
      .populate("uploadedBy", "name email");

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.status(200).json({
      success: true,
      file: {
        _id: file._id,
        title: file.title,
        fileName: file.fileName,
        fileUrl: file.fileUrl,
        thumbnailUrl: file.thumbnailUrl,
        fileType: file.fileType,
        fileSize: file.fileSize,
        uploadedBy: file.uploadedBy,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};