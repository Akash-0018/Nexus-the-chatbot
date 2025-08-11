from langdetect import detect, DetectorFactory
from langdetect.lang_detect_exception import LangDetectException

# Set seed for consistent results
DetectorFactory.seed = 0

def detect_language(text):
    """Detect the language of the input text"""
    try:
        if not text or len(text.strip()) < 3:
            return 'en'
        
        # Remove common programming keywords that might interfere
        programming_keywords = [
            'def', 'class', 'import', 'from', 'if', 'else', 'for', 'while',
            'function', 'var', 'let', 'const', 'return', 'print', 'console.log'
        ]
        
        words = text.lower().split()
        filtered_words = [word for word in words if word not in programming_keywords]
        filtered_text = ' '.join(filtered_words) if filtered_words else text
        
        detected = detect(filtered_text)
        
        # Common Indian language codes
        indian_languages = ['hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'pa', 'or', 'as', 'ur']
        
        if detected in indian_languages:
            return detected
        else:
            return 'en'
            
    except (LangDetectException, Exception):
        return 'en'

def get_language_name(lang_code):
    """Get full language name from language code"""
    language_names = {
        'en': 'English',
        'hi': 'Hindi',
        'bn': 'Bengali',
        'te': 'Telugu',
        'mr': 'Marathi',
        'ta': 'Tamil',
        'gu': 'Gujarati',
        'kn': 'Kannada',
        'ml': 'Malayalam',
        'pa': 'Punjabi',
        'or': 'Odia',
        'as': 'Assamese',
        'ur': 'Urdu'
    }
    return language_names.get(lang_code, 'English')
