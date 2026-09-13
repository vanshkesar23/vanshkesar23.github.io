(() => {
  const MODEL = "Qwen3-0.6B-q4f16_1-MLC";
  const WEBLLM_URL = "https://esm.run/@mlc-ai/web-llm@0.2.82";
  let engine = null;
  let loadingPromise = null;
  let messages = [];

  const systemPrompt = `You are Vansh AI, the personal AI assistant on Vansh Kesar's portfolio website.
Be friendly, concise, natural, and helpful. Speak like a smart student, not a corporate chatbot.
Portfolio facts you may use:
Vansh Kesar is a Computer Intelligence student at SRM Institute of Science & Technology.
He builds real products using AI, code, and design.
Featured projects include FixMyWallet, a gamified personal finance platform, and FitPrint, an AI fashion sizing and recommendation platform.
His portfolio focuses on AI, web development, product building, and design.
GitHub: github.com/vanshkesar23
Email: vk6092@srmist.edu.in
Never invent personal facts about Vansh.
Do not claim to be ChatGPT or OpenAI. You are Vansh AI, a local open source model running in the visitor's browser.
Keep answers short unless the visitor asks for detail.`;

  const css = `
    .vansh-local-launcher{position:fixed;right:28px;bottom:28px;z-index:9998;border:1px solid rgba(255,255,255,.18);background:rgba(18,18,18,.88);backdrop-filter:blur(18px);color:#fff;border-radius:999px;padding:13px 18px;display:flex;align-items:center;gap:10px;font:500 13px Inter,Arial,sans-serif;cursor:pointer;box-shadow:0 16px 45px rgba(0,0,0,.35)}
    .vansh-local-dot{width:8px;height:8px;border-radius:50%;background:#ff5a46;box-shadow:0 0 14px rgba(255,90,70,.7)}
    .vansh-local-panel{position:fixed;right:28px;bottom:86px;width:min(410px,calc(100vw - 32px));height:min(610px,calc(100vh - 115px));z-index:9999;background:rgba(10,10,10,.97);border:1px solid rgba(255,255,255,.14);border-radius:24px;backdrop-filter:blur(24px);box-shadow:0 28px 90px rgba(0,0,0,.55);display:none;overflow:hidden;font-family:Inter,Arial,sans-serif;color:#f5f2ed}.vansh-local-panel.open{display:flex;flex-direction:column}
    .vansh-local-head{padding:18px;border-bottom:1px solid rgba(255,255,255,.09);display:flex;align-items:center;justify-content:space-between}.vansh-local-title{display:flex;align-items:center;gap:11px}.vansh-local-avatar{width:38px;height:38px;border-radius:13px;display:grid;place-items:center;background:linear-gradient(135deg,#ff604b,#ff9d76);color:#111;font-weight:700;font-family:Georgia,serif}.vansh-local-name{font-weight:600;font-size:15px}.vansh-local-status{font-size:10px;color:#8d8a85;margin-top:3px}.vansh-local-close{border:0;background:transparent;color:#aaa;font-size:22px;cursor:pointer}.vansh-local-messages{flex:1;overflow:auto;padding:18px;display:flex;flex-direction:column;gap:12px}.vansh-local-msg{max-width:86%;padding:11px 13px;border-radius:16px;font-size:13px;line-height:1.55;white-space:pre-wrap;word-break:break-word}.vansh-local-msg.ai{align-self:flex-start;background:#181818;border:1px solid rgba(255,255,255,.08)}.vansh-local-msg.user{align-self:flex-end;background:#f1eee8;color:#111}.vansh-local-msg.loading{color:#9c9994}.vansh-local-suggestions{padding:0 18px 10px;display:flex;gap:7px;overflow:auto}.vansh-local-chip{white-space:nowrap;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.035);color:#c9c5be;border-radius:999px;padding:7px 10px;font-size:11px;cursor:pointer}.vansh-local-form{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.09)}.vansh-local-input{flex:1;min-width:0;border:1px solid rgba(255,255,255,.12);outline:0;background:#151515;color:#fff;border-radius:15px;padding:12px 13px;font:13px Inter,Arial,sans-serif}.vansh-local-send{border:0;width:44px;border-radius:14px;background:#f1eee8;color:#111;cursor:pointer;font-size:17px}.vansh-local-send:disabled{opacity:.4;cursor:not-allowed}.vansh-local-note{font-size:9px;color:#6f6c68;text-align:center;padding:0 12px 9px}.vansh-local-progress{height:2px;background:rgba(255,255,255,.07)}.vansh-local-progress span{display:block;height:100%;width:0;background:#ff604b;transition:width .2s ease}@media(max-width:600px){.vansh-local-launcher{right:16px;bottom:16px}.vansh-local-panel{right:10px;bottom:72px;width:calc(100vw - 20px);height:min(650px,calc(100vh - 90px));border-radius:20px}}
  `;

  function addStyles(){const s=document.createElement("style");s.id="vansh-local-ai-styles";s.textContent=css;document.head.appendChild(s)}
  function ui(){
    const launcher=document.createElement("button"); launcher.className="vansh-local-launcher"; launcher.innerHTML='<span class="vansh-local-dot"></span><span>Vansh AI</span>';
    const panel=document.createElement("section"); panel.className="vansh-local-panel"; panel.innerHTML=`<div class="vansh-local-head"><div class="vansh-local-title"><div class="vansh-local-avatar">V</div><div><div class="vansh-local-name">Vansh AI</div><div class="vansh-local-status" id="vansh-local-status">Starting local AI...</div></div></div><button class="vansh-local-close">×</button></div><div class="vansh-local-progress"><span id="vansh-local-progress"></span></div><div class="vansh-local-messages" id="vansh-local-messages"></div><div class="vansh-local-suggestions"><button class="vansh-local-chip">Tell me about Vansh</button><button class="vansh-local-chip">What has he built?</button><button class="vansh-local-chip">Why FitPrint?</button></div><form class="vansh-local-form"><input class="vansh-local-input" autocomplete="off" placeholder="Ask Vansh AI anything..."/><button class="vansh-local-send" type="submit">↑</button></form><div class="vansh-local-note">Runs locally in your browser. First launch downloads a small open source model.</div>`;
    document.body.append(launcher,panel); return {launcher,panel};
  }
  function msg(role,text,extra=""){const b=document.getElementById("vansh-local-messages"),x=document.createElement("div");x.className=`vansh-local-msg ${role} ${extra}`;x.textContent=text;b.appendChild(x);b.scrollTop=b.scrollHeight;return x}
  function progress(v,t){const b=document.getElementById("vansh-local-progress"),s=document.getElementById("vansh-local-status");if(b)b.style.width=`${Math.max(0,Math.min(100,Math.round(v)))}%`;if(s&&t)s.textContent=t}
  async function load(){
    if(engine)return engine;if(loadingPromise)return loadingPromise;
    loadingPromise=(async()=>{progress(2,"Loading local engine...");const webllm=await import(WEBLLM_URL);progress(6,"Preparing Qwen 0.6B...");engine=await webllm.CreateMLCEngine(MODEL,{initProgressCallback:r=>{const p=typeof r?.progress==="number"?r.progress*100:0;progress(Math.max(6,p),r?.text||"Downloading model...")},logLevel:"ERROR"},{context_window_size:2048,temperature:.45,top_p:.9});progress(100,"Ready · running on your device");return engine})().catch(e=>{engine=null;loadingPromise=null;console.error("Vansh AI startup error",e);throw e});return loadingPromise;
  }
  async function ask(text,input,send){const q=text.trim();if(!q||send.disabled)return;msg("user",q);messages.push({role:"user",content:q});input.value="";send.disabled=true;const wait=msg("ai","Thinking...","loading");try{const model=await load();wait.remove();const r=await model.chat.completions.create({messages:[{role:"system",content:systemPrompt},...messages.slice(-6)],max_tokens:180,temperature:.45,top_p:.9,stream:false,extra_body:{enable_thinking:false}});const a=r?.choices?.[0]?.message?.content?.trim()||"I couldn't generate an answer.";msg("ai",a);messages.push({role:"assistant",content:a})}catch(e){wait.remove();const detail=e?.message?`AI couldn't start on this device. Error: ${e.message}`:"AI couldn't start on this device.";msg("ai",detail);console.error(e)}finally{send.disabled=false;input.focus()}}
  function init(){
    if(document.getElementById("vansh-local-launcher"))return; addStyles();const {launcher,panel}=ui();launcher.id="vansh-local-launcher";const input=panel.querySelector(".vansh-local-input"),send=panel.querySelector(".vansh-local-send");msg("ai","Hey! I'm Vansh AI. Ask me about Vansh, his projects, skills, or this portfolio.");launcher.onclick=()=>{panel.classList.toggle("open");if(panel.classList.contains("open"))input.focus()};panel.querySelector(".vansh-local-close").onclick=()=>panel.classList.remove("open");panel.querySelector("form").onsubmit=e=>{e.preventDefault();ask(input.value,input,send)};panel.querySelectorAll(".vansh-local-chip").forEach(c=>c.onclick=()=>ask(c.textContent,input,send));
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
