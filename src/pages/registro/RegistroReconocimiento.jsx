import { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import { supabase } from "../../lib/supabaseClient";
import { useRegistration } from "../../context/useRegistration";
import { useNavigate } from "react-router-dom";

export default function RegistroReconocimiento() {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const { registrationId } = useRegistration();

  const [message, setMessage] = useState("Listo para iniciar");
  const [loading, setLoading] = useState(false);
  const [livenessPassed, setLivenessPassed] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureStep, setCaptureStep] = useState(0);
  const [faceSaved, setFaceSaved] = useState(false);

  const step = useRef(0);
  const stableCounter = useRef(0);
  const runningLiveness = useRef(false);

  // ---------------- MODELOS ----------------
  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
  };

  // ---------------- CAMARA ----------------
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    videoRef.current.srcObject = stream;
    setCameraOn(true);

    if (!modelsLoaded) {
      await loadModels();
      setModelsLoaded(true);
    }

    setMessage("Cámara activa");
  };

  // ---------------- LIVENESS ----------------
  const startLiveness = () => {
    if (!cameraOn) return setMessage("Inicia la cámara primero");

    runningLiveness.current = true;
    step.current = 0;
    stableCounter.current = 0;

    const interval = setInterval(async () => {
      if (!runningLiveness.current) return;

      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 224,
            scoreThreshold: 0.5,
          })
        )
        .withFaceLandmarks()
        .withFaceExpressions();

      if (!detection) {
        setMessage("No se detecta rostro");
        return;
      }

      const nose = detection.landmarks.getNose()[3];
      const offset = nose.x - videoRef.current.videoWidth / 2;

      if (step.current === 0) {
        setMessage("Mira a la izquierda");

        if (offset < -60) stableCounter.current++;
        else stableCounter.current = 0;

        if (stableCounter.current >= 5) {
          step.current = 1;
          stableCounter.current = 0;
          setMessage("Izquierda confirmada");
        }
      }

      else if (step.current === 1) {
        setMessage("Mira a la derecha");

        if (offset > 60) stableCounter.current++;
        else stableCounter.current = 0;

        if (stableCounter.current >= 5) {
          step.current = 2;
          stableCounter.current = 0;
          setMessage("Derecha confirmada");
        }
      }

      else if (step.current === 2) {
        setMessage("Sonríe");

        if (detection.expressions.happy > 0.75) stableCounter.current++;
        else stableCounter.current = 0;

        if (stableCounter.current >= 5) {
          clearInterval(interval);
          runningLiveness.current = false;

          setLivenessPassed(true);
          setMessage("Liveness aprobado");
        }
      }
    }, 300);
  };

  // ---------------- CAPTURA ----------------
  const captureDescriptor = async () => {
    setLoading(true);

    const samples = [];

    for (let i = 0; i < 5; i++) {
      setCaptureStep(i + 1);
      setMessage(`Capturando rostro (${i + 1}/5)`);

      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 224 })
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) samples.push(detection.descriptor);

      await new Promise((r) => setTimeout(r, 250));
    }

    setCaptureStep(0);
    setMessage("Procesando rostro...");

    if (samples.length === 0) {
      setLoading(false);
      setMessage("Error en captura");
      return null;
    }

    const avg = samples[0].map((_, i) =>
      samples.reduce((s, d) => s + d[i], 0) / samples.length
    );

    setLoading(false);
    return avg;
  };

  // ---------------- UPDATE SUPABASE ----------------
  const registerFace = async () => {
    if (!livenessPassed) return setMessage("Falta verificación");

    const descriptor = await captureDescriptor();
    if (!descriptor) return;

    const { error } = await supabase
      .from("voter_registration")
      .update({
        face_embedding: Array.from(descriptor),
        step: 2,
        status: "face_registered",
      })
      .eq("id", registrationId);

    if (error) {
      setMessage("Error guardando en Supabase");
      console.log(error);
      return;
    }
    setFaceSaved(true);
    setMessage("Rostro guardado correctamente");
  };

  // ---------------- CONTINUAR ----------------
  const goNext = () => {
    navigate("/registro/biometrico");
  };

  // ---------------- INIT ----------------
  useEffect(() => {
    loadModels();
  }, []);


  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{ color: "white", textAlign: "center" }}>
          Registro Biométrico
        </h2>

        {/* CAMARA REAL */}
        <div style={styles.cameraContainer}>
          <video
            ref={videoRef}
            autoPlay
            muted
            width={640}
            height={480}
            style={styles.webcam}
          />
          <div style={styles.scanFrame}></div>
        </div>

        {/* BOTONES */}
        <div style={styles.buttons}>
          <button onClick={startCamera} style={styles.primaryButton} disabled={cameraOn}>
            Iniciar cámara
          </button>

          <button onClick={startLiveness} style={styles.primaryButton} disabled={!cameraOn || livenessPassed}>
            Verificar vida
          </button>

          <button onClick={registerFace} style={styles.primaryButton} disabled={!livenessPassed}>
            Registrar rostro
          </button>
          {faceSaved && (
            <button style={styles.continueButton} onClick={goNext}>
              Continuar a biometría →
            </button>
          )}
        </div>

        {/* MENSAJE */}
        <p style={styles.message}>{message}</p>
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

