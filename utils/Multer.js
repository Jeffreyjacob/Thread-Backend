import multer from "multer";

const storage = multer.memoryStorage();

export const Upload = multer({
    storage,
    limits:{
        fileSize:8 * 1024 * 1024 //8mb
    }
})