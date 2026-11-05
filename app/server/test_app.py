import os
import unittest
from unittest.mock import patch, MagicMock
import json
from sqlalchemy.exc import SQLAlchemyError

os.environ['DATABASE_PATH'] = ':memory:'

from app import app
from models import AdoptionRequest, Breed, Dog, db
from models.dog import AdoptionStatus

# filepath: app/server/test_app.py
class TestApp(unittest.TestCase):
    def setUp(self):
        # Create a test client using Flask's test client
        self.app = app.test_client()
        self.app.testing = True
        # Turn off database initialization for tests
        app.config['TESTING'] = True
        with app.app_context():
            db.drop_all()
            db.create_all()

    def _create_db_dog(self, status=AdoptionStatus.AVAILABLE):
        with app.app_context():
            breed = Breed(name=f'{status.name.title()} Retriever', description='Friendly and easy to train.')
            db.session.add(breed)
            db.session.flush()
            dog = Dog(
                name=f'{status.name.title()} Dog',
                breed_id=breed.id,
                age=3,
                gender='Male',
                description='A friendly and loyal companion.',
                status=status,
            )
            db.session.add(dog)
            db.session.commit()
            return dog.id
        
    def _create_mock_dog(self, dog_id, name, breed):
        """Helper method to create a mock dog with standard attributes"""
        dog = MagicMock(spec=['to_dict', 'id', 'name', 'breed'])
        dog.id = dog_id
        dog.name = name
        dog.breed = breed
        dog.to_dict.return_value = {'id': dog_id, 'name': name, 'breed': breed}
        return dog
        
    def _setup_query_mock(self, mock_query, dogs):
        """Helper method to configure the query mock"""
        mock_query_instance = MagicMock()
        mock_query.return_value = mock_query_instance
        mock_query_instance.join.return_value = mock_query_instance
        mock_query_instance.count.return_value = len(dogs)
        mock_query_instance.offset.return_value = mock_query_instance
        mock_query_instance.limit.return_value = mock_query_instance
        mock_query_instance.all.return_value = dogs
        return mock_query_instance

    @patch('app.db.session.query')
    def test_get_dogs_success(self, mock_query):
        """Test successful retrieval of multiple dogs"""
        # Arrange
        dog1 = self._create_mock_dog(1, "Buddy", "Labrador")
        dog2 = self._create_mock_dog(2, "Max", "German Shepherd")
        mock_dogs = [dog1, dog2]
        
        self._setup_query_mock(mock_query, mock_dogs)
        
        # Act
        response = self.app.get('/api/dogs')
        
        # Assert
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data)
        self.assertEqual(len(data['dogs']), 2)
        self.assertEqual(data['page'], 1)
        self.assertEqual(data['total'], 2)
        
        # Verify first dog
        self.assertEqual(data['dogs'][0]['id'], 1)
        self.assertEqual(data['dogs'][0]['name'], "Buddy")
        self.assertEqual(data['dogs'][0]['breed'], "Labrador")
        
        # Verify second dog
        self.assertEqual(data['dogs'][1]['id'], 2)
        self.assertEqual(data['dogs'][1]['name'], "Max")
        self.assertEqual(data['dogs'][1]['breed'], "German Shepherd")
        
        # Verify query was called
        mock_query.assert_called_once()
        
    @patch('app.db.session.query')
    def test_get_dogs_empty(self, mock_query):
        """Test retrieval when no dogs are available"""
        # Arrange
        self._setup_query_mock(mock_query, [])
        
        # Act
        response = self.app.get('/api/dogs')
        
        # Assert
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['dogs'], [])
        self.assertEqual(data['total'], 0)
        
    @patch('app.db.session.query')
    def test_get_dogs_structure(self, mock_query):
        """Test the response structure for a single dog"""
        # Arrange
        dog = self._create_mock_dog(1, "Buddy", "Labrador")
        self._setup_query_mock(mock_query, [dog])
        
        # Act
        response = self.app.get('/api/dogs')
        
        # Assert
        data = json.loads(response.data)
        self.assertIn('dogs', data)
        self.assertIn('page', data)
        self.assertIn('total', data)
        self.assertIn('total_pages', data)
        self.assertTrue(isinstance(data['dogs'], list))
        self.assertEqual(len(data['dogs']), 1)
        self.assertEqual(set(data['dogs'][0].keys()), {'id', 'name', 'breed'})

    def test_create_adoption_request_success(self):
        dog_id = self._create_db_dog()

        response = self.app.post(
            f'/api/dogs/{dog_id}/adoption-requests',
            json={'applicant_name': '  Alex Example  ', 'applicant_email': 'alex@example.com'},
        )

        self.assertEqual(response.status_code, 201)
        data = response.get_json()
        self.assertEqual(data['dog'], {'id': dog_id, 'status': 'PENDING'})
        self.assertEqual(data['request']['dog_id'], dog_id)

        with app.app_context():
            dog = db.session.get(Dog, dog_id)
            saved_request = db.session.query(AdoptionRequest).filter_by(dog_id=dog_id).one()
            self.assertEqual(dog.status, AdoptionStatus.PENDING)
            self.assertEqual(saved_request.applicant_name, 'Alex Example')
            self.assertEqual(saved_request.applicant_email, 'alex@example.com')

    def test_create_adoption_request_rejects_invalid_fields(self):
        dog_id = self._create_db_dog()

        for email in ('not-an-email', 'alex@foo..com'):
            with self.subTest(email=email):
                response = self.app.post(
                    f'/api/dogs/{dog_id}/adoption-requests',
                    json={'applicant_name': 'Alex Example', 'applicant_email': email},
                )

                self.assertEqual(response.status_code, 400)
                self.assertEqual(response.get_json()['field'], 'applicant_email')
                with app.app_context():
                    self.assertEqual(db.session.get(Dog, dog_id).status, AdoptionStatus.AVAILABLE)
                    self.assertEqual(db.session.query(AdoptionRequest).count(), 0)

    def test_create_adoption_request_returns_not_found_for_missing_dog(self):
        response = self.app.post(
            '/api/dogs/99999/adoption-requests',
            json={'applicant_name': 'Alex Example', 'applicant_email': 'alex@example.com'},
        )

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json()['error'], 'Dog not found')

    def test_create_adoption_request_rejects_non_available_dog(self):
        for status in (AdoptionStatus.PENDING, AdoptionStatus.ADOPTED):
            with self.subTest(status=status):
                dog_id = self._create_db_dog(status)

                response = self.app.post(
                    f'/api/dogs/{dog_id}/adoption-requests',
                    json={'applicant_name': 'Alex Example', 'applicant_email': 'alex@example.com'},
                )

                self.assertEqual(response.status_code, 409)
                with app.app_context():
                    self.assertEqual(db.session.get(Dog, dog_id).status, status)
                    self.assertEqual(db.session.query(AdoptionRequest).count(), 0)

    def test_create_adoption_request_rolls_back_on_database_error(self):
        dog_id = self._create_db_dog()

        with patch('app.db.session.commit', side_effect=SQLAlchemyError('database unavailable')):
            response = self.app.post(
                f'/api/dogs/{dog_id}/adoption-requests',
                json={'applicant_name': 'Alex Example', 'applicant_email': 'alex@example.com'},
            )

        self.assertEqual(response.status_code, 500)
        with app.app_context():
            self.assertEqual(db.session.get(Dog, dog_id).status, AdoptionStatus.AVAILABLE)
            self.assertEqual(db.session.query(AdoptionRequest).count(), 0)

    def test_create_adoption_request_returns_json_on_lookup_database_error(self):
        dog_id = self._create_db_dog()

        with patch('app.db.session.get', side_effect=SQLAlchemyError('database unavailable')):
            response = self.app.post(
                f'/api/dogs/{dog_id}/adoption-requests',
                json={'applicant_name': 'Alex Example', 'applicant_email': 'alex@example.com'},
            )

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json()['error'], 'Failed to create adoption request')
        with app.app_context():
            self.assertEqual(db.session.get(Dog, dog_id).status, AdoptionStatus.AVAILABLE)
            self.assertEqual(db.session.query(AdoptionRequest).count(), 0)


if __name__ == '__main__':
    unittest.main()