import React, { useRef, useState } from "react";
import api from "../lib/api";

type ParticipantDTO = {
  id: string;
  name: string;
  barcode: string;
};

type FeedbackKind = "success" | "error" | null;

export default function RecepcaoPage() {
  const [barcode, setBarcode] = useState("");
  const [participant, setParticipant] = useState<ParticipantDTO | null>(null);
  const [loadingScan, setLoadingScan] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackKind, setFeedbackKind] = useState<FeedbackKind>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  async function handleScanSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!barcode.trim()) return;

    setFeedback(null);
    setFeedbackKind(null);
    setLoadingScan(true);

    try {
      const res = await axios.get<ParticipantDTO>(
        `/api/participants/barcode/${encodeURIComponent(barcode.trim())}`
      );
      setParticipant(res.data);
      setFeedback(`Participante localizado: ${res.data.name}`);
      setFeedbackKind("success");
    } catch (err: any) {
      const msg =
        err?.response?.data ||
        "Não foi possível localizar o participante. Verifique o código de barras.";
      setFeedback(String(msg));
      setFeedbackKind("error");
      setParticipant(null);
    } finally {
      setLoadingScan(false);
    }
  }

  async function handleAction(kind: "ENTRY" | "EXIT") {
    if (!participant || loadingAction) return;

    setLoadingAction(true);
    setFeedback(null);
    setFeedbackKind(null);

    try {
      const payload = { barcode: participant.barcode };
      const url = kind === "ENTRY" ? "/api/attendance/entry" : "/api/attendance/exit";
      await axios.post(url, payload);

      const successText =
        kind === "ENTRY"
          ? `Entrada registrada para ${participant.name}.`
          : `Saída registrada para ${participant.name}.`;
      setFeedback(successText);
      setFeedbackKind("success");

      setParticipant(null);
      setBarcode("");

      requestAnimationFrame(() => inputRef.current?.focus());
    } catch (err: any) {
      const msg = err?.response?.data || "Falha ao registrar a movimentação.";
      setFeedback(String(msg));
      setFeedbackKind("error");
    } finally {
      setLoadingAction(false);
    }
  }

  return (
    <div className="container">
      {/* Faixa de topo no mesmo estilo do dashboard */}
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
            Painel • <strong>Recepção</strong>
          </div>
        </div>
      </div>

      {/* Card principal de scan */}
      <div className="card" style={{ marginTop: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Recepção / Scanner</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>Registrar Entrada/Saída</div>
          </div>
          <a className="btn btn-outline" href="/dashboard">Voltar ao Dashboard</a>
        </div>

        <form onSubmit={handleScanSubmit} className="scan-form" style={{ marginTop: 14 }}>
          <label htmlFor="barcode" style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 6 }}>
            Código de barras
          </label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              id="barcode"
              ref={inputRef}
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Bipe o crachá e pressione Enter"
              autoFocus
              className="barcode-input"
              style={{
                flex: "1 1 320px",
                padding: "14px 16px",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                outline: "none",
                boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loadingScan || !barcode.trim()}
              aria-busy={loadingScan}
              style={{ minWidth: 140 }}
            >
              {loadingScan ? "Buscando..." : "Confirmar"}
            </button>
          </div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
            Dica: deixe o cursor no campo e só bipar o crachá.
          </div>
        </form>

        {/* Feedback */}
        {feedback && (
          <div
            style={{
              marginTop: 12,
              padding: "10px 12px",
              borderRadius: 12,
              background: feedbackKind === "success" ? "#f0fdf4" : "#fef2f2",
              border: `1px solid ${feedbackKind === "success" ? "#bbf7d0" : "#fecaca"}`,
              color: feedbackKind === "success" ? "#166534" : "#991b1b",
              fontSize: 14,
            }}
          >
            {feedback}
          </div>
        )}

        {/* Card do participante quando encontrado */}
        {participant ? (
          <div
            className="card"
            style={{
              marginTop: 16,
              border: "1px solid #f3f4f6",
              borderRadius: 16,
              padding: 16,
              background: "#fff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    height: 44,
                    width: 44,
                    borderRadius: 999,
                    background: "#f9fafb",
                    display: "grid",
                    placeItems: "center",
                    outline: "2px solid #6e0d12",
                    color: "#6e0d12",
                    fontWeight: 800,
                  }}
                >
                  {participant.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{participant.name}</div>
                  <div style={{ fontSize: 13, color: "#6b7280", display: "flex", alignItems: "center", gap: 8 }}>
                    Crachá: <span className="kbd">{participant.barcode}</span>
                  </div>
                </div>
              </div>

              {/* BOTÕES DESTACADOS */}
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 10 }}>
                <button
                  className="btn btn-primary"
                  style={{
                    minWidth: 180,
                    padding: "16px 20px",
                    fontSize: 16,
                    fontWeight: 700,
                    backgroundColor: "#6e0d12",
                    border: "none",
                    color: "#fff",
                    borderRadius: 10,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    transition: "all 0.2s ease-in-out",
                  }}
                  onClick={() => handleAction("ENTRY")}
                  disabled={loadingAction}
                  aria-busy={loadingAction}
                >
                  {loadingAction ? "Registrando..." : "🟢 Registrar ENTRADA"}
                </button>

                <button
                  className="btn"
                  style={{
                    minWidth: 180,
                    padding: "16px 20px",
                    fontSize: 16,
                    fontWeight: 700,
                    backgroundColor: "#f3f4f6",
                    border: "1px solid #e5e7eb",
                    color: "#6e0d12",
                    borderRadius: 10,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    transition: "all 0.2s ease-in-out",
                  }}
                  onClick={() => handleAction("EXIT")}
                  disabled={loadingAction}
                  aria-busy={loadingAction}
                >
                  {loadingAction ? "Registrando..." : "🔴 Registrar SAÍDA"}
                </button>
              </div>
            </div>

            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 12 }}>
              Após registrar, o participante sai da tela. Para nova movimentação, bipar o próximo crachá.
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 14, fontSize: 14, color: "#6b7280" }}>
            Bipe um crachá para habilitar as ações de Entrada/Saída.
          </div>
        )}
      </div>
    </div>
  );
}
