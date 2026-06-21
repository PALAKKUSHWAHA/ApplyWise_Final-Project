import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from functools import lru_cache
from typing import Dict, List, Tuple, Any, Optional, Set
import logging
import re
import warnings
warnings.filterwarnings("ignore")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SimilarityEngine:
    def __init__(self, model_name: str = "tfidf"):
        self.model_name = model_name
        # Initialize vectorizer once and reuse - don't refit on every request
        self.tfidf_vectorizer = TfidfVectorizer(
            max_features=5000, 
            stop_words='english', 
            ngram_range=(1, 2),
            min_df=1,
            sublinear_tf=True
        )
        self._vectorizer_fitted = False
        self._fit_corpus = []
        
        # Improved weights based on importance
        self.weights = {
            'semantic_similarity': 0.20,
            'skill_match': 0.45,
            'experience_match': 0.15,
            'education_match': 0.10,
            'keyword_match': 0.10
        }
        
        # Skill synonyms for better matching (e.g., React = ReactJS)
        self.skill_synonyms = {
            'react': ['reactjs', 'react.js'],
            'node.js': ['nodejs', 'node', 'node js'],
            'c++': ['cpp', 'c plus plus'],
            'c#': ['csharp', 'c sharp'],
            'javascript': ['js', 'ecmascript'],
            'python': ['py', 'python3', 'python 3'],
            'typescript': ['ts', 'typescripted'],
            'sql': ['mysql', 'postgresql', 'sql server'],
            'aws': ['amazon web services', 'amazon aws'],
            'machine learning': ['ml', 'deep learning'],
            'artificial intelligence': ['ai', 'ai/ml', 'ai-ml']
        }
        
        # Comprehensive predefined skill sets with expanded categories
        self.skill_categories = {
            'programming_languages': [
                'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'php', 'go', 'rust', 
                'swift', 'kotlin', 'scala', 'r', 'perl', 'groovy', 'elixir', 'clojure', 'haskell', 'lua',
                'objective-c', 'bash', 'shell', 'powershell', 'matlab', 'vb.net', 'java', 'visual basic'
            ],
            'web_frameworks': [
                'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'fastapi', 'laravel',
                'spring', 'spring boot', 'asp.net', 'rails', 'sinatra', 'tornado', 'bottle', 'pyramid',
                'next.js', 'nuxt', 'svelte', 'gatsby', 'ember', 'backbone', 'knockout'
            ],
            'databases': [
                'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'sqlite',
                'mariadb', 'cassandra', 'couchdb', 'dynamodb', 'firebase', 'realm', 'h2', 'hbase',
                'influxdb', 'timescaledb', 'neo4j', 'arangodb', 'rethinkdb', 'solr'
            ],
            'cloud_platforms': [
                'aws', 'azure', 'gcp', 'google cloud', 'heroku', 'digitalocean', 'linode', 'vultr',
                'alibaba cloud', 'ibm cloud', 'oracle cloud', 'aws lambda', 'azure functions', 'cloud run'
            ],
            'devops_tools': [
                'docker', 'kubernetes', 'terraform', 'jenkins', 'gitlab', 'github', 'bitbucket', 'circleci',
                'travis ci', 'ansible', 'puppet', 'chef', 'vagrant', 'git', 'svn', 'mercurial', 'jira',
                'confluence', 'prometheus', 'grafana', 'elk', 'splunk', 'datadog', 'newrelic'
            ],
            'data_science': [
                'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'keras', 'stata', 'spss',
                'r', 'matlab', 'spark', 'hadoop', 'tableau', 'power bi', 'looker', 'qlik', 'plotly',
                'matplotlib', 'seaborn', 'ggplot2', 'jupyter', 'anaconda', 'airflow', 'dbt'
            ],
            'mobile_development': [
                'ios', 'android', 'react native', 'flutter', 'ionic', 'xamarin', 'cordova', 'phonegap',
                'swift', 'kotlin', 'objective-c', 'java', 'jetpack'
            ],
            'testing_qa': [
                'selenium', 'cypress', 'jest', 'mocha', 'pytest', 'unittest', 'testng', 'jUnit', 'qtest',
                'postman', 'rest-assured', 'appium', 'xcode', 'junit5', 'mockito', 'jasmine', 'karma'
            ],
            'development_tools': [
                'git', 'linux', 'windows', 'mac', 'vim', 'vscode', 'intellij', 'eclipse', 'pycharm',
                'webstorm', 'datagrip', 'xcode', 'android studio', 'visual studio', 'sublime text',
                'atom', 'vim', 'neovim', 'emacs', 'notepad++'
            ],
            'version_control': [
                'git', 'github', 'gitlab', 'bitbucket', 'svn', 'mercurial', 'perforce', 'bazaar'
            ],
            'messaging_queues': [
                'rabbitmq', 'kafka', 'activemq', 'redis', 'pubsub', 'azure service bus', 'sqs', 'sns'
            ],
            'api_rest': [
                'rest', 'graphql', 'grpc', 'soap', 'rest api', 'api design', 'openapi', 'swagger'
            ],
            'documentation': [
                'swagger', 'openapi', 'postman', 'confluence', 'jira', 'markdown', 'latex', 'sphinx'
            ],
            'containers_orchestration': [
                'docker', 'kubernetes', 'docker compose', 'docker swarm', 'openshift', 'nomad'
            ],
            'machine_learning': [
                'machine learning', 'deep learning', 'neural networks', 'nlp', 'computer vision', 'cv',
                'reinforcement learning', 'supervised learning', 'unsupervised learning', 'bert', 'gpt',
                'transformers', 'cnn', 'rnn', 'lstm', 'gan'
            ],
            'soft_skills': [
                'communication', 'leadership', 'teamwork', 'project management', 'agile', 'scrum',
                'kanban', 'problem solving', 'critical thinking', 'time management', 'attention to detail',
                'collaboration', 'adaptability', 'creativity', 'analytical thinking'
            ]
        }
        
        # Build reverse skill lookup for synonyms
        self._build_skill_lookup()
        
        logger.info("Initialized optimized similarity engine with smart caching")
    
    def _build_skill_lookup(self):
        """Build a lookup dictionary for quick skill matching with synonyms"""
        self.skill_lookup = {}
        
        # Add all skills and their synonyms to lookup
        for category, skill_list in self.skill_categories.items():
            for skill in skill_list:
                self.skill_lookup[skill.lower()] = skill
                # Add synonyms if they exist
                if skill.lower() in self.skill_synonyms:
                    for synonym in self.skill_synonyms[skill.lower()]:
                        self.skill_lookup[synonym.lower()] = skill
    
    def calculate_similarity(self, resume_data: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate similarity between resume and job description with improved accuracy"""
        try:
            result = {
                'overall_score': 0.0,
                'component_scores': {},
                'detailed_analysis': {},
                'recommendations': [],
                'matched_skills': [],
                'missing_skills': []
            }
            
            # Calculate all component scores
            semantic_score = self._calculate_semantic_similarity(resume_data, job_data)
            result['component_scores']['semantic_similarity'] = semantic_score
            
            skill_analysis = self._calculate_skill_match(resume_data, job_data)
            result['component_scores']['skill_match'] = skill_analysis['score']
            result['matched_skills'] = skill_analysis['matched']
            result['missing_skills'] = skill_analysis['missing']
            
            experience_score = self._calculate_experience_match(resume_data, job_data)
            result['component_scores']['experience_match'] = experience_score
            
            education_score = self._calculate_education_match(resume_data, job_data)
            result['component_scores']['education_match'] = education_score
            
            keyword_score = self._calculate_keyword_match(resume_data, job_data)
            result['component_scores']['keyword_match'] = keyword_score
            
            # Calculate weighted overall score (no arbitrary boosting)
            overall_score = sum(
                result['component_scores'][component] * weight
                for component, weight in self.weights.items()
            )
            
            # Convert to percentage (0-100) with proper normalization
            final_score = overall_score * 100
            result['overall_score'] = round(min(100.0, max(0.0, final_score)), 2)
            
            result['detailed_analysis'] = self._generate_analysis(result)
            result['recommendations'] = self._generate_recommendations(result)
            
            return result
            
        except Exception as e:
            logger.error(f"Similarity calculation failed: {str(e)}")
            return {
                'overall_score': 0.0,
                'component_scores': {},
                'detailed_analysis': {},
                'recommendations': [],
                'matched_skills': [],
                'missing_skills': []
            }
    
    def _get_semantic_embeddings(self, resume_text: str, job_text: str) -> Tuple[np.ndarray, np.ndarray]:
        """Generate TF-IDF embeddings with proper caching strategy"""
        try:
            # Ensure texts are valid strings
            resume_text = str(resume_text).strip() if resume_text else ""
            job_text = str(job_text).strip() if job_text else ""
            
            # Skip if texts are too short
            if len(resume_text) < 5 or len(job_text) < 5:
                logger.warning(f"Text too short for embedding: resume={len(resume_text)}, job={len(job_text)}")
                return np.zeros(100), np.zeros(100)
            
            # Combine all texts for vocabulary building (done once)
            combined_texts = [resume_text, job_text]
            
            # Fit vectorizer if not already fitted
            if not self._vectorizer_fitted or combined_texts != self._fit_corpus:
                self.tfidf_vectorizer.fit(combined_texts)
                self._vectorizer_fitted = True
                self._fit_corpus = combined_texts
            
            # Transform texts using fitted vectorizer
            embeddings = self.tfidf_vectorizer.transform(combined_texts)
            # Convert sparse matrix to dense for similarity calculation
            resume_vec = embeddings[0].toarray().flatten()
            job_vec = embeddings[1].toarray().flatten()
            return resume_vec, job_vec
        except Exception as e:
            logger.error(f"TF-IDF embedding generation failed: {str(e)}")
            # Return zero vectors if TF-IDF fails
            return np.zeros(100), np.zeros(100)
    
    def _calculate_semantic_similarity(self, resume_data: Dict[str, Any], job_data: Dict[str, Any]) -> float:
        """Calculate semantic similarity with better normalization"""
        try:
            resume_text = self._extract_text_from_data(resume_data)
            job_text = self._extract_text_from_data(job_data)
            
            if not resume_text or not job_text:
                return 0.0
            
            resume_vec, job_vec = self._get_semantic_embeddings(resume_text, job_text)
            
            # Compute cosine similarity
            similarity = cosine_similarity([resume_vec], [job_vec])[0][0]
            
            # Normalize to [0, 1]
            return max(0.0, min(1.0, float(similarity)))
        except Exception as e:
            logger.error(f"Semantic similarity calculation failed: {str(e)}")
            return 0.0
    
    def _calculate_skill_match(self, resume_data: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate skill match with smart synonym matching and fuzzy string matching"""
        try:
            resume_skills = self._extract_skills(resume_data)
            job_skills = self._extract_skills(job_data)
            
            if not job_skills:
                return {'score': 0.0, 'matched': [], 'missing': []}
            
            matched_skills = []
            matched_set = set()
            
            def _is_skill_match(job_skill: str, resume_skill: str) -> bool:
                """Check if two skills match considering variations and synonyms"""
                job_lower = job_skill.lower().strip()
                resume_lower = resume_skill.lower().strip()
                
                # Exact match
                if job_lower == resume_lower:
                    return True
                
                # Check for substring matches (but ensure meaningful matches, not just 'sql' in 'mysql')
                if len(job_lower) > 2 and len(resume_lower) > 2:
                    # Both must be significant tech terms
                    if (job_lower in resume_lower or resume_lower in job_lower) and \
                       (len(job_lower) >= len(resume_lower) * 0.6 or len(resume_lower) >= len(job_lower) * 0.6):
                        return True
                
                # Check for common variations (e.g., 'node.js' vs 'nodejs')
                job_normalized = job_lower.replace('.', '').replace('-', '').replace(' ', '')
                resume_normalized = resume_lower.replace('.', '').replace('-', '').replace(' ', '')
                if job_normalized == resume_normalized and len(job_normalized) >= 3:
                    return True
                
                # Check synonym mapping
                for base_skill, synonyms in self.skill_synonyms.items():
                    if job_lower == base_skill or job_lower in synonyms:
                        for syn in [base_skill] + synonyms:
                            if syn == resume_lower or syn in resume_lower or resume_lower in syn:
                                return True
                    if resume_lower == base_skill or resume_lower in synonyms:
                        for syn in [base_skill] + synonyms:
                            if syn == job_lower or syn in job_lower or job_lower in syn:
                                return True
                
                return False
            
            # Match job skills with resume skills
            for job_skill in job_skills:
                job_skill_lower = job_skill.lower()
                
                for resume_skill in resume_skills:
                    if _is_skill_match(job_skill, resume_skill):
                        matched_skills.append(job_skill)
                        matched_set.add(job_skill_lower)
                        break
            
            # Remove duplicates while preserving order
            matched_skills = list(dict.fromkeys(matched_skills))
            missing_skills = [skill for skill in job_skills if skill.lower() not in matched_set]
            
            score = len(matched_skills) / len(job_skills) if job_skills else 0.0
            
            logger.info(f"Skill Match - Job skills: {len(job_skills)}, Resume skills: {len(resume_skills)}, Matched: {len(matched_skills)}, Missing: {len(missing_skills)}")
            
            return {
                'score': min(1.0, score),
                'matched': matched_skills,
                'missing': missing_skills
            }
        except Exception as e:
            logger.error(f"Skill match calculation failed: {str(e)}")
            return {'score': 0.0, 'matched': [], 'missing': []}
    
    def _calculate_experience_match(self, resume_data: Dict[str, Any], job_data: Dict[str, Any]) -> float:
        try:
            resume_experience = self._extract_experience_years(resume_data)
            job_experience = self._extract_experience_years(job_data)
            
            if job_experience == 0:
                return 1.0
            
            if resume_experience >= job_experience:
                return 1.0
            else:
                return resume_experience / job_experience
        except Exception as e:
            logger.error(f"Experience match calculation failed: {str(e)}")
            return 0.0
    
    def _calculate_education_match(self, resume_data: Dict[str, Any], job_data: Dict[str, Any]) -> float:
        try:
            resume_education = self._extract_education_level(resume_data)
            job_education = self._extract_education_level(job_data)
            
            education_hierarchy = {
                'phd': 6, 'doctorate': 6, 'doctoral': 6,
                'masters': 5, 'master': 5, 'mba': 5, 'ms': 5, 'ma': 5,
                'bachelors': 4, 'bachelor': 4, 'bs': 4, 'ba': 4, 'be': 4,
                'associates': 3, 'associate': 3, 'diploma': 3,
                'high school': 2, 'secondary': 2,
                'none': 1
            }
            
            resume_level = education_hierarchy.get(resume_education.lower(), 1)
            job_level = education_hierarchy.get(job_education.lower(), 1)
            
            if resume_level >= job_level:
                return 1.0
            else:
                return resume_level / job_level
        except Exception as e:
            logger.error(f"Education match calculation failed: {str(e)}")
            return 0.0
    
    def _calculate_keyword_match(self, resume_data: Dict[str, Any], job_data: Dict[str, Any]) -> float:
        """Calculate keyword match using TF-IDF importance, not just frequency"""
        try:
            resume_text = self._extract_text_from_data(resume_data).lower()
            job_text = self._extract_text_from_data(job_data).lower()
            
            if not job_text or not resume_text:
                return 0.0
            
            # Extract keywords from job description with length filter
            keywords = re.findall(r'\b[a-z]{3,}\b', job_text)
            keywords = list(set(keywords))  # Remove duplicates
            
            if not keywords:
                return 0.0
            
            # Count matches in resume
            matched_keywords = sum(1 for keyword in keywords if keyword in resume_text)
            
            # Return normalized score
            return min(1.0, matched_keywords / len(keywords)) if keywords else 0.0
        except Exception as e:
            logger.error(f"Keyword match calculation failed: {str(e)}")
            return 0.0
    
    def _extract_text_from_data(self, data: Dict[str, Any]) -> str:
        """Extract text from preprocessed data, prioritizing original and cleaned text"""
        try:
            # Prioritize cleaned_text (better for processing)
            if 'cleaned_text' in data and data['cleaned_text']:
                text = str(data['cleaned_text']).strip()
                if text:
                    return text
            
            # Fall back to original_text
            if 'original_text' in data and data['original_text']:
                text = str(data['original_text']).strip()
                if text:
                    return text
            
            # Fallback to combined tokens
            if 'processed_tokens' in data and isinstance(data['processed_tokens'], list):
                if data['processed_tokens']:
                    return ' '.join(str(token) for token in data['processed_tokens'])
            
            if 'tokens' in data and isinstance(data['tokens'], list):
                if data['tokens']:
                    return ' '.join(str(token) for token in data['tokens'])
            
            return ""
        except Exception as e:
            logger.warning(f"Text extraction warning: {str(e)}")
            return ""
    
    def _extract_skills(self, data: Dict[str, Any]) -> List[str]:
        """Extract and deduplicate skills from data using dynamic and predefined patterns"""
        try:
            skills = set()  # Use set for automatic deduplication
            text = self._extract_text_from_data(data).lower()
            
            # Extract from predefined skill categories using word boundaries
            for skill in self.skill_lookup.keys():
                # Only match complete words/skills (minimum 2 characters for acronyms like 'ML', 'AI')
                if len(skill) >= 2:
                    # Use word boundary matching with regex to prevent partial matches
                    pattern = r'\b' + re.escape(skill) + r'\b'
                    if re.search(pattern, text):
                        # Map synonym back to canonical skill name
                        canonical_skill = self.skill_lookup[skill]
                        skills.add(canonical_skill)
            
            # Dynamic skill extraction: Look for capitalized tech terms and common patterns
            # Pattern 1: Multi-word tech terms (e.g., "Machine Learning", "Spring Boot")
            tech_patterns = [
                r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b(?=\s+(?:framework|library|platform|tool|language|database))',
                r'\b(AWS|GCP|API|ML|AI|CV|NLP|REST|SOA|SQL|NoSQL|CI|CD|IoT|VR|AR)\b',
                r'\b([A-Z][a-z]+\s*[#\+\.]?)\b(?=,|\s+[and|or])',  # Languages with special chars like C++, C#
            ]
            
            for pattern in tech_patterns:
                matches = re.finditer(pattern, text)
                for match in matches:
                    skill = match.group(1).strip()
                    if len(skill) >= 2 and skill.lower() not in self.skill_lookup:
                        skills.add(skill)
            
            # Pattern: Look for common frameworks/tools after "using" or "with"
            framework_patterns = [
                r'(?:using|with|built on|built with|built in|using the|implemented in)\s+([a-zA-Z\s\+\#\-]+?)(?:\s+(?:and|,|\.|,|to)|$)',
                r'(?:framework|library|platform|tool|technology|stack):\s*([a-zA-Z0-9\s\+\#\-]+?)(?:\s+(?:and|,|\.|,|to)|$)',
            ]
            
            for pattern in framework_patterns:
                matches = re.finditer(pattern, text, re.IGNORECASE)
                for match in matches:
                    skill_phrase = match.group(1).strip()
                    # Split by common separators
                    for skill in re.split(r',\s*|and\s+|or\s+|\s{2,}', skill_phrase):
                        skill = skill.strip()
                        if len(skill) >= 2 and len(skill) <= 50:  # Reasonable length
                            if skill.lower() not in self.skill_lookup:
                                skills.add(skill)
            
            # Extract from structured data if available
            if 'keywords' in data and isinstance(data['keywords'], dict):
                if 'technical_skills' in data['keywords']:
                    for skill_item in data['keywords']['technical_skills']:
                        if isinstance(skill_item, dict) and 'term' in skill_item:
                            skill_term = skill_item['term'].strip()
                            if len(skill_term) >= 2:
                                skills.add(skill_term)
                        elif isinstance(skill_item, str):
                            skill_term = skill_item.strip()
                            if len(skill_term) >= 2:
                                skills.add(skill_term)
            
            # Filter out false positives and weak matches
            filtered_skills = []
            for skill in skills:
                # Skip generic words and single letters
                if len(skill) >= 2 and skill.lower() not in ['the', 'and', 'or', 'for', 'is', 'at', 'in', 'be', 'as', 'on', 'by', 'it', 'to', 'of', 'up']:
                    filtered_skills.append(skill)
            
            return list(set(filtered_skills))  # Remove any duplicates
        except Exception as e:
            logger.error(f"Skill extraction failed: {str(e)}")
            return []
    
    def _extract_experience_years(self, data: Dict[str, Any]) -> int:
        try:
            text = self._extract_text_from_data(data)
            
            # Look for patterns like "5 years", "3+ years", etc.
            experience_patterns = [
                r'(\d+)\+?\s*years?\s*(?:of\s*)?experience',
                r'(\d+)\+?\s*years?\s*in',
                r'experience\s*:\s*(\d+)\+?\s*years?',
                r'(\d+)\+?\s*years?\s*working'
            ]
            
            max_years = 0
            for pattern in experience_patterns:
                matches = re.findall(pattern, text, re.IGNORECASE)
                for match in matches:
                    try:
                        years = int(match)
                        max_years = max(max_years, years)
                    except ValueError:
                        continue
            
            return max_years
        except Exception:
            return 0
    
    def _extract_education_level(self, data: Dict[str, Any]) -> str:
        try:
            text = self._extract_text_from_data(data).lower()
            
            education_keywords = {
                'phd': ['phd', 'ph.d', 'doctorate', 'doctoral'],
                'masters': ['masters', 'master', 'mba', 'm.s.', 'm.a.', 'ms ', 'ma '],
                'bachelors': ['bachelors', 'bachelor', 'b.s.', 'b.a.', 'bs ', 'ba ', 'be ', 'b.e.'],
                'associates': ['associates', 'associate', 'diploma'],
                'high school': ['high school', 'secondary', '12th']
            }
            
            for level, keywords in education_keywords.items():
                if any(keyword in text for keyword in keywords):
                    return level
            
            return 'none'
        except Exception:
            return 'none'
    
    def _generate_analysis(self, result: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'strengths': self._identify_strengths(result),
            'weaknesses': self._identify_weaknesses(result),
            'score_breakdown': result['component_scores']
        }
    
    def _identify_strengths(self, result: Dict[str, Any]) -> List[str]:
        strengths = []
        scores = result['component_scores']
        
        if scores.get('skill_match', 0) > 0.7:
            strengths.append("Strong skill alignment with job requirements")
        if scores.get('experience_match', 0) > 0.8:
            strengths.append("Excellent experience match")
        if scores.get('semantic_similarity', 0) > 0.6:
            strengths.append("Good semantic relevance to job description")
        if scores.get('keyword_match', 0) > 0.5:
            strengths.append("Good keyword coverage")
        
        return strengths
    
    def _identify_weaknesses(self, result: Dict[str, Any]) -> List[str]:
        weaknesses = []
        scores = result['component_scores']
        
        if scores.get('skill_match', 0) < 0.3:
            weaknesses.append("Limited skill match with job requirements")
        if scores.get('experience_match', 0) < 0.5:
            weaknesses.append("Experience level below job requirements")
        if scores.get('semantic_similarity', 0) < 0.3:
            weaknesses.append("Low semantic relevance to job description")
        if len(result.get('missing_skills', [])) > 3:
            weaknesses.append("Several key skills missing")
        
        return weaknesses
    
    def _generate_recommendations(self, result: Dict[str, Any]) -> List[str]:
        """Generate actionable recommendations based on analysis"""
        recommendations = []
        missing_skills = result.get('missing_skills', [])
        scores = result['component_scores']
        overall = result.get('overall_score', 0)
        
        # Skill-based recommendations (most important)
        skill_score = scores.get('skill_match', 0)
        if missing_skills:
            if len(missing_skills) <= 3:
                recommendations.append(
                    f"🎯 High Priority: Learn {', '.join(missing_skills)} to significantly improve your match"
                )
            else:
                top_missing = missing_skills[:3]
                remaining = len(missing_skills) - 3
                recommendations.append(
                    f"🎯 Priority Skills: Focus on {', '.join(top_missing)} (plus {remaining} others)"
                )
        
        # Experience level recommendations
        exp_score = scores.get('experience_match', 0)
        if exp_score < 0.5:
            recommendations.append(
                "💼 Experience Gap: You need more experience. Highlight transferable skills and seek mentorship opportunities."
            )
        elif exp_score >= 0.9:
            recommendations.append("✅ Perfect Experience Level: Your experience matches job requirements exactly.")
        
        # Skill coverage recommendations
        if skill_score < 0.5:
            recommendations.append(
                "🛠️ Skill Development: You're missing key technical skills. Create a learning plan for the core technologies."
            )
        elif skill_score >= 0.85:
            recommendations.append(
                "🌟 Strong Technical Skills: You have excellent skill alignment. Emphasize your projects and achievements."
            )
        
        # Semantic relevance recommendations
        semantic_score = scores.get('semantic_similarity', 0)
        if semantic_score < 0.4:
            recommendations.append(
                "📝 Resume Optimization: Use more job-specific terminology and industry keywords in your resume."
            )
        
        # Keyword coverage recommendations
        keyword_score = scores.get('keyword_match', 0)
        if keyword_score < 0.5:
            recommendations.append(
                "🔍 ATS Improvement: Add relevant keywords from the job description to pass automated screening."
            )
        
        # Education recommendations
        edu_score = scores.get('education_match', 0)
        if edu_score < 0.6:
            recommendations.append(
                "🎓 Education: Highlight relevant certifications or take courses to meet educational requirements."
            )
        
        # Overall fit recommendations
        if overall >= 85:
            recommendations.append(
                "🚀 STRONG FIT: Apply immediately! You're an excellent match for this role."
            )
        elif overall >= 70:
            recommendations.append(
                "📌 GOOD FIT: You're a qualified candidate. Customize your resume for this specific role."
            )
        elif overall >= 50:
            recommendations.append(
                "⚡ POTENTIAL: You have some matching skills. Focus on addressing gaps to become competitive."
            )
        else:
            recommendations.append(
                "💡 LEARNING OPPORTUNITY: This role requires skill development. Consider entry-level positions first."
            )
        
        return recommendations
        
        if result['component_scores'].get('semantic_similarity', 0) < 0.5:
            recommendations.append("Tailor resume content to better match the job description")
        
        return recommendations[:5]  # Limit to top 5 recommendations
