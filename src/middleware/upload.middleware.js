import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

// Cấu hình multer để xử lý buffer thay vì lưu file
const storage = multer.memoryStorage();

// Filter để chỉ chấp nhận ảnh
const fileFilter = (req, file, cb) => {
  // Kiểm tra MIME type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh!'), false);
  }
};

// Cấu hình multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
});

// Middleware xử lý ảnh với buffer
const processImageBuffer = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file ảnh được upload',
      });
    }

    const { buffer, originalname, mimetype } = req.file;

    // Validate buffer
    if (!buffer || buffer.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'File ảnh không hợp lệ',
      });
    }

    // Xử lý ảnh với sharp
    const processedImage = await sharp(buffer)
      .resize(800, 800, {
        fit: 'inside', // Giữ tỷ lệ khung hình
        withoutEnlargement: true, // Không phóng to nếu ảnh nhỏ hơn
      })
      .jpeg({ quality: 80 }) // Chuyển về JPEG với chất lượng 80%
      .toBuffer();

    // Tạo thông tin file
    const fileInfo = {
      id: uuidv4(),
      originalName: originalname,
      mimeType: mimetype,
      size: processedImage.length,
      buffer: processedImage,
      uploadedAt: new Date(),
    };

    // Lưu thông tin vào request để controller sử dụng
    req.processedImage = fileInfo;

    next();
  } catch (error) {
    console.error('Lỗi xử lý ảnh:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi xử lý ảnh',
      error: error.message,
    });
  }
};

// Middleware xử lý nhiều ảnh
const processMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có file ảnh được upload',
      });
    }

    const processedImages = [];

    for (const file of req.files) {
      const { buffer, originalname, mimetype } = file;

      if (!buffer || buffer.length === 0) {
        continue; // Bỏ qua file không hợp lệ
      }

      // Xử lý ảnh với sharp
      const processedImage = await sharp(buffer)
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      const fileInfo = {
        id: uuidv4(),
        originalName: originalname,
        mimeType: mimetype,
        size: processedImage.length,
        buffer: processedImage,
        uploadedAt: new Date(),
      };

      processedImages.push(fileInfo);
    }

    // Lưu thông tin vào request
    req.processedImages = processedImages;

    next();
  } catch (error) {
    console.error('Lỗi xử lý nhiều ảnh:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi xử lý ảnh',
      error: error.message,
    });
  }
};

export { upload, processImageBuffer, processMultipleImages };
