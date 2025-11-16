from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from pathlib import Path
from typing import List, Dict, Any
import logging

logger = logging.getLogger("search_controller")
logger.setLevel(logging.INFO)

# Try to import the repo's real backends; fall back to lightweight local implementations
USE_REAL_BACKEND = True
try:
    from search_backend import SearchBackend
    from semantic_search import VectorDB
    from llm_connector import LLMConnector
except Exception as e:
    logger.warning("Could not import full backend stack (%s). Falling back to a lightweight local recommender for dev: %s", type(e).__name__, e)
    USE_REAL_BACKEND = False

app = FastAPI(title="Travel Discovery API (dev-safe)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecommendRequest(BaseModel):
    query: str

ATTRACTIONS_CSV_PATH = Path(__file__).resolve().parents[2] / "Attractions.csv"

def load_attractions_from_csv(csv_path: Path):
    try:
        import pandas as pd
    except Exception:
        logger.warning("pandas not available; cannot load Attractions.csv")
        return []
    if not csv_path.exists():
        logger.warning("Attractions.csv not found at %s", csv_path)
        return []
    df = pd.read_csv(csv_path)
    records = []
    for idx, row in df.iterrows():
        rec: Dict[str, Any] = {}
        rec["id"] = str(row.get("id", f"row-{idx}"))
        rec["name"] = row.get("name") or row.get("attraction_name") or row.get("title") or ""
        rec["description"] = row.get("description") or row.get("summary") or ""
        rec["city"] = row.get("city") or row.get("location_city") or ""
        rec["country"] = row.get("country") or row.get("location_country") or ""
        rec["image_url"] = row.get("image_url") or row.get("photo") or ""
        rec["score"] = float(row.get("score", 0.5))
        records.append(rec)
    return records

def simple_text_search(query: str, top_k: int = 10):
    records = load_attractions_from_csv(ATTRACTIONS_CSV_PATH)
    if not records:
        return [
            {
                "id": "mock1",
                "name": "Mock Beach",
                "description": "A calm beach for relaxation, perfect for families.",
                "city": "Mocksville",
                "country": "Utopia",
                "image_url": "https://placehold.co/600x400?text=Mock+Beach",
                "score": 0.95
            },
            {
                "id": "mock2",
                "name": "Sunny Trails",
                "description": "Hiking trails with excellent views.",
                "city": "Trailcity",
                "country": "Utopia",
                "image_url": "https://placehold.co/600x400?text=Sunny+Trails",
                "score": 0.87
            }
        ]
    q = query.lower().strip()
    tokens = [t for t in q.split() if t]
    def score(rec):
        text = " ".join([str(rec.get("name","")), str(rec.get("description","")), str(rec.get("city","")), str(rec.get("country",""))]).lower()
        s = 0
        for t in tokens:
            if t in text:
                s += 1
        if q in rec.get("name","").lower():
            s += 0.5
        return s
    scored = []
    for r in records:
        s = score(r)
        if s > 0:
            rcopy = dict(r)
            rcopy["score"] = s
            scored.append(rcopy)
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:top_k]

backend = None
if USE_REAL_BACKEND:
    try:
        try:
            vector_db = VectorDB()
        except TypeError:
            embeddings_default = ATTRACTIONS_CSV_PATH.with_suffix(".npy")
            logger.info("VectorDB constructor needed args; trying with csv_path=%s, embedding_path=%s", ATTRACTIONS_CSV_PATH, embeddings_default)
            vector_db = VectorDB(csv_path=str(ATTRACTIONS_CSV_PATH), embedding_path=str(embeddings_default))
        try:
            llm_connector = LLMConnector()
        except Exception as e:
            logger.warning("LLMConnector failed to init (%s). Falling back to a dummy connector.", e)
            class DummyLLM:
                def request(self, q):
                    return [q]
            llm_connector = DummyLLM()
        backend = SearchBackend(vector_db, llm_connector)
        logger.info("Initialized real SearchBackend for recommendations.")
    except Exception as e:
        logger.exception("Failed to initialize SearchBackend, falling back to simple_text_search: %s", e)
        backend = None

@app.post("/api/recommend")
def recommend(payload: RecommendRequest):
    q = payload.query.strip()
    if not q:
        raise HTTPException(status_code=400, detail="query is required")
    if backend is not None:
        try:
            results = backend.search(query=q)
            return results
        except Exception as e:
            logger.exception("Real backend search failed, falling back to simple search: %s", e)
    try:
        return simple_text_search(q, top_k=20)
    except Exception as e:
        logger.exception("Fallback search failed: %s", e)
        raise HTTPException(status_code=500, detail="Recommendation failed")

# Serve built frontend if it exists; otherwise redirect root to Vite dev server
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse

dist_dir = Path(__file__).resolve().parents[1] / "frontend" / "dist"
if dist_dir.exists():
    app.mount("/", StaticFiles(directory=str(dist_dir), html=True), name="frontend")
else:
    @app.get("/")
    def root_redirect():
        return RedirectResponse("http://localhost:5173/")