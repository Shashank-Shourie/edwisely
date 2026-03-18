from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from database import init_db


app = FastAPI(title="My FastAPI App")

@app.on_event("startup")
async def on_startup():
    await init_db()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def root():
    return {"message": "API is running "}