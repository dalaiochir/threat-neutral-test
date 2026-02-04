import Link from "next/link";

export default function Home() {
  return (
    <div className="card">
      <div className="title">Threat vs Neutral — 2 үе шаттай тест</div>
      <p className="muted">
        1-р үе шат: заналхийлсэн утгатай үгийг олно. <br/>
        2-р үе шат: энгийн утгатай үгийг олно. <br/>
        Сонгосны дараа зөв/бурууг шууд харуулна. Эцэст нь нийт хугацаа + зөв хувь + benchmark-тэй харьцуулалт гарна.
      </p>

      <div className="actions">
        <Link className="btn" href="/test">Тест эхлэх</Link>
        <Link className="btn ghost" href="/history">Түүх</Link>
        <Link className="btn ghost" href="/settings">Benchmark</Link>
      </div>
    </div>
  );
}
