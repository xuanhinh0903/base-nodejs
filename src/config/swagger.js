import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clothing NFT Shop API',
      version: '1.0.0',
      description: 'API for Clothing NFT Shop with blockchain integration',
      contact: {
        name: 'API Support',
        email: 'support@clothingnftshop.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
            },
            username: {
              type: 'string',
              description: 'Username',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            wallet_address: {
              type: 'string',
              description: 'User wallet address',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'User creation date',
            },
          },
        },
        Me: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
            },
            username: {
              type: 'string',
              description: 'Username',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            wallet_address: {
              type: 'string',
              description: 'User wallet address',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'User creation date',
            },
          },
        },
        Product: {
          type: 'object',
          properties: {
            productId: {
              type: 'string',
              description: 'Product ID',
            },
            name: {
              type: 'string',
              description: 'Product name',
            },
            description: {
              type: 'string',
              description: 'Product description',
            },
            price: {
              type: 'string',
              description: 'Product price in ETH',
            },
            imageUrl: {
              type: 'string',
              description: 'Product image URL',
            },
            category: {
              type: 'string',
              description: 'Product category',
            },
            isAvailable: {
              type: 'boolean',
              description: 'Product availability',
            },
            stock: {
              type: 'string',
              description: 'Available stock',
            },
          },
        },
        NFT: {
          type: 'object',
          properties: {
            tokenId: {
              type: 'string',
              description: 'NFT token ID',
            },
            owner: {
              type: 'string',
              description: 'NFT owner address',
            },
            tokenURI: {
              type: 'string',
              description: 'NFT metadata URI',
            },
            productInfo: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Product name',
                },
                category: {
                  type: 'string',
                  description: 'Product category',
                },
                price: {
                  type: 'string',
                  description: 'Product price',
                },
                size: {
                  type: 'string',
                  description: 'Product size',
                },
                color: {
                  type: 'string',
                  description: 'Product color',
                },
                isAvailable: {
                  type: 'boolean',
                  description: 'Product availability',
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
            error: {
              type: 'string',
              description: 'Detailed error information',
            },
          },
        },
      },
    },
  },
  apis: ['./src/docs/swagger/*.js'],
};

export const specs = swaggerJsdoc(options);
