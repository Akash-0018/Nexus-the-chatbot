from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from datetime import datetime
from models.chat import db, Chat, Message
import uuid

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chat', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def chat():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response, 200
    
    try:
        from models.ai_model import StudyBuddyAI
        study_buddy = StudyBuddyAI()
        
        data = request.get_json()
        query = data.get('message', '').strip()
        session_id = data.get('session_id')
        file_content = data.get('file_content')
        
        if not query and not file_content:
            return jsonify({
                'error': 'Message is required',
                'success': False
            }), 400

        # Get or create chat session
        chat = Chat.query.filter_by(session_id=session_id).first()
        if not chat:
            chat = Chat(session_id=session_id)
            db.session.add(chat)
            db.session.commit()

        # Store user message
        user_message = Message(
            chat_id=chat.id,
            type='user',
            content=query,
            meta_data={'file_content': file_content} if file_content else None
        )
        db.session.add(user_message)
        
        # Get AI response
        response_data = study_buddy.get_response(query, session_id, file_content)
        
        # Store bot message
        bot_message = Message(
            chat_id=chat.id,
            type='bot',
            content=response_data['response'],
            meta_data={
                'detected_language': response_data.get('detected_language'),
                'subject_area': response_data.get('subject_area', 'general')
            }
        )
        db.session.add(bot_message)
        db.session.commit()
        
        return jsonify(response_data)
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False,
            'timestamp': datetime.now().isoformat()
        }), 500

@chat_bp.route('/new-session', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def new_session():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response, 200
    
    session_id = str(uuid.uuid4())
    
    # Create new chat session
    chat = Chat(session_id=session_id)
    db.session.add(chat)
    db.session.commit()
    
    return jsonify({
        'session_id': session_id,
        'success': True,
        'timestamp': datetime.now().isoformat()
    })

@chat_bp.route('/clear-session', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def clear_session():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response, 200
    
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        
        if session_id:
            chat = Chat.query.filter_by(session_id=session_id).first()
            if chat:
                db.session.delete(chat)
                db.session.commit()
        
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

@chat_bp.route('/history', methods=['GET', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def get_chat_history():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response, 200
    
    try:
        chats = Chat.query.order_by(Chat.updated_at.desc()).all()
        chat_history = []
        
        for chat in chats:
            messages = Message.query.filter_by(chat_id=chat.id).order_by(Message.timestamp).all()
            first_user_msg = next((msg for msg in messages if msg.type == 'user'), None)
            last_bot_msg = next((msg for msg in reversed(messages) if msg.type == 'bot'), None)
            
            chat_data = {
                'id': chat.session_id,
                'messages': [{
                    'id': msg.id,
                    'type': msg.type,
                    'content': msg.content,
                    'timestamp': msg.timestamp.isoformat(),
                    **(msg.meta_data if msg.meta_data else {})
                } for msg in messages],
                'timestamp': chat.created_at.isoformat(),
                'title': first_user_msg.content[:50] + '...' if first_user_msg and len(first_user_msg.content) > 50 else first_user_msg.content if first_user_msg else 'New Chat',
                'preview': (last_bot_msg.content[:80] if last_bot_msg else first_user_msg.content[:80] if first_user_msg else '') + '...'
            }
            chat_history.append(chat_data)
        
        return jsonify({
            'chat_history': chat_history,
            'success': True
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500
