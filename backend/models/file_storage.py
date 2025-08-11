class FileStorage:
    def __init__(self):
        self.session_files = {}  # Maps session_id to list of processed files
    
    def store_file_content(self, session_id, file_data):
        """Store processed file content for a session"""
        if session_id not in self.session_files:
            self.session_files[session_id] = []
        
        self.session_files[session_id].append({
            'file_id': file_data['file_id'],
            'filename': file_data['filename'],
            'content': file_data['content'],
            'file_type': file_data['file_type']
        })
    
    def get_session_files(self, session_id):
        """Get all files associated with a session"""
        return self.session_files.get(session_id, [])
    
    def clear_session(self, session_id):
        """Clear files for a session"""
        if session_id in self.session_files:
            del self.session_files[session_id]

# Global instance
file_storage = FileStorage()
