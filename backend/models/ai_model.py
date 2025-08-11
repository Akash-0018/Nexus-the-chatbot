import google.generativeai as genai
import os
from dotenv import load_dotenv
from datetime import datetime
from utils.language_detector import detect_language
from utils.subject_classifier import classify_subject
from utils.content_formatter import ContentFormatter
import logging

class StudyBuddyAI:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        self.api_key = os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-lite')
        self.chat_sessions = {}
        self.logger = logging.getLogger(__name__)
        
        # Initialize content formatter
        self.formatter = ContentFormatter()
        
        # Indian languages mapping
        self.indian_languages = {
            'hi': 'Hindi', 'bn': 'Bengali', 'te': 'Telugu',
            'mr': 'Marathi', 'ta': 'Tamil', 'gu': 'Gujarati',
            'kn': 'Kannada', 'ml': 'Malayalam', 'pa': 'Punjabi',
            'or': 'Odia', 'as': 'Assamese', 'ur': 'Urdu'
        }

    def create_structured_prompt(self, query, language='en', subject_area='general', file_content=None):
        """Create clean prompts using content formatter"""
        
        # Get format instructions from markdown file
        format_instructions = self.formatter.get_format_instructions(subject_area)
        
        language_instruction = ""
        if language != 'en':
            lang_name = self.indian_languages.get(language, 'the detected language')
            language_instruction = f"\nLANGUAGE: Respond in {lang_name} while maintaining the formatting structure."
        
        if file_content:
            prompt = f"""You are Nexus, a professional AI assistant that provides structured, copy-friendly responses.

{format_instructions}{language_instruction}

DOCUMENT CONTENT:
{file_content[:2000]}...

USER QUERY: {query}

Analyze the document and provide a well-structured response following the format requirements above."""
        else:
            prompt = f"""You are Nexus, a professional AI assistant that provides structured, copy-friendly responses.

{format_instructions}{language_instruction}

USER QUERY: {query}

Provide a well-structured response following the format requirements above."""
        
        return prompt

    def get_response(self, query, session_id, file_content=None):
        """Clean response generation using content formatter"""
        try:
            # Detect language and subject
            detected_lang = detect_language(query)
            subject_area = classify_subject(query)
            
            # Check for document analysis
            if file_content or 'file content:' in query.lower() or 'document content:' in query.lower():
                subject_area = 'document_analysis'
            
            # Create structured prompt using markdown file
            prompt = self.create_structured_prompt(query, detected_lang, subject_area, file_content)
            
            # Get or create chat session
            if session_id not in self.chat_sessions:
                self.chat_sessions[session_id] = self.model.start_chat(history=[])
            
            chat = self.chat_sessions[session_id]
            
            # Generate response
            try:
                response = chat.send_message(prompt)
                raw_text = response.text
            except Exception as ai_error:
                self.logger.error(f"AI generation error: {ai_error}")
                raw_text = "I encountered an issue generating a response. Please try rephrasing your question."
            
            # Apply content-specific formatting using formatter
            formatted_response = self.formatter.format_response(raw_text, subject_area)
            
            return {
                'response': formatted_response,
                'detected_language': detected_lang,
                'subject_area': subject_area,
                'content_type': subject_area,
                'available_formats': self.formatter.get_available_formats(),
                'timestamp': datetime.now().isoformat(),
                'success': True,
                'session_id': session_id
            }
            
        except Exception as e:
            self.logger.error(f"AI response error: {e}")
            return {
                'response': "I encountered an error processing your request. Please try again.",
                'error': str(e),
                'success': False,
                'timestamp': datetime.now().isoformat(),
                'session_id': session_id
            }

    def clear_session(self, session_id):
        """Clear chat session with logging"""
        if session_id in self.chat_sessions:
            del self.chat_sessions[session_id]
            self.logger.info(f"Session cleared: {session_id}")
        return True

    def get_session_count(self):
        """Get current session count for monitoring"""
        return len(self.chat_sessions)

    def reload_formats(self):
        """Reload content formats from markdown file"""
        self.formatter = ContentFormatter()
        return self.formatter.get_available_formats()
