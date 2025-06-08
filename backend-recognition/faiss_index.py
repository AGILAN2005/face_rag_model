import faiss
import numpy as np
import os
import pickle
from threading import Lock

class FaissIndex:
    def __init__(self, dim=512, index_path='index.faiss', meta_path='faces_store.pkl'):
        self.dim = dim
        self.index_path = index_path
        self.meta_path = meta_path

        # Use exact search index (IndexFlatL2) for L2 distance
        self.index = faiss.IndexFlatL2(dim)

        # Metadata is a list of dicts holding user info for each vector
        self.metadata = []

        # For thread-safe operations (add/search)
        self.lock = Lock()

        # Load existing index and metadata if they exist
        self.load()

    def add(self, embedding: np.ndarray, meta: dict):
        """
        embedding: np.ndarray shape (512,) float32
        meta: dict, user info e.g. {"id":..., "name":..., "timestamp":...}
        """
        if embedding is None or embedding.shape[0] != self.dim:
            raise ValueError(f"Embedding must be a numpy array of shape ({self.dim},)")

        with self.lock:
            self.index.add(np.expand_dims(embedding, axis=0))  # Add vector
            self.metadata.append(meta)                         # Save metadata
            self.save()                                        # Persist index + metadata

    def search(self, query_embedding: np.ndarray, k=5):
        """
        query_embedding: np.ndarray shape (512,) float32
        k: number of nearest neighbors to return
        Returns list of (distance, metadata dict)
        """
        with self.lock:
            if self.index.ntotal == 0:
                return []

            D, I = self.index.search(np.expand_dims(query_embedding, axis=0), k)
            results = []
            for dist, idx in zip(D[0], I[0]):
                if idx < len(self.metadata):
                    results.append((dist, self.metadata[idx]))
            return results

    def save(self):
        # Save faiss index and metadata to disk
        faiss.write_index(self.index, self.index_path)
        with open(self.meta_path, 'wb') as f:
            pickle.dump(self.metadata, f)

    def load(self):
        # Load faiss index and metadata from disk if files exist
        if os.path.exists(self.index_path):
            self.index = faiss.read_index(self.index_path)
        if os.path.exists(self.meta_path):
            with open(self.meta_path, 'rb') as f:
                self.metadata = pickle.load(f)
