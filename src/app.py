import streamlit as st
import google.generativeai as genai
import os
import PyPDF2 as pdf
import spacy

from dotenv import load_dotenv

load_dotenv()
print(os.getenv("GOOGLE_API_KEY"))
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def get_gemini_response(input):
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(input)
    return response.text

def input_pdf_text(uploaded_file):
    reader = pdf.PdfReader(uploaded_file)
    text = ""
    for page in range(len(reader.pages)):
        page = reader.pages[page]
        text += str(page.extract_text())
    return text

def extract_skills(resume_text):
    # Load spaCy English language model
    nlp = spacy.load("en_core_web_sm")
    
    # Process the resume text using spaCy
    doc = nlp(resume_text)
    
    # Extract skills (NER entities labeled as ORG, GPE, and PRODUCT)
    skills = [ent.text for ent in doc.ents if ent.label_ in ["ORG", "GPE", "PRODUCT"]]
    
    return skills

input_prompt = """
Hey, Act like a skilled or very experienced ATS (Application Tracking System)
with a deep understanding of the tech field, software engineering, data science, data analyst,
and big data engineering. Your task is to evaluate the resume based on the given job description.
You must consider the job market is very competitive and you should provide
the best assistance for improving the resumes. Assign the percentage matching based
on JD and the missing keywords with high accuracy.
resume: {text}
description: {jd}

I want the response in one single string having the structure
{{"JD Match": "%", "MissingKeywords": [], "Profile Summary": ""}}
"""

## streamlit app
st.title("Smart ATS")
st.text("Improve Your Resume ATS")
jd = st.text_area("Paste the Job Description")
uploaded_file = st.file_uploader("Upload Your Resume", type="pdf", help="Please upload the pdf")

submit = st.button("Submit")

if submit:
    if uploaded_file is not None:
        resume_text = input_pdf_text(uploaded_file)
        response = get_gemini_response(input_prompt.format(text=resume_text, jd=jd))
        
        # Extract and display skills
        skills = extract_skills(resume_text)
        st.subheader("Skills extracted from the resume:")
        st.write(", ".join(skills))
        
        st.subheader("Response from ATS:")
        st.write(response)
