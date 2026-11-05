from datetime import datetime
from sqlalchemy.orm import validates
from . import db
from .base import BaseModel


class AdoptionRequest(BaseModel):
    __tablename__ = 'adoption_requests'

    id = db.Column(db.Integer, primary_key=True)
    dog_id = db.Column(db.Integer, db.ForeignKey('dogs.id'), nullable=False, index=True)
    applicant_name = db.Column(db.String(100), nullable=False)
    applicant_email = db.Column(db.String(254), nullable=False)
    submitted_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

    dog = db.relationship('Dog')

    @validates('applicant_name')
    def validate_applicant_name(self, key, name):
        return self.validate_string_length('Applicant name', name, min_length=2)

    @validates('applicant_email')
    def validate_applicant_email(self, key, email):
        return self.validate_string_length('Applicant email', email, min_length=3)
