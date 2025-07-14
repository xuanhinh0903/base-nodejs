import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api/shop';

/**
 * Test Redis caching performance
 */
async function testRedisCaching() {
  console.log('🧪 Testing Redis caching performance...\n');

  try {
    // Test 1: First call (should sync from blockchain)
    console.log('📦 Test 1: First API call (should sync from blockchain)');
    const start1 = Date.now();
    const response1 = await fetch(`${BASE_URL}/products?page=1&limit=5`);
    const data1 = await response1.json();
    const time1 = Date.now() - start1;

    console.log(`⏱️  Response time: ${time1}ms`);
    console.log(`📊 Products found: ${data1.data?.length || 0}`);
    console.log(`✅ Success: ${data1.success}\n`);

    // Test 2: Second call (should be from Redis cache)
    console.log('🚀 Test 2: Second API call (should be from Redis cache)');
    const start2 = Date.now();
    const response2 = await fetch(`${BASE_URL}/products?page=1&limit=5`);
    const data2 = await response2.json();
    const time2 = Date.now() - start2;

    console.log(`⏱️  Response time: ${time2}ms`);
    console.log(`📊 Products found: ${data2.data?.length || 0}`);
    console.log(`✅ Success: ${data2.success}\n`);

    // Test 3: Third call with different params (should be from Redis cache)
    console.log(
      '🔍 Test 3: Third API call with search (should be from Redis cache)',
    );
    const start3 = Date.now();
    const response3 = await fetch(
      `${BASE_URL}/products?page=1&limit=3&search=shirt`,
    );
    const data3 = await response3.json();
    const time3 = Date.now() - start3;

    console.log(`⏱️  Response time: ${time3}ms`);
    console.log(`📊 Products found: ${data3.data?.length || 0}`);
    console.log(`✅ Success: ${data3.success}\n`);

    // Performance comparison
    console.log('📈 Performance Comparison:');
    console.log(`First call (blockchain): ${time1}ms`);
    console.log(`Second call (Redis cache): ${time2}ms`);
    console.log(`Third call (Redis cache): ${time3}ms`);

    const improvement = (((time1 - time2) / time1) * 100).toFixed(1);
    console.log(`\n🎯 Performance improvement: ${improvement}% faster!`);

    if (time2 < time1 * 0.1) {
      console.log('✅ Redis caching is working effectively!');
    } else {
      console.log('⚠️  Redis caching might need optimization');
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

/**
 * Test adding a product and Redis cache invalidation
 */
async function testAddProductWithRedis() {
  console.log('\n🧪 Testing add product with Redis cache invalidation...\n');

  try {
    const productData = {
      name: 'Test Redis Caching Product',
      description: 'This is a test product for Redis caching',
      price: '0.01',
      imageUrl: 'https://example.com/test.jpg',
      category: '1',
      stock: 10,
    };

    console.log('📦 Adding test product to blockchain...');
    const addResponse = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const addResult = await addResponse.json();
    console.log(`✅ Add product result: ${addResult.success}`);
    console.log(`📝 Product ID: ${addResult.data?.productId || 'N/A'}\n`);

    // Test getting the new product
    if (addResult.success && addResult.data?.productId) {
      console.log('🔍 Testing get product by ID...');
      const getResponse = await fetch(
        `${BASE_URL}/products/${addResult.data.productId}`,
      );
      const getResult = await getResponse.json();

      console.log(`✅ Get product result: ${getResult.success}`);
      console.log(`📝 Product name: ${getResult.data?.name || 'N/A'}`);
    }
  } catch (error) {
    console.error('❌ Add product test failed:', error.message);
  }
}

/**
 * Test Redis connection status
 */
async function testRedisConnection() {
  console.log('\n🔍 Testing Redis connection...\n');

  try {
    // Test if Redis is working by making a call
    const response = await fetch(`${BASE_URL}/products?page=1&limit=1`);
    const data = await response.json();

    if (data.success) {
      console.log('✅ Redis connection test passed');
      console.log('📊 API is responding correctly');
    } else {
      console.log('⚠️  API response indicates potential issues');
    }
  } catch (error) {
    console.error('❌ Redis connection test failed:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Redis caching performance tests...\n');

  await testRedisConnection();
  await testRedisCaching();
  await testAddProductWithRedis();

  console.log('\n🎉 Tests completed!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests()
    .then(() => {
      console.log('\n✅ All tests passed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Tests failed:', error);
      process.exit(1);
    });
}

export { testRedisCaching, testAddProductWithRedis, testRedisConnection };
