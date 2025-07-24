import express from 'express';
import {
  getTransaction,
  getTransactionByIdController,
  getTransactionByHashController,
  createTransactionController,
  updateTransactionStatusController,
  deleteTransactionController,
  getTransactionStatsController,
  getTransactionsByWalletController,
} from '../controllers/transaction.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions with optional filtering
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: wallet_address
 *         schema:
 *           type: string
 *         description: Filter by wallet address
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [add_product, delete_product, purchase_product]
 *         description: Filter by transaction type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, failed]
 *         description: Filter by transaction status
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: string
 *         description: Filter by product ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit number of results
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset for pagination
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 count:
 *                   type: integer
 */
router.get('/', getTransaction);

/**
 * @swagger
 * /api/transactions/stats:
 *   get:
 *     summary: Get transaction statistics
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: wallet_address
 *         schema:
 *           type: string
 *         description: Optional wallet address filter
 *     responses:
 *       200:
 *         description: Transaction statistics retrieved successfully
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
 *                     total_transactions:
 *                       type: integer
 *                     confirmed_transactions:
 *                       type: integer
 *                     pending_transactions:
 *                       type: integer
 *                     failed_transactions:
 *                       type: integer
 *                     add_product_count:
 *                       type: integer
 *                     delete_product_count:
 *                       type: integer
 *                     purchase_product_count:
 *                       type: integer
 */
router.get('/stats', getTransactionStatsController);

/**
 * @swagger
 * /api/transactions/wallet/{wallet_address}:
 *   get:
 *     summary: Get transactions by wallet address
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: wallet_address
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet address
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit number of results
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset for pagination
 *     responses:
 *       200:
 *         description: Wallet transactions retrieved successfully
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 count:
 *                   type: integer
 */
router.get('/wallet/:wallet_address', getTransactionsByWalletController);

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tx_hash
 *               - type
 *               - wallet_address
 *             properties:
 *               tx_hash:
 *                 type: string
 *                 description: Ethereum transaction hash (0x + 64 hex characters)
 *               type:
 *                 type: string
 *                 enum: [add_product, delete_product, purchase_product]
 *                 description: Transaction type
 *               wallet_address:
 *                 type: string
 *                 description: Ethereum wallet address (0x + 40 hex characters)
 *               product_id:
 *                 type: string
 *                 description: Optional product ID
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, failed]
 *                 default: confirmed
 *                 description: Transaction status
 *     responses:
 *       201:
 *         description: Transaction created successfully
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
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Validation error
 */
router.post('/', createTransactionController);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction retrieved successfully
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
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 */
router.get('/:id', getTransactionByIdController);

/**
 * @swagger
 * /api/transactions/hash/{txHash}:
 *   get:
 *     summary: Get a transaction by transaction hash
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: txHash
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction hash
 *     responses:
 *       200:
 *         description: Transaction retrieved successfully
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
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 */
router.get('/hash/:txHash', getTransactionByHashController);

/**
 * @swagger
 * /api/transactions/{id}/status:
 *   put:
 *     summary: Update transaction status
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, failed]
 *                 description: New transaction status
 *     responses:
 *       200:
 *         description: Transaction status updated successfully
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
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 */
router.put('/:id/status', updateTransactionStatusController);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction (soft delete)
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Transaction not found
 */
router.delete('/:id', deleteTransactionController);

export default router;
