from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class Report(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    type: str
    owner: str
    status: str
    status_class: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ReportCreate(BaseModel):
    title: str
    type: str
    owner: str
    status: str
    status_class: str


class Campaign(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    channel: str
    spend: str
    roas: str
    status_class: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class CampaignCreate(BaseModel):
    title: str
    channel: str
    spend: str
    roas: str
    status_class: str


class Setting(BaseModel):
    id: str = "user_settings"
    is_dark: bool = True
    selected_swatch: str = "#9D8CFF"
    live_stats: bool = True
    reduced_motion: bool = False
    compact_mode: bool = False
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class Transaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    plan: str
    amount: str
    status_class: str
    status_text: str
    color: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# Helper to format MongoDB doc (Pydantic v2 format helper)
def format_doc(doc: dict) -> dict:
    if not doc:
        return doc
    doc["id"] = str(doc.pop("_id")) if "_id" in doc else doc.get("id")
    return doc


# Seed script to populate with realistic data if collections are empty
async def seed_database():
    # Reports Seed
    reports_count = await db.reports.count_documents({})
    if reports_count == 0:
        initial_reports = [
            {"_id": str(uuid.uuid4()), "title": "Q3 Revenue Summary", "type": "Financial", "owner": "Ari Rhodes", "status": "Ready", "status_class": "ok", "created_at": datetime.now(timezone.utc).isoformat()},
            {"_id": str(uuid.uuid4()), "title": "Weekly Engagement", "type": "Product", "owner": "Mei Lin", "status": "Ready", "status_class": "ok", "created_at": datetime.now(timezone.utc).isoformat()},
            {"_id": str(uuid.uuid4()), "title": "Churn Cohort Analysis", "type": "Retention", "owner": "Dana Osei", "status": "Building", "status_class": "wait", "created_at": datetime.now(timezone.utc).isoformat()},
            {"_id": str(uuid.uuid4()), "title": "Ad Spend Breakdown", "type": "Marketing", "owner": "Omar Haddad", "status": "Ready", "status_class": "ok", "created_at": datetime.now(timezone.utc).isoformat()},
            {"_id": str(uuid.uuid4()), "title": "API Latency Audit", "type": "Engineering", "owner": "Jonas Berg", "status": "Failed", "status_class": "fail", "created_at": datetime.now(timezone.utc).isoformat()},
            {"_id": str(uuid.uuid4()), "title": "User Funnel Report", "type": "Product", "owner": "Sofia Reyes", "status": "Ready", "status_class": "ok", "created_at": datetime.now(timezone.utc).isoformat()}
        ]
        await db.reports.insert_many(initial_reports)
        logging.info("Seeded reports collection")

    # Campaigns Seed
    campaigns_count = await db.campaigns.count_documents({})
    if campaigns_count == 0:
        initial_campaigns = [
            {"_id": str(uuid.uuid4()), "title": "Summer Launch", "channel": "Search", "spend": "$12,400", "roas": "4.8x", "status_class": "ok", "created_at": datetime.now(timezone.utc).isoformat()},
            {"_id": str(uuid.uuid4()), "title": "Retargeting Q3", "channel": "Social", "spend": "$8,900", "roas": "5.2x", "status_class": "ok", "created_at": datetime.now(timezone.utc).isoformat()},
            {"_id": str(uuid.uuid4()), "title": "Brand Awareness", "channel": "Display", "spend": "$6,200", "roas": "2.1x", "status_class": "wait", "created_at": datetime.now(timezone.utc).isoformat()},
            {"_id": str(uuid.uuid4()), "title": "Newsletter Drive", "channel": "Email", "spend": "$3,100", "roas": "6.4x", "status_class": "ok", "created_at": datetime.now(timezone.utc).isoformat()},
            {"_id": str(uuid.uuid4()), "title": "Video Series", "channel": "Video", "spend": "$9,800", "roas": "3.3x", "status_class": "ok", "created_at": datetime.now(timezone.utc).isoformat()},
            {"_id": str(uuid.uuid4()), "title": "Partner Promo", "channel": "Search", "spend": "$4,500", "roas": "1.4x", "status_class": "fail", "created_at": datetime.now(timezone.utc).isoformat()}
        ]
        await db.campaigns.insert_many(initial_campaigns)
        logging.info("Seeded campaigns collection")

    # Transactions Seed
    txns_count = await db.transactions.count_documents({})
    if txns_count == 0:
        initial_txns = [
            {"_id": str(uuid.uuid4()), "customer_name": "Priya Nair", "plan": "Scale · annual", "amount": "$4,800", "status_class": "ok", "status_text": "Paid", "color": "var(--accent)", "created_at": datetime.now(timezone.utc).isoformat()},
            {"_id": str(uuid.uuid4()), "customer_name": "Marcus Vale", "plan": "Pro · monthly", "amount": "$149", "status_class": "ok", "status_text": "Paid", "color": "var(--accent-2)", "created_at": datetime.now(timezone.utc).isoformat()},
            {"_id": str(uuid.uuid4()), "customer_name": "Dana Osei", "plan": "Scale · monthly", "amount": "$620", "status_class": "wait", "status_text": "Pending", "color": "var(--accent-3)", "created_at": datetime.now(timezone.utc).isoformat()},
            {"_id": str(uuid.uuid4()), "customer_name": "Leo Fischer", "plan": "Starter · monthly", "amount": "$29", "status_class": "ok", "status_text": "Paid", "color": "var(--accent)", "created_at": datetime.now(timezone.utc).isoformat()},
            {"_id": str(uuid.uuid4()), "customer_name": "Yuki Tanaka", "plan": "Pro · annual", "amount": "$1,490", "status_class": "fail", "status_text": "Failed", "color": "var(--neg)", "created_at": datetime.now(timezone.utc).isoformat()},
            {"_id": str(uuid.uuid4()), "customer_name": "Sofia Reyes", "plan": "Scale · annual", "amount": "$5,240", "status_class": "ok", "status_text": "Paid", "color": "var(--accent-2)", "created_at": datetime.now(timezone.utc).isoformat()},
            {"_id": str(uuid.uuid4()), "customer_name": "Alex Chen", "plan": "Pro · monthly", "amount": "$149", "status_class": "ok", "status_text": "Paid", "color": "var(--accent)", "created_at": datetime.now(timezone.utc).isoformat()},
            {"_id": str(uuid.uuid4()), "customer_name": "Elena Rostova", "plan": "Scale · monthly", "amount": "$620", "status_class": "ok", "status_text": "Paid", "color": "var(--accent-2)", "created_at": datetime.now(timezone.utc).isoformat()},
            {"_id": str(uuid.uuid4()), "customer_name": "John Doe", "plan": "Starter · annual", "amount": "$290", "status_class": "wait", "status_text": "Pending", "color": "var(--accent-3)", "created_at": datetime.now(timezone.utc).isoformat()},
            {"_id": str(uuid.uuid4()), "customer_name": "Amara Diallo", "plan": "Pro · annual", "amount": "$1,490", "status_class": "ok", "status_text": "Paid", "color": "var(--accent)", "created_at": datetime.now(timezone.utc).isoformat()}
        ]
        await db.transactions.insert_many(initial_txns)
        logging.info("Seeded transactions collection")


@app.on_event("startup")
async def startup_db_client():
    await seed_database()


# Routes
@api_router.get("/")
async def root():
    return {"message": "Cadence API is fully operational"}


# --- Reports API ---
@api_router.get("/reports", response_model=List[Report])
async def get_reports():
    reports = await db.reports.find().to_list(1000)
    return [Report(**format_doc(r)) for r in reports]


@api_router.post("/reports", response_model=Report)
async def create_report(input_report: ReportCreate):
    report_dict = input_report.model_dump()
    new_id = str(uuid.uuid4())
    report_dict["_id"] = new_id
    report_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.reports.insert_one(report_dict)
    
    saved_report = await db.reports.find_one({"_id": new_id})
    return Report(**format_doc(saved_report))


# --- Campaigns API ---
@api_router.get("/campaigns", response_model=List[Campaign])
async def get_campaigns():
    campaigns = await db.campaigns.find().to_list(1000)
    return [Campaign(**format_doc(c)) for c in campaigns]


@api_router.post("/campaigns", response_model=Campaign)
async def create_campaign(input_campaign: CampaignCreate):
    campaign_dict = input_campaign.model_dump()
    new_id = str(uuid.uuid4())
    campaign_dict["_id"] = new_id
    campaign_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.campaigns.insert_one(campaign_dict)
    
    saved_campaign = await db.campaigns.find_one({"_id": new_id})
    return Campaign(**format_doc(saved_campaign))


# --- Transactions API ---
@api_router.get("/transactions", response_model=List[Transaction])
async def get_transactions(q: Optional[str] = None):
    query = {}
    if q:
        query = {
            "$or": [
                {"customer_name": {"$regex": q, "$options": "i"}},
                {"plan": {"$regex": q, "$options": "i"}},
                {"status_text": {"$regex": q, "$options": "i"}}
            ]
        }
    transactions = await db.transactions.find(query).to_list(1000)
    return [Transaction(**format_doc(t)) for t in transactions]


# --- Settings API ---
@api_router.get("/settings", response_model=Setting)
async def get_settings():
    settings = await db.settings.find_one({"_id": "user_settings"})
    if not settings:
        return Setting()
    return Setting(**format_doc(settings))


@api_router.post("/settings", response_model=Setting)
async def save_settings(input_settings: Setting):
    settings_dict = input_settings.model_dump()
    settings_dict["_id"] = "user_settings"
    settings_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.settings.replace_one({"_id": "user_settings"}, settings_dict, upsert=True)
    saved_settings = await db.settings.find_one({"_id": "user_settings"})
    return Setting(**format_doc(saved_settings))


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
