from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
from datetime import datetime

# Load environment variables FIRST
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configure file uploads
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max
    app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')
    
    # Create upload directory
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # **FIXED CORS CONFIGURATION WITH CREDENTIALS**
    CORS(app, 
         origins=["http://localhost:3000"],
         supports_credentials=True,  # ✅ FIXED: Use 'supports_credentials' not 'support_credentials'
         allow_headers=[
             "Content-Type", 
             "Authorization", 
             "X-Requested-With",
             "Accept",
             "Origin"
         ],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         max_age=3600)
    
    # **ADDITIONAL CORS HEADERS FOR CREDENTIALS**
    @app.after_request
    def after_request(response):
        origin = request.headers.get('Origin')
        if origin == 'http://localhost:3000':
            response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
            response.headers['Access-Control-Allow-Credentials'] = 'true'  # ✅ FIXED: Must be string 'true'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,X-Requested-With'
            response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        return response
    
    # Register blueprints
    try:
        from routes.file_processing import file_bp
        app.register_blueprint(file_bp, url_prefix='/api/files')
        print("[OK] File processing blueprint registered")
    except ImportError as e:
        print(f"[ERROR] Could not import file_bp: {e}")
        return None
    
    try:
        from routes.chat import chat_bp
        app.register_blueprint(chat_bp, url_prefix='/api')
        print("[OK] Chat blueprint registered")
    except ImportError as e:
        print(f"[ERROR] Could not import chat_bp: {e}")
    
    try:
        from routes.health import health_bp
        app.register_blueprint(health_bp, url_prefix='/api')
        print("[OK] Health blueprint registered")
    except ImportError as e:
        print(f"[WARNING] Could not import health_bp: {e}")
    
    @app.route('/')
    def home():
        return jsonify({
            'message': 'Nexus AI Backend is running!',
            'cors_enabled': True,
            'credentials_supported': True,
            'timestamp': datetime.now().isoformat()
        })
    
    return app

if __name__ == '__main__':
    # Verify API key is loaded
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("[ERROR] GEMINI_API_KEY not found! Check your .env file")
        exit(1)
    
    app = create_app()
    if app is None:
        print("[ERROR] Failed to create app")
        exit(1)
    
    print("\n" + "="*50)
    print("NEXUS AI - CORS FIXED & READY")
    print("="*50)
    print("Server: http://localhost:5000")
    print("Frontend: http://localhost:3000")
    print("CORS Credentials: ENABLED")
    print("="*50 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
