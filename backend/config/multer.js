import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // PDF
  if (file.fieldname === "file") {
    if (file.mimetype === "application/pdf") {
      return cb(null, true);
    }
    return cb(new Error("Only PDF files are allowed"), false);
  }

  // Thumbnail Image
  if (file.fieldname === "thumbnail") {
    const allowedImages = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (allowedImages.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error("Only JPG, JPEG, PNG and WEBP images are allowed"),
      false
    );
  }

  cb(new Error("Invalid file field"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB each file
  },
});

export default upload;