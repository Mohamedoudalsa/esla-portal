import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Ensure backend directory is in sys.path regardless of CWD
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.database import engine, Base, BASE_DIR
from app.seed import seed_database
from app.routers import auth_routes, tier_routes, application_routes, document_routes, admin_routes

# Initialize DB tables & seed
Base.metadata.create_all(bind=engine)
try:
    seed_database()
except Exception as e:
    print(f"Warning during seed: {e}")

app = FastAPI(
    title="Egyptian Society of Landscape Architects (ESLA) Portal",
    description="Member Registration & Document Submission System for ESLA",
    version="1.0.0"
)

# CORS middleware for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth_routes.router)
app.include_router(tier_routes.router)
app.include_router(application_routes.router)
app.include_router(document_routes.router)
app.include_router(admin_routes.router)

# Mount Uploads directory
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Frontend directory
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend"))

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "ESLA Member Portal API", "society": "Egyptian Society of Landscape Architects"}

# Serve frontend single page app
@app.get("/")
def serve_index():
    index_file = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "ESLA API is running. Frontend index.html not yet deployed."}

# Static file fallback for frontend assets
if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="frontend_static")
