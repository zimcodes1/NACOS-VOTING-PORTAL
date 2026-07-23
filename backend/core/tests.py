from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Category, Project, Voter, Vote


class ProjectRegistrationAndVotingTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(
            name="Software Engineering",
            track=Category.ExhibitionTrack.SOFTWARE,
            voting_open=True,
            requires_payment=False,
        )

    def test_register_project_with_matric_and_level(self):
        payload = {
            "category_id": self.category.id,
            "track": "software",
            "title": "Campus Navigator",
            "tagline": "AI map for campus",
            "description": "Navigation app built with React & Django",
            "thumbnail_url": "https://example.com/thumb.png",
            "team_name": "Dev Squad",
            "contact_name": "Alice Smith",
            "contact_email": "alice@example.com",
            "contact_phone": "08012345678",
            "matric_number": "ft24cmp0999",
            "level": "300 Level",
        }
        response = self.client.post("/api/register-project/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["matric_number"], "FT24CMP0999")
        self.assertEqual(response.data["level"], "300 Level")

    def test_seat_reservation_and_passcode_verification(self):
        # 1. Reserve seat with matric, name, and password
        res_payload = {
            "matric_number": "ft24cmp0777",
            "name": "John Doe",
            "password": "secretpasscode"
        }
        res_response = self.client.post("/api/reserve-seat/", res_payload, format="json")
        self.assertEqual(res_response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res_response.data["success"])
        self.assertEqual(res_response.data["matric_number"], "FT24CMP0777")

        # 2. Verify voter with correct password
        ver_response = self.client.post("/api/verify-voter/", {
            "matric_number": "FT24CMP0777",
            "password": "secretpasscode"
        }, format="json")
        self.assertEqual(ver_response.status_code, status.HTTP_200_OK)
        self.assertTrue(ver_response.data["valid"])

        # 3. Verify voter with wrong password
        wrong_ver = self.client.post("/api/verify-voter/", {
            "matric_number": "FT24CMP0777",
            "password": "wrongpassword"
        }, format="json")
        self.assertEqual(wrong_ver.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(wrong_ver.data["valid"])

    def test_cannot_vote_with_registered_project_matric(self):
        # Register a project with matric FT24CMP0888
        project = Project.objects.create(
            category=self.category,
            title="Smart Election",
            contact_email="owner@example.com",
            matric_number="FT24CMP0888",
            level="400 Level",
        )

        # 1. Verify Voter API should return 403 / valid=False
        verify_resp = self.client.post("/api/verify-voter/", {"matric_number": "FT24CMP0888", "password": "pass"}, format="json")
        self.assertEqual(verify_resp.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(verify_resp.data["valid"])

        # 2. Reservation API should return 403
        res_resp = self.client.post("/api/reserve-seat/", {
            "matric_number": "FT24CMP0888",
            "name": "Project Owner",
            "password": "pass"
        }, format="json")
        self.assertEqual(res_resp.status_code, status.HTTP_403_FORBIDDEN)

        # 3. Vote API should reject vote
        vote_resp = self.client.post("/api/votes/", {
            "project_id": project.id,
            "matric_number": "FT24CMP0888",
            "password": "pass"
        }, format="json")
        self.assertEqual(vote_resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_eligible_student_can_reserve_and_vote(self):
        project = Project.objects.create(
            category=self.category,
            title="Health AI",
            contact_email="owner2@example.com",
            matric_number="FT24CMP0111",
            level="200 Level",
            selected=True
        )

        # 1. Reserve seat
        self.client.post("/api/reserve-seat/", {
            "matric_number": "FT24CMP0555",
            "name": "Voter Student",
            "password": "voterpassword123"
        }, format="json")

        # 2. Vote with correct password
        vote_resp = self.client.post("/api/votes/", {
            "project_id": project.id,
            "matric_number": "FT24CMP0555",
            "password": "voterpassword123"
        }, format="json")
        self.assertEqual(vote_resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(vote_resp.data["success"])
