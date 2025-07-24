import express from 'express';
import {
  upload,
  processImageBuffer,
  processMultipleImages,
} from '../middleware/upload.middleware.js';
import UploadController from '../controllers/upload.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Tạo bảng uploads khi khởi động
import UploadModel from '../models/upload.model.js';
UploadModel.createTable().catch(console.error);

// Upload một ảnh
router.post(
  '/single',
  authenticateToken,
  upload.single('image'),
  processImageBuffer,
  UploadController.uploadSingleImage,
);

// Upload nhiều ảnh
router.post(
  '/multiple',
  authenticateToken,
  upload.array('images', 10), // Tối đa 10 ảnh
  processMultipleImages,
  UploadController.uploadMultipleImages,
);

// Lấy ảnh theo ID (public endpoint)
router.get('/image/:imageId', UploadController.getImageById);

// Lấy danh sách ảnh của user (cần đăng nhập)
router.get('/my-images', authenticateToken, UploadController.getUserImages);

// Lấy danh sách ảnh public
router.get('/public', UploadController.getPublicImages);

// Cập nhật thông tin ảnh
router.put('/image/:imageId', authenticateToken, UploadController.updateImage);

// Xóa ảnh
router.delete(
  '/image/:imageId',
  authenticateToken,
  UploadController.deleteImage,
);

// Tìm kiếm ảnh
router.get('/search', UploadController.searchImages);

export default router;
