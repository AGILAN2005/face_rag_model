import insightface
import numpy as np
import cv2
from PIL import Image
import io
import base64

class ArcFaceEmbedder:
    def __init__(self):
        # Initialize face analysis model (buffalo_l)
        self.model = insightface.app.FaceAnalysis(name='buffalo_l')
        self.model.prepare(ctx_id=0)  # Use CPU: ctx_id=0. For GPU, use ctx_id=1 or proper GPU device

    def get_embedding(self, img):
        """
        img: PIL Image or numpy array in BGR format
        Returns: 512-d embedding vector (np.ndarray)
        """
        # Convert PIL Image to BGR numpy if needed
        if isinstance(img, Image.Image):
            img = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        elif isinstance(img, bytes):
            # If raw bytes, decode
            img = cv2.imdecode(np.frombuffer(img, np.uint8), cv2.IMREAD_COLOR)
        
        faces = self.model.get(img)
        if not faces:
            return None
        # Return the first detected face's embedding vector
        return faces[0].embedding.astype(np.float32)

    def get_embedding_from_base64(self, base64_string):
        # Helper if you have base64 string input
        decoded = base64.b64decode(base64_string.split(',')[-1])
        img = Image.open(io.BytesIO(decoded)).convert('RGB')
        return self.get_embedding(img)
