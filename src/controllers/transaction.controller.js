import {
  getTransactions,
  getTransactionById,
  getTransactionByHash,
  createTransaction,
  updateTransactionStatus,
  deleteTransaction,
  getTransactionStats,
  getTransactionsByWallet,
} from '../services/transaction.service.js';

/**
 * Get all transactions with pagination and filtering (following user model pattern)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getTransaction = async (req, res) => {
  try {
    // Extract query parameters for filtering and pagination
    const options = {
      page: req.query.page ? parseInt(req.query.page) : 1,
      limit: req.query.limit ? parseInt(req.query.limit) : 10,
      wallet_address: req.query.wallet_address || '',
      type: req.query.type || '',
      status: req.query.status || '',
      product_id: req.query.product_id || '',
    };

    const result = await getTransactions(options);

    res.status(200).json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: result.transactions,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error in getTransaction controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve transactions',
      error: error.message,
    });
  }
};

/**
 * Get a single transaction by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getTransactionByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID',
      });
    }

    const transaction = await getTransactionById(parseInt(id));

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction retrieved successfully',
      data: transaction,
    });
  } catch (error) {
    console.error('Error in getTransactionById controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve transaction',
      error: error.message,
    });
  }
};

/**
 * Get a transaction by transaction hash
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getTransactionByHashController = async (req, res) => {
  try {
    const { txHash } = req.params;

    if (!txHash) {
      return res.status(400).json({
        success: false,
        message: 'Transaction hash is required',
      });
    }

    const transaction = await getTransactionByHash(txHash);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction retrieved successfully',
      data: transaction,
    });
  } catch (error) {
    console.error('Error in getTransactionByHash controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve transaction',
      error: error.message,
    });
  }
};

/**
 * Create a new transaction
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createTransactionController = async (req, res) => {
  try {
    const { tx_hash, type, wallet_address, product_id, status } = req.body;

    // Validate required fields
    if (!tx_hash || !type || !wallet_address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: tx_hash, type, wallet_address',
      });
    }

    const transactionData = {
      tx_hash,
      type,
      wallet_address,
      product_id,
      status,
    };

    const transaction = await createTransaction(transactionData);

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction,
    });
  } catch (error) {
    console.error('Error in createTransaction controller:', error);

    // Handle specific validation errors
    if (
      error.message.includes('Invalid transaction type') ||
      error.message.includes('Invalid status') ||
      error.message.includes('Transaction hash already exists')
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
      error: error.message,
    });
  }
};

/**
 * Update transaction status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateTransactionStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID',
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const transaction = await updateTransactionStatus(parseInt(id), status);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction status updated successfully',
      data: transaction,
    });
  } catch (error) {
    console.error('Error in updateTransactionStatus controller:', error);

    if (error.message.includes('Invalid status')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update transaction status',
      error: error.message,
    });
  }
};

/**
 * Delete a transaction (soft delete)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteTransactionController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID',
      });
    }

    const result = await deleteTransaction(parseInt(id));

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteTransaction controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete transaction',
      error: error.message,
    });
  }
};

/**
 * Get transaction statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getTransactionStatsController = async (req, res) => {
  try {
    const { wallet_address } = req.query;

    const stats = await getTransactionStats(wallet_address);

    res.status(200).json({
      success: true,
      message: 'Transaction statistics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    console.error('Error in getTransactionStats controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve transaction statistics',
      error: error.message,
    });
  }
};

/**
 * Get transactions by wallet address with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getTransactionsByWalletController = async (req, res) => {
  try {
    const { wallet_address } = req.params;
    const { page, limit } = req.query;

    if (!wallet_address) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required',
      });
    }

    const options = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    };

    const result = await getTransactionsByWallet(wallet_address, options);

    res.status(200).json({
      success: true,
      message: 'Wallet transactions retrieved successfully',
      data: result.transactions,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error in getTransactionsByWallet controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve wallet transactions',
      error: error.message,
    });
  }
};
