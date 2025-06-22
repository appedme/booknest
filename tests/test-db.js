const { drizzle } = require("drizzle-orm/better-sqlite3");
const Database = require("better-sqlite3");
const path = require("path");

// Simple test of database connection
async function testDB() {
  try {
    console.log('Testing database connection...');
    const dbPath = path.join(process.cwd(), 'local.db');
    console.log('Database path:', dbPath);
    
    const sqlite = new Database(dbPath);
    console.log('SQLite connection successful');
    
    // Test query
    const result = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Tables found:', result.map(r => r.name));
    
    // Check if reviews table exists
    const reviewsTable = sqlite.prepare("SELECT * FROM reviews LIMIT 1").all();
    console.log('Reviews table test successful, row count:', reviewsTable.length);
    
    sqlite.close();
    console.log('Database test completed successfully');
  } catch (error) {
    console.error('Database test failed:', error);
  }
}

testDB();
