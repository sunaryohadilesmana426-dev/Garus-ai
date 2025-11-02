const chatBox = document.getElementById('chat-box');
const input = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');
const micBtn = document.getElementById('mic-btn');
const modeToggle = document.getElementById('mode-toggle');

let chatHistory = [];

// Default Ollama proxy IP — edit in-app or replace with your PC IP
let OLLAMA_IP = "192.168.1.100"; // default as requested
const LOCAL_API = `http://${OLLAMA_IP}:5000/api/chat`;

// Append message
function appendMessage(role, text){
  const d = document.createElement('div');
  d.className = 'message ' + (role==='user'?'user':'bot');
  d.textContent = text;
  chatBox.appendChild(d);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message to Ollama or offline fallback
async function sendMessage(){
  const text = input.value.trim(); if(!text) return;
  chatHistory.push({role:'user', content:text});
  appendMessage('user', text);
  input.value='';
  const loading = document.createElement('div'); loading.className='message bot'; loading.textContent='Mengetik...'; chatBox.appendChild(loading); chatBox.scrollTop=chatBox.scrollHeight;
  try {
    if(modeToggle.checked){
      const res = await fetch(LOCAL_API, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({messages:[{role:'system',content:'Kamu adalah asisten ramah berbahasa Indonesia.'}, ...chatHistory]})});
      if(!res.ok) throw new Error('Ollama tidak tersedia di ' + LOCAL_API);
      const j = await res.json();
      const reply = j.reply || j.raw?.response || 'Tidak ada jawaban';
      loading.textContent = reply;
      chatHistory.push({role:'assistant', content:reply});
      speak(reply);
    } else {
      const reply = offlineReply(text);
      loading.textContent = reply;
      chatHistory.push({role:'assistant', content:reply});
      speak(reply);
    }
  } catch(err){
    loading.textContent = 'Error: ' + err.message;
  }
}

// Simple offline replies
function offlineReply(text){
  const t = text.toLowerCase();
  if(t.includes('halo')||t.includes('hai')) return 'Halo! Saya Garus AI. Ada yang bisa saya bantu?';
  if(t.includes('siapa') && t.includes('kamu')) return 'Saya Garus AI, chatbot lokal kamu.';
  if(t.includes('cuaca')) return 'Maaf, saya offline jadi tidak bisa mengecek cuaca.';
  if(t.includes('terima kasih')||t.includes('makasih')) return 'Sama-sama!';
  return 'Saya: ' + text.split('').reverse().join('').slice(0,120) + ' ... (mode offline)';
}

// Voice
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if(SpeechRecognition){
  const rec = new SpeechRecognition(); rec.lang='id-ID';
  rec.onresult = (e)=>{ input.value = e.results[0][0].transcript; sendMessage(); };
  micBtn.onclick = ()=> rec.start();
}
function speak(text){ const u = new SpeechSynthesisUtterance(text); u.lang='id-ID'; window.speechSynthesis.speak(u); }

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keydown', e=>{ if(e.key==='Enter') sendMessage(); });
clearBtn.addEventListener('click', ()=>{ chatHistory=[]; chatBox.innerHTML=''; });
