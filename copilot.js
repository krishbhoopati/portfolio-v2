export const mapleCopilot = [
  {
    role: "user",
    text: "What did Krish do at Maple Leaf Foods?"
  },
  {
    role: "assistant",
    text: `At Maple Leaf Foods, Krish focused on helping teams work smarter by making AI more accessible and useful across the company.

- He built a Power BI dashboard that gave leadership a clearer picture of how AI was being used across the organization, and worked with teams to find opportunities where AI could make their day-to-day work easier.
- He also led Microsoft Copilot workshops across 6+ business functions, helping drive enterprise AI adoption to 91%.
- On the technical side, he built automated workflows that saved around 6 hours per review cycle, along with an AI agent that turned a 3-hour weekly research and communications process into something that took just minutes.

Throughout his internship, he worked with stakeholders and developers to turn real business problems into solutions that saved time, improved processes, and helped more people get value from AI.`
  }
];

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function blocks(text) {
  const result = [];
  let list = null;
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) {
      list = null;
      continue;
    }
    if (line.startsWith("- ")) {
      if (!list) {
        list = { type: "list", items: [] };
        result.push(list);
      }
      list.items.push(line.slice(2));
      continue;
    }
    list = null;
    result.push({ type: "p", text: line });
  }
  return result;
}

export function playCopilot(root, { script = mapleCopilot, whenVisible = false } = {}) {
  if (!root || root.dataset.copilotPlayed === "true") return Promise.resolve();
  const start = () => runCopilot(root, script);
  if (!whenVisible || !("IntersectionObserver" in window)) return start();
  return new Promise((resolve) => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        resolve(start());
      },
      { threshold: 0.4 }
    );
    observer.observe(root);
  });
}

async function runCopilot(root, script) {
  if (root.dataset.copilotPlayed === "true") return;
  root.dataset.copilotPlayed = "true";

  const thread = root.querySelector("[data-copilot-thread]");
  const composer = root.querySelector("[data-copilot-composer]");
  const prompt = script.find((line) => line.role === "user");
  const answer = script.find((line) => line.role === "assistant");
  if (!thread || !composer || !prompt || !answer) return;

  async function type(node, text, ms) {
    node.textContent = "";
    for (const char of text) {
      node.textContent += char;
      if (thread.contains(node)) thread.scrollTop = thread.scrollHeight;
      await wait(ms);
    }
  }

  function userMessage(text) {
    const message = document.createElement("div");
    message.className = "copilot-msg copilot-msg-user";
    const body = document.createElement("p");
    body.textContent = text;
    message.append(body);
    thread.append(message);
  }

  function assistantMessage() {
    const message = document.createElement("div");
    message.className = "copilot-msg copilot-msg-assistant";
    const mark = document.createElement("span");
    mark.className = "copilot-mark";
    mark.setAttribute("aria-hidden", "true");
    const body = document.createElement("div");
    body.className = "copilot-msg-body";
    body.setAttribute("role", "status");
    const finalText = document.createElement("span");
    finalText.className = "copilot-sr";
    body.append(finalText);
    message.append(mark, body);
    thread.append(message);
    return { body, finalText };
  }

  function append(body, node) {
    node.setAttribute("aria-hidden", "true");
    body.insertBefore(node, body.querySelector(".copilot-sr"));
    thread.scrollTop = thread.scrollHeight;
    return node;
  }

  function fillAnswer(body, text) {
    for (const block of blocks(text)) {
      if (block.type === "p") {
        const paragraph = document.createElement("p");
        paragraph.textContent = block.text;
        append(body, paragraph);
        continue;
      }
      const list = document.createElement("ul");
      list.className = "copilot-list";
      for (const item of block.items) {
        const entry = document.createElement("li");
        entry.textContent = item;
        list.append(entry);
      }
      append(body, list);
    }
  }

  async function writeAnswer(body, text, ms) {
    for (const block of blocks(text)) {
      if (block.type === "p") {
        const paragraph = document.createElement("p");
        paragraph.className = "copilot-stream is-typing";
        append(body, paragraph);
        await type(paragraph, block.text, ms);
        paragraph.classList.remove("is-typing");
        continue;
      }
      const list = document.createElement("ul");
      list.className = "copilot-list";
      append(body, list);
      for (const item of block.items) {
        const entry = document.createElement("li");
        entry.className = "copilot-stream is-typing";
        list.append(entry);
        thread.scrollTop = thread.scrollHeight;
        await type(entry, item, ms);
        entry.classList.remove("is-typing");
      }
    }
  }

  function typing() {
    const indicator = document.createElement("div");
    indicator.className = "copilot-typing";
    indicator.setAttribute("aria-hidden", "true");
    indicator.innerHTML = "<span></span><span></span><span></span>";
    thread.append(indicator);
    return indicator;
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    userMessage(prompt.text);
    const settled = assistantMessage();
    fillAnswer(settled.body, answer.text);
    settled.finalText.textContent = answer.text.replace(/^- /gm, "");
    return;
  }

  composer.classList.remove("is-placeholder");
  composer.classList.add("is-typing");
  await type(composer, prompt.text, 26);
  composer.classList.remove("is-typing");
  await wait(360);
  composer.textContent = "Message Copilot";
  composer.classList.add("is-placeholder");
  userMessage(prompt.text);

  await wait(420);
  const indicator = typing();
  await wait(680);
  indicator.remove();

  const settled = assistantMessage();
  await writeAnswer(settled.body, answer.text, 14);
  settled.finalText.textContent = answer.text.replace(/^- /gm, "");
  thread.scrollTop = thread.scrollHeight;
}
