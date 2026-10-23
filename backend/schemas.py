from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class CropLotCreate(BaseModel):
    crop_name: str
    variety: str = "Standard"
    quantity_kg: float
    quality_grade: str = "Grade A"
    harvest_date: str
    location: str
    expected_price_per_kg: float
    notes: Optional[str] = None

class PredictionRequest(BaseModel):
    crop_id: str
    mandi_name: str
    current_price: float

class NetPriceComparisonRequest(BaseModel):
    crop_id: str
    quantity_kg: float
    origin_location: str
    markets: Optional[List[str]] = None

class OrderCreate(BaseModel):
    buyer_id: str
    farmer_id: str = "FAR_DEFAULT"
    crop_name: str
    quantity_kg: float
    agreed_price_per_kg: float
    delivery_location: str
    pickup_date: str

class DisputeCreate(BaseModel):
    order_id: str
    category: str
    description: str
    contact_phone: str

class AIChatQuery(BaseModel):
    query: str
    language: str = "English"
    crop: Optional[str] = None
    location: Optional[str] = None

class TransportCalculationRequest(BaseModel):
    origin_location: str
    destination_mandi: str
    crop: str
    quantity_kg: float
    current_modal_price_per_kg: Optional[float] = None

class SMSAlertRequest(BaseModel):
    phone_number: str
    alert_type: str = "price_alert"
    crop: str
    mandi: str
    price_per_kg: Optional[float] = None
    custom_message: Optional[str] = None

class UPIProfileRequest(BaseModel):
    upi_id: str
    bank_name: Optional[str] = "State Bank of India"
    is_default: bool = True

class AutoSMSPreferences(BaseModel):
    enabled: bool = True
    phone_number: str = "+91 98765 43210"
    auto_price_surge_enabled: bool = True
    price_surge_threshold_pct: float = 8.0
    auto_arrival_drop_enabled: bool = True
    auto_rain_warning_enabled: bool = True
    rain_threshold_pct: float = 35.0
    auto_order_escrow_enabled: bool = True
    monitored_crops: List[str] = ["Tomato", "Onion", "Potato", "Turmeric", "Cotton"]
    preferred_mandi: str = "Coimbatore Main Mandi"
    frequency: str = "instant"
    gateway_provider: Optional[str] = "device_sms" # "device_sms", "fast2sms", "twilio"
    fast2sms_api_key: Optional[str] = None
    twilio_account_sid: Optional[str] = None
    twilio_auth_token: Optional[str] = None
    twilio_from_phone: Optional[str] = None

class AutoSMSEvaluateRequest(BaseModel):
    phone_number: Optional[str] = None
    crop: Optional[str] = "Tomato"
    mandi: Optional[str] = "Coimbatore Main Mandi"
    force_trigger: Optional[bool] = False
    fast2sms_api_key: Optional[str] = None

