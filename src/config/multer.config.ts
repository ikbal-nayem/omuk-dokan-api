import { createDirIfNotExists } from '@src/utils/file.util';
import multer from 'multer';
import path from 'path';

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, createDirIfNotExists(req.mediaDir || process.env.MEDIA_ROOT!));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname?.split('.')[0]}-[${Date.now()}]${path.extname(file.originalname)}`);
  },
});

// File filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
