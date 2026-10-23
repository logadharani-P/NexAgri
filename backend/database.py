import sqlite3
import os
from typing import List, Dict, Any, Optional

DB_FILE = os.path.join(os.path.dirname(__file__), "agriis_market.db")

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Create market_prices table with normalized official AGMARKNET schema
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS market_prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        arrival_date TEXT NOT NULL,
        state TEXT NOT NULL,
        district TEXT NOT NULL,
        market TEXT NOT NULL,
        commodity TEXT NOT NULL,
        category TEXT NOT NULL,
        variety TEXT NOT NULL DEFAULT 'Common / FAQ',
        grade TEXT NOT NULL DEFAULT 'FAQ (Fair Average Quality)',
        min_price REAL NOT NULL,
        max_price REAL NOT NULL,
        modal_price REAL NOT NULL,
        price_unit TEXT NOT NULL DEFAULT 'Rs/Quintal',
        price_per_kg REAL NOT NULL,
        arrival_quantity REAL NOT NULL DEFAULT 0.0,
        source TEXT NOT NULL DEFAULT 'AGMARKNET / data.gov.in',
        source_updated_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Create performance indexes for Pan-India queries
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_state ON market_prices(state);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_district ON market_prices(state, district);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_market ON market_prices(market);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_commodity ON market_prices(commodity);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_category ON market_prices(category);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_date ON market_prices(arrival_date);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_modal_price ON market_prices(modal_price);")
    cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_record ON market_prices(arrival_date, state, district, market, commodity, variety);")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("NEXAGRI Pan-India Database initialized successfully at", DB_FILE)
