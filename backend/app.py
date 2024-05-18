from flask import Flask, request, jsonify, session, url_for
from flask_cors import CORS
import bcrypt, json, torch, datetime, spacy, openai, pyrebase
import pandas as pd
from database.db import connect_to_mongodb
from utils.helper import search_jobs_faiss, search_students_jobs_faiss, search_jobs_knn, ResourceManager
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, unset_jwt_cookies, set_access_cookies
nlp = spacy.load('en_core_web_sm')
# from pyresparser import ResumeParser
from flask_caching import Cache
import os

ResourceManager.load_resources()
app = Flask(__name__)

cache = Cache(app, config={'CACHE_TYPE': 'simple'})
jwt = JWTManager(app)
app.secret_key = 'testing'
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
db = connect_to_mongodb()
records = db['users']
saved_jobs = db['saved_jobs']
job_posting = db['job_posting']
CORS(app, supports_credentials=True)

@app.route('/', methods=["POST", "GET"])
def register():
    data = request.json
    user = data.get("fullname")
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    email = data.get("email")
    password1 = data.get("password")
    password2 = data.get("password2")
    resume = data.get('resume', '')
    education = data.get('education', '')
    work_experience = data.get('workExperience', '')
    tags = data.get('skills', '')

    print('education', education)
    print('work_experience', work_experience)
    print('tags', tags)
 
    doc = nlp(resume)
    skills = []
    for ent in doc.ents:
        print(ent.text, ent.label_)
        if ent.label_ in ['ORG', 'PERSON', 'GPE']:
            skills.append(ent.text)

    # Check if user or email already exists
    user_found = records.find_one({"name": user})
    email_found = records.find_one({"email": email})
    if user_found:
        return jsonify({"message": "User already exists"}), 400
    if email_found:
        print('email exist')
        return jsonify({"message": "Email already exists"}), 400
    if password1 != password2:
        print('mismatch')
        return jsonify({"message": "Passwords do not match"}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(password2.encode('utf-8'), bcrypt.gensalt())

    # Insert user into the database
    user_input = {'name': user, 
                  'firstname': firstname, 
                  'lastname': lastname, 
                  'email': email, 
                  'password': hashed_password, 
                  'skills': skills,
                  'education': json.loads(education),
                  'work_experience': json.loads(work_experience),
                  'tags': json.loads(tags)
                  }
    
    records.insert_one(user_input)
    # access_token = create_access_token(identity=user.user_id)

    return jsonify({"message": "User registered successfully"}), 200

@app.route("/login", methods=["GET", "POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    # Check if email exists in the database
    email_found = records.find_one({"email": email})
    if email_found:
        email_val = email_found['email']
        firstname = email_found['firstname']
        lastname = email_found['lastname']
        passwordcheck = email_found['password']
        # Encode the password and check if it matches
        if bcrypt.checkpw(password.encode('utf-8'), passwordcheck):
            # session.permanent = True
            # session.modified = True
            session["email"] = email_val
            session["firstname"] = firstname
            session["lastname"] = lastname
            # session["firstname"] = firstname
            access_token = create_access_token(identity=email_found['email'])
            resp = jsonify({"message": "Login successful", "fname": firstname, "lname": lastname, "access_token": access_token})
            return resp, 200
        else:
            return jsonify({"message": "Wrong password"}), 401
    else:
        return jsonify({"message": "Email not found"}), 404

@app.route("/logout", methods=["GET", "POST"])
@jwt_required()
def logout():
    # current_user = get_jwt_identity()
    resp = jsonify({'message': 'Logout successful'})
    unset_jwt_cookies(resp)
    return resp, 200
    
@app.route("/recommendation", methods=["GET", "POST"])
@jwt_required()
# @cache.memoize(timeout=50)
def get_recommended_jobs():
    current = get_jwt_identity()
    user_record = records.find_one({"email": current})
    if not user_record:
        return jsonify({"message": "User not found"}), 404

    user_skills = user_record.get("skills", []) + user_record.get('tags', [])
    work_exp = user_record.get('work_experience', {})
    # user_skills = user_skills + work_exp.employerName + work_exp.position

    Fname = request.json.get('firstname')
    Lname = request.json.get('lastname')
    # jobs = pd.read_csv(r'C:\Users\Checkout\Documents\Fall 2023\uApply-Job-Recommendation-System\notebooks\job_posting_data.csv')
    students = pd.read_csv(r'C:\Users\Checkout\Documents\uApply-Job-Recommendation-System\notebooks\students5.csv')
 
    user_skills = user_record.get("skills", [])
    prompt = ', '.join(user_skills)
    # using cosine similarity
    # ranks = search_jobs(prompt, embeddings_dataset, tokenizer, model, k=10)
    # using faiss
    ranks = search_jobs_faiss(prompt, ResourceManager.faiss_index, k=50)

    # student_ranks = search_jobs_knn(prompt, k=30)
    student_ranks = search_students_jobs_faiss(prompt, ResourceManager.student_faiss_index, k=50)

    job_ids = [job['job_id'] for job in job_posting.find({"job_id": {"$in": ranks.tolist()}})]
    jobs_data = list(job_posting.find({"job_id": {"$in": job_ids}}))

    student_ids = student_ranks.tolist()
    selected_students = students[students["student_id"].isin(student_ids)]
    students_data = selected_students.to_dict(orient="records")
    # Filter out students with null company address
   
    response = {
        "jobs": [],
        "students": []
    }
    for job in jobs_data:
        response['jobs'].append({
            "job_id": job.get('job_id', ''),
            "company_name": job.get('company_name', ''),
            "title": job.get('title', ''),
            "location": job.get('location', ''),
            # "salary": job.get("salary", ''),
            "formatted_work_type": job.get('formatted_work_type', ''), 
            "linkedin_url": job.get('linkedin_url', ''),
            "company_industry": job.get('company_industry', ''),
            "description": job.get('description', '')
        })
    # response1['jobs'].append(job_entry)

    for student in students_data:
        response['students'].append({
            "company_id": student.get('company_id', ''),
            "full_name": student.get('full_name', ''),
            "position": student.get('position', ''),
            "linkedin": student.get("linkedin", ''),
            "company_name": student.get('company_name', ''),
            "company_link": student.get('company_link', ''),
            "company_address": student.get('company_city_1', ''),
            "education": student.get('education_1', '')
            # Add other student fields as needed
        })

    return jsonify(response)
    

@app.route("/save-jobs", methods=["POST", "GET"])
@jwt_required()
def save_job():
    current_user_email = get_jwt_identity()
    data = request.json
    job_id = data.get("job_id")

    if not job_id:
        return jsonify({"message": "Job ID is required"}), 400

    # Retrieve the user's saved jobs document
    user_saved_jobs = saved_jobs.find_one({"user_email": current_user_email})

    if user_saved_jobs:
        # Check if the job is already saved to prevent duplicates
        if job_id in user_saved_jobs["job_ids"]:
            return jsonify({"message": "Job already saved"}), 409

        # Append the new job ID to the existing list
        saved_jobs.update_one(
            {"user_email": current_user_email},
            {"$push": {"job_ids": job_id}}
        )
    else:
        # Create a new document for the user with the initial job ID
        saved_jobs.insert_one({
            "user_email": current_user_email,
            "job_ids": [job_id],  # Start with the job_id in a list
            "saved_at": datetime.datetime.utcnow()
        })

    return jsonify({"message": "Job saved successfully"}), 201

@app.route("/get-saved-jobs", methods=["GET"])
@jwt_required()
def get_saved_jobs():
    current_user_email = get_jwt_identity()

    # Fetch the user's saved job IDs from MongoDB
    user_saved_jobs = saved_jobs.find_one({"user_email": current_user_email})

    if not user_saved_jobs or "job_ids" not in user_saved_jobs or not user_saved_jobs["job_ids"]:
        return jsonify([]), 200
    
    # Filter the DataFrame for the saved job IDs
    saved_job_ids = user_saved_jobs['job_ids']
    jobs_data = list(job_posting.find({"job_id": {"$in": saved_job_ids}}))

    jobs_details_list = [{
        "job_id": job.get('job_id', ''),
        "company_name": job.get('company_name', ''),
        "title": job.get('title', ''),
        "location": job.get('location', ''),
        "formatted_work_type": job.get('formatted_work_type', ''), 
        "linkedin_url": job.get('linkedin_url', ''),
        "company_industry": job.get('company_industry', ''),
        "description": job.get('description', '')
    } for job in jobs_data]

    return jsonify(jobs_details_list), 200

@app.route("/unsave-jobs", methods=["DELETE"])
@jwt_required()
def unsave_job():
    current_user_email = get_jwt_identity()
    data = request.get_json()
    job_id = data.get("job_id")

    if not job_id:
        return jsonify({"message": "Job ID is required"}), 400

    # Retrieve the user's saved jobs document
    user_saved_jobs = saved_jobs.find_one({"user_email": current_user_email})
    
    if user_saved_jobs and job_id in user_saved_jobs["job_ids"]:
        # Remove the job ID from the saved list
        saved_jobs.update_one(
            {"user_email": current_user_email},
            {"$pull": {"job_ids": job_id}}
        )
        return jsonify({"message": "Job unsaved successfully"}), 200
    return jsonify({"message": "Job not found in saved list"}), 404

@app.route("/user/account", methods=["GET"])
@jwt_required()
def get_account_info():
    current_user = get_jwt_identity()
    user_record = records.find_one({"email": current_user})
    if not user_record:
        return jsonify({"message": "User not found"}), 404
    
    account_info = {
        "firstname": user_record.get("firstname"),
        "lastname": user_record.get("lastname"),
        "email": user_record.get("email"),
        "education": user_record.get("education"),
        "work_experience": user_record.get("work_experience"),
        "tags": user_record.get("tags")
        # "resume": user_record.get("resume_link", "No resume uploaded")
    }
    
    return jsonify(account_info), 200

    
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
