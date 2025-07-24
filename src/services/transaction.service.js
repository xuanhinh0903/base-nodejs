import transactionModel from '../models/transaction.model.js';

/**
 * Get all transactions with pagination and filtering (following user model pattern)
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Structured response with transactions and pagination
 */
export const getTransactions = async (options = {}) => {
  try {
    const result = await transactionModel.getAllTransactions(options);
    console.log('🚀 ~ getTransactions ~ result:', result);
    return result;
  } catch (error) {
    console.error('Error in getTransactions service:', error);
    throw error;
  }
};

/**
 * Get a single transaction by ID
 * @param {number} id - Transaction ID
 * @returns {Promise<Object|null>} Transaction object or null if not found
 */
export const getTransactionById = async id => {
  try {
    const transaction = await transactionModel.getTransactionById(id);
    console.log('🚀 ~ getTransactionById ~ transaction:', transaction);
    return transaction;
  } catch (error) {
    console.error('Error in getTransactionById service:', error);
    throw error;
  }
};

/**
 * Get a transaction by transaction hash
 * @param {string} txHash - Transaction hash
 * @returns {Promise<Object|null>} Transaction object or null if not found
 */
export const getTransactionByHash = async txHash => {
  try {
    const transaction = await transactionModel.getTransactionByHash(txHash);
    console.log('🚀 ~ getTransactionByHash ~ transaction:', transaction);
    return transaction;
  } catch (error) {
    console.error('Error in getTransactionByHash service:', error);
    throw error;
  }
};

/**
 * Create a new transaction
 * @param {Object} transactionData - Transaction data
 * @returns {Promise<Object>} Created transaction
 */
export const createTransaction = async transactionData => {
  try {
    const transaction =
      await transactionModel.createTransaction(transactionData);
    console.log('🚀 ~ createTransaction ~ transaction:', transaction);
    return transaction;
  } catch (error) {
    console.error('Error in createTransaction service:', error);
    throw error;
  }
};

/**
 * Update transaction status
 * @param {number} id - Transaction ID
 * @param {string} status - New status
 * @returns {Promise<Object|null>} Updated transaction or null if not found
 */
export const updateTransactionStatus = async (id, status) => {
  try {
    const transaction = await transactionModel.updateTransactionStatus(
      id,
      status,
    );
    console.log('🚀 ~ updateTransactionStatus ~ transaction:', transaction);
    return transaction;
  } catch (error) {
    console.error('Error in updateTransactionStatus service:', error);
    throw error;
  }
};

/**
 * Delete a transaction (soft delete)
 * @param {number} id - Transaction ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
export const deleteTransaction = async id => {
  try {
    const result = await transactionModel.deleteTransaction(id);
    console.log('🚀 ~ deleteTransaction ~ result:', result);
    return result;
  } catch (error) {
    console.error('Error in deleteTransaction service:', error);
    throw error;
  }
};

/**
 * Get transaction statistics
 * @param {string} [wallet_address] - Optional wallet address filter
 * @returns {Promise<Object>} Transaction statistics
 */
export const getTransactionStats = async (wallet_address = null) => {
  try {
    const stats = await transactionModel.getTransactionStats(wallet_address);
    console.log('🚀 ~ getTransactionStats ~ stats:', stats);
    return stats;
  } catch (error) {
    console.error('Error in getTransactionStats service:', error);
    throw error;
  }
};

/**
 * Get transactions by wallet address with pagination
 * @param {string} wallet_address - Wallet address
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 10)
 * @returns {Promise<Object>} Structured response with transactions and pagination
 */
export const getTransactionsByWallet = async (wallet_address, options = {}) => {
  try {
    const result = await transactionModel.getTransactionsByWallet(
      wallet_address,
      options,
    );
    console.log('🚀 ~ getTransactionsByWallet ~ result:', result);
    return result;
  } catch (error) {
    console.error('Error in getTransactionsByWallet service:', error);
    throw error;
  }
};
