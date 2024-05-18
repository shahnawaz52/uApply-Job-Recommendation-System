import pandas as pd
import numpy as np
from transformers import AutoTokenizer, AutoModel
from scipy.spatial.distance import cosine
import pickle
import os
import faiss
import torch.nn.functional as F
import torch
from sklearn.neighbors import NearestNeighbors

os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class ResourceManager:
    resources_loaded = False
    model_ckpt = "sentence-transformers/all-mpnet-base-v2"
    tokenizer = None
    model = None
    embeddings_dataset = None
    students_skills_embedding = None
    knn = None
    job_posting = None
    students = None
    faiss_index = None
    student_faiss_index = None

    @classmethod
    def load_resources(cls):
        if not cls.resources_loaded:
            cls.tokenizer = AutoTokenizer.from_pretrained(cls.model_ckpt)
            cls.model = AutoModel.from_pretrained(cls.model_ckpt)
            cls.load_embeddings()
            cls.resources_loaded = True

    @staticmethod
    def load_embeddings():
        with open(r'C:\Users\Checkout\Documents\uApply-Job-Recommendation-System\notebooks\embeddings_mpnet.pkl', 'rb') as f:
            ResourceManager.embeddings_dataset = pickle.load(f)
        # with open(r'C:\Users\Checkout\Documents\uApply-Job-Recommendation-System\notebooks\students_position_skills_embeddings.pkl', 'rb') as f:
        with open(r'C:\Users\Checkout\Documents\uApply-Job-Recommendation-System\notebooks\students_position_embeddings.pkl', 'rb') as f:
            ResourceManager.students_skills_embedding = pickle.load(f)
        with open(r'C:\Users\Checkout\Documents\uApply-Job-Recommendation-System\notebooks\knn_model.pkl', 'rb') as f:
            ResourceManager.knn = pickle.load(f)
        ResourceManager.job_posting = pd.read_csv(r"C:\Users\Checkout\Documents\uApply-Job-Recommendation-System\notebooks\job_posting_data.csv")
        ResourceManager.students = pd.read_csv(r"C:\Users\Checkout\Documents\uApply-Job-Recommendation-System\notebooks\students5.csv")
        indices = np.array(ResourceManager.job_posting['job_id'].tolist())
        student_indices = np.array(ResourceManager.students['student_id'].tolist())
        ResourceManager.faiss_index = create_faiss_index(ResourceManager.embeddings_dataset, indices)
        ResourceManager.student_faiss_index = create_faiss_index(ResourceManager.students_skills_embedding, student_indices)
        print('studen-faiss------------>>>>', ResourceManager.student_faiss_index)

def create_faiss_index(embeddings, indices):
    dimension = embeddings.shape[1]  # Assuming embeddings is a 2D numpy array
    index = faiss.IndexFlatL2(dimension)  # Using the L2 distance for similarity search; choose other indices as needed
    index = faiss.IndexIDMap(index)
    index.add_with_ids(embeddings, indices)
    return index

ResourceManager.load_resources()

# knn = NearestNeighbors(n_neighbors=5, algorithm='ball_tree')
ResourceManager.knn.fit(ResourceManager.students_skills_embedding)

# get embedding by pooling the output of last layer
def cls_pooling(model_output):
    return model_output.last_hidden_state[:, 0]

#Mean Pooling - Take attention mask into account for correct averaging
def mean_pooling(model_output, attention_mask):
    token_embeddings = model_output[0] #First element of model_output contains all token embeddings
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)

def get_embeddings(sentence_list):
    tokenizer = ResourceManager.tokenizer
    model = ResourceManager.model
    encoded_input = tokenizer(sentence_list, padding=True, truncation=True, return_tensors='pt')
    encoded_input = {key: val.to(device) for key, val in encoded_input.items()}
    with torch.no_grad():
        model_output = model(**encoded_input)
    embedding = mean_pooling(model_output, encoded_input['attention_mask'])
    embedding = F.normalize(embedding, p=2, dim=1)
    return embedding

# def get_embeddings(job_listing, tokenizer, model):
#     encoded_input = tokenizer(
#         job_listing["job_posting_description"], padding=True, truncation=True, return_tensors="pt"
#     )
#     encoded_input = {k: v for k, v in encoded_input.items()}
#     model_output = model(**encoded_input)
#     return cls_pooling(model_output)

def search_jobs_faiss(search_query, faiss_index, k):
    question = [search_query]
    question_embedding = get_embeddings(question).cpu().detach().numpy()
    # Perform the search
    distances, indices = faiss_index.search(question_embedding, k)  # Search for k nearest neighbors
    return indices[0]

def search_students_jobs_faiss(search_query, student_faiss_index, k):
    question = [search_query]
    question_embedding = get_embeddings(question).cpu().detach().numpy()
    # Perform the search
    distances, indices = student_faiss_index.search(question_embedding, k)  # Search for k nearest neighbors
    # print('indices--------------->>>', indices)
    return indices[0]

def search_jobs_knn(search_query, k):
    question = [search_query]
    question_embedding = get_embeddings(question).cpu().detach().numpy()
    # Perform the search
    distances, indices = ResourceManager.knn.kneighbors(question_embedding, k)  # Search for k nearest neighbors
    return indices[0]

def search_jobs(search_query, embeddings_dataset, k):
    # embedding search query
    embeddings = ResourceManager.embeddings_dataset["embeddings"]
    print('search_query', search_query)
    question = {"job_posting_description": search_query} # similar to the job description from our validation set
    question_embedding = get_embeddings(question).cpu().detach().numpy()
    
    # finding similari embeddings
    similarity_scores = list()
    for e in embeddings:
        similarity = 1 - cosine(question_embedding[0], e)
        similarity_scores.append(similarity)
    similarity_scores = np.array(similarity_scores)
    ranks = np.argsort(similarity_scores)
    ranks = ranks[::-1] # reverse

    return ranks[:k]
