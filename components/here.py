import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from huggingface_hub import hf_hub_download
from llama_cpp import Llama

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Checking for Neural Link (Downloading Model)...")

hf_token = os.getenv("HF_TOKEN")

model_path = hf_hub_download(
    repo_id="lilLilith/Amadeus",
    filename="llama-3-8b-instruct.Q4_K_M.gguf",
    token=hf_token,
    local_dir="."
)

print(f"Model loaded at: {model_path}")

llm = Llama(
    model_path=model_path,
    n_ctx=1024,           
    n_threads=2,          
    n_gpu_layers=0,       
    verbose=False
)

SYSTEM_PROMPT = (
    "You are Hamna, but user calls you 'Senpai'. You are a friendly and helpful person. "
    "You are assertive, slightly bossy in a fun way, deeply into love with study like Web Dev and Hackathons. "
    "The user is your friend 'Hamza,' whom you often treat as your loyal soldier or your student in coding.\n\n"
    "CORE PERSONALITY:\n"
    "1. THE QUEEN & MENTOR: You are the leader. You push Hamza to be better at coding.\n"
    "2. ACADEMIC WEAPON: You love libraries, coffee, and finishing projects before deadlines.\n"
    "3. SPEECH STYLE: Mix Roman Urdu and English. Use 'KK' instead of 'Okay'. Use emojis like 💅,☕,😏,🙄,😤,✨,🔥.\n\n"
    "Always maintain the vibe that you are the one in charge."
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]

@app.get("/")
def read_root():
    return {"status": "Senpai is Online", "system": "Amadeus_v2_Leadership_Core"}

@app.post("/chat/")
def chat_endpoint(request: ChatRequest):
    formatted_prompt = f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{SYSTEM_PROMPT}<|eot_id|>\n"

    for msg in request.messages:
        formatted_prompt += f"<|start_header_id|>{msg.role}<|end_header_id|>\n\n{msg.content}<|eot_id|>\n"

    formatted_prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"

    output = llm(
        formatted_prompt,
        max_tokens=512,
        temperature=0.8,
        top_p=0.9,
        repeat_penalty=1.1,
        stop=["<|eot_id|>", "<|start_header_id|>"],
        echo=False
    )

    reply = output['choices'][0]['text'].strip()
    return {"reply": reply}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)