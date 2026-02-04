const HISTORY_KEY = "twostage_test_history_v1";

const historyTable = document.querySelector("#historyTable");
const btnClearHistory = document.querySelector("#btnClearHistory");
const btnExport = document.querySelector("#btnExport");

btnClearHistory.addEventListener("click", () => {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
});

btnExport.addEventListener("click", () => {
  const data = loadHistory();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "test_history.json";
  a.click();
  URL.revokeObjectURL(url);
});

renderHistory();

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatMs(ms) {
  const total = Math.max(0, Math.round(ms));
  const minutes = Math.floor(total / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  const millis = total % 1000;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
}

function renderHistory() {
  const list = loadHistory();
  const tbody = historyTable.querySelector("tbody");
  tbody.innerHTML = "";

  if (list.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="6" class="muted">Одоогоор түүх байхгүй байна.</td>`;
    tbody.appendChild(tr);
    return;
  }

  list.slice(0, 50).forEach((entry) => {
    const at = new Date(entry.at);
    const stageThreat = entry.stage?.find((s) => s.id === "threat");
    const stageNeutral = entry.stage?.find((s) => s.id === "neutral");

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
