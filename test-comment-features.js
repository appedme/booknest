// Test script to verify comment reply and like functionality
const BASE_URL = 'http://localhost:3001';

async function testCommentFeatures() {
  console.log('🧪 Testing Comment Reply and Like Features...\n');

  try {
    // Test 1: Get comments for a book
    console.log('1. Testing GET comments...');
    const commentsResponse = await fetch(`${BASE_URL}/api/comments?bookId=1`);
    
    if (commentsResponse.ok) {
      const data = await commentsResponse.json();
      console.log('✅ Comments fetched successfully');
      console.log(`   Found ${data.comments?.length || 0} parent comments`);
      
      // Check if comments have like counts and nested replies
      if (data.comments && data.comments.length > 0) {
        const firstComment = data.comments[0];
        console.log(`   First comment has ${firstComment.replies?.length || 0} replies`);
        console.log(`   First comment has ${firstComment.likeCount || 0} likes`);
        console.log(`   Is liked: ${firstComment.isLiked || false}`);
      }
    } else {
      console.log('❌ Failed to fetch comments');
    }

    // Test 2: Create a new comment
    console.log('\n2. Testing POST new comment...');
    const newCommentResponse = await fetch(`${BASE_URL}/api/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookId: 1,
        content: 'Test comment from API test script',
        username: 'Test User'
      }),
    });

    if (newCommentResponse.ok) {
      const newComment = await newCommentResponse.json();
      console.log('✅ New comment created successfully');
      console.log(`   Comment ID: ${newComment.id}`);
      
      // Test 3: Create a reply to the new comment
      console.log('\n3. Testing POST reply...');
      const replyResponse = await fetch(`${BASE_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: 1,
          content: 'Test reply to the comment',
          username: 'Reply User',
          parentCommentId: newComment.id
        }),
      });

      if (replyResponse.ok) {
        const reply = await replyResponse.json();
        console.log('✅ Reply created successfully');
        console.log(`   Reply ID: ${reply.id}`);
        console.log(`   Parent Comment ID: ${reply.parentCommentId}`);
      } else {
        console.log('❌ Failed to create reply');
      }

      // Test 4: Like the comment (anonymous user)
      console.log('\n4. Testing comment like (anonymous)...');
      const likeResponse = await fetch(`${BASE_URL}/api/comment-likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId: newComment.id
        }),
      });

      if (likeResponse.ok) {
        const likeResult = await likeResponse.json();
        console.log('✅ Comment like toggled successfully');
        console.log(`   Liked: ${likeResult.liked}`);
        console.log(`   Message: ${likeResult.message}`);
      } else {
        console.log('❌ Failed to like comment');
      }

      // Test 5: Check like status
      console.log('\n5. Testing GET like status...');
      const likeStatusResponse = await fetch(`${BASE_URL}/api/comment-likes?commentId=${newComment.id}`);
      
      if (likeStatusResponse.ok) {
        const likeStatus = await likeStatusResponse.json();
        console.log('✅ Like status fetched successfully');
        console.log(`   Is liked: ${likeStatus.isLiked}`);
        console.log(`   Like count: ${likeStatus.likeCount}`);
      } else {
        console.log('❌ Failed to fetch like status');
      }
    } else {
      console.log('❌ Failed to create new comment');
    }

    console.log('\n🎉 Comment features test completed!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testCommentFeatures();
