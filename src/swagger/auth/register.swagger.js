/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register user
 *     description: Register user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *                 default: xuanhinh12@gmail.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 default: 123123123
 *               name:
 *                 type: string
 *                 description: User's name
 *                 default: Xuan Hinh
 *               phone:
 *                 type: string
 *                 description: User's phone
 *                 default: 0909090909
 *     responses:
 *       200:
 *         description: Register successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Register successful
 *                   default: Register successful
 *                 status:
 *                   type: string
 *                   description: Register successful
 *                   default: Register successful
 *                 token:
 *                   type: string
 *                   description: Register successful
 *                   default: Register successful
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Unauthorized
 *                   default: Unauthorized
 *                 status:
 *                   type: string
 *                   description: Unauthorized
 *                   default: Unauthorized
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Internal Server Error
 *                   default: Internal Server Error
 *                 status:
 *                   type: string
 *                   description: Internal Server Error
 *                   default: Internal Server Error
 *
 */
