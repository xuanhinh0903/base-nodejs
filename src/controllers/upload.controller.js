import UploadModel from '../models/upload.model.js';

// Controller xử lý upload ảnh
class UploadController {
  // Upload một ảnh
  static async uploadSingleImage(req, res) {
    try {
      const { processedImage } = req;
      const { description, tags, isPublic = true } = req.body;
      const userId = req.user?.id; // Lấy từ middleware auth

      // Chuẩn bị dữ liệu để lưu
      const imageData = {
        id: processedImage.id,
        originalName: processedImage.originalName,
        mimeType: processedImage.mimeType,
        size: processedImage.size,
        buffer: processedImage.buffer,
        userId,
        description: description || '',
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        isPublic: isPublic === 'true' || isPublic === true,
      };

      // Lưu vào database
      const savedImage = await UploadModel.saveImage(imageData);

      // Trả về thông tin ảnh (không bao gồm buffer)
      const responseData = {
        id: savedImage.id,
        originalName: savedImage.original_name,
        mimeType: savedImage.mime_type,
        size: savedImage.size,
        description: savedImage.description,
        tags: savedImage.tags,
        isPublic: savedImage.is_public,
        createdAt: savedImage.created_at,
        userId: savedImage.user_id,
      };

      res.status(201).json({
        success: true,
        message: 'Upload ảnh thành công!',
        data: responseData,
      });
    } catch (error) {
      console.error('❌ Lỗi upload ảnh:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi upload ảnh',
        error: error.message,
      });
    }
  }

  // Upload nhiều ảnh
  static async uploadMultipleImages(req, res) {
    try {
      const { processedImages } = req;
      const { description, tags, isPublic = true } = req.body;
      const userId = req.user?.id;

      const savedImages = [];

      for (const processedImage of processedImages) {
        const imageData = {
          id: processedImage.id,
          originalName: processedImage.originalName,
          mimeType: processedImage.mimeType,
          size: processedImage.size,
          buffer: processedImage.buffer,
          userId,
          description: description || '',
          tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
          isPublic: isPublic === 'true' || isPublic === true,
        };

        const savedImage = await UploadModel.saveImage(imageData);
        savedImages.push({
          id: savedImage.id,
          originalName: savedImage.original_name,
          mimeType: savedImage.mime_type,
          size: savedImage.size,
          description: savedImage.description,
          tags: savedImage.tags,
          isPublic: savedImage.is_public,
          createdAt: savedImage.created_at,
          userId: savedImage.user_id,
        });
      }

      res.status(201).json({
        success: true,
        message: `Upload thành công ${savedImages.length} ảnh!`,
        data: savedImages,
      });
    } catch (error) {
      console.error('❌ Lỗi upload nhiều ảnh:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi upload nhiều ảnh',
        error: error.message,
      });
    }
  }

  // Lấy ảnh theo ID
  static async getImageById(req, res) {
    try {
      const { imageId } = req.params;

      const image = await UploadModel.getImageById(imageId);

      if (!image) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy ảnh',
        });
      }

      // Kiểm tra quyền xem ảnh
      if (!image.is_public && image.user_id !== req.user?.id) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền xem ảnh này',
        });
      }

      // Trả về ảnh dưới dạng buffer
      res.set('Content-Type', image.mime_type);
      res.set(
        'Content-Disposition',
        `inline; filename="${image.original_name}"`,
      );
      res.send(image.buffer_data);
    } catch (error) {
      console.error('❌ Lỗi lấy ảnh:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy ảnh',
        error: error.message,
      });
    }
  }

  // Lấy danh sách ảnh của user
  static async getUserImages(req, res) {
    try {
      const userId = req.user?.id;
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const images = await UploadModel.getImagesByUserId(userId, limit, offset);
      const total = await UploadModel.countImagesByUserId(userId);

      res.json({
        success: true,
        data: images,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('❌ Lỗi lấy ảnh của user:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy ảnh của user',
        error: error.message,
      });
    }
  }

  // Lấy danh sách ảnh public
  static async getPublicImages(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const images = await UploadModel.getPublicImages(limit, offset);

      res.json({
        success: true,
        data: images,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      console.error('❌ Lỗi lấy ảnh public:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy ảnh public',
        error: error.message,
      });
    }
  }

  // Cập nhật thông tin ảnh
  static async updateImage(req, res) {
    try {
      const { imageId } = req.params;
      const { description, tags, isPublic } = req.body;
      const userId = req.user?.id;

      // Kiểm tra ảnh tồn tại và thuộc về user
      const existingImage = await UploadModel.getImageById(imageId);
      if (!existingImage) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy ảnh',
        });
      }

      if (existingImage.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền cập nhật ảnh này',
        });
      }

      const updateData = {
        description: description || existingImage.description,
        tags: tags
          ? tags.split(',').map(tag => tag.trim())
          : existingImage.tags,
        isPublic:
          isPublic !== undefined
            ? isPublic === 'true' || isPublic === true
            : existingImage.is_public,
      };

      const updatedImage = await UploadModel.updateImage(imageId, updateData);

      res.json({
        success: true,
        message: 'Cập nhật ảnh thành công!',
        data: {
          id: updatedImage.id,
          originalName: updatedImage.original_name,
          mimeType: updatedImage.mime_type,
          size: updatedImage.size,
          description: updatedImage.description,
          tags: updatedImage.tags,
          isPublic: updatedImage.is_public,
          updatedAt: updatedImage.updated_at,
        },
      });
    } catch (error) {
      console.error('❌ Lỗi cập nhật ảnh:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi cập nhật ảnh',
        error: error.message,
      });
    }
  }

  // Xóa ảnh
  static async deleteImage(req, res) {
    try {
      const { imageId } = req.params;
      const userId = req.user?.id;

      const deletedImage = await UploadModel.deleteImage(imageId, userId);

      if (!deletedImage) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy ảnh hoặc không có quyền xóa',
        });
      }

      res.json({
        success: true,
        message: 'Xóa ảnh thành công!',
        data: {
          id: deletedImage.id,
          originalName: deletedImage.original_name,
        },
      });
    } catch (error) {
      console.error('❌ Lỗi xóa ảnh:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi xóa ảnh',
        error: error.message,
      });
    }
  }

  // Tìm kiếm ảnh
  static async searchImages(req, res) {
    try {
      const { q, page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập từ khóa tìm kiếm',
        });
      }

      const images = await UploadModel.searchImages(q, limit, offset);

      res.json({
        success: true,
        data: images,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          searchTerm: q,
        },
      });
    } catch (error) {
      console.error('❌ Lỗi tìm kiếm ảnh:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi tìm kiếm ảnh',
        error: error.message,
      });
    }
  }
}

export default UploadController;
