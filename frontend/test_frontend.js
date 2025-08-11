// Frontend testing script - run in browser console
const testFrontendSystem = async () => {
  console.log('🧪 NEXUS FRONTEND TESTS');
  console.log('=====================');

  // Test 1: API Service Health
  try {
    await ApiService.checkHealth();
    console.log('✅ API Service Health: PASS');
  } catch (error) {
    console.log('❌ API Service Health: FAIL', error.message);
  }

  // Test 2: Session Creation
  try {
    const session = await ApiService.createNewSession();
    console.log('✅ Session Creation: PASS', session.session_id.substring(0, 8) + '...');
  } catch (error) {
    console.log('❌ Session Creation: FAIL', error.message);
  }

  // Test 3: Chat System
  try {
    const response = await ApiService.sendMessage('Hello Nexus!', 'test-session');
    console.log('✅ Chat System: PASS', response.response ? 'Got response' : 'No response');
  } catch (error) {
    console.log('❌ Chat System: FAIL', error.message);
  }

  // Test 4: File Upload System
  try {
    const testFile = new Blob(['Hello Nexus! This is a test file.'], { type: 'text/plain' });
    testFile.name = 'test.txt';
    const uploadResult = await ApiService.uploadFile(testFile, 'test-session');
    console.log('✅ File Upload: PASS', uploadResult.success ? 'Upload successful' : 'Upload failed');
  } catch (error) {
    console.log('❌ File Upload: FAIL', error.message);
  }

  console.log('\n🎯 Frontend testing complete!');
};

// Run the test
testFrontendSystem();
