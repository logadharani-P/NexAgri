# NEXAGRI Platform – Comprehensive Technology Stack & Feature Specification

> **Platform Name:** NEXAGRI – Smart Mandi & Farmer Market Linkage Platform  
> **Target Audience:** Farmers, Farmer Producer Organizations (FPOs), Verified Agricultural Buyers, Transporters, and Policy Administrators across Pan-India.  
> **Primary Objective:** Democratize market intelligence, eliminate predatory middlemen, provide real-time AGMARKNET price discovery, net-profit arbitrage calculation, AI-driven advisory, voice assistance in regional languages, and seamless PMFBY insurance claims.

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Frontend Technologies & Implementation Details](#2-frontend-technologies--implementation-details)
3. [Backend Technologies & Implementation Details](#3-backend-technologies--implementation-details)
4. [Database & Data Storage Engine](#4-database--data-storage-engine)
5. [Client-Side & Offline-First Technologies](#5-client-side--offline-first-technologies)
6. [Hardware & Web Platform APIs (Voice, Geolocation, PWA)](#6-hardware--web-platform-apis-voice-geolocation-pwa)
7. [External Services, Gateways & Data Integrations](#7-external-services-gateways--data-integrations)
8. [Module-by-Module Feature Directory](#8-module-by-module-feature-directory)
9. [Development, Build, and Code Quality Tooling](#9-development-build-and-code-quality-tooling)

---

## 1. Architecture Overview

NEXAGRI uses a decoupled **Client-Server Single Page Application (SPA) / Progressive Web App (PWA)** architecture:

* **Presentation Layer (Frontend):** Built with React 19, TypeScript, Vite, and Tailwind CSS v4, operating as an installable PWA that functions seamlessly even in low-bandwidth or offline rural environments.
* **API & Business Logic Layer (Backend):** Built with Python 3, FastAPI, and Uvicorn, serving asynchronous RESTful endpoints with sub-10ms response times.
* **Persistence Layer (Database):** Embedded SQLite database (`agriis_market.db`) with composite B-Tree indexes containing normalized Pan-India AGMARKNET data covering hundreds of APMC mandis.
* **Edge & Hardware Integration:** Web Speech Recognition & Synthesis APIs for hands-free multilingual farmer interaction, HTML5 Geolocation for mandi proximity calculation, and SMS gateways for feature phone reach.

```
+-------------------------------------------------------------------------------+
|                             FARMER / BUYER CLIENT                             |
|    (PWA / Mobile / Desktop Browser - React 19 + TypeScript + Tailwind CSS)    |
+------------------------------------+------------------------------------------+
                                     |
                                     | HTTP REST / JSON / FormData
                                     v
+-------------------------------------------------------------------------------+
|                               FASTAPI BACKEND                                 |
|                       (Uvicorn ASGI Server - Python)                          |
+------------------------------------+------------------------------------------+
|  • AGMARKNET Price Engine          |  • AI Price Predictor & Volatility Model |
|  • Transport Arbitrage Engine      |  • Automated SMS Alert Triggers          |
|  • Buyer-Farmer Order Matching     |  • Mock UPI Escrow & Settlement Service  |
|  • PMFBY Insurance Claim Engine    |  • Role-based Authentication & Profile   |
+------------------------------------+------------------------------------------+
                                     |
                                     | SQL Queries (Indexed)
                                     v
+-------------------------------------------------------------------------------+
|                       SQLITE EMBEDDED RELATIONAL DB                           |
|                            (agriis_market.db)                                 |
|  • 439+ Mandi Records  • Arrival Volumes  • Historical Modal/Min/Max Prices   |
+-------------------------------------------------------------------------------+
```

---

## 2. Frontend Technologies & Implementation Details

### 2.1. React 19 (`react` & `react-dom` v19.2.8)
* **What it is:** The latest standard of the world's most adopted declarative UI framework.
* **Why used:** Provides component reusability, fine-grained state management, concurrent rendering, and hooks (`useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`, `useContext`).
* **Features implemented with React 19:**
  * Dynamic navigation switching between Farmer, Buyer, Admin, Insurance, and Logistics modules.
  * Real-time reactive updates for filter selections (State -> District -> Mandi -> Commodity -> Variety).
  * Modal overlays for Voice Assistant, AI Chatbot, Price Predictor, Price Comparison, and Automatic SMS Alert triggers.

### 2.2. TypeScript (`typescript` ~v6.0.2)
* **What it is:** Strongly typed superset of JavaScript that compiles down to clean JavaScript.
* **Why used:** Eliminates runtime crashes, guarantees schema consistency with backend Pydantic models, and auto-completes complex agricultural data structures.
* **Features implemented with TypeScript:**
  * Strictly typed interfaces for mandi records, crop lots, buyer profiles, insurance policies, loss survey reports, and SMS logs (`types/index.ts`, `types/insurance.ts`).
  * Strict null checks and type guards for API response fallback logic.

### 2.3. Vite (`vite` v8.2.2 & `@vitejs/plugin-react` v6.1.0)
* **What it is:** Next-generation frontend tooling offering instant development server start and lightning-fast Hot Module Replacement (HMR).
* **Why used:** Drastically accelerates development speed and produces an optimized tree-shaken production bundle (`dist/`).
* **Features implemented with Vite:**
  * Fast ES modules compilation and modern asset handling.
  * Production asset chunking and compression for fast rural 3G/4G loading.

### 2.4. Tailwind CSS (`tailwindcss` v4.3.3 & `@tailwindcss/postcss`)
* **What it is:** High-performance, zero-runtime utility-first CSS framework.
* **Why used:** Provides custom HSL-tailored agricultural color palettes, glassmorphism cards, micro-animations, and fluid responsive design without heavy styling overhead.
* **Features implemented with Tailwind CSS:**
  * Emerald/Green/Blue agricultural theme (`#16a34a`, `#2563eb`, `#f8fafc`).
  * Fully responsive layouts adapting from mobile phones (360px) to desktop dashboards (1920px).
  * Dynamic badges for quality grades (`Grade A`, `FAQ`), price trends (surging green, dropping red), and order statuses.

### 2.5. Leaflet (`leaflet` v1.9.4 & `@types/leaflet` v1.9.22)
* **What it is:** The leading open-source JavaScript library for mobile-friendly interactive maps.
* **Why used:** Enables geospatial visualization of APMC mandis and transport routes without expensive third-party proprietary mapping fees.
* **Features implemented with Leaflet:**
  * Interactive OpenStreetMap tile rendering in `MarketMap.tsx`.
  * Pinpoint clustering of APMC mandis across India with color-coded markers based on modal price levels.
  * Distance calculation and marker popups displaying today's arrival quantity, min price, modal price, and direct navigation links.

### 2.6. Recharts (`recharts` v3.10.1)
* **What it is:** Composable, declarative charting library built on React components and SVG.
* **Why used:** Provides high-resolution, interactive, and responsive visualizations for financial and agricultural data.
* **Features implemented with Recharts:**
  * Historical 30-day modal price trend lines.
  * Forecasted price projection curves with upper and lower volatility confidence intervals in `PricePredictorModal.tsx`.
  * Mandi arrival volume bar charts comparing local vs regional APMC wholesale supply.

### 2.7. Lucide React (`lucide-react` v1.41.0)
* **What it is:** Modern, clean, and consistent icon library for React.
* **Why used:** Provides clear, visually communicative iconography essential for rural users with varying literacy levels.
* **Features implemented with Lucide:**
  * Visual representations of weather (rain radar, sunlight), crops (sprout, leaf), transport (truck, van), financial safety (shield, credit card, QR code), and voice operations (mic, speaker).

### 2.8. Canvas Confetti (`canvas-confetti` v1.9.4)
* **What it is:** High-performance HTML5 canvas confetti particle emitter.
* **Why used:** Enhances user experience by providing positive psychological feedback upon significant farmer milestones.
* **Features implemented with Canvas Confetti:**
  * Triggered upon successful crop lot listing, order settlement confirmation, and PMFBY crop loss claim submission.

---

## 3. Backend Technologies & Implementation Details

### 3.1. Python 3 (v3.10+)
* **What it is:** High-level, readable, interpreted programming language widely adopted for data processing, AI, and web APIs.
* **Why used:** Native compatibility with mathematical calculations, rapid string normalization, and seamless database integration.

### 3.2. FastAPI (`fastapi` >= v0.110.0)
* **What it is:** Modern, fast (high-performance) web framework for building APIs with Python based on standard Python type hints.
* **Why used:** Built-in automatic OpenAPI (Swagger) documentation, asynchronous request handling (`async`/`await`), dependency injection, and native Pydantic validation.
* **Features implemented with FastAPI:**
  * Real-time search and filter endpoints for States, Districts, Mandis, Commodities, and Prices.
  * Crop price prediction engine endpoints (`/predict/{crop_id}`).
  * Multi-market net price comparison & arbitrage calculation endpoints (`/compare-markets/{crop_id}`).
  * Direct farmer crop lot creation and listing endpoints (`/lots`).
  * Buyer order creation, tracking, and dispute registration endpoints.
  * SMS alert configuration and dispatch endpoints (`/sms/send`, `/sms/auto-rules`, `/sms/auto-evaluate`).
  * Simulated UPI Escrow profile and milestone payment processing.

### 3.3. Uvicorn (`uvicorn` >= v0.28.0)
* **What it is:** Lightning-fast ASGI (Asynchronous Server Gateway Interface) web server implementation for Python.
* **Why used:** Handles concurrent client requests with minimal memory footprint and high I/O throughput.

### 3.4. Pydantic v2 (`pydantic` >= v2.6.0)
* **What it is:** Data parsing and validation library using Python type annotations.
* **Why used:** Guarantees that all client inputs (numeric quantities, phone numbers, price values, dates) strictly adhere to defined schemas before touching the database or business logic.
* **Schemas defined in `backend/schemas.py`:**
  * `CropLotCreate`: Validation for farmer harvest lot submissions.
  * `PredictionRequest`: Commodity and mandi parameters for price trend calculations.
  * `NetPriceComparisonRequest`: Origin location, transport payload, and candidate destination markets.
  * `OrderCreate`: Buyer order parameters, quantity agreements, and pickup schedules.
  * `DisputeCreate`: Grievance category, order reference, and contact verification.
  * `AutoSMSPreferences` & `AutoSMSEvaluateRequest`: Threshold percentages for price surge, arrival drops, and weather warnings.

### 3.5. Python Multipart (`python-multipart` >= v0.0.9)
* **What it is:** Streaming multipart/form-data parser for Python.
* **Why used:** Enables file and photo upload handling for crop lot inspection pictures and insurance claim loss damage evidence.

---

## 4. Database & Data Storage Engine

### 4.1. SQLite 3 (`agriis_market.db`)
* **What it is:** Serverless, zero-configuration, transactional SQL database engine stored directly as a file on disk.
* **Why used:** Zero external service dependency, lightning-fast reads, minimal server overhead, and portability.
* **Schema Design (`database.py`):**
  * `market_prices` table:
    * `id`: Primary key (autoincrement).
    * `arrival_date`: Date string formatted (`YYYY-MM-DD`).
    * `state`: State name (e.g., Tamil Nadu, Maharashtra, Karnataka, Punjab).
    * `district`: District administrative division.
    * `market`: APMC Mandi regulated market name.
    * `commodity`: Agricultural produce name (e.g., Tomato, Onion, Potato, Wheat, Cotton).
    * `category`: Broad crop classification (Vegetables, Fruits, Cereals/Grains, Pulses, Oilseeds, Spices, Commercial).
    * `variety`: Specific crop cultivar/hybrid designation.
    * `grade`: Quality classification (FAQ, Grade A, etc.).
    * `min_price`, `max_price`, `modal_price`: Prices in Indian Rupees per Quintal (100 kg).
    * `price_per_kg`: Computed standard unit price for easy farmer comprehension.
    * `arrival_quantity`: Tonnage/Quintals arriving at the mandi on the given date.
    * `source`: Official AGMARKNET / data.gov.in provenance.
* **Performance Indexing:**
  * `idx_state`: Rapid filtering by Indian state.
  * `idx_district`: District-level drill-down queries.
  * `idx_market`: Single-mandi lookup index.
  * `idx_commodity` & `idx_category`: Fast search for specific crops.
  * `idx_modal_price`: Price sorting for lowest/highest price discovery.
  * `idx_unique_record`: Unique composite constraint preventing duplicate historical entries.

---

## 5. Client-Side & Offline-First Technologies

### 5.1. Progressive Web App (PWA)
* **What it is:** Web application technologies that provide native mobile app-like experiences.
* **Features implemented:**
  * `manifest.json`: Defines home screen icons, standalone display orientation, and brand theme colors (`#2563EB`).
  * Installable directly from Chrome, Edge, Safari on Android and iOS devices without requiring the Google Play Store or Apple App Store.

### 5.2. Offline Storage & Resilience (`offlineStorage.ts` & `OfflineContext.tsx`)
* **What it is:** Client-side persistence system utilizing the browser's `localStorage` and memory caching.
* **Features implemented:**
  * **Automatic Cache Fallback:** If the user is in a rural area with intermittent or zero internet connectivity, the app transparently serves pre-cached PAN-India datasets from [marketPricesDataset.ts](file:///c:/Users/ELCOT/OneDrive/Desktop/SIH/frontend/src/data/marketPricesDataset.ts).
  * **Offline Action Queue:** Allows farmers to record lots or save buyer enquiries offline; actions are queued and synced once connectivity is restored.
  * **Offline Status Banner:** Real-time visual indicator displaying offline/online connection state without blocking user interaction.

### 5.3. Multi-Language Localization Engine (`LanguageContext.tsx` & `translations.ts`)
* **What it is:** Custom client-side internationalization (i18n) framework tailored for Indian agriculture.
* **Features implemented:**
  * Supports 13 Indian languages: English, Tamil (தமிழ்), Hindi (हिन्दी), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Marathi (मराठी), Gujarati (ગુજરાતી), Bengali (বাংলা), Punjabi (ਪੰਜਾਬੀ), Odia (ଓଡ଼ିଆ), Assamese (অসমীয়া), and Urdu (اردو).
  * Instant, zero-reload runtime language switching across all dashboard cards, navigation buttons, and modal dialogs.

---

## 6. Hardware & Web Platform APIs

### 6.1. Web Speech API (Voice Recognition & Voice Synthesis)
* **What it is:** Native W3C browser APIs enabling voice input interpretation and text-to-speech output.
* **Features implemented in `NexAgriVoiceAssistant.tsx`:**
  * **Speech-to-Text (`SpeechRecognition` / `webkitSpeechRecognition`):** Allows farmers to speak naturally into their smartphone or computer microphone to ask: *"What is today's tomato modal price in Coimbatore?"* or *"Where should I sell 2500 kg onions for maximum profit?"*
  * **Text-to-Speech (`SpeechSynthesis`):** The AI assistant speaks answers back out loud in the farmer's selected native language (e.g., Tamil, Hindi, Kannada, Telugu), ensuring complete accessibility for illiterate or semi-literate farmers.

### 6.2. HTML5 Geolocation API
* **What it is:** Browser API that provides the user's latitude and longitude coordinates.
* **Features implemented:**
  * Automatically detects the farmer's current location to determine the nearest APMC mandis, calculate transit distances, and provide localized weather forecasts.

---

## 7. External Services, Gateways & Data Integrations

### 7.1. Pan-India AGMARKNET Integration
* **What it is:** Agricultural Marketing Information Network operated by the Directorate of Marketing & Inspection (DMI), Ministry of Agriculture and Farmers Welfare, Government of India.
* **Features implemented:**
  * Real-time and standardized schema mapping of wholesale market arrivals, maximum, minimum, and modal prices across 439+ Indian mandis.

### 7.2. Multi-Channel SMS Alert Engine
* **What it is:** Tri-mode SMS notification system designed to deliver critical market alerts to both smartphones and basic feature phones.
* **Integration options implemented in `backend/main.py` & `AutomaticSMSModal.tsx`:**
  * **Fast2SMS Gateway:** Bulk SMS provider for Indian mobile numbers with direct API integration.
  * **Twilio SMS Gateway:** Global programmable SMS gateway for verified enterprise messaging.
  * **Device-Native Web SMS Fallback:** Generates direct `sms:+91XXXXXXXXXX?body=...` URIs allowing users to send pre-formatted market alerts from their native mobile messaging app without third-party API costs.
  * **Trigger Rules:**
    * Modal price surge exceeding user-defined threshold (e.g., +8%).
    * Sudden market arrival drops indicating high demand.
    * Extreme weather warnings (rain probability >35%) near harvest date.

### 7.3. UPI Escrow & Digital Payment Settlement
* **What it is:** Simulated Unified Payments Interface (UPI) escrow framework modeling National Payments Corporation of India (NPCI) and RBI guidelines.
* **Features implemented:**
  * Virtual payment addresses (`farmer@sbi`), dynamic payment QR code string generation (`upi://pay?pa=...`).
  * Three-stage escrow milestone release:
    1. Buyer deposits full amount into escrow prior to crop pickup.
    2. Transporter verifies loading with geo-tagged checkpoint.
    3. Farmer confirms delivery; funds are instantly credited to the farmer's UPI account.

### 7.4. PMFBY (Pradhan Mantri Fasal Bima Yojana) Integration
* **What it is:** The Government of India flagship crop insurance scheme.
* **Features implemented in `CropInsuranceDashboard.tsx`:**
  * Official seasonal premium rates: 2.0% for Kharif foodgrains/oilseeds, 1.5% for Rabi foodgrains/oilseeds, and 5.0% for Annual Commercial & Horticultural crops.
  * Premium Calculator computing Sum Insured per hectare, government subsidy share, and farmer payable contribution.
  * Crop Loss Intimation workflow supporting 72-hour reporting mandates with GPS tag and photo attachment simulation.

---

## 8. Module-by-Module Feature Directory

| Module File | Key Technologies Used | Primary Features |
| :--- | :--- | :--- |
| [FarmerHome.tsx](file:///c:/Users/ELCOT/OneDrive/Desktop/SIH/frontend/src/components/FarmerHome.tsx) | React 19, Lucide, Tailwind CSS | Dashboard landing hub, live market price ticker, weather forecast card, crop lot summary, quick actions to voice assistant and buyer finder. |
| [MarketPrices.tsx](file:///c:/Users/ELCOT/OneDrive/Desktop/SIH/frontend/src/components/MarketPrices.tsx) | React 19, TypeScript, REST API, Tailwind CSS | Full-featured Pan-India price discovery across 439+ mandis. Drill-down filtering by State, District, Market, Commodity, Category. Instant SMS alert subscription. |
| [MarketMap.tsx](file:///c:/Users/ELCOT/OneDrive/Desktop/SIH/frontend/src/components/MarketMap.tsx) | Leaflet, OpenStreetMap, HTML5 Geolocation | Geospatial APMC mandi locator, distance calculation from farm, color-coded price markers, popup detail cards. |
| [PricePredictorModal.tsx](file:///c:/Users/ELCOT/OneDrive/Desktop/SIH/frontend/src/components/PricePredictorModal.tsx) | Recharts, SVG, Lucide, FastAPI Predictor | 7-day to 30-day modal price trend forecasting, volatility risk rating (Low/Medium/High), harvest timing recommendations. |
| [PriceComparisonModal.tsx](file:///c:/Users/ELCOT/OneDrive/Desktop/SIH/frontend/src/components/PriceComparisonModal.tsx) | React 19, Lucide, Arbitrage Logic | Multi-mandi net-profit comparison. Computes distance, fuel freight, transit spoilage, and determines the true highest net-earning mandi. |
| [NexAgriVoiceAssistant.tsx](file:///c:/Users/ELCOT/OneDrive/Desktop/SIH/frontend/src/components/NexAgriVoiceAssistant.tsx) | Web Speech API, React 19, Lucide | 2-way multilingual voice assistant supporting 13 Indian languages with speech-to-text input and natural text-to-speech audio playback. |
| [AgriAIChatbot.tsx](file:///c:/Users/ELCOT/OneDrive/Desktop/SIH/frontend/src/components/AgriAIChatbot.tsx) | React 19, Lucide, FastAPI Chat Endpoint | 24/7 agricultural advisor handling queries on pest control, harvest windows, buyer negotiations, mandi trends, and payment policies. |
| [FindBuyers.tsx](file:///c:/Users/ELCOT/OneDrive/Desktop/SIH/frontend/src/components/FindBuyers.tsx) | React 19, TypeScript, Tailwind CSS | Directory of verified institutional buyers, FPOs, and food processors. Direct quotation requests, rating badges, and requirement matching. |
| [MyCropsLots.tsx](file:///c:/Users/ELCOT/OneDrive/Desktop/SIH/frontend/src/components/MyCropsLots.tsx) | React 19, TypeScript, Canvas Confetti | Crop lot listing manager for farmers. Add new lots with variety, grade, harvest date, expected price, and instant buyer visibility. |
| [OrdersTracker.tsx](file:///c:/Users/ELCOT/OneDrive/Desktop/SIH/frontend/src/components/OrdersTracker.tsx) | React 19, Lucide, Tailwind CSS | Full order status pipeline tracking from quotation to pickup, transit, delivery, and payment settlement. |
| [PaymentsUPI.tsx](file:///c:/Users/ELCOT/OneDrive/Desktop/SIH/frontend/src/components/PaymentsUPI.tsx) | React 19, Lucide, Canvas Confetti | Bank account linkage, dynamic UPI QR code generator, escrow fund milestone tracking, and instant mock settlement. |
| [LogisticsStorage.tsx](file:///c:/Users/ELCOT/OneDrive/Desktop/SIH/frontend/src/components/LogisticsStorage.tsx) | React 19, Lucide, Tailwind CSS | On-demand farm transport booking (Tata Ace, 14ft, 20ft Eicher) with per-km rates, plus cold storage and dry warehouse directory. |
| [CropInsuranceDashboard.tsx](file:///c:/Users/ELCOT/OneDrive/Desktop/SIH/frontend/src/components/CropInsuranceDashboard.tsx) | React 19, Lucide, TypeScript | End-to-end PMFBY crop insurance portal: seasonal premium calculator, 72-hr crop loss intimation with camera/photo upload, policy tracking, helpline directory, and FAQs. |
| [AutomaticSMSModal.tsx](file:///c:/Users/ELCOT/OneDrive/Desktop/SIH/frontend/src/components/AutomaticSMSModal.tsx) | React 19, REST API, Fast2SMS/Twilio | Configuration center for automated mobile SMS alerts based on custom price surge thresholds, arrival crashes, or rain forecasts. |
| [DisputesModule.tsx](file:///c:/Users/ELCOT/OneDrive/Desktop/SIH/frontend/src/components/DisputesModule.tsx) | React 19, TypeScript, REST API | Farmer-buyer dispute arbitration portal for weight discrepancies, quality disputes, or payment delays. |
| [AdminDashboard.tsx](file:///c:/Users/ELCOT/OneDrive/Desktop/SIH/frontend/src/components/AdminDashboard.tsx) | React 19, Recharts, Lucide | Platform governance portal tracking total farmers, trade volume, active escrow funds, and AGMARKNET sync health. |

---

## 9. Development, Build, and Code Quality Tooling

* **[Oxlint](https://oxc.rs/) (`oxlint` v1.79.0):**
  * Configured in [.oxlintrc.json](file:///c:/Users/ELCOT/OneDrive/Desktop/SIH/frontend/.oxlintrc.json).
  * High-performance Rust-based linter that scans TypeScript/React code up to 50x faster than legacy ESLint.
* **[PostCSS](https://postcss.org/) & [Autoprefixer](https://github.com/postcss/autoprefixer):**
  * Automatically compiles Tailwind CSS directives and injects browser-specific CSS vendor prefixes for cross-browser compatibility across legacy mobile browsers.
* **TypeScript Compiler (`tsc`):**
  * Runs type checking during build step (`npm run build`) ensuring zero type regressions before Vite generates the production package.
