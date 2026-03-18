from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from models.user import User, UserCreate
from auth import UserLogin
from models.admin import Admin
from core.security import hash_password, verify_password, create_access_token
from models.subject import Subject
from utils import generate_usic
from core.s3 import upload_file
from core.ai import compare_docs


router = APIRouter()


# =========================
# 👤 USER REGISTER
# =========================
@router.post("/user/register")
async def register_user(data: UserCreate):
    existing = await User.find_one(User.email == data.email)
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    
    print("RAW PASSWORD:", data.password, len(data.password))

    user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password),
        university=data.university,
        college=data.college
    )

    await user.insert()
    return {"message": "User created"}


# =========================
# 👤 USER LOGIN (JWT)
# =========================
@router.post("/user/login")
async def login_user(data: UserLogin):
    user = await User.find_one(User.email == data.email)

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "user_id": str(user.id),
        "role": "user",
        "college":user.college
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "college": user.college,  
            "university": user.university
        }
    }

@router.post("/admin/login")
async def login_admin(data):
    admin = await Admin.find_one(Admin.name == data.name)

    if not admin or not verify_password(data.password, admin.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "admin_id": str(admin.id),
        "role": "admin"
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }


##Subjects routes
@router.post("/subject/create")
async def create_subject(
    university: str = Form(...),
    college: str = Form(...),
    academic_year: str = Form(...),
    regulation: str = Form(...),
    semester: int = Form(...),
    branch: str = Form(...),
    type: str = Form(...),
    name: str = Form(...),
    credits: float = Form(...),
    file: UploadFile = File(...)
):
    print("reached")
    data = {
    "university": university.strip().lower(),
    "college": college.strip().lower(),
    "academic_year": academic_year.strip(),
    "regulation": regulation.strip().lower(),
    "semester": int(semester),
    "branch": branch.strip().lower(),
    "type": type.strip().lower(),
    "name": name.strip().lower()
}

    print("reqsetn")
    print(data)

    usic = generate_usic(data)

    # 🔍 Check if subject exists
    existing = await Subject.find_one(Subject.usic == usic)

    # ☁️ Upload file
    file_url = await upload_file(file,usic)

    ai_diff = None
    version = 1
    prev_id = None

    if existing:
        ai_diff = compare_docs(existing.syllabus_url, file_url)
        version = existing.version + 1
        prev_id = str(existing.id)

    subject = Subject(
        usic=usic,
        credits=credits,
        syllabus_url=file_url,
        version=version,
        previous_version_id=prev_id,
        ai_diff_summary=ai_diff,
        **data
    )

    await subject.insert()

    return {
        "message": "Subject created",
        "usic": usic,
        "version": version,
        "ai_diff": ai_diff
    }

from fastapi import Depends
from core.security import get_current_user

@router.get("/subjects")
async def get_subjects(user=Depends(get_current_user)):
    college = user.get("college")

    subjects = await Subject.find(Subject.college == college).to_list()

    return subjects

@router.delete("/subject/{usic}")
async def delete_subject(usic: str, user=Depends(get_current_user)):
    subject = await Subject.find_one(Subject.usic == usic)

    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    if subject.college != user.get("college"):
        raise HTTPException(status_code=403, detail="Not allowed")

    await subject.delete()

    return {"message": "Deleted"}