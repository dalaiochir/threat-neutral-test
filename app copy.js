/***********************
 * 2-stage Image Choice Test
 * - Stage 1: Threat word
 * - Stage 2: Neutral word
 * - After click: show correct + feedback, then Next
 * - End: total time + accuracy + compare to benchmark and best
 * - History saved in localStorage
 ************************/

// ==== CONFIG (Та энд зургаа/асуултаа нэмнэ) ====
const BENCHMARK = {
  targetAccuracyPct: 90,      // зорилтот зөвийн хувь
  targetTimeMs: 30_000        // зорилтот хугацаа (жишээ: 30 сек)
};

// Асуулт бүр: { prompt, options:[{img, caption?},{img, caption?}], correctIndex }
const STAGES = [
  {
    id: "threat",
    title: "1-р үе шат: Заналхийлсэн утгатай үгийг олох",
    desc: "2 зурагнаас заналхийлсэн утгатай үгийг илэрхийлж буй зургийг сонгоно уу.",
    questions: [
      {
        prompt: "Заналхийлсэн утгатай үг аль нь вэ?",
        options: [
          { img: "./assets/threat_1_a.jpg", caption: "Сонголт A" },
          { img: "./assets/threat_1_b.jpg", caption: "Сонголт B" }
        ],
        correctIndex: 0
      },
      {
        prompt: "Заналхийлсэн утгатай үг аль нь вэ?",
        options: [
          { img: "./assets/threat_2_a.jpg", caption: "Сонголт A" },
          { img: "./assets/threat_2_b.jpg", caption: "Сонголт B" }
        ],
        correctIndex: 1
      }
    ]
  },
  {
    id: "neutral",
    title: "2-р үе шат: Энгийн утгатай үгийг олох",
    desc: "2 зурагнаас энгийн (саармаг) утгатай үгийг илэрхийлж буй зургийг сонгоно уу.",
    questions: [
      {
        prompt: "Энгийн утгатай үг аль нь вэ?",
        options: [
          { img: "./assets/neutral_1_a.jpg", caption: "Сонголт A" },
          { img: "./assets/neutral_1_b.jpg", caption: "Сонголт B" }
        ],
        correctIndex: 1
      },
      {
        prompt: "Энгийн утгатай үг аль нь вэ?",
        options: [
          { img: "./assets/neutral_2_a.jpg", caption: "Сонголт A" },
          { img: "./assets/neutral_2_b.jpg", caption: "Сонголт B" }
        ],
        correctIndex: 0
      }
    ]
  }
];

// ==== STATE ====
const state = {
  running: false,
  stageIndex: 0,
  questionIndex: 0,
  answered: false,
  totalQuestions: 0,
  totalCorrect: 0,
  stageCorrect: {},
  stageTotal: {},
  startTs: 0,
  endTs: 0,
  timerHandle: null
};

const HISTORY_KEY = "twostage_test_history_v1";

// ==== DOM ====
const $ = (sel) => document.querySelector(sel);

const screenWelcome = $("#screenWelcome");
const screenTest = $("#screenTest");
const screenResult = $("#screenResult");

const btnStart = $("#btnStart");
const btnRestart = $("#btnRestart");
const btnNext = $("#btnNext");
const btnStartAgain = $("#btnStartAgain");

const tagStage = $("#tagStage");
const tagProgress = $("#tagProgress");
const timerEl = $("#timer");

const promptTitle = $("#promptTitle");
const promptDesc = $("#promptDesc");
const choicesEl = $("#choices");
const feedbackEl = $("#feedback");

const resTime = $("#resTime");
const resAcc = $("#resAcc");
const resCorrect = $("#resCorrect");
const resTotal = $("#resTotal");
const compareText = $("#compareText");
const benchPill = $("#benchPill");
const bestPill = $("#bestPill");

const historyTable = $("#historyTable");
const btnClearHistory = $("#btnClearHistory");
const btnExport = $("#btnExport");

// ==== INIT ====
init();

function init(){
  state.totalQuestions = STAGES.reduce((sum,s)=>sum + s.questions.length, 0);
  STAGES.forEach(s=>{
    state.stageCorrect[s.id] = 0;
    state.stageTotal[s.id] = s.questions.length;
  });

  renderHistory();

  btnStart.addEventListener("click", startTest);
  btnRestart.addEventListener("click", resetAndStart);
  btnNext.addEventListener("click", nextStep);
  btnStartAgain.addEventListener("click", resetAndStart);

  btnClearHistory.addEventListener("click", () => {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
  });

  btnExport.addEventListener("click", () => {
    const data = loadHistory();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "test_history.json";
    a.click();
    URL.revokeObjectURL(url);
  });
}

function resetAndStart(){
  stopTimer();
  state.running = false;
  state.stageIndex = 0;
  state.questionIndex = 0;
  state.answered = false;
  state.totalCorrect = 0;
  Object.keys(state.stageCorrect).forEach(k => state.stageCorrect[k] = 0);
  startTest();
}

// ==== TEST FLOW ====
function startTest(){
  state.running = true;
  state.stageIndex = 0;
  state.questionIndex = 0;
  state.answered = false;

  state.startTs = performance.now();
  state.endTs = 0;

  screenWelcome.classList.add("hidden");
  screenResult.classList.add("hidden");
  screenTest.classList.remove("hidden");

  startTimer();
  renderQuestion();
}

function nextStep(){
  if(!state.running) return;

  // next question or next stage
  const stage = STAGES[state.stageIndex];
  if(state.questionIndex < stage.questions.length - 1){
    state.questionIndex += 1;
  } else {
    // next stage
    if(state.stageIndex < STAGES.length - 1){
      state.stageIndex += 1;
      state.questionIndex = 0;
    } else {
      finishTest();
      return;
    }
  }

  state.answered = false;
  btnNext.disabled = true;
  feedbackEl.classList.add("hidden");
  feedbackEl.classList.remove("ok","bad");
  renderQuestion();
}

function finishTest(){
  state.running = false;
  state.endTs = performance.now();
  stopTimer();

  const totalMs = state.endTs - state.startTs;
  const accPct = calcAccuracyPct(state.totalCorrect, state.totalQuestions);

  // save history
  const entry = {
    at: new Date().toISOString(),
    totalMs: Math.round(totalMs),
    totalCorrect: state.totalCorrect,
    totalQuestions: state.totalQuestions,
    accPct,
    stage: STAGES.map(s => ({
      id: s.id,
      correct: state.stageCorrect[s.id],
      total: state.stageTotal[s.id]
    }))
  };
  saveHistoryEntry(entry);
  renderHistory();

  // render results
  resTime.textContent = formatMs(totalMs);
  resAcc.textContent = `${accPct.toFixed(1)}%`;
  resCorrect.textContent = String(state.totalCorrect);
  resTotal.textContent = String(state.totalQuestions);

  // compare text
  const benchAccOk = accPct >= BENCHMARK.targetAccuracyPct;
  const benchTimeOk = totalMs <= BENCHMARK.targetTimeMs;

  benchPill.textContent = `Benchmark: ≥${BENCHMARK.targetAccuracyPct}% & ≤${formatMs(BENCHMARK.targetTimeMs)}`;
  const best = getBestFromHistory(loadHistory());
  bestPill.textContent = best
    ? `Таны best: ${best.accPct.toFixed(1)}% / ${formatMs(best.totalMs)}`
    : `Таны best: -`;

  const parts = [];
  parts.push(`Таны үр дүн: ${accPct.toFixed(1)}% зөв, хугацаа ${formatMs(totalMs)}.`);

  parts.push(
    `Benchmark-тэй харьцуулахад: зөвийн хувь ${benchAccOk ? "хангаж байна ✅" : "хангахгүй байна ❌"}, ` +
    `хугацаа ${benchTimeOk ? "хангаж байна ✅" : "хангахгүй байна ❌"}.`
  );

  if(best){
    const faster = totalMs < best.totalMs;
    const higher = accPct > best.accPct;
    parts.push(`Өмнөх best-тэй харьцуулахад: хугацаа ${faster ? "сайжирсан ⬆️" : "сайжраагүй"}, зөвийн хувь ${higher ? "сайжирсан ⬆️" : "сайжраагүй"}.`);
  }

  compareText.textContent = parts.join(" ");

  screenTest.classList.add("hidden");
  screenResult.classList.remove("hidden");
}

// ==== RENDER QUESTION ====
function renderQuestion(){
  const stage = STAGES[state.stageIndex];
  const q = stage.questions[state.questionIndex];

  tagStage.textContent = `Үе шат: ${state.stageIndex + 1}/${STAGES.length}`;
  const globalIndex = getGlobalQuestionIndex(state.stageIndex, state.questionIndex);
  tagProgress.textContent = `Асуулт: ${globalIndex + 1}/${state.totalQuestions}`;

  promptTitle.textContent = stage.title;
  promptDesc.textContent = q.prompt || stage.desc;

  choicesEl.innerHTML = "";
  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.type = "button";
    btn.setAttribute("data-index", String(idx));
    btn.innerHTML = `
      <img src="${opt.img}" alt="choice ${idx+1}" />
      <div class="caption">${opt.caption ?? ""}</div>
    `;
    btn.addEventListener("click", () => onChoose(idx));
    choicesEl.appendChild(btn);
  });

  btnNext.disabled = true;
  feedbackEl.classList.add("hidden");
  feedbackEl.classList.remove("ok","bad");
}

function onChoose(chosenIndex){
  if(state.answered) return;

  const stage = STAGES[state.stageIndex];
  const q = stage.questions[state.questionIndex];

  state.answered = true;

  const isCorrect = chosenIndex === q.correctIndex;
  if(isCorrect){
    state.totalCorrect += 1;
    state.stageCorrect[stage.id] += 1;
  }

  // mark UI
  const cards = [...choicesEl.querySelectorAll(".choice")];
  cards.forEach((c) => c.disabled = true);

  cards[chosenIndex].classList.add("selected");
  cards[q.correctIndex].classList.add("correct");
  if(!isCorrect) cards[chosenIndex].classList.add("wrong");

  // feedback
  feedbackEl.classList.remove("hidden");
  feedbackEl.classList.add(isCorrect ? "ok" : "bad");
  feedbackEl.textContent = isCorrect
    ? "Зөв ✅ — Дараагийнх руу шилжихэд 'Дараагийнх'-ийг дарна уу."
    : "Буруу ❌ — Ногооноор тэмдэглэгдсэн нь зөв байсан. Дараагийнх руу шилжихэд 'Дараагийнх'-ийг дарна уу.";

  btnNext.disabled = false;
}

// ==== TIMER ====
function startTimer(){
  stopTimer();
  state.timerHandle = setInterval(() => {
    if(!state.running) return;
    const ms = performance.now() - state.startTs;
    timerEl.textContent = formatMs(ms);
  }, 50);
}
function stopTimer(){
  if(state.timerHandle){
    clearInterval(state.timerHandle);
    state.timerHandle = null;
  }
}
function formatMs(ms){
  const total = Math.max(0, Math.round(ms));
  const minutes = Math.floor(total / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  const millis = total % 1000;
  return `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}.${String(millis).padStart(3,"0")}`;
}

// ==== HELPERS ====
function calcAccuracyPct(correct, total){
  if(total <= 0) return 0;
  return (correct / total) * 100;
}

function getGlobalQuestionIndex(stageIndex, questionIndex){
  let idx = 0;
  for(let i=0;i<stageIndex;i++){
    idx += STAGES[i].questions.length;
  }
  idx += questionIndex;
  return idx;
}

// ==== HISTORY (localStorage) ====
function loadHistory(){
  try{
    const raw = localStorage.getItem(HISTORY_KEY);
    if(!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  }catch{
    return [];
  }
}

function saveHistoryEntry(entry){
  const list = loadHistory();
  list.unshift(entry); // newest first
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}

function getBestFromHistory(list){
  if(!list.length) return null;
  // Best: higher accuracy first, if tie then faster time
  const sorted = [...list].sort((a,b) => {
    if(b.accPct !== a.accPct) return b.accPct - a.accPct;
    return a.totalMs - b.totalMs;
  });
  return sorted[0] || null;
}

function renderHistory(){
  const list = loadHistory();
  const tbody = historyTable.querySelector("tbody");
  tbody.innerHTML = "";

  if(list.length === 0){
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="6" class="muted">Одоогоор түүх байхгүй байна.</td>`;
    tbody.appendChild(tr);
    return;
  }

  list.slice(0, 30).forEach(entry => {
    const at = new Date(entry.at);
    const stageThreat = entry.stage?.find(s => s.id === "threat");
    const stageNeutral = entry.stage?.find(s => s.id === "neutral");

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${at.toLocaleString()}</td>
      <td>${formatMs(entry.totalMs)}</td>
      <td>${Number(entry.accPct).toFixed(1)}%</td>
      <td>${entry.totalCorrect}/${entry.totalQuestions}</td>
      <td>${stageThreat ? `${stageThreat.correct}/${stageThreat.total}` : "-"}</td>
      <td>${stageNeutral ? `${stageNeutral.correct}/${stageNeutral.total}` : "-"}</td>
    `;
    tbody.appendChild(tr);
  });
}
