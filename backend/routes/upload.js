const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const router = express.Router();

// Configure Cloudinary
console.log('Configuring Cloudinary...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key exists:', !!process.env.CLOUDINARY_API_KEY);
console.log('API Secret exists:', !!process.env.CLOUDINARY_API_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use memory storage for multer (files not saved to disk)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.pdf'];
    const ext = require('path').extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image and document files are allowed!'));
    }
  }
});

// POST /api/upload
router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    console.log('Received file:', req.file.originalname, 'size:', req.file.size);
    
    // Upload to Cloudinary from buffer
    const result = await Promise.race([
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'peepal-export/products',
            resource_type: 'auto'
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary error:', error);
              reject(error);
            } else {
              console.log('Cloudinary upload success:', result.secure_url);
              resolve(result);
            }
          }
        );

        uploadStream.on('error', (error) => {
          console.error('Upload stream error:', error);
          reject(error);
        });

        uploadStream.end(req.file.buffer);
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout after 30 seconds')), 30000)
      )
    ]);

    // Return the secure URL from Cloudinary
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error.message);
    console.error('Error metadata:', {
      code: error.code,
      http_code: error.http_code,
      message: error.message
    });
    res.status(500).json({ error: 'Failed to upload image to Cloudinary: ' + error.message });
  }
});

module.exports = router;
