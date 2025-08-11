from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import uuid
from datetime import datetime

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chat', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)  # ✅ FIXED: Enable credentials support
def chat():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response, 200
    
    try:
        # Import here to avoid initialization issues
        from models.ai_model import StudyBuddyAI
        study_buddy = StudyBuddyAI()
        
        data = request.get_json()
        query = data.get('message', '').strip()
        session_id = data.get('session_id', str(uuid.uuid4()))
        file_content = data.get('file_content')
        
        if not query and not file_content:
            return jsonify({
                'error': 'Message is required',
                'success': False
            }), 400
        
        response = study_buddy.get_response(query, session_id, file_content)
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False,
            'timestamp': datetime.now().isoformat()
        }), 500

@chat_bp.route('/new-session', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)  # ✅ FIXED: Enable credentials support
def new_session():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response, 200
    
    session_id = str(uuid.uuid4())
    return jsonify({
        'session_id': session_id,
        'success': True,
        'timestamp': datetime.now().isoformat()
    })

@chat_bp.route('/clear-session', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)  # ✅ FIXED: Enable credentials support
def clear_session():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response, 200
    
    try:
        from models.ai_model import StudyBuddyAI
        study_buddy = StudyBuddyAI()
        
        data = request.get_json()
        session_id = data.get('session_id')
        
        if session_id:
            study_buddy.clear_session(session_id)
        
        return jsonify({
            'message': 'Session cleared successfully',
            'success': True,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500
