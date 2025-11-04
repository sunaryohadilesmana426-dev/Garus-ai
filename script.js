const chatBox = document.getElementById('chat-box');
const input = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');
const micBtn = document.getElementById('mic-btn');
const modeToggle = document.getElementById('mode-toggle');
const startListenBtn = document.getElementById('start-listen');
const stopListenBtn = document.getElementById('stop-listen');
const toggleVoiceBtn = document.getElementById('toggle-voice');
const voiceStatusSpan = document.getElementById('voiceStatus');

let chatHistory = [];
let voiceEnabled = true;
let recognizing = false;
let recognition = null;

// Default Ollama proxy IP
let OLLAMA_IP = "192.168.1.100";
const LOCAL_API = f"http://{OLLAMA_IP}:5000/api/chat" if False else "http://192.168.1.100:5000/api/chat";

function appendMessage(role, text){
  const d = document.createElement('div');
  d.className = 'message ' + (role==='user' ? 'user' : 'bot');
  d.textContent = text;
  chatBox.appendChild(d);
  chatBox.scrollTop = chatBox.scrollHeight;
  return d;
}

async function sendMessage(){
  const text = input.value.trim();
  if(!text) return;
  chatHistory.push({role:'user', content:text});
  appendMessage('user', text);
  input.value = '';
  const loading = appendMessage('bot', 'Mengetik...');

  try {
    if(modeToggle.checked){
      const res = await fetch(LOCAL_API, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({messages: [{role:'system', content:'Kamu adalah asisten ramah berbahasa Indonesia.'}, ...chatHistory]})
      });
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
  } catch (err) {
    loading.textContent = 'Error: ' + err.message;
  }
}

function offlineReply(text){
  const t = text.toLowerCase();
  if(t.includes('halo')||t.includes('hai')) return 'Halo! Saya Garus AI. Ada yang bisa saya bantu?';
  if(t.includes('siapa') && t.includes('kamu')) return 'Saya Garus AI, chatbot lokal kamu.';
  if(t.includes('cuaca')) return 'Maaf, saya offline jadi tidak bisa mengecek cuaca.';
  if(t.includes('terima kasih')||t.includes('makasih')) return 'Sama-sama!';
  return 'Saya: ' + text.split('').reverse().join('').slice(0,120) + ' ... (mode offline)';
}

function speak(text){
  if(!voiceEnabled) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'id-ID';
  u.volume = 1;
  u.rate = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

// Voice recognition (mic)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if(SpeechRecognition){
  recognition = new SpeechRecognition();
  recognition.lang = 'id-ID';
  recognition.interimResults = false;
  recognition.onstart = () => { recognizing = true; appendMessage('bot', '🎙️ Mendengarkan...'); };
  recognition.onend = () => { recognizing = false; appendMessage('bot', '🛑 Selesai mendengarkan'); };
  recognition.onresult = (e) => {
    const text = e.results[e.results.length-1][0].transcript;
    input.value = text;
    sendMessage();
  };
}

startListenBtn?.addEventListener('click', ()=>{ if(recognition && !recognizing) recognition.start(); });
stopListenBtn?.addEventListener('click', ()=>{ if(recognition && recognizing) recognition.stop(); });
toggleVoiceBtn?.addEventListener('click', ()=>{ voiceEnabled = !voiceEnabled; voiceStatusSpan.textContent = voiceEnabled ? 'ON' : 'OFF'; });

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keydown', e=>{ if(e.key==='Enter') sendMessage(); });
clearBtn.addEventListener('click', ()=>{ chatHistory=[]; chatBox.innerHTML=''; });
