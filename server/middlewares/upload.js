import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) return cb(null, true);
    else return cb(new Error("Only jpg, png, and webp files are allowed"));
};

export const upload = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB file size limit
    fileFilter,
});
