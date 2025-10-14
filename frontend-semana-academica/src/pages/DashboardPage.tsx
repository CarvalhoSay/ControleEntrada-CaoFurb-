import React, { useEffect, useMemo, useState } from "react";
import api from "../lib/api";

type Participant = {
  id: string | number;
  name: string;
  barcode: string;
};

type AttendanceSession = {
  id?: string | number;
  startTime?: string;       // ISO
  start_time?: string;      // (fallback)
  endTime?: string | null;  // ISO
  end_time?: string | null; // (fallback)
};

type Row = {
  id: string;
  name: string;
  barcode: string;
  totalMs: number;
  sessionsCount: number;
  isPresent: boolean;
  lastMovement?: string; // ISO
};

function formatDuration(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  if (h === 0) {
    // abaixo de 1h → MM:SS
    return `${pad(m)}:${pad(s)}`;
  }
  // 1h ou mais → HH:MM:SS
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

// normaliza start/end em caso de snake_case
function normalizeSession(s: AttendanceSession) {
  return {
    startTime: s.startTime ?? s.start_time ?? null,
    endTime: s.endTime ?? s.end_time ?? null,
  };
}

export default function DashboardPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);

        // 1) participantes
        const pRes = await axios.get<Participant[]>("/api/participants");
        const base = pRes.data ?? [];
        setParticipants(base);

        // 2) para cada barcode, traz as sessões
        const sessionsByBarcode = await Promise.all(
          base.map(async (p) => {
            try {
              const sRes = await axios.get<AttendanceSession[]>(
                `/api/attendance/by-participant/${encodeURIComponent(p.barcode)}/sessions`
              );
              return { barcode: p.barcode, sessions: sRes.data ?? [] };
            } catch {
              return { barcode: p.barcode, sessions: [] as AttendanceSession[] };
            }
          })
        );

        // índice por barcode
        const idx = new Map<string, AttendanceSession[]>();
        sessionsByBarcode.forEach(({ barcode, sessions }) => idx.set(barcode, sessions));

        // 3) calcular linhas
        const now = Date.now();
        const calc: Row[] = base.map((p) => {
          const raw = idx.get(p.barcode) ?? [];
          const sessions = raw.map(normalizeSession).filter((s) => !!s.startTime);

          let total = 0;
          let isPresent = false;
          let last: number | undefined;

          sessions.forEach((s) => {
            const start = s.startTime ? new Date(s.startTime).getTime() : NaN;
            const end = s.endTime ? new Date(s.endTime).getTime() : now;
            const lastCandidate = s.endTime ? end : start;

            if (!Number.isNaN(start) && !Number.isNaN(end) && end >= start) {
              total += end - start;
            }
            if (!s.endTime) isPresent = true;
            if (!last || (lastCandidate && lastCandidate > last)) last = lastCandidate;
          });

          return {
            id: String(p.id),
            name: p.name,
            barcode: p.barcode,
            totalMs: total,
            sessionsCount: sessions.length,
            isPresent,
            lastMovement: last ? new Date(last).toISOString() : undefined,
          };
        });

        // presentes primeiro; depois por nome
        calc.sort((a, b) => {
          if (a.isPresent !== b.isPresent) return a.isPresent ? -1 : 1;
          return a.name.localeCompare(b.name, "pt-BR");
        });

        if (alive) setRows(calc);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.barcode.toLowerCase().includes(q)
    );
  }, [rows, filter]);

  function exportCsv(data: Row[]) {
    const sep = ";";
    const headers = [
      "Participante",
      "Barcode",
      "Sessões",
      "Tempo total (MM:SS ou HH:MM:SS)",
      "Status",
      "Último movimento (ISO)",
    ];
    const esc = (v: any) => {
      const s = v == null ? "" : String(v);
      if (/[;"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    const lines = [
      headers.join(sep),
      ...data.map((r) =>
        [
          esc(r.name),
          esc(r.barcode),
          esc(r.sessionsCount),
          esc(formatDuration(r.totalMs)),
          esc(r.isPresent ? "Presente" : "Ausente"),
          esc(r.lastMovement ?? ""),
        ].join(sep)
      ),
    ];
    const csv = lines.join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dt = new Date();
    const ts = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
      dt.getDate()
    ).padStart(2, "0")}_${String(dt.getHours()).padStart(2, "0")}${String(
      dt.getMinutes()
    ).padStart(2, "0")}`;
    a.href = url;
    a.download = `participantes_tempo_${ts}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container">
      <div className="header-band shadow">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                height: 48,
                width: 48,
                borderRadius: 999,
                background: "#fff",
                display: "grid",
                placeItems: "center",
                outline: "3px solid #6e0d12",
              }}
            >
              🦷
            </div>
            <div>
              <div style={{ fontSize: 12, opacity: 0.9, fontWeight: 700 }}>XXIV</div>
              <div style={{ fontWeight: 800 }}>Semana Acadêmica de Odontologia FURB</div>
            </div>
          </div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>
            Painel • <strong>Dashboard</strong>
          </div>
        </div>
      </div>

      {/* Cards iniciais */}
      <div className="grid" style={{ marginTop: 18, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <div className="card">
          <div style={{ fontSize: 12, color: "#6b7280" }}>Check-in rápido</div>
          <div style={{ fontSize: 18, fontWeight: 700, margin: "6px 0 12px" }}>Recepção / Scanner</div>
          <a className="btn btn-primary" href="/reception">Abrir Recepção</a>
        </div>

        <div className="card">
          <div style={{ fontSize: 12, color: "#6b7280" }}>Status do evento</div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>{new Date().toLocaleDateString()}</div>
          <div style={{ marginTop: 8, color: "#374151" }}>Use o menu para navegar até a recepção.</div>
        </div>
      </div>

      {/* Relatório */}
      <div className="card" style={{ marginTop: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Relatório</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>Participantes e tempo de permanência</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", minWidth: 260 }}>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filtrar por nome ou barcode…"
              className="table-filter-input"
              style={{
                width: 260,
                padding: "12px 14px",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                outline: "none",
              }}
            />
            <button
              className="btn btn-outline"
              onClick={() => exportCsv(filtered)}
              title="Exportar o que está visível na tabela"
            >
              Exportar CSV
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Participante</th>
                <th>Barcode</th>
                <th style={{ textAlign: "center" }}>Sessões</th>
                <th style={{ textAlign: "center" }}>Tempo total (MM:SS / HH:MM:SS)</th>
                <th style={{ textAlign: "center" }}>Status</th>
                <th>Último movimento</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: 16, textAlign: "center", color: "#6b7280" }}>
                    Carregando…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 16, textAlign: "center", color: "#6b7280" }}>
                    Nenhum participante encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 700 }}>{r.name}</td>
                    <td><span className="kbd">{r.barcode}</span></td>
                    <td style={{ textAlign: "center" }}>{r.sessionsCount}</td>
                    <td style={{ textAlign: "center" }}>
                      <span className="badge">{formatDuration(r.totalMs)}</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {r.isPresent ? (
                        <span className="badge">Presente</span>
                      ) : (
                        <span className="badge" style={{ background: "#f9fafb" }}>Ausente</span>
                      )}
                    </td>
                    <td>{r.lastMovement ? new Date(r.lastMovement).toLocaleString() : "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
