import File from "../models/FilesModel.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// Upload PDF
export const uploadFile = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF file",
            });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "student-test/files",
                resource_type: "raw",
            },
            async (error, result) => {
                try {
                    if (error) {
                        return res.status(500).json({
                            success: false,
                            message: error.message,
                        });
                    }

                    const file = await File.create({
                        title,
                        description,
                        fileName: req.file.originalname,
                        fileUrl: result.secure_url,
                        publicId: result.public_id,
                        fileType: req.file.mimetype,
                        fileSize: req.file.size,
                        uploadedBy: req.user._id,
                    });

                    return res.status(201).json({
                        success: true,
                        message: "File uploaded successfully",
                        file,
                    });
                } catch (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message,
                    });
                }
            }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get All Files
export const getAllFiles = async (req, res) => {
    try {
        const files = await File.find()
            .populate("uploadedBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: files.length,
            files,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Single File
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
            file,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete File
export const deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found",
            });
        }

        await cloudinary.uploader.destroy(file.publicId, {
            resource_type: "raw",
        });

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