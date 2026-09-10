import sys
import unittest
from starlette.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal, ensure_db_migrations
from app.seed import seed_database
from app.models import Worker, ServiceRequest, Cooperative

class TestNammaSevaiBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        ensure_db_migrations()
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()
        cls.client = TestClient(app)

    def test_01_root_and_health(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("statutory_fee_split", data)
        self.assertEqual(data["statutory_fee_split"]["workerShare"], "85%")
        self.assertEqual(data["statutory_fee_split"]["cooperativeWelfareShare"], "10%")
        self.assertEqual(data["statutory_fee_split"]["platformOperationsShare"], "5%")

        health_res = self.client.get("/api/health")
        self.assertEqual(health_res.status_code, 200)
        self.assertEqual(health_res.json()["status"], "healthy")

    def test_02_categories(self):
        res = self.client.get("/api/categories")
        self.assertEqual(res.status_code, 200)
        cats = res.json()
        self.assertGreaterEqual(len(cats), 10)
        cat_names = [c["name"] for c in cats]
        self.assertIn("Plumbing", cat_names)
        self.assertIn("Electrical", cat_names)

    def test_03_cooperatives(self):
        res = self.client.get("/api/cooperatives")
        self.assertEqual(res.status_code, 200)
        coops = res.json()
        self.assertGreaterEqual(len(coops), 3)

        welfare_res = self.client.get("/api/cooperatives/coop-1/welfare-fund")
        self.assertEqual(welfare_res.status_code, 200)
        welfare = welfare_res.json()
        self.assertIn("welfareFundBalance", welfare)
        self.assertEqual(welfare["cooperativeContributionRate"], "10%")

    def test_04_workers(self):
        res = self.client.get("/api/workers")
        self.assertEqual(res.status_code, 200)
        workers = res.json()
        self.assertGreaterEqual(len(workers), 10)

        # Worker details
        w_res = self.client.get("/api/workers/worker-1")
        self.assertEqual(w_res.status_code, 200)
        worker1 = w_res.json()
        self.assertEqual(worker1["name"], "Arun Kumar")
        self.assertTrue(len(worker1["documents"]) > 0)
        self.assertTrue(worker1["isOverallVerified"])

        # Update availability
        patch_res = self.client.patch("/api/workers/worker-1/availability", json={"availability": "busy"})
        self.assertEqual(patch_res.status_code, 200)
        self.assertEqual(patch_res.json()["availability"], "busy")

        # Revert to available
        self.client.patch("/api/workers/worker-1/availability", json={"availability": "available"})

    def test_05_smart_matching(self):
        match_payload = {
            "userLocation": {
                "lat": 10.8271,
                "lng": 78.6890,
                "address": "Thillai Nagar",
                "city": "Tiruchirappalli",
                "pincode": "620018"
            },
            "targetCategory": "Plumbing",
            "targetSkill": "Pipe Repair",
            "customWeights": {
                "skill": 30,
                "distance": 25,
                "availability": 15,
                "rating": 10,
                "verification": 10,
                "experience": 10
            }
        }
        res = self.client.post("/api/matching/rank", json=match_payload)
        self.assertEqual(res.status_code, 200)
        ranked = res.json()
        self.assertTrue(len(ranked) > 0)
        # Top result should have highest score and breakdown
        top = ranked[0]
        self.assertIn("overallScore", top)
        self.assertIn("breakdown", top)
        self.assertIn("reasons", top)
        self.assertGreater(top["overallScore"], 50)

    def test_06_ai_parser(self):
        # Emergency burst pipe
        ai_res = self.client.post("/api/ai/parse-request", json={"input": "urgent pipe burst in bathroom water is flooding!"})
        self.assertEqual(ai_res.status_code, 200)
        data = ai_res.json()
        self.assertEqual(data["detectedService"], "Plumbing")
        self.assertEqual(data["urgency"], "emergency")

        # AC servicing
        ac_res = self.client.post("/api/ai/parse-request", json={"input": "AC not cooling and need gas refill"})
        self.assertEqual(ac_res.status_code, 200)
        ac_data = ac_res.json()
        self.assertEqual(ac_data["detectedService"], "Appliance Repair")

    def test_07_request_lifecycle_and_statutory_split(self):
        # 1. Create request
        req_payload = {
            "category": "Plumbing",
            "skill": "Tap Repair",
            "problem": "Kitchen faucet leaking constantly",
            "urgency": "medium",
            "isEmergency": False,
            "workerId": "worker-1",
            "amount": 500.0,
            "customerId": "cust-101",
            "customerName": "Priya Sharma",
            "customerMobile": "+91 98421 77312"
        }
        create_res = self.client.post("/api/requests", json=req_payload)
        self.assertEqual(create_res.status_code, 201)
        req_data = create_res.json()
        req_id = req_data["id"]
        otp = req_data["verificationOtp"]

        # Check Section 14 Fee Split
        # ₹500 total -> Worker 85% = ₹425, Cooperative 10% = ₹50, Platform 5% = ₹25
        pb = req_data["paymentBreakdown"]
        self.assertEqual(pb["totalAmount"], 500.0)
        self.assertEqual(pb["workerEarnings"], 425.0)
        self.assertEqual(pb["cooperativeContribution"], 50.0)
        self.assertEqual(pb["platformFee"], 25.0)
        self.assertEqual(pb["workerPercentage"], 85)
        self.assertEqual(pb["cooperativePercentage"], 10)
        self.assertEqual(pb["platformPercentage"], 5)

        # 2. Worker accepts
        res = self.client.patch(f"/api/requests/{req_id}/status", json={"status": "accepted"})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "accepted")

        # 3. Worker arrives
        res = self.client.patch(f"/api/requests/{req_id}/status", json={"status": "arrived"})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "arrived")

        # 4. Try completing with wrong OTP (should fail)
        bad_otp_res = self.client.patch(
            f"/api/requests/{req_id}/status",
            json={"status": "completed", "verificationOtp": "0000"}
        )
        self.assertEqual(bad_otp_res.status_code, 400)

        # 5. Complete with correct OTP
        good_otp_res = self.client.patch(
            f"/api/requests/{req_id}/status",
            json={"status": "completed", "verificationOtp": otp}
        )
        self.assertEqual(good_otp_res.status_code, 200)
        self.assertEqual(good_otp_res.json()["status"], "completed")

        # 6. Process Payment
        pay_res = self.client.patch(
            f"/api/requests/{req_id}/status",
            json={"status": "paid", "paymentMethod": "UPI", "amount": 500.0}
        )
        self.assertEqual(pay_res.status_code, 200)
        paid_data = pay_res.json()
        self.assertEqual(paid_data["status"], "paid")
        self.assertEqual(paid_data["paymentStatus"], "completed")

    def test_08_reviews_and_ratings(self):
        rev_payload = {
            "serviceRequestId": "req-301",
            "workerId": "worker-1",
            "customerId": "cust-101",
            "customerName": "Priya Sharma",
            "rating": 5.0,
            "reviewText": "Excellent service and genuine pricing!",
            "serviceCategory": "Plumbing"
        }
        res = self.client.post("/api/reviews", json=rev_payload)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertEqual(data["rating"], 5.0)

    def test_09_notifications(self):
        res = self.client.get("/api/notifications")
        self.assertEqual(res.status_code, 200)
        notifs = res.json()
        self.assertTrue(len(notifs) > 0)
        first_id = notifs[0]["id"]

        read_res = self.client.patch(f"/api/notifications/{first_id}/read")
        self.assertEqual(read_res.status_code, 200)
        self.assertTrue(read_res.json()["read"])

    def test_10_admin_metrics(self):
        res = self.client.get("/api/admin/metrics")
        self.assertEqual(res.status_code, 200)
        metrics = res.json()
        self.assertGreater(metrics["totalWorkers"], 0)
        self.assertGreater(metrics["totalVolumeGmv"], 0)
        self.assertGreater(metrics["platformRevenue5Percent"], 0)
        self.assertGreater(metrics["cooperativeWelfarePool10Percent"], 0)
        self.assertGreater(metrics["workerNetDisbursement85Percent"], 0)

    def test_11_auth_register_login(self):
        # Test register
        reg_payload = {
            "name": "Karthik Ram",
            "mobile": "+91 98765 43210",
            "email": "karthik.ram@example.com",
            "password": "mypassword123",
            "role": "customer",
            "city": "Tiruchirappalli",
            "address": "Thillai Nagar, Trichy"
        }
        res = self.client.post("/api/auth/register", json=reg_payload)
        self.assertIn(res.status_code, [200, 201])
        data = res.json()
        self.assertEqual(data["user"]["email"], "karthik.ram@example.com")
        self.assertIn("token", data)

        # Test login
        login_payload = {
            "identifier": "karthik.ram@example.com",
            "password": "mypassword123"
        }
        log_res = self.client.post("/api/auth/login", json=login_payload)
        self.assertEqual(log_res.status_code, 200)
        self.assertEqual(log_res.json()["user"]["name"], "Karthik Ram")

        # Test OTP flow
        otp_send = self.client.post("/api/auth/send-otp", json={"mobile": "+91 98765 43210"})
        self.assertEqual(otp_send.status_code, 200)
        self.assertTrue(otp_send.json()["success"])

        otp_ver = self.client.post("/api/auth/verify-otp", json={"mobile": "+91 98765 43210", "otp": "1234"})
        self.assertEqual(otp_ver.status_code, 200)
        self.assertIn("token", otp_ver.json())

    def test_12_upload_document(self):
        import io
        fake_file = io.BytesIO(b"dummy image bytes for aadhaar card photo")
        files = {"file": ("test_aadhaar.jpg", fake_file, "image/jpeg")}
        res = self.client.post("/api/upload/document", files=files)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("/uploads/documents/", data["url"])
        self.assertEqual(data["filename"], "test_aadhaar.jpg")

if __name__ == "__main__":
    unittest.main()

