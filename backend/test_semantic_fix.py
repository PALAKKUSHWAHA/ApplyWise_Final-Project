import json
from similarity_engine import SimilarityEngine
from text_preprocessor import TextPreprocessor

# Sample texts
resume_text = 'Software Engineer with 5 years experience in Python, JavaScript, React, and AWS. Built scalable microservices and REST APIs.'
job_text = 'We are looking for a Software Developer with experience in Python, JavaScript, React, Docker, and cloud platforms. Must have 3+ years of experience.'

# Process texts
preprocessor = TextPreprocessor()
resume_processed = preprocessor.preprocess_text(resume_text)
job_processed = preprocessor.preprocess_text(job_text)

# Calculate similarity
similarity_engine = SimilarityEngine()
result = similarity_engine.calculate_similarity(resume_processed, job_processed)

print("SEMANTIC MATCH TEST RESULTS:")
print("=" * 50)
print(json.dumps(result, indent=2))
print("=" * 50)
print(f"Overall Score: {result['overall_score']}%")
print(f"Semantic Similarity: {result['component_scores'].get('semantic_similarity', 0) * 100:.2f}%")
