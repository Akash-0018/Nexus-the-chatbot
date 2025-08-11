from flask import Blueprint, jsonify
from datetime import datetime

health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'StudyBuddy AI Backend',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@health_bp.route('/status', methods=['GET'])
def status():
    return jsonify({
        'api_status': 'running',
        'endpoints': [
            '/api/chat',
            '/api/new-session',
            '/api/clear-session',
            '/api/health'
        ]
    })
