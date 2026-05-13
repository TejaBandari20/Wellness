import chromadb
from chromadb.config import Settings

class VectorStore:
    def __init__(self):
        self.client = chromadb.PersistentClient(path="./data/chroma_db")
        self.collection = self.client.get_or_create_collection(name="daily_logs_final")

    def add_log(self, doc_id: str, vector: list, metadata: dict, text: str):
        self.collection.add(
            ids=[doc_id],
            embeddings=[vector],
            metadatas=[metadata],
            documents=[text]
        )

    def query_similar_logs(self, query_vector: list, n_results: int = 3):
        try:
            results = self.collection.query(
                query_embeddings=[query_vector],
                n_results=n_results
            )
            return " ".join(results['documents'][0]) if results['documents'] else ""
        except Exception as e:
            return ""

    def get_all_logs(self):
        """Fetches every entry stored in ChromaDB for trends and history."""
        try:
            return self.collection.get()
        except Exception as e:
            print(f"Fetch Error: {e}")
            return {"ids": [], "metadatas": [], "documents": []}