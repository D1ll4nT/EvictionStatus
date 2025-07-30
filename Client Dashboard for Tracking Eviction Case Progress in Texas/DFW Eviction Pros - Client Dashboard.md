# DFW Eviction Pros - Client Dashboard

A comprehensive client portal for tracking eviction case progress and status in Texas courts. This system provides clients with real-time updates on their case progression, document access, and important dates.

## 🏗️ Project Overview

### Purpose
This client dashboard allows DFW Eviction Pros clients to:
- Track their eviction case progress through a visual timeline
- View case details and important dates
- Access and download case-related documents
- Monitor payment status
- Receive updates on next steps

### Technology Stack
- **Frontend**: React 18 with Vite, Tailwind CSS, Lucide React icons
- **Backend**: Flask with SQLAlchemy, Flask-CORS
- **Database**: SQLite (development), easily upgradeable to PostgreSQL
- **Authentication**: Case number + access code system

## 📁 Project Structure

```
dfw-eviction-dashboard/          # React Frontend
├── src/
│   ├── components/
│   │   ├── LoginPage.jsx        # Authentication component
│   │   └── Dashboard.jsx        # Main dashboard component
│   ├── services/
│   │   └── api.js              # API service layer
│   └── assets/                 # Design mockups and images
└── ...

dfw-eviction-api/               # Flask Backend
├── src/
│   ├── models/
│   │   ├── user.py            # User model (template)
│   │   └── case.py            # Case, Timeline, Document models
│   ├── routes/
│   │   ├── user.py            # User routes (template)
│   │   └── case.py            # Case management API routes
│   ├── static/                # Frontend build files (for deployment)
│   └── main.py                # Flask application entry point
├── populate_db.py             # Database seeding script
└── requirements.txt           # Python dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and pnpm
- Python 3.11+
- Git

### Development Setup

1. **Clone and setup the frontend:**
```bash
cd dfw-eviction-dashboard
pnpm install
pnpm run dev
```

2. **Setup the backend:**
```bash
cd dfw-eviction-api
source venv/bin/activate
pip install -r requirements.txt
python populate_db.py  # Seed with demo data
python src/main.py     # Start Flask server
```

3. **Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Demo Credentials
- **Case 1**: Number `21456`, Code `test123` (Advanced case - Hearing Scheduled)
- **Case 2**: Number `21457`, Code `demo456` (Early case - Notice Served)

## 🎨 Design Features

### Visual Design
- **Professional Color Scheme**: DFW Blue (#1e40af) primary, success green (#059669)
- **Responsive Layout**: Mobile-first design with desktop enhancements
- **Accessibility**: WCAG 2.1 AA compliant with proper contrast and keyboard navigation
- **Modern UI**: Clean cards, subtle shadows, professional typography

### User Experience
- **Progress Visualization**: Circular progress indicator showing case completion percentage
- **Timeline Component**: Visual timeline with completed (green), current (blue), and pending (gray) steps
- **Status Hero Section**: Prominent display of current case status and next steps
- **Document Library**: Easy access to case documents with download functionality
- **Error Handling**: Clear error messages for authentication failures

## 📊 Database Schema

### Case Model
```python
class Case(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    case_number = db.Column(db.String(20), unique=True, nullable=False)
    client_name = db.Column(db.String(100), nullable=False)
    tenant_name = db.Column(db.String(100), nullable=True)
    property_address = db.Column(db.String(200), nullable=False)
    county = db.Column(db.String(50), nullable=False, default='Dallas')
    court = db.Column(db.String(50), nullable=False, default='JP 4-1')
    current_status = db.Column(db.String(50), nullable=False)
    current_step = db.Column(db.Integer, nullable=False, default=1)
    total_steps = db.Column(db.Integer, nullable=False, default=7)
    # ... additional fields for dates, payment status, etc.
```

### Timeline Events
```python
class TimelineEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    case_id = db.Column(db.Integer, db.ForeignKey('case.id'), nullable=False)
    step_number = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), nullable=False)  # pending, current, completed
    event_date = db.Column(db.Date, nullable=True)
    estimated_date = db.Column(db.Date, nullable=True)
```

### Documents
```python
class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    case_id = db.Column(db.Integer, db.ForeignKey('case.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    document_type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='available')
    uploaded_date = db.Column(db.Date, nullable=False)
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth` - Authenticate with case number and access code

### Case Management
- `GET /api/case/{case_number}` - Get case details
- `GET /api/case/{case_number}/timeline` - Get case timeline events
- `GET /api/case/{case_number}/documents` - Get case documents
- `PUT /api/case/{case_number}/status` - Update case status (admin)

### Administrative
- `POST /api/cases` - Create new case (admin)
- `PUT /api/timeline/{event_id}` - Update timeline event (admin)

## 🔒 Security Features

### Authentication
- Case number + access code authentication system
- No user accounts required - clients access via case credentials
- Session-based authentication with logout functionality

### Data Protection
- CORS enabled for frontend-backend communication
- Input validation on all API endpoints
- SQL injection protection via SQLAlchemy ORM
- Error handling that doesn't expose sensitive information

### Access Control
- Clients can only access their own case data
- Administrative functions require separate authentication (to be implemented)
- Document access controlled by case ownership

## 📱 Mobile Responsiveness

### Responsive Design Features
- **Mobile-First Approach**: Designed for mobile devices first, enhanced for desktop
- **Touch-Friendly Interface**: Minimum 44px touch targets for buttons and links
- **Optimized Typography**: Readable font sizes across all screen sizes
- **Flexible Layouts**: Grid and flexbox layouts that adapt to screen size
- **Progressive Enhancement**: Core functionality works on all devices

### Breakpoints
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## 🚀 Deployment Guide

### Production Deployment

1. **Build the frontend:**
```bash
cd dfw-eviction-dashboard
pnpm run build
```

2. **Copy frontend build to Flask static directory:**
```bash
cp -r dist/* ../dfw-eviction-api/src/static/
```

3. **Deploy the Flask application:**
```bash
cd dfw-eviction-api
# Update requirements.txt
pip freeze > requirements.txt
# Deploy using your preferred method (Heroku, AWS, etc.)
```

### Environment Configuration

For production, update the following in `src/main.py`:
```python
# Use environment variables for production
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
```

### Database Migration

For production with PostgreSQL:
```python
# Update main.py
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@host:port/database'
```

## 🔧 Customization

### Adding New Case Types
1. Update the `Case` model with new fields
2. Modify the timeline events in `populate_db.py`
3. Update the frontend components to display new information

### Extending the Timeline
1. Modify the `default_timeline` in `case.py` routes
2. Update the `total_steps` default value in the `Case` model
3. Adjust progress calculation in the frontend

### Document Management
1. Implement file upload functionality in the backend
2. Add document storage (local filesystem or cloud storage)
3. Create document management interface for administrators

## 📈 Future Enhancements

### Planned Features
- **Email Notifications**: Automated updates when case status changes
- **SMS Integration**: Text message alerts for important dates
- **Document Upload**: Client ability to upload documents
- **Payment Integration**: Online payment processing
- **Multi-language Support**: Spanish language option
- **Admin Dashboard**: Case management interface for DFW Eviction Pros staff

### Technical Improvements
- **Real-time Updates**: WebSocket integration for live updates
- **Caching**: Redis caching for improved performance
- **Monitoring**: Application performance monitoring and logging
- **Testing**: Comprehensive unit and integration tests
- **CI/CD**: Automated deployment pipeline

## 🤝 Support

### Demo Access
Use the provided demo credentials to explore the system:
- Advanced case (near hearing): `21456` / `test123`
- Early case (notice served): `21457` / `demo456`

### Contact Information
- **DFW Eviction Pros**: (945) 998-0643
- **Email**: support@dfw-eviction.com
- **Website**: dfw-eviction.com

### Technical Support
For technical issues or customization requests, please contact the development team with:
- Detailed description of the issue
- Steps to reproduce (if applicable)
- Browser and device information
- Screenshots if relevant

---

*This documentation covers the complete DFW Eviction Pros Client Dashboard system. For additional technical details or customization requests, please refer to the source code or contact the development team.*

