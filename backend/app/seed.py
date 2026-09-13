import os
import uuid
from datetime import datetime
from app.database import engine, SessionLocal, Base, BASE_DIR
from app.models import User, Application, Document, UserRole, ApplicationStatus, DocumentStatus
from app.auth import get_password_hash

def seed_database():
    # Create all database tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if admin already exists
        admin = db.query(User).filter(User.email == "admin@esla.org.eg").first()
        if not admin:
            admin = User(
                email="admin@esla.org.eg",
                full_name_ar="د. حازم المنياوي (رئيس لجنة العضوية)",
                full_name_en="Dr. Hazem El-Meniawy (Membership Board)",
                phone_whatsapp="+201001234567",
                password_hash=get_password_hash("Admin@ESLA2026"),
                role=UserRole.ADMIN.value
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
            print("[+] Seeded Admin: admin@esla.org.eg (Pass: Admin@ESLA2026)")

        # Prepare uploads directory
        uploads_root = os.path.join(BASE_DIR, "uploads")
        os.makedirs(uploads_root, exist_ok=True)

        def create_sample_file(user_id: int, filename: str, content: str = "ESLA Verification Sample File"):
            user_dir = os.path.join(uploads_root, str(user_id))
            os.makedirs(user_dir, exist_ok=True)
            file_path = os.path.join(user_dir, filename)
            with open(file_path, "wb") as f:
                f.write(content.encode("utf-8"))
            return file_path

        # Demo applicant 1: Student
        s_user = db.query(User).filter(User.email == "student@esla.org.eg").first()
        if not s_user:
            s_user = User(
                email="student@esla.org.eg",
                full_name_ar="نور الدين أحمد الشافعي",
                full_name_en="Nour Eldin Ahmed El-Shafei",
                phone_whatsapp="+201112233445",
                password_hash=get_password_hash("student123"),
                role=UserRole.MEMBER.value
            )
            db.add(s_user)
            db.commit()
            db.refresh(s_user)

            app1 = Application(
                user_id=s_user.id,
                category="student",
                status=ApplicationStatus.PENDING_REVIEW.value,
                admin_notes=None
            )
            db.add(app1)
            db.commit()
            db.refresh(app1)

            # Sample documents
            p1 = create_sample_file(s_user.id, "national_id.pdf", "%PDF-1.4 National ID Card Scan")
            p2 = create_sample_file(s_user.id, "enrollment_cert.pdf", "%PDF-1.4 Faculty Enrollment Certificate 2026")
            
            db.add(Document(
                application_id=app1.id,
                doc_type="national_id",
                original_filename="بطاقة_الرقم_القومي.pdf",
                stored_filename="national_id.pdf",
                file_path=p1,
                file_size=1024 * 150,
                mime_type="application/pdf",
                status=DocumentStatus.PENDING.value
            ))
            db.add(Document(
                application_id=app1.id,
                doc_type="enrollment_cert",
                original_filename="شهادة_قيد_هندسة_القاهرة_2026.pdf",
                stored_filename="enrollment_cert.pdf",
                file_path=p2,
                file_size=1024 * 280,
                mime_type="application/pdf",
                status=DocumentStatus.PENDING.value
            ))
            db.commit()
            print("[+] Seeded Student applicant: student@esla.org.eg")

        # Demo applicant 2: Graduate with Needs Action
        g_user = db.query(User).filter(User.email == "yasmine@esla.org.eg").first()
        if not g_user:
            g_user = User(
                email="yasmine@esla.org.eg",
                full_name_ar="م. ياسمين شريف المنصوري",
                full_name_en="Eng. Yasmine Sherif El-Mansoury",
                phone_whatsapp="+201223344556",
                password_hash=get_password_hash("member123"),
                role=UserRole.MEMBER.value
            )
            db.add(g_user)
            db.commit()
            db.refresh(g_user)

            app2 = Application(
                user_id=g_user.id,
                category="graduate",
                status=ApplicationStatus.NEEDS_ACTION.value,
                admin_notes="يرجى إعادة رفع كارنيه نقابة المهندسين المصرية لعام 2026 حيث أن المرفق السابق غير موضح به ختم التجديد الساري."
            )
            db.add(app2)
            db.commit()
            db.refresh(app2)

            f1 = create_sample_file(g_user.id, "grad_cert.pdf", "%PDF-1.4 B.Sc. Architecture Degree Cairo University")
            f2 = create_sample_file(g_user.id, "syndicate_card.pdf", "%PDF-1.4 Syndicate Card Scan")
            f3 = create_sample_file(g_user.id, "cv_yasmine.pdf", "%PDF-1.4 Yasmine CV Resume")

            db.add(Document(
                application_id=app2.id,
                doc_type="degree_cert",
                original_filename="شهادة_البكالوريوس_2024.pdf",
                stored_filename="grad_cert.pdf",
                file_path=f1,
                file_size=1024 * 450,
                mime_type="application/pdf",
                status=DocumentStatus.VERIFIED.value
            ))
            db.add(Document(
                application_id=app2.id,
                doc_type="syndicate_id",
                original_filename="كارنيه_النقابة_2024.pdf",
                stored_filename="syndicate_card.pdf",
                file_path=f2,
                file_size=1024 * 120,
                mime_type="application/pdf",
                status=DocumentStatus.REJECTED.value,
                rejection_reason="صورة الكارنيه غير مجددة لعام 2026"
            ))
            db.add(Document(
                application_id=app2.id,
                doc_type="cv_resume",
                original_filename="السيرة_الذاتية_2026.pdf",
                stored_filename="cv_yasmine.pdf",
                file_path=f3,
                file_size=1024 * 190,
                mime_type="application/pdf",
                status=DocumentStatus.VERIFIED.value
            ))
            db.commit()
            print("[+] Seeded Graduate applicant: yasmine@esla.org.eg")

        # Demo applicant 3: Full / Professional Member
        p_user = db.query(User).filter(User.email == "tarek@esla.org.eg").first()
        if not p_user:
            p_user = User(
                email="tarek@esla.org.eg",
                full_name_ar="م. طارق رضوان القاضي",
                full_name_en="Eng. Tarek Radwan El-Kady",
                phone_whatsapp="+201019876543",
                password_hash=get_password_hash("member123"),
                role=UserRole.MEMBER.value
            )
            db.add(p_user)
            db.commit()
            db.refresh(p_user)

            app3 = Application(
                user_id=p_user.id,
                category="professional",
                status=ApplicationStatus.UNDER_VERIFICATION.value,
                admin_notes="الملف مكتمل وقيد فحص سابقة الأعمال من قبل اللجنة الفنية."
            )
            db.add(app3)
            db.commit()
            db.refresh(app3)

            t1 = create_sample_file(p_user.id, "portfolio_tarek.pdf", "%PDF-1.4 Landscape Architecture Projects Portfolio 2021-2026")
            t2 = create_sample_file(p_user.id, "exp_letters.pdf", "%PDF-1.4 5 Years Experience Letters in Landscape Design")

            db.add(Document(
                application_id=app3.id,
                doc_type="portfolio_pdf",
                original_filename="ملف_سابقة_الأعمال_والتصاميم.pdf",
                stored_filename="portfolio_tarek.pdf",
                file_path=t1,
                file_size=1024 * 3500,
                mime_type="application/pdf",
                status=DocumentStatus.PENDING.value
            ))
            db.add(Document(
                application_id=app3.id,
                doc_type="experience_letters",
                original_filename="شهادات_الخبرة_5_سنوات.pdf",
                stored_filename="exp_letters.pdf",
                file_path=t2,
                file_size=1024 * 600,
                mime_type="application/pdf",
                status=DocumentStatus.VERIFIED.value
            ))
            db.commit()
            print("[+] Seeded Professional applicant: tarek@esla.org.eg")

        # Demo applicant 4: Consultant Approved
        c_user = db.query(User).filter(User.email == "sami@esla.org.eg").first()
        if not c_user:
            c_user = User(
                email="sami@esla.org.eg",
                full_name_ar="أ.د. سامي فتحي الجوهري",
                full_name_en="Prof. Dr. Sami Fathy El-Gohary",
                phone_whatsapp="+201205557788",
                password_hash=get_password_hash("member123"),
                role=UserRole.MEMBER.value
            )
            db.add(c_user)
            db.commit()
            db.refresh(c_user)

            app4 = Application(
                user_id=c_user.id,
                category="consultant",
                status=ApplicationStatus.APPROVED.value,
                admin_notes="تمت المراجعة والاعتماد بعضوية استشاري رقم ESLA-CONS-2026-089. مرحباً بكم في الجمعية."
            )
            db.add(app4)
            db.commit()
            db.refresh(app4)
            print("[+] Seeded Consultant applicant: sami@esla.org.eg")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
