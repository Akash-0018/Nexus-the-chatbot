import os
import re
from typing import Dict, Optional

class ContentFormatter:
    def __init__(self):
        self.formats = {}
        self.load_formats()
    
    def load_formats(self):
        """Load content formats from markdown file"""
        try:
            formats_path = os.path.join(os.path.dirname(__file__), '..', 'prompts', 'content_formats.md')
            
            with open(formats_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Split sections by ***
            sections = content.split('***')
            
            for section in sections:
                if section.strip():
                    lines = section.strip().split('\n')
                    
                    content_type = None
                    format_instructions = []
                    template = []
                    in_template = False
                    
                    for line in lines:
                        if line.startswith('## ') and not line.startswith('### '):
                            content_type = line[3:].strip()
                        elif line.strip() == '### Template':
                            in_template = True
                        elif line.startswith('```'):  # Skip code block start/end lines
                            continue
                        elif in_template:
                            template.append(line)
                        elif line.startswith('- ') and not in_template:
                            format_instructions.append(line[2:])
                    
                    if content_type:
                        self.formats[content_type] = {
                            'instructions': format_instructions,
                            'template': '\n'.join(template).strip()
                        }
            
            print(f"[INFO] Loaded {len(self.formats)} content formats")
        
        except FileNotFoundError:
            print("[WARNING] content_formats.md not found, using default formats")
            self.load_default_formats()
        
        except Exception as e:
            print(f"[ERROR] Failed to load content formats: {e}")
            self.load_default_formats()
    
    def load_default_formats(self):
        """Fallback default formats"""
        self.formats = {
            'programming': {
                'instructions': [
                    'Provide working code in ``` blocks',
                    'Include essential comments',
                    'Show example usage'
                ],
                'template': '## 🔧 SOLUTION\n```\n\n## 🚀 USAGE\n```'
            },
            'general': {
                'instructions': [
                    'Use clear structure',
                    'Include bullet points',
                    'Keep concise'
                ],
                'template': '## 🎯 RESPONSE\n\n- Point 1\n- Point 2'
            }
        }
    
    def get_format_instructions(self, content_type: str) -> str:
        """Get formatting instructions for a content type"""
        if content_type not in self.formats:
            content_type = 'general'
        
        format_data = self.formats[content_type]
        instructions = '\n'.join([f"- {instruction}" for instruction in format_data['instructions']])
        
        return f"""
CONTENT TYPE: {content_type.upper()}

FORMAT REQUIREMENTS:
{instructions}

EXAMPLE STRUCTURE:
{format_data['template']}
"""
    
    def get_available_formats(self) -> list:
        """Get list of available content formats"""
        return list(self.formats.keys())
    
    def format_response(self, response: str, content_type: str) -> str:
        """Apply content-specific formatting to response"""
        if content_type == 'programming':
            return self._format_programming(response)
        elif content_type == 'mathematics':
            return self._format_mathematics(response)
        elif content_type == 'document_analysis':
            return self._format_document_analysis(response)
        else:
            return self._format_general(response)
    
    def _format_programming(self, response: str) -> str:
        """Format programming responses"""
        # Remove 6-backtick blocks if present
        response = re.sub(r'``````', '', response)
        return self._clean_response(response)
    
    def _format_mathematics(self, response: str) -> str:
        """Format mathematics responses"""
        response = re.sub(r'\*\*Step (\d+):\*\*', r'\n**Step \1:**', response)
        response = re.sub(r'\*\*Final Answer:\*\*', r'\n**🎯 Final Answer:**', response)
        return self._clean_response(response)
    
    def _format_document_analysis(self, response: str) -> str:
        """Format document analysis responses"""
        response = re.sub(r'##\s*([^#\n]+)', r'## \1', response)
        return self._clean_response(response)
    
    def _format_general(self, response: str) -> str:
        """Format general responses"""
        verbose_patterns = [
            r"Hey there!.*?!",
            r"I'm super excited.*?!",
            r"Don't worry.*?!",
            r"Let's dive into.*?!",
            r"I'm thrilled to.*?!"
        ]
        
        for pattern in verbose_patterns:
            response = re.sub(pattern, "", response, flags=re.IGNORECASE | re.DOTALL)
        
        return self._clean_response(response)
    
    def _clean_response(self, response: str) -> str:
        """Apply general cleaning to response"""
        response = re.sub(r'^##([^#])', r'## \1', response, flags=re.MULTILINE)
        response = re.sub(r'\n{3,}', '\n\n', response)
        response = re.sub(r'[ \t]+', ' ', response)
        return response.strip()
