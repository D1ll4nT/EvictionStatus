#!/usr/bin/env python3
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from datetime import datetime, date, timedelta
from src.main import app
from src.models.case import Case, TimelineEvent, Document, db

def populate_database():
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Create sample case
        sample_case = Case(
            case_number='21456',
            client_name='John Smith',
            tenant_name='Jane Doe',
            property_address='1234 Main St, Dallas, TX 75201',
            county='Dallas',
            court='JP 4-1',
            case_type='Eviction',
            current_status='Hearing Scheduled',
            current_step=4,
            total_steps=7,
            filed_date=date(2023, 3, 20),
            notice_served_date=date(2023, 2, 14),
            hearing_date=datetime(2023, 5, 15, 9, 0),
            response_deadline=date(2023, 5, 12),
            payment_status='Paid',
            access_code='test123'
        )
        
        db.session.add(sample_case)
        db.session.flush()  # Get the case ID
        
        # Create timeline events
        timeline_events = [
            {
                'step_number': 1,
                'title': 'Notice to Vacate',
                'description': 'Legal notice served to tenant',
                'status': 'completed',
                'event_date': date(2023, 2, 14)
            },
            {
                'step_number': 2,
                'title': 'Filing Suit',
                'description': 'Eviction lawsuit filed with court',
                'status': 'completed',
                'event_date': date(2023, 3, 20)
            },
            {
                'step_number': 3,
                'title': 'Service of Papers',
                'description': 'Court papers served to tenant',
                'status': 'completed',
                'event_date': date(2023, 3, 25)
            },
            {
                'step_number': 4,
                'title': 'Court Hearing',
                'description': 'Scheduled court hearing',
                'status': 'current',
                'event_date': date(2023, 5, 15)
            },
            {
                'step_number': 5,
                'title': 'Judgment',
                'description': 'Court judgment issued',
                'status': 'pending',
                'estimated_date': date(2023, 5, 20)
            },
            {
                'step_number': 6,
                'title': 'Appeal Period',
                'description': '5-day appeal period',
                'status': 'pending',
                'estimated_date': date(2023, 5, 25)
            },
            {
                'step_number': 7,
                'title': 'Writ of Possession',
                'description': 'Final eviction order',
                'status': 'pending',
                'estimated_date': date(2023, 6, 15)
            }
        ]
        
        for event_data in timeline_events:
            timeline_event = TimelineEvent(
                case_id=sample_case.id,
                **event_data
            )
            db.session.add(timeline_event)
        
        # Create sample documents
        documents = [
            {
                'name': 'Notice to Vacate',
                'document_type': 'PDF',
                'status': 'available',
                'uploaded_date': date(2023, 2, 14)
            },
            {
                'name': 'Lease Agreement',
                'document_type': 'PDF',
                'status': 'available',
                'uploaded_date': date(2023, 2, 10)
            },
            {
                'name': 'Court Filing',
                'document_type': 'PDF',
                'status': 'available',
                'uploaded_date': date(2023, 3, 20)
            },
            {
                'name': 'Service Receipt',
                'document_type': 'PDF',
                'status': 'available',
                'uploaded_date': date(2023, 3, 25)
            }
        ]
        
        for doc_data in documents:
            document = Document(
                case_id=sample_case.id,
                **doc_data
            )
            db.session.add(document)
        
        # Create additional sample case
        sample_case2 = Case(
            case_number='21457',
            client_name='Mary Johnson',
            tenant_name='Bob Wilson',
            property_address='5678 Oak Ave, Dallas, TX 75202',
            county='Dallas',
            court='JP 4-1',
            case_type='Eviction',
            current_status='Notice Served',
            current_step=1,
            total_steps=7,
            notice_served_date=date(2023, 4, 1),
            payment_status='Pending',
            access_code='demo456'
        )
        
        db.session.add(sample_case2)
        db.session.flush()
        
        # Create timeline for second case
        for i, event_data in enumerate(timeline_events, 1):
            timeline_event = TimelineEvent(
                case_id=sample_case2.id,
                step_number=event_data['step_number'],
                title=event_data['title'],
                description=event_data['description'],
                status='completed' if i == 1 else 'pending',
                event_date=date(2023, 4, 1) if i == 1 else None,
                estimated_date=event_data.get('estimated_date')
            )
            db.session.add(timeline_event)
        
        db.session.commit()
        print("Database populated successfully!")
        print("Sample cases created:")
        print("- Case 21456 (John Smith) - Access code: test123")
        print("- Case 21457 (Mary Johnson) - Access code: demo456")

if __name__ == '__main__':
    populate_database()

