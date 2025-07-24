/**
 * @swagger
 * components:
 *   schemas:
 *     UploadImage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID duy nhất của ảnh
 *         originalName:
 *           type: string
 *           description: Tên file gốc
 *         mimeType:
 *           type: string
 *           description: Loại MIME của ảnh
 *         size:
 *           type: integer
 *           description: Kích thước file (bytes)
 *         description:
 *           type: string
 *           description: Mô tả ảnh
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Danh sách tags
 *         isPublic:
 *           type: boolean
 *           description: Trạng thái public/private
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID của user upload
 *
 *     UploadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/UploadImage'
 *
 *     UploadMultipleResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UploadImage'
 *
 *     PaginationInfo:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         total:
 *           type: integer
 *         totalPages:
 *           type: integer
 *
 *     ImagesListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UploadImage'
 *         pagination:
 *           $ref: '#/components/schemas/PaginationInfo'
 */

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: API quản lý upload ảnh
 */

/**
 * @swagger
 * /api/upload/single:
 *   post:
 *     summary: Upload một ảnh
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh cần upload
 *               description:
 *                 type: string
 *                 description: Mô tả ảnh
 *               tags:
 *                 type: string
 *                 description: Tags phân cách bằng dấu phẩy
 *               isPublic:
 *                 type: boolean
 *                 default: true
 *                 description: Trạng thái public/private
 *     responses:
 *       201:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa đăng nhập
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/upload/multiple:
 *   post:
 *     summary: Upload nhiều ảnh
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Danh sách file ảnh (tối đa 10 file)
 *               description:
 *                 type: string
 *                 description: Mô tả chung cho tất cả ảnh
 *               tags:
 *                 type: string
 *                 description: Tags phân cách bằng dấu phẩy
 *               isPublic:
 *                 type: boolean
 *                 default: true
 *                 description: Trạng thái public/private
 *     responses:
 *       201:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadMultipleResponse'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa đăng nhập
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/upload/image/{imageId}:
 *   get:
 *     summary: Lấy ảnh theo ID
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của ảnh
 *     responses:
 *       200:
 *         description: Trả về ảnh dưới dạng binary
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Không tìm thấy ảnh
 *       403:
 *         description: Không có quyền xem ảnh
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/upload/my-images:
 *   get:
 *     summary: Lấy danh sách ảnh của user
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Số lượng ảnh mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách ảnh của user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImagesListResponse'
 *       401:
 *         description: Chưa đăng nhập
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/upload/public:
 *   get:
 *     summary: Lấy danh sách ảnh public
 *     tags: [Upload]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Số lượng ảnh mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách ảnh public
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImagesListResponse'
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/upload/image/{imageId}:
 *   put:
 *     summary: Cập nhật thông tin ảnh
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của ảnh
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Mô tả ảnh
 *               tags:
 *                 type: string
 *                 description: Tags phân cách bằng dấu phẩy
 *               isPublic:
 *                 type: boolean
 *                 description: Trạng thái public/private
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       404:
 *         description: Không tìm thấy ảnh
 *       403:
 *         description: Không có quyền cập nhật
 *       401:
 *         description: Chưa đăng nhập
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/upload/image/{imageId}:
 *   delete:
 *     summary: Xóa ảnh
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID của ảnh
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     originalName:
 *                       type: string
 *       404:
 *         description: Không tìm thấy ảnh hoặc không có quyền xóa
 *       401:
 *         description: Chưa đăng nhập
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/upload/search:
 *   get:
 *     summary: Tìm kiếm ảnh
 *     tags: [Upload]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Số lượng ảnh mỗi trang
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UploadImage'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationInfo'
 *       400:
 *         description: Thiếu từ khóa tìm kiếm
 *       500:
 *         description: Lỗi server
 */
