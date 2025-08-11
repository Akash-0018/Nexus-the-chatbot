import re

def classify_subject(query):
    """Classify the subject area based on query content"""
    
    query_lower = query.lower()
    
    # Programming keywords
    programming_keywords = [
        'code', 'python', 'java', 'javascript', 'html', 'css', 'react', 'angular',
        'vue', 'node', 'api', 'database', 'sql', 'algorithm', 'data structure',
        'function', 'class', 'object', 'variable', 'loop', 'array', 'string',
        'programming', 'software', 'development', 'debugging', 'error', 'syntax',
        'framework', 'library', 'package', 'import', 'export', 'git', 'github'
    ]
    
    # Mathematics keywords
    math_keywords = [
        'equation', 'calculate', 'solve', 'mathematics', 'algebra', 'calculus',
        'geometry', 'trigonometry', 'statistics', 'probability', 'derivative',
        'integral', 'matrix', 'vector', 'graph', 'function', 'formula',
        'theorem', 'proof', 'number', 'prime', 'factorial', 'logarithm',
        'exponential', 'polynomial', 'quadratic', 'linear', 'differential'
    ]
    
    # Science keywords
    science_keywords = [
        'chemistry', 'physics', 'biology', 'experiment', 'theory', 'molecular',
        'atom', 'electron', 'proton', 'neutron', 'chemical', 'reaction',
        'element', 'compound', 'mixture', 'solution', 'acid', 'base',
        'cell', 'dna', 'rna', 'protein', 'enzyme', 'organism', 'ecosystem',
        'evolution', 'genetics', 'photosynthesis', 'respiration', 'force',
        'energy', 'motion', 'velocity', 'acceleration', 'gravity', 'wave'
    ]
    
    # Literature keywords
    literature_keywords = [
        'literature', 'poem', 'poetry', 'novel', 'story', 'character',
        'plot', 'theme', 'metaphor', 'simile', 'symbolism', 'irony',
        'author', 'writer', 'book', 'essay', 'analysis', 'critique',
        'narrative', 'dialogue', 'setting', 'conflict', 'climax',
        'shakespeare', 'dickens', 'prose', 'verse', 'stanza', 'rhyme'
    ]
    
    # History keywords
    history_keywords = [
        'history', 'historical', 'ancient', 'medieval', 'modern', 'war',
        'battle', 'empire', 'kingdom', 'civilization', 'revolution',
        'independence', 'freedom', 'colonial', 'mughal', 'british',
        'gandhi', 'nehru', 'partition', 'constitution', 'democracy'
    ]
    
    # Count matches for each subject
    programming_score = sum(1 for keyword in programming_keywords if keyword in query_lower)
    math_score = sum(1 for keyword in math_keywords if keyword in query_lower)
    science_score = sum(1 for keyword in science_keywords if keyword in query_lower)
    literature_score = sum(1 for keyword in literature_keywords if keyword in query_lower)
    history_score = sum(1 for keyword in history_keywords if keyword in query_lower)
    
    # Determine the subject with highest score
    scores = {
        'programming': programming_score,
        'mathematics': math_score,
        'science': science_score,
        'literature': literature_score,
        'history': history_score
    }
    
    max_score = max(scores.values())
    
    if max_score == 0:
        return 'general'
    
    # Return the subject with the highest score
    for subject, score in scores.items():
        if score == max_score:
            return subject
    
    return 'general'

def get_subject_icon(subject):
    """Get emoji icon for subject"""
    icons = {
        'programming': '💻',
        'mathematics': '📊',
        'science': '🔬',
        'literature': '📖',
        'history': '🏛️',
        'general': '🎯'
    }
    return icons.get(subject, '🎯')
