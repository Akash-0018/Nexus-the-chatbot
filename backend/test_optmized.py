import requests
import json
import os
import time

BASE_URL = "http://localhost:5000"

def test_server_health():
    """Test if server is running"""
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        print(f"✅ Server Health: {response.status_code}")
        return response.status_code == 200
    except:
        print("❌ Server not running")
        return False

def test_chat_performance():
    """Test chat with performance metrics"""
    payload = {
        "message": "Explain Python functions in a structured format",
        "session_id": "perf-test-session"
    }
    
    try:
        start_time = time.time()
        response = requests.post(f"{BASE_URL}/api/chat", json=payload, timeout=30)
        end_time = time.time()
        
        data = response.json()
        response_time = end_time - start_time
        
        print(f"✅ Chat Test: {response.status_code}")
        print(f"📊 Response Time: {response_time:.2f}s")
        print(f"📝 Response Length: {len(data.get('response', ''))}")
        print(f"🎯 Copy-friendly Format: {'##' in data.get('response', '')}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Chat Test Failed: {e}")
        return False

def test_file_upload_performance():
    """Test file upload with different file types"""
    # Create test files
    test_files = {
        'test.txt': "This is a test document for Nexus AI.\nIt contains multiple lines.\nFor testing purposes.",
        'test.md': "# Test Document\n\n## Section 1\nContent here\n\n## Section 2\nMore content"
    }
    
    results = []
    
    for filename, content in test_files.items():
        try:
            # Create test file
            with open(filename, 'w') as f:
                f.write(content)
            
            # Upload file
            start_time = time.time()
            with open(filename, 'rb') as f:
                files = {"file": f}
                response = requests.post(f"{BASE_URL}/api/files/upload", files=files)
            end_time = time.time()
            
            data = response.json()
            upload_time = end_time - start_time
            
            print(f"✅ File Upload ({filename}): {response.status_code}")
            print(f"⏱️  Upload Time: {upload_time:.2f}s")
            print(f"📄 Processed: {data.get('success', False)}")
            
            results.append(response.status_code == 200)
            
            # Cleanup
            os.remove(filename)
            
        except Exception as e:
            print(f"❌ File Upload ({filename}) Failed: {e}")
            results.append(False)
    
    return all(results)

def test_system_endpoints():
    """Test all system endpoints"""
    endpoints = [
        ('/api/files/test', 'File System Test'),
        ('/api/chat/test', 'Chat System Test'),
        ('/api/files/supported', 'Supported Formats'),
        ('/api/chat/stats', 'Chat Statistics')
    ]
    
    results = []
    
    for endpoint, name in endpoints:
        try:
            response = requests.get(f"{BASE_URL}{endpoint}", timeout=10)
            print(f"✅ {name}: {response.status_code}")
            results.append(response.status_code == 200)
        except Exception as e:
            print(f"❌ {name} Failed: {e}")
            results.append(False)
    
    return all(results)

def run_optimization_tests():
    """Run complete optimization test suite"""
    print("🧪 NEXUS AI OPTIMIZATION TESTS")
    print("=" * 50)
    
    tests = [
        ("Server Health", test_server_health),
        ("Chat Performance", test_chat_performance),
        ("File Upload Performance", test_file_upload_performance),
        ("System Endpoints", test_system_endpoints)
    ]
    
    results = []
    total_start = time.time()
    
    for test_name, test_func in tests:
        print(f"\n🔍 Testing {test_name}...")
        result = test_func()
        results.append((test_name, result))
    
    total_time = time.time() - total_start
    
    print(f"\n📊 TEST RESULTS:")
    print("=" * 50)
    for test_name, passed in results:
        status = "PASS" if passed else "FAIL"
        emoji = "✅" if passed else "❌"
        print(f"{emoji} {test_name}: {status}")
    
    passed_count = sum(1 for _, passed in results if passed)
    print(f"\n🎯 Results: {passed_count}/{len(results)} tests passed")
    print(f"⏱️  Total Time: {total_time:.2f}s")
    
    if passed_count == len(results):
        print("🚀 All systems optimized and working!")
    else:
        print("⚠️  Some optimizations may need attention")

if __name__ == "__main__":
    run_optimization_tests()
