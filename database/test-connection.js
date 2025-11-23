// Test database connection
// Run with: node database/test-connection.js

const db = require('./db');

async function test() {
  console.log('Testing database connection...\n');
  
  const connected = await db.testConnection();
  
  if (connected) {
    console.log('\n✅ Connection successful! Testing a query...\n');
    
    try {
      // Test query - get all table names
      const tables = await db.query('SHOW TABLES');
      console.log('📊 Tables in database:');
      const tableNames = tables.map(row => Object.values(row)[0]);
      tableNames.forEach((name, index) => {
        console.log(`   ${index + 1}. ${name}`);
      });
      
      console.log(`\n✅ Found ${tableNames.length} tables. Database is ready to use!`);
    } catch (error) {
      console.error('❌ Query test failed:', error.message);
    }
  }
  
  // Close pool
  process.exit(connected ? 0 : 1);
}

test();

