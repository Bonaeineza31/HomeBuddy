import multer from 'multer';
import path from 'path';

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // This should be a directory, not a file
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname );
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed!'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB max size
  fileFilter: fileFilter
});

export default upload;