from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import membership_service, content_service

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev; restrict in prod!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with prefixes
app.include_router(membership_service.router, prefix="/membership", tags=["Membership"])
app.include_router(content_service.router, prefix="/content", tags=["Content"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)