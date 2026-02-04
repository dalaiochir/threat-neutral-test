import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container" style={{ padding: "28px 16px" }}>
      <h1 style={{ fontSize: 38, margin: "8px 0 10px" }}>
        2 үе шаттай сонголтын тест
      </h1>

      <p style={{ opacity: 0.8, maxWidth: 760, lineHeight: 1.5 }}>
        1-р үе шат: заналхийлсэн утгатай үгийг олно. <br />
        2-р үе шат: энгийн (нейтраль) утгатай үгийг олно. <br />
        Дууссаны дараа нийт хугацаа, зөв хувь, мөн өөрийн Baseline / Personal Best-тэй харьцуулалт гарна.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
        <Link
          href="/test"
          style={{
            textDecoration: "none",
            padding: "12px 14px",
            borderRadius: 14,
            border: "1px solid #111827",
            background: "#111827",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          Тест эхлэх
        </Link>

        <Link
          href="/history"
          style={{
            textDecoration: "none",
            padding: "12px 14px",
            borderRadius: 14,
            border: "1px solid #e5e7eb",
            background: "#fff",
            color: "#111827",
            fontWeight: 700,
          }}
        >
          Түүх харах
        </Link>

        <Link
          href="/settings"
          style={{
            textDecoration: "none",
            padding: "12px 14px",
            borderRadius: 14,
            border: "1px solid #e5e7eb",
            background: "#fff",
            color: "#111827",
            fontWeight: 700,
          }}
        >
          Тохиргоо
        </Link>
      </div>

      <section
        style={{
          marginTop: 18,
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 14,
          background: "#fff",
          boxShadow: "0 6px 18px rgba(0,0,0,.06)",
        }}
      >
        <h2 style={{ margin: "0 0 6px" }}>Зөвлөмж</h2>
        <ul style={{ margin: 0, paddingLeft: 18, opacity: 0.85, lineHeight: 1.6 }}>
          <li>Тест эхлэхээс өмнө орчноо тайван байлга.</li>
          <li>Аль болох хурдан бөгөөд зөв сонгохыг зорь.</li>
          <li>Baseline-аа тохируулж өөрийн ахиц дэвшлийг харьцуул.</li>
        </ul>
      </section>
    </main>
  );
}
