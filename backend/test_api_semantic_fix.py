import requests
import json
import os

# Test the API endpoint
BASE_URL = "http://localhost:8000"

# Create sample resume file
resume_text = """
John Doe
john@example.com | (555) 123-4567

SUMMARY
Experienced Software Engineer with 5+ years developing scalable applications using Python, JavaScript, React, and AWS cloud services.

EXPERIENCE
Senior Software Engineer - TechCorp (2021-Present)
- Architected microservices using Node.js and Express, handling 100k+ requests/minute
- Built React-based dashboards with real-time data visualization
- Deployed applications to AWS using EC2, S3, and Lambda
- Led team of 4 developers using Agile methodology

Software Developer - StartupXYZ (2019-2021)
- Developed full-stack applications with Python and JavaScript
- Implemented RESTful APIs using Flask and FastAPI
- Worked with PostgreSQL and MongoDB databases
- Deployed Docker containers to Kubernetes clusters

SKILLS
Languages: Python, JavaScript, TypeScript, SQL
Frontend: React, HTML5, CSS3, Tailwind
Backend: Node.js, Express, Flask, FastAPI, Django
Databases: PostgreSQL, MongoDB, Redis
DevOps: AWS, Docker, Kubernetes, CI/CD
Tools: Git, GitHub, Jira, VS Code

EDUCATION
Bachelor of Science in Computer Science
University of Technology, 2019
"""

job_description = """
Software Developer - FullStack Position

We are looking for a talented Software Developer with the following qualifications:

Required Skills:
- 3+ years of professional development experience
- Strong knowledge of Python and JavaScript/TypeScript
- Experience with React or similar frontend frameworks
- Backend development with Node.js or Python frameworks
- Experience with cloud platforms (AWS, Azure, or GCP)
- Database design and SQL/NoSQL experience
- Docker containerization
- Kubernetes orchestration preferred
- Git version control
- CI/CD pipeline experience

Responsibilities:
- Develop and maintain full-stack web applications
- Design and implement RESTful APIs
- Optimize application performance
- Collaborate with cross-functional teams
- Write clean, maintainable code
- Participate in code reviews

Nice to Have:
- Machine Learning experience
- GraphQL knowledge
- Microservices architecture experience
- AWS certification

We offer:
- Competitive salary
- Remote work opportunities
- Professional development
- Health insurance
"""

# Create temporary resume file
resume_filename = "test_resume.txt"
with open(resume_filename, "w") as f:
    f.write(resume_text)

try:
    # Send the API request
    with open(resume_filename, "rb") as f:
        files = {"resume": (resume_filename, f, "text/plain")}
        data = {"job_description": job_description}
        
        print("Sending analysis request to API...")
        print(f"URL: {BASE_URL}/analyze")
        print("=" * 70)
        
        response = requests.post(f"{BASE_URL}/analyze", files=files, data=data, timeout=30)
        
        print(f"Response Status: {response.status_code}")
        print("=" * 70)
        
        if response.status_code == 200:
            result = response.json()
            similarity = result.get("similarity_analysis", {})
            
            print("\n✅ API TEST SUCCESSFUL!\n")
            print("SEMANTIC MATCH ANALYSIS RESULTS:")
            print("-" * 70)
            print(f"Overall Score: {similarity.get('overall_score', 0):.2f}%")
            print(f"Semantic Similarity: {similarity.get('component_scores', {}).get('semantic_similarity', 0) * 100:.2f}%")
            print(f"Skill Match: {similarity.get('component_scores', {}).get('skill_match', 0) * 100:.2f}%")
            print(f"Experience Match: {similarity.get('component_scores', {}).get('experience_match', 0) * 100:.2f}%")
            print(f"Education Match: {similarity.get('component_scores', {}).get('education_match', 0) * 100:.2f}%")
            print(f"Keyword Match: {similarity.get('component_scores', {}).get('keyword_match', 0) * 100:.2f}%")
            print("-" * 70)
            print(f"\nMatched Skills: {', '.join(similarity.get('matched_skills', []))}")
            print(f"Missing Skills: {', '.join(similarity.get('missing_skills', []))}")
            print("\n" + json.dumps(similarity, indent=2))
        else:
            print(f"❌ ERROR: {response.status_code}")
            print(response.text)
            
except Exception as e:
    print(f"❌ Test failed with error: {str(e)}")
finally:
    # Clean up
    if os.path.exists(resume_filename):
        os.remove(resume_filename)
