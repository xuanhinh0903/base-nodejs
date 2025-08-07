/**
 * @swagger
 * /api/profile/me:
 *   get:
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     summary: Get current user profile
 *     description: Get current user profile
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Profile fetched successfully
 *                   default: Profile fetched successfully
 *                 status:
 *                   type: string
 *                   description: OK
 *                   default: OK
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone_number:
 *                       type: string
 *                     role:
 *                       type: string
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
 */
