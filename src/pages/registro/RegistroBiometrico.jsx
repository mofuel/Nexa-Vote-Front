import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegistroBiometrico = () => {
  const navigate = useNavigate();

  const [registrado, setRegistrado] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const generarChallenge = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return array;
  };

  const registrarBiometrico = async () => {
    try {
      setMensaje("");
      setLoading(true);

      if (!window.PublicKeyCredential) {
        setMensaje("Tu navegador no soporta WebAuthn.");
        return;
      }

      const publicKey = {
        challenge: generarChallenge(),
        rp: {
          name: "Nexa Vote",
        },
        user: {
          id: generarChallenge(),
          name: "votante@nexavote.com",
          displayName: "Votante Nexa Vote",
        },
        pubKeyCredParams: [
          {
            type: "public-key",
            alg: -7,
          },
          {
            type: "public-key",
            alg: -257,
          },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
        attestation: "none",
      };

      const credential = await navigator.credentials.create({
        publicKey,
      });

      if (!credential) {
        setMensaje("No se pudo registrar la biometría.");
        return;
      }

      localStorage.setItem("nexa_vote_biometrico", "true");

      setRegistrado(true);
      setMensaje("✅ Huella o biometría registrada correctamente.");
    } catch (error) {
      console.error("Error WebAuthn:", error);

      if (error.name === "NotAllowedError") {
        setMensaje("Operación cancelada o tiempo agotado.");
      } else if (error.name === "NotSupportedError") {
        setMensaje("Este dispositivo no soporta autenticación biométrica.");
      } else {
        setMensaje("No se pudo registrar la biometría en este dispositivo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const continuar = () => {
    navigate("/registro/verificacion");
  };

  return (
    <div style={styles.page}>
      <header style={styles.navbar}>
        <h2 style={styles.logo}>NEXA VOTE</h2>

        <div style={styles.navIcons}>
          <span>🔒</span>
          <span>🛡️</span>
        </div>
      </header>

      <main style={styles.container}>
        <section style={styles.card}>
          <h1 style={styles.title}>Biometría - WebAuthn</h1>

          <p style={styles.subtitle}>
            Vincule su huella o llave de seguridad para continuar
          </p>

          <div style={styles.fingerprintCircle}>
            <span style={styles.fingerprint}>🌀</span>
          </div>

          <div style={styles.badges}>
            <span style={styles.badge}>FIDO2 COMPATIBLE</span>
            <span style={styles.badge}>U2F COMPATIBLE</span>
            <span style={styles.badge}>AES-256 COMPATIBLE</span>
          </div>

          <div style={styles.infoBox}>
            WebAuthn utiliza criptografía de clave pública. Sus datos biométricos
            nunca salen del dispositivo.
          </div>

          <button
            onClick={registrarBiometrico}
            disabled={loading || registrado}
            style={{
              ...styles.primaryButton,
              opacity: loading || registrado ? 0.7 : 1,
              cursor: loading || registrado ? "not-allowed" : "pointer",
            }}
          >
            {loading
              ? "Esperando validación biométrica..."
              : registrado
              ? "Biometría registrada"
              : "Registrar Biométrico"}
          </button>

          <button
            onClick={continuar}
            disabled={!registrado}
            style={{
              ...styles.secondaryButton,
              opacity: registrado ? 1 : 0.5,
              cursor: registrado ? "pointer" : "not-allowed",
            }}
          >
            Siguiente →
          </button>

          {mensaje && <div style={styles.message}>{mensaje}</div>}
        </section>
      </main>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#11101a",
    color: "#f8fafc",
    fontFamily: "Inter, system-ui, Arial, sans-serif",
  },

  navbar: {
    height: "90px",
    padding: "0 90px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    color: "#c4b5fd",
    letterSpacing: "6px",
    fontSize: "22px",
  },

  navIcons: {
    display: "flex",
    gap: "18px",
    color: "#2dd4bf",
    fontSize: "22px",
  },

  container: {
    minHeight: "calc(100vh - 90px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
  },

  card: {
    width: "100%",
    maxWidth: "760px",
    background: "#151726",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    borderRadius: "24px",
    padding: "42px",
    textAlign: "center",
    boxShadow: "0 24px 70px rgba(0,0,0,0.35)",
  },

  title: {
    fontSize: "32px",
    margin: 0,
    fontWeight: "800",
  },

  subtitle: {
    color: "#cbd5e1",
    marginTop: "12px",
  },

  fingerprintCircle: {
    width: "190px",
    height: "190px",
    borderRadius: "50%",
    border: "2px dashed #4f46e5",
    margin: "50px auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(79, 70, 229, 0.08)",
  },

  fingerprint: {
    fontSize: "64px",
  },

  badges: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
    marginBottom: "26px",
  },

  badge: {
    border: "1px solid rgba(148, 163, 184, 0.25)",
    borderRadius: "999px",
    padding: "8px 16px",
    fontSize: "13px",
    color: "#cbd5e1",
  },

  infoBox: {
    background: "rgba(88, 28, 135, 0.28)",
    borderLeft: "4px solid #7c3aed",
    padding: "16px",
    textAlign: "left",
    color: "#ddd6fe",
    marginBottom: "28px",
  },

  primaryButton: {
    width: "100%",
    border: "none",
    borderRadius: "14px",
    padding: "16px",
    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
    color: "#fff",
    fontWeight: "800",
    marginBottom: "18px",
  },

  secondaryButton: {
    width: "100%",
    border: "1px solid rgba(148, 163, 184, 0.25)",
    borderRadius: "14px",
    padding: "16px",
    background: "#232436",
    color: "#f8fafc",
    fontWeight: "700",
  },

  message: {
    marginTop: "22px",
    padding: "16px",
    borderRadius: "14px",
    background: "rgba(15, 23, 42, 0.9)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    color: "#e0f2fe",
    fontWeight: "700",
  },
};

export default RegistroBiometrico;