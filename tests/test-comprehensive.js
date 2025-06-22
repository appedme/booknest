#!/usr/bin/env node

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function runTests() {
  console.log('🚀 Starting comprehensive tests...\n');
  
  const tests = [
    {
      name: 'Test API: Get reviews for existing book',
      command: 'curl -X GET "http://localhost:3000/api/reviews?bookId=9" -H "Content-Type: application/json" -s'
    },
    {
      name: 'Test API: Create new review',
      command: `curl -X POST "http://localhost:3000/api/reviews" -H "Content-Type: application/json" -d '{"bookId":"10","rating":4,"title":"Good read","content":"Nice programming concepts","authorName":"Test Reviewer"}' -s`
    },
    {
      name: 'Test API: Get reviews for book with new review',
      command: 'curl -X GET "http://localhost:3000/api/reviews?bookId=10" -H "Content-Type: application/json" -s'
    },
    {
      name: 'Test Search Page Response',
      command: 'curl -X GET "http://localhost:3000/search" -s -o /dev/null -w "%{http_code}"'
    },
    {
      name: 'Test Book Detail Page Response',
      command: 'curl -X GET "http://localhost:3000/books/9" -s -o /dev/null -w "%{http_code}"'
    },
    {
      name: 'Test Main Page Response',
      command: 'curl -X GET "http://localhost:3000" -s -o /dev/null -w "%{http_code}"'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`📋 ${test.name}...`);
      const { stdout, stderr } = await execAsync(test.command);
      
      if (stderr) {
        console.log(`❌ Error: ${stderr}`);
      } else {
        if (test.name.includes('Response')) {
          console.log(`✅ Status: ${stdout.trim()}`);
        } else {
          const result = JSON.parse(stdout);
          console.log(`✅ Success: ${result.message || result.reviews?.length + ' reviews' || 'Data received'}`);
        }
      }
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
    }
    console.log('');
  }
  
  console.log('🎉 Tests completed!');
}

runTests();
