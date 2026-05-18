import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useRegistration } from "../../context/useRegistration";
import Stepper from "../components/ui/Stepper";

// --- ESTILOS (NO TOCADOS) ---
const glassCard = {
    background: "rgba(19, 22, 42, 0.8)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
};

const steps = [
    { n: 1, label: "Identidad" },
    { n: 2, label: "Facial" },
    { n: 3, label: "Biométrico" },
    { n: 4, label: "Verificación" },
];

export default function ConfirmacionRegistro() {
    const navigate = useNavigate();
    const { registrationId } = useRegistration();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // ---------------- FETCH ----------------
    useEffect(() => {
        const fetchData = async () => {
            if (!registrationId) return;

            const { data, error } = await supabase
                .from("voter_registration")
                .select("*")
                .eq("id", registrationId)
                .single();

            if (error) {
                console.log(error);
                setLoading(false);
                return;
            }

            setData(data);
            setLoading(false);
        };

        fetchData();
    }, [registrationId]);

    const finishRegistration = async () => {
        const { error } = await supabase
            .from("voter_registration")
            .update({
                step: 4,
                status: "completed",
            })
            .eq("id", registrationId);

        if (error) return console.log(error);

        navigate("/registro/exitoso");
    };

    if (loading) {
        return <div style={{ color: "#fff", padding: 40 }}>Cargando...</div>;
    }

    const faceOk = !!data?.face_embedding;
    const bioOk = !!data?.webauthn_credential_id;

    return (
        <div style={{ background: "#14121c", color: "#e6e0ef", minHeight: "100vh", fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column" }}>

            {/* HEADER (NO TOCADO) */}
            <header style={{
                position: "fixed", top: 0, width: "100%", zIndex: 50,
                background: "rgba(20,18,28,0.8)", backdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.1)", height: "64px",
                display: "flex", alignItems: "center",
            }}>
                <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "0 40px", width: "100%", maxWidth: "1280px", margin: "0 auto",
                }}>
                    <span onClick={() => navigate('/')} style={{
                        fontFamily: "Space Grotesk, sans-serif", fontWeight: 700,
                        fontSize: "20px", color: "#c9beff", cursor: "pointer"
                    }}>
                        NEXA VOTE
                    </span>

                    <div style={{ display: "flex", gap: "8px" }}>
                        <span className="material-symbols-outlined" style={{ color: "#41eec2" }}>lock</span>
                        <span className="material-symbols-outlined" style={{ color: "#41eec2" }}>verified_user</span>
                    </div>
                </div>
            </header>

            {/* MAIN */}
            <main style={{ paddingTop: "96px", paddingBottom: "48px", flex: 1 }}>
                <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px", display: "flex", flexDirection: "column", gap: "32px" }}>

                    <Stepper steps={steps} currentStep={4} />

                    {/* TITLE */}
                    <div style={{ textAlign: "center" }}>
                        <h1 style={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: "28px", color: "#fff" }}>
                            Confirmación de Registro
                        </h1>
                        <p style={{ color: "#c9c3d9", fontSize: "16px" }}>
                            Revise la información antes de finalizar
                        </p>
                    </div>

                    {/* CARD */}
                    <section style={{ ...glassCard, borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", gap: "32px" }}>

                        {/* PERFIL (NO TOCADO) */}
                        <div style={{ display: "flex", gap: "24px", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "24px" }}>

                            {/* FOTO FIJA (NO CAMBIAR) */}
                            <div style={{ width: "100px", height: "100px", borderRadius: "12px", overflow: "hidden", border: "2px solid #6c47ff" }}>
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeWuNUhk99LQRkOfMyu5_kTKiESepjmLTkMpSCHJW1PUvivLvmSeOul1_prLjECurrAWcf1Jz3u9LxAwaETgdI85ba_ZnebxldCFid4RRmASuae6a0_T__17vzvU8EnFNzGFlcUtbXCsARg4NgmwI5hSHlbGPjAuOkvDMpBteJ1Zdby31zdY5m7mQ-5jBpBdEljl1PVHLAHENSJuWemCuTPDEg_-HmYRFmL-Oj52ySq9puR8iHqQEqgvuAyKf7w4RBBxmoXht0psg"
                                    style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%) brightness(0.8)" }}
                                />
                            </div>

                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(65, 238, 194, 0.1)", padding: "4px 12px", borderRadius: "999px" }}>
                                    <span className="material-symbols-outlined" style={{ color: "#41eec2" }}>verified</span>
                                    <span style={{ fontSize: "10px", color: "#41eec2", fontWeight: 700 }}>IDENTIDAD VERIFICADA</span>
                                </div>

                                <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#c9beff" }}>
                                    {data?.full_name}
                                </h2>

                                <p style={{ fontSize: "14px", color: "#c9c3d9" }}>
                                    {data?.email}
                                </p>
                            </div>
                        </div>

                        {/* GRID CORREGIDO */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

                            <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px" }}>
                                <span style={{ fontSize: "10px", textTransform: "uppercase" }}>Nombre Completo</span>
                                <div>{data?.full_name}</div>
                            </div>

                            {/* 🔥 CAMBIO: EMAIL → DNI */}
                            <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px" }}>
                                <span style={{ fontSize: "10px", textTransform: "uppercase" }}>DNI</span>
                                <div>{data?.dni}</div>
                            </div>

                            <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px" }}>
                                <span style={{ fontSize: "10px", textTransform: "uppercase" }}>Validación Facial</span>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>{faceOk ? "Completado" : "Pendiente"}</span>
                                    {faceOk && (
                                        <span className="material-symbols-outlined" style={{ color: "#41eec2" }}>
                                            check_circle
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px" }}>
                                <span style={{ fontSize: "10px", textTransform: "uppercase" }}>Biometría</span>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>{bioOk ? "Registrado" : "Pendiente"}</span>
                                    {bioOk && (
                                        <span className="material-symbols-outlined" style={{ color: "#41eec2" }}>
                                            check_circle
                                        </span>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* BOTONES (NO TOCADOS) */}
                        <div style={{ display: "flex", justifyContent: "space-between" }}>

                            <button
                                onClick={() => navigate(-1)}
                                style={{
                                    padding: "14px 32px",
                                    borderRadius: "999px",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    background: "transparent",
                                    color: "#c9c3d9",
                                    fontFamily: "Space Grotesk"
                                }}
                            >
                                Editar Información
                            </button>

                            <button
                                onClick={finishRegistration}
                                disabled={!faceOk || !bioOk}
                                style={{
                                    padding: "14px 48px",
                                    borderRadius: "999px",
                                    background: "#6c47ff",
                                    color: "#fff",
                                    opacity: faceOk && bioOk ? 1 : 0.5,
                                    cursor: "pointer"
                                }}
                            >
                                Finalizar Registro
                            </button>

                        </div>

                    </section>

                </div>
            </main>
        </div>
    );
}