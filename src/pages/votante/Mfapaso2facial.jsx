import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";
import { toast } from "sonner";
import { useTheme } from "../../context/ThemeContext";
import Footer from "../components/layout/footer/Footer";
import MFAStepper from "../components/ui/Mfastepper";
import "../../css/votante/Mfapaso2facial.css";
import { validateFace } from "../../services/api";


const isFaceFrontal = (landmarks) => {
  const leftEye  = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();
  const nose     = landmarks.getNose();

  const leftEyeX    = leftEye.reduce((s, p)  => s + p.x, 0) / leftEye.length;
  const rightEyeX   = rightEye.reduce((s, p) => s + p.x, 0) / rightEye.length;
  const eyesCenterX = (leftEyeX + rightEyeX) / 2;
  const noseTipX    = nose[3].x;

  const horizontalOffset = Math.abs(noseTipX - eyesCenterX);
  const eyeDistance      = Math.abs(rightEyeX - leftEyeX);

  return (horizontalOffset / eyeDistance) < 0.25;
};

const isFaceVertical = (landmarks) => {
  const leftEye  = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();
  const nose     = landmarks.getNose();

  const leftEyeY    = leftEye.reduce((s, p)  => s + p.y, 0) / leftEye.length;
  const rightEyeY   = rightEye.reduce((s, p) => s + p.y, 0) / rightEye.length;
  const eyesCenterY = (leftEyeY + rightEyeY) / 2;
  const noseTipY    = nose[3].y;

  const leftEyeX  = leftEye.reduce((s, p)  => s + p.x, 0) / leftEye.length;
  const rightEyeX = rightEye.reduce((s, p) => s + p.x, 0) / rightEye.length;
  const eyeDistance = Math.abs(rightEyeX - leftEyeX);

  const verticalOffset = noseTipY - eyesCenterY;
  return verticalOffset > eyeDistance * 0.5 && verticalOffset < eyeDistance * 2.5;
};


export default function MFAPaso2Facial() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const videoRef = useRef(null);

  const [phase, setPhase]               = useState("idle");
  const [message, setMessage]           = useState("Presiona Iniciar para comenzar");
  const [livenessPassed, setLivenessPassed] = useState(false);
  const [captureStep, setCaptureStep]   = useState(0);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const step            = useRef(0);
  const stableCounter   = useRef(0);
  const runningLiveness = useRef(false);
  const intervalRef     = useRef(null);

  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
  };

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startLiveness = () => {
    runningLiveness.current = true;
    step.current          = 0;
    stableCounter.current = 0;
    setPhase("liveness");

    intervalRef.current = setInterval(async () => {
      if (!runningLiveness.current) return;

      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
        )
        .withFaceLandmarks()
        .withFaceExpressions();

      if (!detection) { setMessage("No se detecta rostro"); return; }

      const nose   = detection.landmarks.getNose()[3];
      const offset = nose.x - videoRef.current.videoWidth / 2;

      if (step.current === 0) {
        setMessage("👈 Mira a la izquierda");
        if (offset < -60) stableCounter.current++;
        else stableCounter.current = 0;
        if (stableCounter.current >= 5) {
          step.current = 1; stableCounter.current = 0;
          setMessage("Izquierda confirmada ✓");
        }
      } else if (step.current === 1) {
        setMessage("👉 Mira a la derecha");
        if (offset > 60) stableCounter.current++;
        else stableCounter.current = 0;
        if (stableCounter.current >= 5) {
          step.current = 2; stableCounter.current = 0;
          setMessage("Derecha confirmada ✓");
        }
      } else if (step.current === 2) {
        setMessage("😊 Sonríe");
        if (detection.expressions.happy > 0.75) stableCounter.current++;
        else stableCounter.current = 0;
        if (stableCounter.current >= 5) {
          clearInterval(intervalRef.current);
          runningLiveness.current = false;
          setLivenessPassed(true);
          setMessage("Liveness aprobado ✓ — capturando rostro...");
          await captureAndValidate();
        }
      }
    }, 300);
  };

  const captureDescriptor = async () => {
    const samples      = [];
    const MAX_INTENTOS = 20;
    let intentos       = 0;

    while (samples.length < 5 && intentos < MAX_INTENTOS) {
      intentos++;
      setCaptureStep(samples.length + 1);

      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.85 })
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setMessage("Rostro no detectado, ajusta tu posición...");
        await new Promise((r) => setTimeout(r, 300));
        continue;
      }

      const box       = detection.detection.box;
      const faceRatio = (box.width * box.height) /
                        (videoRef.current.videoWidth * videoRef.current.videoHeight);

      if (faceRatio < 0.08) {
        setMessage("Acércate más a la cámara");
        await new Promise((r) => setTimeout(r, 300));
        continue;
      }

      if (!isFaceFrontal(detection.landmarks)) {
        setMessage("Mira de frente a la cámara");
        await new Promise((r) => setTimeout(r, 300));
        continue;
      }

      if (!isFaceVertical(detection.landmarks)) {
        setMessage("Mantén la cabeza recta");
        await new Promise((r) => setTimeout(r, 300));
        continue;
      }

      samples.push(detection.descriptor);
      setMessage(`Capturando rostro (${samples.length}/5) ✓`);
      await new Promise((r) => setTimeout(r, 250));
    }

    setCaptureStep(0);

    if (samples.length < 5) return null;

    return samples[0].map((_, i) =>
      samples.reduce((s, d) => s + d[i], 0) / samples.length
    );
  };

  const captureAndValidate = async () => {
    setPhase("capturing");
    setMessage("Capturando rostro...");

    const descriptor = await captureDescriptor();

    if (!descriptor) {
      setPhase("error");
      setMessage("No se pudo capturar. Mejora la iluminación e intenta de nuevo.");
      toast.error("Captura fallida");
      return;
    }

    try {
      setPhase("validating");
      setMessage("Validando identidad...");

      const data = await validateFace(Array.from(descriptor));

      if (!data.success) {
        setPhase("error");
        setMessage(data.error || "Rostro no coincide");
        toast.error(data.error || "Validación facial fallida");
        return;
      }

      setPhase("success");
      setMessage("Identidad verificada ✓");

      toast.success("Rostro validado correctamente");

      stopCamera();
      setTimeout(() => navigate("/mfa/webauthn"), 1500);

    } catch (err) {
      console.error(err);
      setPhase("error");
      setMessage("Error de conexión con el servidor");
      toast.error("Error de conexión");
    }
  };

  const handleIniciar = async () => {

    try {
      setPhase("loading_models");
      setMessage("Cargando modelos...");

      if (!modelsLoaded) {
        await loadModels();
        setModelsLoaded(true);
      }

      await startCamera();
      setMessage("Cámara activa — iniciando verificación de vida");
      startLiveness();

    } catch (err) {
      console.error(err);
      setPhase("error");
      setMessage("Error al iniciar la cámara");
      toast.error("No se pudo acceder a la cámara");
    }
  };

  const handleReintentar = async () => {
    setLivenessPassed(false);
    setCaptureStep(0);
    setPhase("idle");
    setMessage("Presiona Iniciar para comenzar");
    stopCamera();
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      stopCamera();
    };
  }, []);

  return (
    <div className="mfa2-page">

      <header className="mfa2-header">
        <nav className="mfa2-nav">
          <span className="mfa2-logo">NEXA VOTE</span>
          <div className="mfa2-nav-right">
            <button className="theme-toggle" onClick={toggleTheme}>
              <span className="material-symbols-outlined">{theme === "light" ? "dark_mode" : "light_mode"}</span>
            </button>
            <span className="material-symbols-outlined mfa2-nav-icon">security</span>
            <button className="mfa2-btn-secure">Secure Login</button>
          </div>
        </nav>
      </header>

      <main className="mfa2-main">

        <div className="mfa2-stepper-wrap">
          <MFAStepper currentStep={2} />
        </div>

        <div className="mfa2-panel">

          <div className="mfa2-id-badge">
            <span className="material-symbols-outlined">verified</span>
            <span className="mfa2-id-badge-text">ID VERIFIED</span>
          </div>

          <div className="mfa2-panel-header">
            <h1>MFA Paso 2: Reconocimiento Facial</h1>
            <p>Complete la verificación de vida y posicione su rostro en el recuadro.</p>
          </div>

          <div className="mfa2-scanner">
            <div className="mfa2-scanner-inner">
              <div className="mfa2-face-frame">
                <div className="mfa2-corner mfa2-corner--tl" />
                <div className="mfa2-corner mfa2-corner--tr" />
                <div className="mfa2-corner mfa2-corner--bl" />
                <div className="mfa2-corner mfa2-corner--br" />

                {/* ✅ Video siempre montado en el DOM — solo se oculta visualmente */}
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="mfa2-video"
                  style={{
                    width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px",
                    display: (phase === "idle" || phase === "loading_models") ? "none" : "block"
                  }}
                />

                {/* SVG decorativo solo cuando la cámara no está activa */}
                {(phase === "idle" || phase === "loading_models") && (
                  <svg
                    className="mfa2-face-outline"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                    viewBox="0 0 100 120"
                  >
                    <path d="M50 10C35 10 20 25 20 50C20 85 40 110 50 110C60 110 80 85 80 50C80 25 65 10 50 10Z" />
                  </svg>
                )}
              </div>
            </div>

            {/* Barra de progreso captura */}
            {captureStep > 0 && (
              <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "12px" }}>
                {[1,2,3,4,5].map((n) => (
                  <div
                    key={n}
                    style={{
                      width: "12px", height: "12px", borderRadius: "50%",
                      background: n <= captureStep ? "#22c55e" : "#334155",
                      transition: "background 0.3s"
                    }}
                  />
                ))}
              </div>
            )}

            <div className="mfa2-calibrating">
              <div className="mfa2-calibrating-pill">
                <span className="mfa2-pulse-dot" />
                <span className="mfa2-calibrating-text">{message}</span>
              </div>
            </div>
          </div>

          <div className="mfa2-actions">

            {(phase === "idle" || phase === "error") && (
              <button className="mfa2-btn-scan" onClick={handleIniciar}>
                <span className="material-symbols-outlined">videocam</span>
                {phase === "error" ? "Reintentar" : "Iniciar Escaneo"}
              </button>
            )}

            {(phase === "loading_models" || phase === "liveness" ||
              phase === "capturing"      || phase === "validating") && (
              <button className="mfa2-btn-scan" disabled style={{ opacity: 0.6 }}>
                <span className="material-symbols-outlined">hourglass_top</span>
                {phase === "loading_models" ? "Cargando modelos..."  :
                 phase === "liveness"       ? "Verificando vida..."  :
                 phase === "capturing"      ? "Capturando rostro..."  :
                                             "Validando identidad..."}
              </button>
            )}

            {phase === "success" && (
              <button className="mfa2-btn-scan" disabled style={{ opacity: 0.8 }}>
                <span className="material-symbols-outlined">check_circle</span>
                Verificado — redirigiendo...
              </button>
            )}

          </div>

        </div>

        {/* Status Cards */}
        <div className="mfa2-status-grid">

          <div className="mfa2-status-card mfa2-status-card--verified">
            <div className="mfa2-status-left">
              <span className="material-symbols-outlined mfa2-status-icon--verified">id_card</span>
              <div>
                <p className="mfa2-status-title">DOCUMENTO IDENTIDAD</p>
                <p className="mfa2-status-subtitle">DNI ESCANEADO</p>
              </div>
            </div>
            <span className="mfa2-status-tag mfa2-status-tag--verified">VERIFICADO</span>
          </div>

          <div className={`mfa2-status-card ${phase === "success" ? "mfa2-status-card--verified" : "mfa2-status-card--pending"}`}>
            <div className="mfa2-status-left">
              <span className="material-symbols-outlined mfa2-status-icon--pending">face</span>
              <div>
                <p className="mfa2-status-title">RECONOCIMIENTO FACIAL</p>
                <p className="mfa2-status-subtitle">
                  {phase === "success" ? "VALIDADO" : "PENDIENTE"}
                </p>
              </div>
            </div>
            <span className={`mfa2-status-tag ${phase === "success" ? "mfa2-status-tag--verified" : "mfa2-status-tag--pending"}`}>
              {phase === "success" ? "VERIFICADO" : "PENDIENTE"}
            </span>
          </div>

          <div className="mfa2-status-card mfa2-status-card--pending">
            <div className="mfa2-status-left">
              <span className="material-symbols-outlined mfa2-status-icon--pending">key</span>
              <div>
                <p className="mfa2-status-title">WEBAUTHN TOKEN</p>
                <p className="mfa2-status-subtitle">PENDIENTE DE FIRMA</p>
              </div>
            </div>
            <span className="mfa2-status-tag mfa2-status-tag--pending">PENDIENTE</span>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}