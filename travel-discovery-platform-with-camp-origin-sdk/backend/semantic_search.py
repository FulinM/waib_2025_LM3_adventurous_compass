import faiss
import numpy as np
import pandas as pd

from typing import List, Optional, Dict, Any
from pathlib import Path


class VectorDB:
    """
    Build a FAISS index
    """

    def __init__(
        self,
        csv_path: Path,
        embedding_path: Path,
        normalize: bool = True,
        embedding_model_name: Optional[str] = None,
        keep_in_memory: bool = True,
    ):
        self.normalize = normalize
        self.keep_in_memory = keep_in_memory
        self.embedding_model_name = embedding_model_name

        # Load CSV
        self._df = self._parse_csv(csv_path)

        # Build FAISS index
        self._index = self._build_index(embedding_path, normalize=self.normalize)

    # ------------- Public API -------------

    def search_by_vector(
        self,
        query_vector: np.ndarray,
        k: int = 5,
    ) -> List[Dict[str, Any]]:
        """
        Search using a query embedding vector.

        Parameters
        ----------
        query_vector : List[float] or np.ndarray
            The query embedding (same dimension as index).
        k : int
            Number of nearest neighbors to return (FAISS index.search(..., k) behavior) [[1]].
        return_fields : Optional[Sequence[str]]
            Subset of metadata fields to include. If None, returns all metadata columns.

        Returns
        -------
        List[Dict[str, Any]]
            Each result includes: id, score (cosine similarity if normalize=True; else negative L2 distance),
            and requested metadata.
        """
        q = np.asarray(query_vector, dtype=np.float32).reshape(1, -1)
        if self.normalize:
            # Cosine similarity via inner product requires normalized query [[7]]
            faiss.normalize_L2(q)
        D, I = self._index.search(q, k)  # [[1]]
        return self._format_results(D, I)

    # ------------- Internal helpers -------------

    def _format_results(
        self, scores: np.ndarray, result_ids: np.ndarray
    ) -> pd.DataFrame:
        results = self._df.iloc[result_ids.ravel()].copy()
        results["score"] = scores.ravel() if self.normalize else -scores.ravel()
        return results

    def _parse_csv(self, csv_path: Path) -> pd.DataFrame:
        df = pd.read_csv(csv_path)
        return df[["Name", "Url", "Telephone", "Address", "Tags"]]

    def _build_index(self, embedding_path: Path, normalize: bool = True):

        with embedding_path.open("rb") as f:
            X = np.load(f)

        if X.ndim != 2:
            raise ValueError("Embeddings must be a 2D array of shape (n_samples, dim).")

        n, d = X.shape
        X = X.astype(np.float32, copy=True)

        if normalize:
            # Cosine similarity via IP index requires L2 normalization [[7]]
            faiss.normalize_L2(X)

            index = faiss.IndexFlatIP(d)  # Flat inner-product index [[8]]
        else:
            index = faiss.IndexFlatL2(d)  # Flat L2 index [[3]]

        index.add(X)  # add all vectors to index [[8]]
        return index
