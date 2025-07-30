import pdfplumber
from docx import Document
import re
import nltk
from typing import Dict, List
from collections import defaultdict

# Download NLTK data
nltk.download('punkt')
nltk.download('stopwords')

SKILL_CATEGORIES = {
    'Programming': {
        'keywords': ['python', 'java', 'javascript', 'typescript', 'go', 'rust', 'c++', 'c#', 'swift', 'kotlin', 
                    'php', 'ruby', 'scala', 'r', 'matlab', 'perl', 'dart'],
        'patterns': [
            r'programming (?:language|skills?)[:\.\s]*([\w\s,]+)',
            r'proficient in ([\w\s,]+) programming'
        ]
    },
    'Frontend': {
        'keywords': ['react', 'angular', 'vue', 'svelte', 'jquery', 'html', 'css', 'sass', 'less', 
                    'bootstrap', 'tailwind', 'material ui', 'redux', 'graphql'],
        'patterns': [
            r'front[- ]?end (?:development|skills?)[:\.\s]*([\w\s,]+)',
            r'web interface (?:development|skills?)[:\.\s]*([\w\s,]+)'
        ]
    },
    'Backend': {
        'keywords': ['node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'asp.net', 'ruby on rails', 
                    'fastapi', 'nest.js', 'graphql', 'rest api', 'microservices'],
        'patterns': [
            r'back[- ]?end (?:development|skills?)[:\.\s]*([\w\s,]+)',
            r'server[- ]?side (?:development|skills?)[:\.\s]*([\w\s,]+)'
        ]
    },
    'DevOps': {
        'keywords': ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'ansible', 'jenkins', 
                    'ci/cd', 'github actions', 'gitlab ci', 'prometheus', 'grafana'],
        'patterns': [
            r'devops (?:tools|skills?)[:\.\s]*([\w\s,]+)',
            r'cloud (?:services|technologies)[:\.\s]*([\w\s,]+)'
        ]
    },
    'Database': {
        'keywords': ['mysql', 'postgresql', 'mongodb', 'redis', 'sql server', 'oracle', 'cassandra', 
                    'dynamodb', 'firebase', 'elasticsearch'],
        'patterns': [
            r'database (?:systems|skills?)[:\.\s]*([\w\s,]+)',
            r'(?:sql|nosql) (?:databases?|skills?)[:\.\s]*([\w\s,]+)'
        ]
    },
    'UI/UX': {
        'keywords': ['figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'user experience', 
                    'user interface', 'wireframing', 'prototyping'],
        'patterns': [
            r'ui/ux (?:design|skills?)[:\.\s]*([\w\s,]+)',
            r'user interface (?:design|skills?)[:\.\s]*([\w\s,]+)'
        ]
    },
    'Data Science': {
        'keywords': ['pandas', 'numpy', 'tensorflow', 'pytorch', 'scikit-learn', 'keras', 'opencv', 
                    'nltk', 'spacy', 'data analysis', 'machine learning', 'deep learning'],
        'patterns': [
            r'data (?:science|analysis) (?:skills?|tools)[:\.\s]*([\w\s,]+)',
            r'machine learning (?:frameworks|skills?)[:\.\s]*([\w\s,]+)'
        ]
    },
    'Mobile': {
        'keywords': ['flutter', 'react native', 'android', 'ios', 'swiftui', 'kotlin multiplatform', 
                    'xamarin', 'ionic', 'cordova'],
        'patterns': [
            r'mobile (?:development|skills?)[:\.\s]*([\w\s,]+)',
            r'(?:android|ios) (?:development|skills?)[:\.\s]*([\w\s,]+)'
        ]
    },
    'IoT': {
        'keywords': ['arduino', 'raspberry pi', 'embedded systems', 'microcontrollers', 'sensors', 
                    'bluetooth', 'zigbee', 'mqtt', 'iot protocols'],
        'patterns': [
            r'iot (?:technologies|skills?)[:\.\s]*([\w\s,]+)',
            r'embedded (?:systems|development)[:\.\s]*([\w\s,]+)'
        ]
    }
}

def analyze_cv(filepath: str) -> Dict[str, List[str]]:
    """
    Analyze CV file and return categorized skills.
    
    Args:
        filepath: Path to the PDF/DOCX file
        
    Returns:
        Dictionary mapping categories to lists of skills
        
    Raises:
        ValueError: If file processing fails
    """
    text = extract_text(filepath)
    return categorize_skills(text)

def extract_text(filepath: str) -> str:
    """Extract text from PDF or DOCX with error handling"""
    if not filepath.lower().endswith(('.pdf', '.docx')):
        raise ValueError("Only PDF and DOCX files are supported")

    try:
        if filepath.endswith('.pdf'):
            with pdfplumber.open(filepath) as pdf:
                text_pages = []
                for page in pdf.pages:
                    text = page.extract_text()
                    if text and text.strip():
                        text_pages.append(text)
                if not text_pages:
                    raise ValueError("PDF contains no extractable text")
                return '\n'.join(text_pages)
                
        elif filepath.endswith('.docx'):
            doc = Document(filepath)
            return '\n'.join(para.text for para in doc.paragraphs if para.text)
            
    except Exception as e:
        raise ValueError(f"File processing failed: {str(e)}")

def categorize_skills(text: str) -> Dict[str, List[str]]:
    """Categorize skills from text content"""
    results = defaultdict(set)
    text = text.lower()
    
    for category, data in SKILL_CATEGORIES.items():
        # Keyword matching
        for keyword in data['keywords']:
            if re.search(rf'\b{re.escape(keyword)}\b', text):
                results[category].add(keyword)
        
        # Pattern matching
        for pattern in data['patterns']:
            for match in re.findall(pattern, text):
                for skill in re.split(r'[,/&]', match):
                    if skill := skill.strip().lower():
                        results[category].add(skill)
    
    return {k: sorted(v) for k, v in results.items()}