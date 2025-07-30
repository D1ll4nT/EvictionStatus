from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Case(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    case_number = db.Column(db.String(20), unique=True, nullable=False)
    client_name = db.Column(db.String(100), nullable=False)
    tenant_name = db.Column(db.String(100), nullable=True)
    property_address = db.Column(db.String(200), nullable=False)
    county = db.Column(db.String(50), nullable=False, default='Dallas')
    court = db.Column(db.String(50), nullable=False, default='JP 4-1')
    case_type = db.Column(db.String(50), nullable=False, default='Eviction')
    current_status = db.Column(db.String(50), nullable=False, default='Notice Preparation')
    current_step = db.Column(db.Integer, nullable=False, default=1)
    total_steps = db.Column(db.Integer, nullable=False, default=7)
    filed_date = db.Column(db.Date, nullable=True)
    notice_served_date = db.Column(db.Date, nullable=True)
    hearing_date = db.Column(db.DateTime, nullable=True)
    response_deadline = db.Column(db.Date, nullable=True)
    payment_status = db.Column(db.String(20), nullable=False, default='Pending')
    access_code = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    timeline_events = db.relationship('TimelineEvent', backref='case', lazy=True, cascade='all, delete-orphan')
    documents = db.relationship('Document', backref='case', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Case {self.case_number}>'

    def to_dict(self):
        return {
            'id': self.id,
            'case_number': self.case_number,
            'client_name': self.client_name,
            'tenant_name': self.tenant_name,
            'property_address': self.property_address,
            'county': self.county,
            'court': self.court,
            'case_type': self.case_type,
            'current_status': self.current_status,
            'current_step': self.current_step,
            'total_steps': self.total_steps,
            'filed_date': self.filed_date.isoformat() if self.filed_date else None,
            'notice_served_date': self.notice_served_date.isoformat() if self.notice_served_date else None,
            'hearing_date': self.hearing_date.isoformat() if self.hearing_date else None,
            'response_deadline': self.response_deadline.isoformat() if self.response_deadline else None,
            'payment_status': self.payment_status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class TimelineEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    case_id = db.Column(db.Integer, db.ForeignKey('case.id'), nullable=False)
    step_number = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), nullable=False, default='pending')  # pending, current, completed
    event_date = db.Column(db.Date, nullable=True)
    estimated_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f'<TimelineEvent {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'step_number': self.step_number,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'event_date': self.event_date.isoformat() if self.event_date else None,
            'estimated_date': self.estimated_date.isoformat() if self.estimated_date else None,
            'created_at': self.created_at.isoformat()
        }

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    case_id = db.Column(db.Integer, db.ForeignKey('case.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    document_type = db.Column(db.String(50), nullable=False)
    file_path = db.Column(db.String(500), nullable=True)
    file_size = db.Column(db.Integer, nullable=True)
    status = db.Column(db.String(20), nullable=False, default='available')  # available, pending, processing
    uploaded_date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f'<Document {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'document_type': self.document_type,
            'file_size': self.file_size,
            'status': self.status,
            'uploaded_date': self.uploaded_date.isoformat(),
            'created_at': self.created_at.isoformat()
        }

