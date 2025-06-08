# # backend-recognition/face_api.py
# from fastapi import FastAPI, UploadFile, File, Form, Query
# from fastapi.responses import JSONResponse
# from arcface import ArcFaceEmbedder
# from faiss_index import FaissIndex
# from PIL import Image
# import io
# import uvicorn
# import time
# import openai
# import numpy as np
# import os

# # Set your OpenAI API key securely
# openai.api_key = os.getenv("OPENAI_API_KEY")  # Set this in your environment variables

# app = FastAPI()
# arcface = ArcFaceEmbedder()
# faiss_index = FaissIndex()

# def get_text_embedding(text: str):
#     response = openai.Embedding.create(
#         input=text,
#         model="text-embedding-ada-002"
#     )
#     embedding = response['data'][0]['embedding']
#     return np.array(embedding).astype('float32')

# @app.post("/register")
# async def register_face(
#     name: str = Form(...),
#     image: UploadFile = File(...)
# ):
#     image_bytes = await image.read()
#     img = Image.open(io.BytesIO(image_bytes))
#     embedding = arcface.get_embedding(img)

#     if embedding is None:
#         return JSONResponse({"status": "fail", "message": "No face detected"}, status_code=400)

#     meta = {
#         "id": int(time.time()*1000),  # simple unique id (timestamp ms)
#         "name": name,
#         "timestamp": time.time()
#     }

#     faiss_index.add(embedding, meta)

#     return JSONResponse({"status": "success", "id": meta["id"], "name": name})

# @app.post("/recognize")
# async def recognize_face(image: UploadFile = File(...)):
#     image_bytes = await image.read()
#     img = Image.open(io.BytesIO(image_bytes))
#     embedding = arcface.get_embedding(img)

#     if embedding is None:
#         return JSONResponse({"status": "fail", "message": "No face detected"}, status_code=400)

#     results = faiss_index.search(embedding, k=3)  # top 3 matches

#     response = [
#         {
#             "name": meta["name"],
#             "distance": float(dist),
#             "id": meta["id"],
#             "timestamp": meta["timestamp"]
#         } for dist, meta in results
#     ]

#     return {"matches": response}

# @app.get("/search_text")
# async def search_by_text(query: str = Query(..., description="Text query to search in FAISS")):
#     embedding = get_text_embedding(query)
#     results = faiss_index.search(embedding, k=5)  # top 5 matches

#     response = [
#         {
#             "name": meta["name"],
#             "distance": float(dist),
#             "id": meta["id"],
#             "timestamp": meta["timestamp"]
#         } for dist, meta in results
#     ]

#     return {"results": response}


# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8001)


# backend-recognition/face_api.py
from fastapi import FastAPI, UploadFile, File, Form  # Removed Query import as not used now
from fastapi.responses import JSONResponse
from arcface import ArcFaceEmbedder
from faiss_index import FaissIndex
from PIL import Image
import io
import uvicorn
import time
#import openai  # Commented out now, for future text embedding use
import numpy as np
import os

# # Set your OpenAI API key securely - currently not used
# openai.api_key = os.getenv("OPENAI_API_KEY")  # Set this in your environment variables

app = FastAPI()
arcface = ArcFaceEmbedder()
faiss_index = FaissIndex()

# # Future use: get text embedding with OpenAI API - commented out for now
# def get_text_embedding(text: str):
#     response = openai.Embedding.create(
#         input=text,
#         model="text-embedding-ada-002"
#     )
#     embedding = response['data'][0]['embedding']
#     return np.array(embedding).astype('float32')

@app.post("/register")
async def register_face(
    name: str = Form(...),
    image: UploadFile = File(...)
):
    image_bytes = await image.read()
    img = Image.open(io.BytesIO(image_bytes))
    embedding = arcface.get_embedding(img)

    if embedding is None:
        return JSONResponse({"status": "fail", "message": "No face detected"}, status_code=400)

    meta = {
        "id": int(time.time()*1000),  # simple unique id (timestamp ms)
        "name": name,
        "timestamp": time.time()
    }

    faiss_index.add(embedding, meta)

    return JSONResponse({"status": "success", "id": meta["id"], "name": name})

@app.post("/recognize")
async def recognize_face(image: UploadFile = File(...)):
    image_bytes = await image.read()
    img = Image.open(io.BytesIO(image_bytes))
    embedding = arcface.get_embedding(img)

    if embedding is None:
        return JSONResponse({"status": "fail", "message": "No face detected"}, status_code=400)

    results = faiss_index.search(embedding, k=3)  # top 3 matches

    response = [
        {
            "name": meta["name"],
            "distance": float(dist),
            "id": meta["id"],
            "timestamp": meta["timestamp"]
        } for dist, meta in results
    ]

    return {"matches": response}

# # Future endpoint for text-based search, currently disabled
# from fastapi import Query
# @app.get("/search_text")
# async def search_by_text(query: str = Query(..., description="Text query to search in FAISS")):
#     embedding = get_text_embedding(query)
#     results = faiss_index.search(embedding, k=5)  # top 5 matches
#
#     response = [
#         {
#             "name": meta["name"],
#             "distance": float(dist),
#             "id": meta["id"],
#             "timestamp": meta["timestamp"]
#         } for dist, meta in results
#     ]
#
#     return {"results": response}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
