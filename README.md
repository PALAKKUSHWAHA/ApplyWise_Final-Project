# ResuMatch 🎯

## Revolutionize Your Job Application Process

ResuMatch is an advanced AI-powered platform that transforms how job seekers and recruiters approach the hiring process. By leveraging cutting-edge natural language processing (NLP) and machine learning algorithms, ResuMatch analyzes the compatibility between resumes and job descriptions with unprecedented accuracy and insight.

### Why ResuMatch?

In today's competitive job market, standing out is essential. ResuMatch provides job seekers with data-driven insights to tailor their applications, while helping recruiters identify ideal candidates efficiently. Our intelligent matching system goes beyond simple keyword matching by understanding context, skills relevance, and experience alignment.


## Screenshots 📸

### Home Page
![ResuMatch Home Page](ResuMatch%20Home.png)

### Analysis Results
![ResuMatch Demo Results](ResuMatch%20Demo.png)

## Features ✨

- **Multi-format Support**: PDF, DOC, DOCX, TXT, and image files with text extraction
- **Text Preprocessing**: NLP pipeline with entity recognition, skill extraction, and text normalization
- **Similarity Analysis**: Semantic similarity calculation using sentence embeddings
- **Component Scoring**: Analysis across multiple dimensions:
  - Semantic similarity
  - Skill matching
  - Experience compatibility
  - Education alignment
  - Keyword overlap
- **Web Interface**: React-based frontend for easy interaction
- **REST API**: Backend API for integration with other applications
- **Batch Processing**: Analyze multiple resumes through API endpoints
- **Open Source**: Complete source code available for customization and extension

## Quick Start 🚀

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher (for frontend)
- pip package manager

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/gaurav-singh7092/ResuMatch.git
cd ResuMatch
```

2. **Backend Setup**:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

3. **Frontend Setup**:
```bash
cd ../frontend
npm install
```

4. **Install Tesseract OCR** (for image processing):
   - **Ubuntu/Debian**: `sudo apt-get install tesseract-ocr`
   - **macOS**: `brew install tesseract`
   - **Windows**: Download from [GitHub](https://github.com/UB-Mannheim/tesseract/wiki)

### Running the Application

#### Quick Start with Development Script
```bash
# Setup everything
./dev.sh setup-all

# Run both backend and frontend
./dev.sh run-dev
```

#### Manual Setup

**Backend API Server**
```bash
cd backend
python main.py
```
The backend API will be available at `http://localhost:8000`

**Frontend Development Server**
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:3000`

#### Development Helper Commands
```bash
./dev.sh setup-backend     # Setup Python environment
./dev.sh setup-frontend    # Setup Node.js environment  
./dev.sh setup-all         # Setup both environments
./dev.sh run-backend       # Start only backend
./dev.sh run-frontend      # Start only frontend
./dev.sh run-dev           # Start both services
./dev.sh clean             # Clean up generated files
./dev.sh help              # Show help
```

## Project Structure 📁

```
ResuMatch/
├── README.md                    # Main project documentation
├── backend/                     # Python backend application
│   ├── README.md               # Backend-specific documentation
│   ├── main.py                 # Flask/FastAPI application
│   ├── config.py               # Configuration settings
│   ├── similarity_engine.py    # Core matching algorithms
│   ├── text_extractor.py       # Document text extraction
│   ├── text_preprocessor.py    # NLP preprocessing
│   ├── examples.py             # Example scripts
│   ├── requirements.txt        # Python dependencies
│   ├── examples/               # Sample files and results
│   ├── results/                # Analysis output storage
│   ├── static/                 # Web assets
│   ├── templates/              # HTML templates
│   └── uploads/                # File upload storage
├── frontend/                   # Next.js frontend application
│   ├── README.md               # Frontend documentation
│   ├── package.json            # Node.js dependencies
│   ├── next.config.js          # Next.js configuration
│   ├── tailwind.config.js      # Tailwind CSS config
│   ├── components/             # React components
│   ├── pages/                  # Next.js pages
│   ├── services/               # API services
│   ├── hooks/                  # Custom React hooks
│   └── styles/                 # CSS styles
└── .venv/                      # Python virtual environment
```

## Usage Examples 📋

### Web Interface

1. **Single Resume Analysis**:
   - Upload your resume (PDF, DOC, DOCX, or TXT)
   - Paste the job description
   - Click "Analyze Match"
   - View detailed results with scores and recommendations

2. **Batch Analysis**:
   - Use the API endpoint `/batch-analyze` to process multiple resumes

### API Usage Examples

The project now focuses on web-based interaction through the frontend interface and REST API endpoints. For automated processing, you can use the API endpoints programmatically:

```bash
# Navigate to backend directory
cd backend

# Example API usage with curl
curl -X POST http://localhost:8000/api/analyze \
  -F "resume=@path/to/resume.pdf" \
  -F "job_description=Your job description text here"

# Or use the web interface at http://localhost:3000
```

## Architecture 🏗️

### Core Components

1. **Frontend (Next.js + TypeScript)**
   - Modern React-based web interface
   - Responsive design with Tailwind CSS
   - Real-time analysis results
   - File upload and management

2. **Backend API (Python)**
   - RESTful API server
   - File processing and analysis
   - Machine learning models
   - Database integration

3. **Text Extractor** (`backend/text_extractor.py`)
   - Supports multiple file formats
   - OCR for scanned documents
   - Fallback mechanisms for better reliability

4. **Text Preprocessor** (`backend/text_preprocessor.py`)
   - Advanced NLP pipeline
   - Skill and entity extraction
   - Statistical analysis

5. **Similarity Engine** (`backend/similarity_engine.py`)
   - Transformer-based embeddings
   - Multi-component scoring
   - Configurable weights

### Data Flow

```
Resume File → Text Extraction → Preprocessing → Feature Extraction
                                      ↓
Job Description → Preprocessing → Feature Extraction
                                      ↓
                              Similarity Analysis
                                      ↓
                            Detailed Results & Recommendations
```

## API Documentation 📚

### REST Endpoints

#### `POST /analyze`
Analyze a single resume against a job description.

**Parameters**:
- `resume`: File upload (multipart/form-data)
- `job_description`: Text (form field)

**Response**:
```json
{
  "analysis_id": "uuid",
  "similarity_analysis": {
    "overall_score": 75.5,
    "component_scores": {
      "semantic_similarity": 0.78,
      "skill_match": 0.65,
      "experience_match": 0.80,
      "education_match": 0.90,
      "keyword_match": 0.72
    },
    "matched_skills": ["python", "django", "rest api"],
    "missing_skills": ["react", "aws", "docker"],
    "recommendations": ["Add React experience", "Include cloud technologies"]
  }
}
```

#### `POST /batch-analyze`
Analyze multiple resumes against a job description.

#### `GET /analysis/{analysis_id}`
Retrieve detailed analysis results by ID.

#### `GET /health`
Health check endpoint.

#### `GET /api/stats`
Application statistics.

## Configuration ⚙️

### Environment Variables

```bash
# Server settings
HOST=0.0.0.0
PORT=8000
DEBUG=False

# Model settings
SENTENCE_MODEL=all-MiniLM-L6-v2
USE_GPU=False

# Processing settings
MAX_FILE_SIZE=52428800  # 50MB
MAX_BATCH_SIZE=10

# Component weights
WEIGHT_SEMANTIC=0.35
WEIGHT_SKILL=0.25
WEIGHT_EXPERIENCE=0.15
WEIGHT_EDUCATION=0.10
WEIGHT_KEYWORD=0.15
```

### Configuration Files

The application uses `config.py` for centralized configuration management with support for different environments (development, production, testing).

## Supported File Formats 📄

| Format | Extensions | Notes |
|--------|------------|-------|
| PDF | `.pdf` | Text-based and scanned (OCR) |
| Word | `.doc`, `.docx` | Microsoft Word documents |
| Text | `.txt` | Plain text files |
| Images | `.png`, `.jpg`, `.jpeg`, `.tiff`, `.bmp` | OCR processing |

## Scoring System 📊

### Component Weights (Default)

- **Semantic Similarity** (35%): Overall content alignment
- **Skill Match** (25%): Technical and soft skills overlap
- **Experience Match** (15%): Years and type of experience
- **Education Match** (10%): Educational background alignment
- **Keyword Match** (15%): Important keyword overlap

### Score Interpretation

- **75-100%**: Excellent match
- **60-74%**: Good match
- **45-59%**: Fair match
- **0-44%**: Poor match

## Advanced Features 🔧

### Skill Extraction

The system automatically extracts:
- Programming languages
- Frameworks and libraries
- Databases
- Cloud platforms
- Tools and technologies
- Soft skills
- Certifications

### Entity Recognition

Identifies:
- Contact information
- Company names
- Locations
- Dates
- Educational institutions

### Quality Assessment

Evaluates:
- Document completeness
- Text clarity
- Professional formatting
- Technical depth

## Performance Optimization 🚀

### Model Loading

- Lazy loading of heavy models
- Fallback to lighter models
- GPU acceleration support

### Processing

- Async file processing
- Batch optimization
- Caching mechanisms

### Memory Management

- Streaming file processing
- Garbage collection optimization
- Resource cleanup

## Development 👨‍💻

### Project Structure

```
ResuMatch/
├── main.py              # Web application
├── config.py            # Configuration management
├── text_extractor.py    # Text extraction engine
├── text_preprocessor.py # NLP preprocessing pipeline
├── similarity_engine.py # AI similarity analysis
├── requirements.txt     # Python dependencies
├── README.md           # Documentation
├── uploads/            # Uploaded files
├── results/            # Analysis results
└── static/             # Static web assets
```

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio

# Run tests
pytest tests/

# Run with coverage
pytest --cov=. tests/
```

### Adding New Features

1. **New File Format Support**:
   - Add extraction method to `TextExtractor`
   - Update supported formats list
   - Add file type detection

2. **New Skill Categories**:
   - Update skill patterns in `TextPreprocessor`
   - Add new regex patterns
   - Update feature extraction

3. **Custom Scoring**:
   - Modify weights in `SimilarityEngine`
   - Add new scoring components
   - Update analysis logic

## Troubleshooting 🔧

### Common Issues

1. **Model Loading Errors**:
   ```bash
   # Download models manually
   python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"
   ```

2. **OCR Not Working**:
   - Ensure Tesseract is installed and in PATH
   - Check image quality and format

3. **Memory Issues**:
   - Reduce batch size
   - Use lighter models
   - Enable garbage collection

4. **Performance Issues**:
   - Enable GPU acceleration
   - Use caching
   - Optimize preprocessing options

### Logging

```bash
# Enable debug logging
export LOG_LEVEL=DEBUG
python main.py
```

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Style

- Follow PEP 8
- Use type hints
- Add docstrings
- Write unit tests

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support 💬

For support, please:
1. Check the troubleshooting section
2. Review existing issues on GitHub
3. Create a new issue with detailed information

## Acknowledgments 🙏

- **Sentence Transformers**: For semantic similarity models
- **spaCy**: For NLP preprocessing
- **FastAPI**: For the web framework
- **scikit-learn**: For machine learning utilities
- **Tesseract**: For OCR capabilities

## Roadmap 🗺️

### Planned Features

- [ ] Database integration for result storage
- [ ] User authentication and profiles
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Resume optimization suggestions
- [ ] Integration with job boards
- [ ] Machine learning model fine-tuning
- [ ] Mobile application
- [ ] Enterprise features

---

**ResuMatch** - Making resume screening intelligent and efficient! 🎯
"# ApplyWise_Final-Project"  
