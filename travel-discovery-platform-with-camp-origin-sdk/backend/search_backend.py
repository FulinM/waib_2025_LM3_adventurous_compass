from typing import Any, List
import numpy as np

from sentence_transformers import SentenceTransformer
from llm_connector import LLMConnector
from semantic_search import VectorDB


class SearchBackend:

    vector_db: VectorDB
    llm_connector: LLMConnector
    embedding_model: SentenceTransformer

    def __init__(
        self,
        vector: VectorDB,
        llm_connector: LLMConnector,
        embedding_model: str = "all-MiniLM-L6-v2",
    ):
        self.vector_db = vector
        self.llm_connector = llm_connector
        self.embedding_model = SentenceTransformer(model_name_or_path=embedding_model)

    def search(self, query: str) -> List[dict[str, Any]]:
        llm_suggestions: List[str] = self._get_LLMSuggestions(query)
        embedded_queries = (
            self._embed_query(suggestion) for suggestion in llm_suggestions
        )
        results = (
            self.vector_db.search_by_vector(query_vector=embedding)
            for embedding in embedded_queries
        )
        entries = (result.to_dict(orient="records") for result in results)
        results = []
        for i, entry_block in enumerate(entries):
            for e in entry_block:
                e["score"] *= np.exp(-i / 20)
                results.append(e)

        return results

    def _embed_query(self, query: str) -> np.ndarray:
        return self.embedding_model.encode(query)

    def _get_LLMSuggestions(self, query: str) -> List[str]:
        return self.llm_connector.request(query)
