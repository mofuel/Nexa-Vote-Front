import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/reconocimiento/facial";

const RegistroReconocimiento = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const capturarImagen = async () => {
    try {
      setMensaje("");
      setLoading(true);

      const screenshot = webcamRef.current?.getScreenshot();

      if (!screenshot) {
        setMensaje("No se pudo capturar la imagen. Verifica permisos de cámara.");
        return;
      }

      setImagen(screenshot);

      const response = await axios.post(
        API_URL,
        {
          imagen: screenshot,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      if (response.data?.success) {
        setMensaje("✅ Rostro registrado correctamente.");
      } else {
        setMensaje(response.data?.message || "❌ No se pudo validar el rostro.");
      }
    } catch (error) {
      console.error("Error reconocimiento facial:", error);

      if (error.code === "ECONNABORTED") {
        setMensaje("El servidor tardó demasiado en responder.");
      } else if (error.response) {
        setMensaje(error.response.data?.message || "Error en el servidor.");
      } else {
        setMensaje(
          "No se pudo conectar con el backend. Verifica que python run.py esté activo."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const repetirCaptura = () => {
    setImagen(null);
    setMensaje("");
  };

  const continuar = () => {
    navigate("/registro/biometrico");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>🧬</div>

          <h1 style={styles.title}>Registro Biométrico Facial</h1>

          <p style={styles.subtitle}>
            Validación multifactor para el sistema Nexa Vote
          </p>
        </div>

        <div style={styles.cameraContainer}>
          {!imagen ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 640,
                height: 480,
                facingMode: "user",
              }}
              style={styles.webcam}
            />
          ) : (
            <img src={imagen} alt="Captura facial" style={styles.webcam} />
          )}

          <div style={styles.scanFrame}></div>
        </div>

        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            Coloca tu rostro dentro del recuadro y mantén una buena iluminación.
          </p>
        </div>

        <div style={styles.buttons}>
          {!imagen ? (
            <button
              onClick={capturarImagen}
              disabled={loading}
              style={{
                ...styles.primaryButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Procesando..." : "Iniciar Reconocimiento"}
            </button>
          ) : (
            <>
              <button
                onClick={repetirCaptura}
                disabled={loading}
                style={{
                  ...styles.secondaryButton,
                  opacity: loading ? 0.7 : 1,
                  cursor: "pointer",
                }}
              >
                Repetir captura
              </button>

              <button
                onClick={capturarImagen}
                disabled={loading}
                style={{
                  ...styles.primaryButton,
                  opacity: loading ? 0.7 : 1,
                  cursor: "pointer",
                }}
              >
                {loading ? "Procesando..." : "Enviar nuevamente"}
              </button>
            </>
          )}
        </div>

        {mensaje && (
          <>
            <div style={styles.message}>{mensaje}</div>

            {mensaje.includes("✅") && (
              <div style={styles.continueContainer}>
                <button
                  onClick={continuar}
                  style={styles.continueButton}
                >
                  Continuar a validación biométrica →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background:
      "radial-gradient(circle at top, #1e3a8a 0%, #020617 45%, #000 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    boxSizing: "border-box",
    fontFamily: "Inter, system-ui, Arial, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "820px",
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.25)",
    borderRadius: "28px",
    padding: "32px",
    boxShadow: "0 30px 80px rgba(0, 0, 0, 0.45)",
    backdropFilter: "blur(18px)",
  },

  header: {
    textAlign: "center",
    marginBottom: "28px",
  },

  icon: {
    width: "64px",
    height: "64px",
    margin: "0 auto 14px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #06b6d4, #2563eb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    boxShadow: "0 12px 30px rgba(37, 99, 235, 0.45)",
  },

  title: {
    color: "#f8fafc",
    fontSize: "34px",
    margin: "0",
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: "10px",
    fontSize: "16px",
  },

  cameraContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "640px",
    margin: "0 auto",
    borderRadius: "24px",
    overflow: "hidden",
    border: "2px solid rgba(34, 211, 238, 0.5)",
    boxShadow: "0 0 45px rgba(6, 182, 212, 0.25)",
    background: "#020617",
  },

  webcam: {
    width: "100%",
    height: "auto",
    display: "block",
  },

  scanFrame: {
    position: "absolute",
    inset: "28px",
    border: "3px solid rgba(34, 211, 238, 0.9)",
    borderRadius: "22px",
    boxShadow: "0 0 25px rgba(34, 211, 238, 0.7)",
    pointerEvents: "none",
  },

  infoBox: {
    maxWidth: "640px",
    margin: "22px auto 0",
    padding: "14px 18px",
    borderRadius: "16px",
    background: "rgba(15, 23, 42, 0.95)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
  },

  infoText: {
    color: "#cbd5e1",
    textAlign: "center",
    margin: 0,
    fontSize: "15px",
  },

  buttons: {
    marginTop: "26px",
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
  },

  primaryButton: {
    border: "none",
    borderRadius: "16px",
    padding: "14px 28px",
    background: "linear-gradient(135deg, #06b6d4, #2563eb)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "700",
    boxShadow: "0 12px 28px rgba(37, 99, 235, 0.35)",
  },

  secondaryButton: {
    border: "1px solid rgba(148, 163, 184, 0.35)",
    borderRadius: "16px",
    padding: "14px 28px",
    background: "rgba(30, 41, 59, 0.9)",
    color: "#e2e8f0",
    fontSize: "16px",
    fontWeight: "700",
  },

  message: {
    maxWidth: "640px",
    margin: "22px auto 0",
    padding: "16px",
    borderRadius: "16px",
    background: "rgba(8, 47, 73, 0.8)",
    border: "1px solid rgba(34, 211, 238, 0.35)",
    color: "#e0f2fe",
    textAlign: "center",
    fontWeight: "700",
  },

  continueContainer: {
    marginTop: "24px",
    textAlign: "center",
  },

  continueButton: {
    border: "none",
    borderRadius: "16px",
    padding: "16px 32px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 12px 28px rgba(34, 197, 94, 0.35)",
  },
};

export default RegistroReconocimiento;