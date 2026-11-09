
import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const fileFilter: multer.Options["fileFilter"] = (
    _req,
    file,
    callback
) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(
            new Error(
                "Invalid image format. Only JPG, PNG, and WEBP images are allowed."
            )
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
    },
});

export default upload;
