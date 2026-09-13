from fastapi import APIRouter
from typing import List, Dict
from app.schemas import MembershipTierInfo, DocRequirement

router = APIRouter(prefix="/api/tiers", tags=["Membership Tiers"])

MEMBERSHIP_TIERS: Dict[str, dict] = {
    "student": {
        "id": "student",
        "title_ar": "عضو طالب",
        "title_en": "Student Member",
        "subtitle_ar": "لطلاب كليات الهندسة، الفنون، والتخطيط العمراني",
        "subtitle_en": "For undergraduate architecture & landscape students",
        "description_ar": "مخصصة للطلاب المقيدين في برامج العمارة، تخطيط المدن، وهندسة تنسيق المواقع بالجامعات المصرية المعترف بها.",
        "description_en": "Dedicated to students enrolled in accredited architecture, urban planning, or landscape architecture degree programs in Egyptian universities.",
        "annual_fee_egp": 150,
        "required_documents": [
            {
                "id": "national_id",
                "name_ar": "بطاقة الرقم القومي / جواز السفر",
                "name_en": "National ID / Passport",
                "description_ar": "صورة واضحة للوجهين أو جواز السفر لغير المصريين",
                "description_en": "Clear scan of both sides or valid passport for non-Egyptians",
                "is_required": True,
                "accepted_formats": ["pdf", "jpg", "jpeg", "png"],
                "max_size_mb": 10
            },
            {
                "id": "enrollment_cert",
                "name_ar": "إثبات قيد جامعي أو كارنيه الكلية",
                "name_en": "University Enrollment Proof / Student ID",
                "description_ar": "شهادة قيد للعام الجامعي الحالي أو صورة كارنيه الكلية ساري",
                "description_en": "Certificate of enrollment for the current academic year or valid student card",
                "is_required": True,
                "accepted_formats": ["pdf", "jpg", "jpeg", "png"],
                "max_size_mb": 10
            },
            {
                "id": "personal_photo",
                "name_ar": "صورة شخصية حديثة",
                "name_en": "Personal Photograph",
                "description_ar": "صورة رسمية ملونة بخلفية بيضاء (مقاس 4×6 أو ما يعادلها)",
                "description_en": "Recent passport-style photograph with a plain white background",
                "is_required": True,
                "accepted_formats": ["jpg", "jpeg", "png"],
                "max_size_mb": 5
            }
        ]
    },
    "graduate": {
        "id": "graduate",
        "title_ar": "عضو منتسب (حديث تخرج)",
        "title_en": "Associate / Graduate Member",
        "subtitle_ar": "للخريجين الجدد خلال أول 3 سنوات من التخرج",
        "subtitle_en": "For recent graduates within the first 3 years of graduation",
        "description_ar": "للخريجين الجدد الحاصلين على بكالوريوس في هندسة العمارة أو تنسيق المواقع والمسجلين بنقابة المهندسين.",
        "description_en": "For recent graduates holding a recognized Bachelor's degree in Architecture, Landscape Architecture or Urban Design registered in the Syndicate.",
        "annual_fee_egp": 400,
        "required_documents": [
            {
                "id": "national_id",
                "name_ar": "بطاقة الرقم القومي / جواز السفر",
                "name_en": "National ID / Passport",
                "description_ar": "صورة واضحة للوجهين",
                "description_en": "Clear scan of both sides",
                "is_required": True,
                "accepted_formats": ["pdf", "jpg", "jpeg", "png"],
                "max_size_mb": 10
            },
            {
                "id": "degree_cert",
                "name_ar": "شهادة التخرج / البكالوريوس",
                "name_en": "Graduation Certificate / B.Sc. Degree",
                "description_ar": "صورة المؤهل الدراسي أو إفادة النجاح المعتمدة",
                "description_en": "Official graduation certificate or accredited transcript",
                "is_required": True,
                "accepted_formats": ["pdf", "jpg", "jpeg", "png"],
                "max_size_mb": 10
            },
            {
                "id": "syndicate_id",
                "name_ar": "كارنيه نقابة المهندسين المصرية",
                "name_en": "Egyptian Syndicate of Engineers Card",
                "description_ar": "صورة كارنيه النقابة ساري المفعول",
                "description_en": "Clear copy of the valid Egyptian Engineers Syndicate registration card",
                "is_required": True,
                "accepted_formats": ["pdf", "jpg", "jpeg", "png"],
                "max_size_mb": 10
            },
            {
                "id": "cv_resume",
                "name_ar": "السيرة الذاتية (CV)",
                "name_en": "Curriculum Vitae (CV)",
                "description_ar": "سيرة ذاتية محدثة توضح المسار الأكاديمي والتدريبي",
                "description_en": "Updated CV outlining educational background, training, and internships",
                "is_required": True,
                "accepted_formats": ["pdf"],
                "max_size_mb": 10
            },
            {
                "id": "personal_photo",
                "name_ar": "صورة شخصية حديثة",
                "name_en": "Personal Photograph",
                "description_ar": "صورة شخصية رسمية خلفية بيضاء لكارنيه العضوية",
                "description_en": "Formal photo for the official membership card",
                "is_required": True,
                "accepted_formats": ["jpg", "jpeg", "png"],
                "max_size_mb": 5
            }
        ]
    },
    "professional": {
        "id": "professional",
        "title_ar": "عضو عامل (ممارس محترف)",
        "title_en": "Full / Professional Member",
        "subtitle_ar": "للمهندسين الممارسين ذوي الخبرة (3+ سنوات)",
        "subtitle_en": "For practicing landscape architects with 3+ years experience",
        "description_ar": "للمهنيين الذين مارسوا تصميم وتنفيذ اللاندسكيب بشكل متصل لمدة لا تقل عن 3 سنوات ويمتلكون سابقة أعمال معتمدة.",
        "description_en": "For professionals with a minimum of 3 years of verified practice in landscape design and supervision, with an established project portfolio.",
        "annual_fee_egp": 800,
        "required_documents": [
            {
                "id": "national_id",
                "name_ar": "بطاقة الرقم القومي / جواز السفر",
                "name_en": "National ID / Passport",
                "description_ar": "صورة واضحة للوجهين",
                "description_en": "Clear scan of both sides",
                "is_required": True,
                "accepted_formats": ["pdf", "jpg", "jpeg", "png"],
                "max_size_mb": 10
            },
            {
                "id": "degree_cert",
                "name_ar": "شهادة البكالوريوس والدرجات العليا",
                "name_en": "B.Sc. Degree & Post-Grad Certificates",
                "description_ar": "شهادة البكالوريوس وأي دبلومات أو ماجستير متعلقة باللاندسكيب",
                "description_en": "Bachelor's degree and any relevant postgraduate diplomas or MSc",
                "is_required": True,
                "accepted_formats": ["pdf", "jpg", "jpeg", "png"],
                "max_size_mb": 10
            },
            {
                "id": "syndicate_id",
                "name_ar": "كارنيه نقابة المهندسين المصرية",
                "name_en": "Egyptian Engineers Syndicate Card",
                "description_ar": "كارنيه ساري موضح به الرتبة المهنية",
                "description_en": "Valid Syndicate membership card",
                "is_required": True,
                "accepted_formats": ["pdf", "jpg", "jpeg", "png"],
                "max_size_mb": 10
            },
            {
                "id": "experience_letters",
                "name_ar": "شهادات الخبرة المهنية (3+ سنوات)",
                "name_en": "Professional Experience Certificates (3+ Yrs)",
                "description_ar": "خطابات خبرة رسمية من مكاتب أو شركات استشارية تفيد بممارسة أعمال اللاندسكيب",
                "description_en": "Official employment certificates or letters verifying at least 3 years in landscape practice",
                "is_required": True,
                "accepted_formats": ["pdf"],
                "max_size_mb": 10
            },
            {
                "id": "portfolio_pdf",
                "name_ar": "ملف سابقة الأعمال (Portfolio PDF)",
                "name_en": "Landscape Architecture Portfolio (PDF)",
                "description_ar": "ملف مجمع يضم نماذج من المخططات، والتصميمات التنفيذية والصور الواقعية للمشاريع المنفذة",
                "description_en": "Comprehensive portfolio demonstrating design plans, working drawings, and photos of executed landscape projects",
                "is_required": True,
                "accepted_formats": ["pdf"],
                "max_size_mb": 15
            },
            {
                "id": "cv_resume",
                "name_ar": "السيرة الذاتية المهنية (CV)",
                "name_en": "Professional CV",
                "description_ar": "سيرة ذاتية توضح المسؤوليات والمشاريع المنفذة",
                "description_en": "Detailed professional CV highlighting key landscape projects and roles",
                "is_required": True,
                "accepted_formats": ["pdf"],
                "max_size_mb": 10
            },
            {
                "id": "personal_photo",
                "name_ar": "صورة شخصية حديثة",
                "name_en": "Personal Photograph",
                "description_ar": "صورة رسمية لكارنيه العضوية والشهادة",
                "description_en": "Formal photo for official register & certificate",
                "is_required": True,
                "accepted_formats": ["jpg", "jpeg", "png"],
                "max_size_mb": 5
            }
        ]
    },
    "consultant": {
        "id": "consultant",
        "title_ar": "عضو استشاري (زميل)",
        "title_en": "Fellow / Consultant Member",
        "subtitle_ar": "لكبار المعماريين والاستشاريين (15+ سنة خبرة)",
        "subtitle_en": "For senior architects & certified consultants (15+ Yrs)",
        "description_ar": "أعلى درجات العضوية، مخصصة لكبار الاستشاريين المعتمدين من نقابة المهندسين أو أصحاب الإسهامات البارزة في عمارة البيئة وتنسيق المواقع.",
        "description_en": "The highest membership grade, designated for certified consulting engineers registered in the Syndicate or leaders with significant contributions to landscape architecture.",
        "annual_fee_egp": 1500,
        "required_documents": [
            {
                "id": "national_id",
                "name_ar": "بطاقة الرقم القومي / جواز السفر",
                "name_en": "National ID / Passport",
                "description_ar": "صورة واضحة للوجهين",
                "description_en": "Clear scan of both sides",
                "is_required": True,
                "accepted_formats": ["pdf", "jpg", "jpeg", "png"],
                "max_size_mb": 10
            },
            {
                "id": "consultant_cert",
                "name_ar": "شهادة أو كارنيه استشاري معتمد",
                "name_en": "Syndicate Consultant Certificate / Card",
                "description_ar": "شهادة قيد استشاري بتنسيق المواقع أو العمارة والتخطيط العمراني من نقابة المهندسين",
                "description_en": "Certified consultant status certificate issued by the Egyptian Engineers Syndicate",
                "is_required": True,
                "accepted_formats": ["pdf", "jpg", "jpeg", "png"],
                "max_size_mb": 10
            },
            {
                "id": "consultant_experience",
                "name_ar": "سجل وسنوات الخبرة (15+ سنة)",
                "name_en": "Verified Experience Record (15+ Yrs)",
                "description_ar": "بيان رسمي بمسيرة العمل المهني أو الأكاديمي لا تقل عن 15 عاماً",
                "description_en": "Official summary of at least 15 years of continuous high-level professional/academic practice",
                "is_required": True,
                "accepted_formats": ["pdf"],
                "max_size_mb": 10
            },
            {
                "id": "portfolio_pdf",
                "name_ar": "سابقة أعمال المشاريع الكبرى والمخططات العامة",
                "name_en": "Masterplan & Landmark Portfolio (PDF)",
                "description_ar": "ملف شامل يوضح المشاريع الكبرى أو المخططات العامة التي أشرف عليها المتقدم",
                "description_en": "Comprehensive portfolio showcasing master planning and major urban/landscape projects",
                "is_required": True,
                "accepted_formats": ["pdf"],
                "max_size_mb": 20
            },
            {
                "id": "recommendation_letters",
                "name_ar": "خطابات تزكية / أبحاث ومنشورات",
                "name_en": "Recommendation Letters / Academic Publications",
                "description_ar": "خطاب تزكية من استشاريين زملاء أو قائمة بالأبحاث والكتب المنشورة إن وجدت",
                "description_en": "Peer recommendation letters or list of published research/books in landscape architecture",
                "is_required": False,
                "accepted_formats": ["pdf"],
                "max_size_mb": 10
            },
            {
                "id": "personal_photo",
                "name_ar": "صورة شخصية حديثة",
                "name_en": "Personal Photograph",
                "description_ar": "صورة رسمية عالية الدقة",
                "description_en": "High resolution formal photo",
                "is_required": True,
                "accepted_formats": ["jpg", "jpeg", "png"],
                "max_size_mb": 5
            }
        ]
    }
}

@router.get("/", response_model=List[MembershipTierInfo])
def get_all_tiers():
    """Return all ESLA membership tiers with dynamic required document rules."""
    return list(MEMBERSHIP_TIERS.values())

@router.get("/{tier_id}", response_model=MembershipTierInfo)
def get_tier_by_id(tier_id: str):
    """Get specific tier requirements."""
    tier = MEMBERSHIP_TIERS.get(tier_id.lower())
    if not tier:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Membership tier not found")
    return tier
