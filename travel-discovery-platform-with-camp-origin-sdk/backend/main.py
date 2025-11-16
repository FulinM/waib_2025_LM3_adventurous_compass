import math
import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
import requests

from llm_connector import LLMConnector
from search_backend import SearchBackend
from semantic_search import VectorDB
from fastapi import FastAPI, Query
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse


app = FastAPI(title="Travel Discovery API")


csv_path = Path("../../Attractions.csv")
embedding_path = Path("../../embeddings.npy")
load_dotenv()
api_key = os.getenv("LLM_API_KEY")

llm_connector = LLMConnector(api_key=api_key)

vector_db = VectorDB(csv_path=csv_path, embedding_path=embedding_path)
search_backend = SearchBackend(vector=vector_db, llm_connector=llm_connector)


def _sanitize_for_json(obj: Any) -> Any:
    """
    Recursively convert objects into JSON-safe primitives:
     - numpy/pandas NaN -> None
     - numpy scalars -> native python types
     - floats that are NaN -> None
     - lists/tuples/dicts are processed recursively
    """
    # Avoid importing heavy libs at top-level if not necessary
    try:
        import numpy as _np
    except Exception:
        _np = None

    try:
        import pandas as _pd
    except Exception:
        _pd = None

    # Helper inner recursive function
    def _rec(x: Any) -> Any:
        # None stays None
        if x is None:
            return None

        # pandas NA / missing
        if _pd is not None:
            try:
                if _pd.isna(x):
                    return None
            except Exception:
                # pd.isna can raise for some types; ignore
                pass

        # numpy scalar handling
        if _np is not None:
            if isinstance(x, (_np.floating,)):
                fx = float(x)
                if math.isnan(fx):
                    return None
                return fx
            if isinstance(x, (_np.integer,)):
                return int(x)
            if isinstance(x, (_np.bool_,)):
                return bool(x)
            # generic numpy array / ndarray -> convert to list
            if isinstance(x, _np.ndarray):
                return [_rec(v) for v in x.tolist()]

        # native python float (check NaN)
        if isinstance(x, float):
            if math.isnan(x):
                return None
            return x

        # ints/bools/str are fine
        if isinstance(x, (str, int, bool)):
            return x

        # dict -> sanitize values recursively
        if isinstance(x, dict):
            return {str(k): _rec(v) for k, v in x.items()}

        # list/tuple/set -> sanitize elements
        if isinstance(x, (list, tuple, set)):
            return [_rec(v) for v in x]

        # Fallback: try to convert to builtin via jsonable_encoder (it converts some objects)
        try:
            encoded = jsonable_encoder(x)
            # if encoding produced a basic type, sanitize it again
            if isinstance(
                encoded, (dict, list, tuple, str, int, float, bool, type(None))
            ):
                return _rec(encoded)
        except Exception:
            pass

        # As a last resort, return its string representation
        try:
            return str(x)
        except Exception:
            return None

    return _rec(obj)


@app.get("/search/{query}")
async def search(query: str):
    print(f"Received query: {query}")
    results = search_backend.search(query=query)

    # Optional: log results for debugging (keep lightweight)
    # for i, r in enumerate(results[:5]):
    #     print(f"{i}: {r}")

    # First convert objects to JSON-encodable primitives (handles numpy/pandas scalars)
    encoded = jsonable_encoder(results)

    # Then sanitize encoded structure to convert NaN -> None etc.
    safe = _sanitize_for_json(encoded)

    return JSONResponse(content=safe)


@app.get("/api/image-search")
async def image_search(query: str = Query(..., min_length=1)):
    """
    Search the web for an image for `query` using Google's Custom Search JSON API (searchType=image).
    Returns: { "image_url": "<string>" } or { "image_url": null } on no results.
    Notes:
      - Set environment variables GOOGLE_API_KEY and GOOGLE_CX (Custom Search Engine ID).
      - This endpoint runs server-side so the API key is not exposed to clients.
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    cx = os.getenv("GOOGLE_CX")
    if not api_key or not cx:
        return JSONResponse(
            status_code=500,
            content={
                "error": "GOOGLE_API_KEY and GOOGLE_CX must be configured on the server."
            },
        )

    params = {
        "q": query,
        "cx": cx,
        "key": api_key,
        "searchType": "image",
        "num": 1,
        "safe": "high",
    }
    try:
        r = requests.get(
            "https://www.googleapis.com/customsearch/v1", params=params, timeout=6.0
        )
        r.raise_for_status()
        data = r.json()
        items = data.get("items") or []
        if not items:
            return {"image_url": None}
        # items[0] should have a 'link' to the image
        first = items[0]
        image_link = first.get("link") or first.get("image", {}).get("thumbnailLink")
        return {"image_url": image_link}
    except requests.RequestException as e:
        # Log error server-side and return null result so frontend gracefully falls back
        print("Image search error:", e)
        return JSONResponse(
            status_code=502, content={"error": "Image search failed", "detail": str(e)}
        )
