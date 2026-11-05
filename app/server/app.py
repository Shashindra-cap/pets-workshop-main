import os
import re
from typing import Dict, List, Any, Optional
from flask import Flask, jsonify, request, Response
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.exceptions import BadRequest
from models import init_db, db, Dog, Breed, AdoptionRequest
from models.dog import AdoptionStatus

# Get the server directory path
base_dir: str = os.path.abspath(os.path.dirname(__file__))

app: Flask = Flask(__name__)
db_path: str = os.environ.get('DATABASE_PATH', os.path.join(base_dir, 'dogshelter.db'))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database with the app
init_db(app)

EMAIL_PATTERN = re.compile(
    r"^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+"
    r"(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@"
    r"(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+"
    r"[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$"
)

@app.route('/api/dogs', methods=['GET'])
def get_dogs() -> Response:
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 6, type=int)
    page = max(1, page)
    per_page = max(1, min(per_page, 100))

    query = db.session.query(
        Dog.id, 
        Dog.name, 
        Breed.name.label('breed')
    ).join(Breed, Dog.breed_id == Breed.id)
    
    total = query.count()
    dogs_query = query.offset((page - 1) * per_page).limit(per_page).all()
    
    dogs_list: List[Dict[str, Any]] = [
        {
            'id': dog.id,
            'name': dog.name,
            'breed': dog.breed
        }
        for dog in dogs_query
    ]
    
    return jsonify({
        'dogs': dogs_list,
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': max(1, -(-total // per_page))
    })

@app.route('/api/dogs/<int:id>', methods=['GET'])
def get_dog(id: int) -> tuple[Response, int] | Response:
    # Query the specific dog by ID and join with breed to get breed name
    dog_query = db.session.query(
        Dog.id,
        Dog.name,
        Breed.name.label('breed'),
        Dog.age,
        Dog.description,
        Dog.gender,
        Dog.status
    ).join(Breed, Dog.breed_id == Breed.id).filter(Dog.id == id).first()
    
    # Return 404 if dog not found
    if not dog_query:
        return jsonify({"error": "Dog not found"}), 404
    
    # Convert the result to a dictionary
    dog: Dict[str, Any] = {
        'id': dog_query.id,
        'name': dog_query.name,
        'breed': dog_query.breed,
        'age': dog_query.age,
        'description': dog_query.description,
        'gender': dog_query.gender,
        'status': dog_query.status.name
    }
    
    return jsonify(dog)

@app.route('/api/dogs/<int:id>/adoption-requests', methods=['POST'])
def create_adoption_request(id: int) -> tuple[Response, int]:
    if not request.is_json:
        return jsonify({'error': 'Request body must be JSON'}), 400

    try:
        data = request.get_json()
    except BadRequest:
        return jsonify({'error': 'Request body must contain valid JSON'}), 400

    if not isinstance(data, dict):
        return jsonify({'error': 'Request body must be a JSON object'}), 400

    applicant_name = data.get('applicant_name')
    if not isinstance(applicant_name, str) or not 2 <= len(applicant_name.strip()) <= 100:
        return jsonify({
            'error': 'Applicant name must be between 2 and 100 characters',
            'field': 'applicant_name',
        }), 400

    applicant_email = data.get('applicant_email')
    if (
        not isinstance(applicant_email, str)
        or len(applicant_email.strip()) > 254
        or not EMAIL_PATTERN.fullmatch(applicant_email.strip())
    ):
        return jsonify({
            'error': 'A valid email address is required',
            'field': 'applicant_email',
        }), 400

    try:
        dog = db.session.get(Dog, id)
        if dog is None:
            return jsonify({'error': 'Dog not found'}), 404
        if dog.status is not AdoptionStatus.AVAILABLE:
            return jsonify({'error': 'Dog is not available for adoption'}), 409

        updated_count = db.session.query(Dog).filter(
            Dog.id == id,
            Dog.status == AdoptionStatus.AVAILABLE,
        ).update(
            {Dog.status: AdoptionStatus.PENDING},
            synchronize_session=False,
        )

        if updated_count != 1:
            db.session.rollback()
            current_dog = db.session.get(Dog, id)
            if current_dog is None:
                return jsonify({'error': 'Dog not found'}), 404
            return jsonify({'error': 'Dog is not available for adoption'}), 409

        adoption_request = AdoptionRequest(
            dog_id=id,
            applicant_name=applicant_name.strip(),
            applicant_email=applicant_email.strip(),
        )
        db.session.add(adoption_request)
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
        app.logger.exception('Failed to create an adoption request for dog %s', id)
        return jsonify({'error': 'Failed to create adoption request'}), 500

    return jsonify({
        'request': {'id': adoption_request.id, 'dog_id': id},
        'dog': {'id': id, 'status': AdoptionStatus.PENDING.name},
    }), 201

## HERE

if __name__ == '__main__':
    app.run(debug=True, port=int(os.environ.get('PORT', '5100')))
