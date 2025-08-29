from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import membership_service
import content_service

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
    # 在开发环境中运行FastAPI应用程序
    uvicorn.run(
        "mainC:app",  # 应用程序入口点
        host="localhost",  # 本地主机
        port=8001,  # 端口号
        reload=True,  # 启用热重载用于开发
        log_level="debug"  # 详细日志记录
    )
