# uApply: Skill-based Job Recommendation System

https://www.loom.com/share/5bee8b72b9c94dd3b2f972963283c33e?sid=79e0c671-77e0-4cf2-a4cd-eac0bc7f6b14


## Overview
uApply is a skill-based job recommendation system designed to assist university students in finding employment opportunities aligned with their skills and interests. This project leverages machine learning, natural language processing (NLP), and large language models (LLM) to provide personalized job recommendations.

## Table of Contents
- [Project Description](#project-description)
- [Features](#features)
- [Architecture](#architecture)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Data Collection and Preprocessing](#data-collection-and-preprocessing)
- [Faiss Indexing](#faiss-indexing)
- [Training with LLM](#training-with-llm)
- [Evaluation Methodology](#evaluation-methodology)
- [Future Work](#future-work)
- [References](#references)

## Project Description
uApply addresses the challenges university students face in finding relevant job opportunities by understanding their specific skills and preferences. It utilizes advanced machine learning techniques, such as collaborative filtering, content-based filtering, and hybrid approaches, along with NLP to extract and categorize skills from resumes and job postings.

## Features
- **Job Postings**: Employers can post job vacancies with detailed requirements.
- **User Registration**: Simple registration module for users to set up profiles.
- **Resume Submission**: Upload resumes for tailored job recommendations.
- **Personalized Job Recommendations**: Matches job listings to candidates based on skills and preferences.
- **User Profile Management**: Dashboard for users to update personal and career information.
- **Job Search and Authentication**: Advanced search tools with robust authentication.

## Architecture
### Frontend
- **React.js**: Provides a sleek and intuitive user interface with modular components for maintainability.

### Backend
- **MongoDB**: Stores resumes, user info, and job data.
- **Flask APIs**: Facilitates file uploads, resume management, and job matching using RESTful APIs.
- **Large Language Models**: Uses embeddings from Hugging Face's transformers library for semantic similarity analysis.

## Setup and Installation
### Prerequisites
- Python 3.7+
- Node.js
- MongoDB

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/shahnawaz52/uApply-Job-Recommendation-System.git
   cd uApply-Job-Recommendation-System
2. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
3. Activate virtual environment:
   ```bash
   .\myenv\Scripts\activate
4. Install frontend dependencies:
   ```bash
   npm install chakra-ui
   npm install react-pdftotext
5. Go to Client folder:
   ```bash
   npm start
6. Go to backend folder:
   ```bash
   flask run


## Usage
### User Registration
Navigate to the registration page and fill in personal and professional details to create a profile.

### Resume Submission
Upload your resume through the profile dashboard for personalized job recommendations.

### Job Recommendations
View tailored job recommendations based on your skills and preferences on the dashboard.

## API Endpoints
- **/recommendation**: Get job recommendations.
- **/saved-jobs**: Retrieve saved jobs for a user.
- **/login**: User login.
- **/register**: User registration.
- **/logout**: User logout.

## Data Collection and Preprocessing
### Data Collection
- Sourced from Kaggle and LinkedIn, focusing on SJSU students' profiles and job listings.
- Collected over 5000 profiles for robust training and evaluation.

### Data Preprocessing
- Clean and process raw text data using techniques such as tokenization, stemming, and lemmatization.
- Store processed data in MongoDB for real-time recommendations.

## Faiss Indexing
- **Faiss**: Utilized for efficient similarity search and retrieval.
- **Advantages**:
  - Product quantization for memory efficiency.
  - Inverted File Index (IVF) for fast approximate nearest neighbor searches.
  - K-means clustering for optimizing retrieval accuracy.

## Training with LLM
- **Embedding Models**: Uses models like "all-mpnet-base-v2" for generating embeddings.
- **Process**:
  - Tokenize text inputs and convert them into embeddings.
  - Perform similarity-based matching between job postings and skills.
  - Store embeddings in Faiss index for efficient retrieval.

## Evaluation Methodology
- **Metrics**: Precision, recall, F1 score, Mean Reciprocal Rank (MRR), normalized discounted cumulative gain (NDCG), mean average precision (MAP).
- **Models Evaluated**: EB5, LaBSE, MPNet, with EB5 showing superior performance across all metrics.

## Future Work
- Expand the system to serve a broader demographic beyond university students.
- Enhance scalability and performance to handle larger user bases and job listings.
- Integrate real-time labor market analysis and feedback mechanisms for improved recommendations.
