(() => {
  const MODEL = "onnx-community/Qwen3-0.6B-ONNX";
  const TRANSFORMERS_URL = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.2.0";
  let generator = null;
  let loadingPromise = null;
  let messages = [];

  const systemPrompt = `You are Vansh AI, the personal AI assistant on Vansh Kesar's portfolio website.
You are friendly, concise, natural, and helpful. You speak like a smart student, not like a corporate chatbot.
Know this portfolio context:
- Vansh Kesar is a Computer Intelligence student at SRM Institute of Science & Technology.
- He builds real products using AI, code, and design.
- Featured projects include FixMyWallet, a gamified personal finance platform, and FitPrint, an AI fashion sizing and recommendation platform.
- His portfolio focuses on AI, web development, product building, and design.
- GitHub: github.com/vanshkesar23
- Email: vk6092@srmist.edu.in
If a visitor asks about something not covered by the portfolio context, answer normally when you can, but never invent personal facts about Vansh.
Do not claim to be ChatGPT or OpenAI. You are Vansh AI, a local open source model running in the visitor's browser.
Keep answers short unless the visitor asks for detail.`;

  const css = `
    .vansh-ai-launcher{position:fixed;right:28px;bottom:28px;z-index:9998;border:1px solid rgba(255,255,255,.18);background:rgba(18,18,18,.88);backdrop-filter:blur(18px);color:#fff;border-radius:999px;padding:13px 18px;display:flex;align-items:center;gap:10px;font:500 13px Inter,Arial,sans-serif;letter-spacing:.02em;cursor:pointer;box-shadow:0 16px 45px rgba(0,0,0,.35);transition:transform .25s ease,border-color .25s ease,background .25s ease}.vansh-ai-launcher:hover{transform:translateY(-3px);border-color:rgba(255,255,255,.4);background:rgba(30,30,30,.95)}
    .vansh-ai-dot{width:8px;height:8px;border-radius:50%;background:#ff5a46;box-shadow:0 0 14px rgba(255,90,70,.7)}
    .vansh-ai-panel{position:fixed;right:28px;bottom:86px;width:min(410px,calc(100vw - 32px));height:min(610px,calc(100vh - 115px));z-index:9999;background:rgba(10,10,10,.96);border:1px solid rgba(255,255,255,.14);border-radius:24px;backdrop-filter:blur(24px);box-shadow:0 28px 90px rgba(0,0,0,.55);display:none;overflow:hidden;font-family:Inter,Arial,sans-serif;color:#f5f2ed}.vansh-ai-panel.open{display:flex;flex-direction:column;animation:vanshAiIn .28s ease both}@keyframes vanshAiIn{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}
    .vansh-ai-head{padding:18px 18px 14px;border-bottom:1px solid rgba(255,255,255,.09);display:flex;align-items:center;justify-content:space-between}.vansh-ai-title{display:flex;align-items:center;gap:11px}.vansh-ai-avatar{width:38px;height:38px;border-radius:13px;display:grid;place-items:center;background:linear-gradient(135deg,#ff604b,#ff9d76);color:#111;font-weight:700;font-family:Georgia,serif}.vansh-ai-name{font:600 15px Inter,Arial,sans-serif}.vansh-ai-status{font-size:10px;color:#8d8a85;margin-top:3px}.vansh-ai-close{border:0;background:transparent;color:#aaa;font-size:22px;cursor:pointer;width:32px;height:32px;border-radius:50%}.vansh-ai-close:hover{background:rgba(255,255,255,.08);color:#fff}
    .vansh-ai-messages{flex:1;overflow:auto;padding:18px;display:flex;flex-direction:column;gap:12px}.vansh-ai-msg{max-width:86%;padding:11px 13px;border-radius:16px;font-size:13px;line-height:1.55;white-space:pre-wrap;word-break:break-word}.vansh-ai-msg.ai{align-self:flex-start;background:#181818;border:1px solid rgba(255,255,255,.08)}.vansh-ai-msg.user{align-self:flex-end;background:#f1eee8;color:#111}.vansh-ai-msg.loading{color:#9c9994}.vansh-ai-suggestions{padding:0 18px 10px;display:flex;gap:7px;overflow:auto}.vansh-ai-chip{white-space:nowrap;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.035);color:#c9c5be;border-radius:999px;padding:7px 10px;font-size:11px;cursor:pointer}.vansh-ai-chip:hover{background:rgba(255,255,255,.08);color:#fff}.vansh-ai-form{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.09)}.vansh-ai-input{flex:1;min-width:0;border:1px solid rgba(255,255,255,.12);outline:0;background:#151515;color:#fff;border-radius:15px;padding:12px 13px;font:13px Inter,Arial,sans-serif}.vansh-ai-input:focus{border-color:rgba(255,255,255,.32)}.vansh-ai-send{border:0;width:44px;border-radius:14px;background:#f1eee8;color:#111;cursor:pointer;font-size:17px}.vansh-ai-send:disabled{opacity:.4;cursor:not-allowed}.vansh-ai-note{font-size:9px;color:#6f6c68;text-align:center;padding:0 12px 9px}.vansh-ai-progress{height:2px;background:rgba(255,255,255,.07);overflow:hidden}.vansh-ai-progress span{display:block;height:100%;width:0;background:#ff604b;transition:width .2s ease}
    @media(max-width:600px){.vansh-ai-launcher{right:16px;bottom:16px}.vansh-ai-panel{right:10px;bottom:72px;width:calc(100vw - 20px);height:min(650px,calc(100vh - 90px));border-radius:20px}}
  `;

  function addStyles() {
    const style = document.createElement("style");
    style.id = "vansh-ai-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function createUI() {
    const launcher = document.createElement("button");
    launcher.className = "vansh-ai-launcher";
    launcher.setAttribute("aria-label", "Open Vansh AI");
    launcher.innerHTML = '<span class="vansh-ai-dot"></span><span>Vansh AI</span>';

    const panel = document.createElement("section");
    panel.className = "vansh-ai-panel";
    panel.setAttribute("aria-label", "Vansh AI chat");
    panel.innerHTML = `
      <div class="vansh-ai-head">
        <div class="vansh-ai-title">
          <div class="vansh-ai-avatar">V</div>
          <div><div class="vansh-ai-name">Vansh AI</div><div class="vansh-ai-status" id="vansh-ai-status">Local open source AI</div></div>
        </div>
        <button class="vansh-ai-close" aria-label="Close Vansh AI">×</button>
      </div>
      <div class="vansh-ai-progress"><span id="vansh-ai-progress"></span></div>
      <div class="vansh-ai-messages" id="vansh-ai-messages"></div>
      <div class="vansh-ai-suggestions">
        <button class="vansh-ai-chip">Tell me about Vansh</button>
        <button class="vansh-ai-chip">What has he built?</button>
        <button class="vansh-ai-chip">Why FitPrint?</button>
      </div>
      <form class="vansh-ai-form" id="vansh-ai-form">
        <input class="vansh-ai-input" id="vansh-ai-input" autocomplete="off" placeholder="Ask Vansh AI anything..." />
        <button class="vansh-ai-send" id="vansh-ai-send" type="submit" aria-label="Send">↑</button>
      </form>
      <div class="vansh-ai-note">Runs locally in your browser with an open source model. First launch downloads the model.</div>
    `;

    document.body.append(launcher, panel);
    return { launcher, panel };
  }

  function appendMessage(role, text, extraClass = "") {
    const box = document.getElementById("vansh-ai-messages");
    const item = document.createElement("div");
    item.className = `vansh-ai-msg ${role} ${extraClass}`.trim();
    item.textContent = text;
    box.appendChild(item);
    box.scrollTop = box.scrollHeight;
    return item;
  }

  async function loadModel() {
    if (generator) return generator;
    if (loadingPromise) return loadingPromise;

    loadingPromise = (async () => {
      const status = document.getElementById("vansh-ai-status");
      const progress = document.getElementById("vansh-ai-progress");
      status.textContent = "Loading local model...";
      progress.style.width = "8%";

      const { pipeline, TextStreamer } = await import(TRANSFORMERS_URL);
      progress.style.width = "22%";

      generator = await pipeline("text-generation", MODEL, {
        device: "webgpu",
        dtype: "q4f16",
        progress_callback: data => {
          if (typeof data.progress === "number") {
            progress.style.width = `${Math.max(8, Math.min(100, Math.round(data.progress)))}%`;
          }
        }
      });

      progress.style.width = "100%";
      status.textContent = "Ready · running on your device";
      setTimeout(() => { progress.style.width = "0"; }, 700);
      return generator;
    })().catch(error => {
      loadingPromise = null;
      generator = null;
      const status = document.getElementById("vansh-ai-status");
      status.textContent = "WebGPU unavailable · try Chrome or Safari 18+";
      throw error;
    });

    return loadingPromise;
  }

  async function ask(text) {
    const input = document.getElementById("vansh-ai-input");
    const send = document.getElementById("vansh-ai-send");
    if (!text.trim() || send.disabled) return;

    appendMessage("user", text.trim());
    messages.push({ role: "user", content: text.trim() });
    input.value = "";
    send.disabled = true;

    const loading = appendMessage("ai", "Thinking...", "loading");

    try {
      const model = await loadModel();
      loading.remove();

      const chat = [
        { role: "system", content: systemPrompt },
        ...messages.slice(-8)
      ];

      let responseText = "";
      const responseNode = appendMessage("ai", "");
      const streamer = new TextStreamer(model.tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function: token => {
          responseText += token;
          responseNode.textContent = responseText;
          const box = document.getElementById("vansh-ai-messages");
          box.scrollTop = box.scrollHeight;
        }
      });

      const output = await model(chat, {
        max_new_tokens: 220,
        do_sample: true,
        temperature: 0.65,
        top_k: 30,
        streamer
      });

      if (!responseText) {
        const generated = output?.[0]?.generated_text;
        responseText = Array.isArray(generated) ? generated.at(-1)?.content || "I'm not sure yet." : String(generated || "I'm not sure yet.");
        responseNode.textContent = responseText;
      }
      messages.push({ role: "assistant", content: responseText });
    } catch (error) {
      loading.remove();
      appendMessage("ai", "I couldn't start the local model on this browser. Try the latest Chrome, Edge, or Safari 18+ with WebGPU enabled.");
      console.error("Vansh AI error:", error);
    } finally {
      send.disabled = false;
      input.focus();
    }
  }

  function init() {
    if (document.getElementById("vansh-ai-launcher")) return;
    addStyles();
    const { launcher, panel } = createUI();
    launcher.id = "vansh-ai-launcher";
    const input = panel.querySelector("#vansh-ai-input");
    const form = panel.querySelector("#vansh-ai-form");

    appendMessage("ai", "Hey! I'm Vansh AI. Ask me about Vansh, his projects, skills, or the ideas behind this portfolio.");

    launcher.addEventListener("click", () => {
      panel.classList.toggle("open");
      if (panel.classList.contains("open")) input.focus();
    });
    panel.querySelector(".vansh-ai-close").addEventListener("click", () => panel.classList.remove("open"));
    form.addEventListener("submit", event => { event.preventDefault(); ask(input.value); });
    panel.querySelectorAll(".vansh-ai-chip").forEach(chip => chip.addEventListener("click", () => ask(chip.textContent)));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
