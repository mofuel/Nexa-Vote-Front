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

  const leftEyeY   = leftEye.reduce((s, p)  => s + p.y, 0) / leftEye.length;
  const rightEyeY  = rightEye.reduce((s, p) => s + p.y, 0) / rightEye.length;
  const eyesCenterY = (leftEyeY + rightEyeY) / 2;
  const noseTipY    = nose[3].y;

  const eyeDistance = Math.abs(
    landmarks.getRightEye().reduce((s, p) => s + p.x, 0) / rightEye.length -
    landmarks.getLeftEye().reduce((s, p)  => s + p.x, 0) / leftEye.length
  );

  const verticalOffset = noseTipY - eyesCenterY;

  return verticalOffset > eyeDistance * 0.5 && verticalOffset < eyeDistance * 2.5;
};

export default function MFAPaso2Facial() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const videoRef = useRef(null);

  const [message, setMessage] = useState("Presiona Iniciar para comenzar");
  const [livenessPassed, setLivenessPassed] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureStep, setCaptureStep] = useState(0);
  const [phase, setPhase] = useState("idle");
  const [stepComplete, setStepComplete] = useState("");
  const livenessRef = useRef({ running: false, step: 0, stableCount: 0, timer: null, stepTimer: null });

  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
  };

  const stopLiveness = () => {
    livenessRef.current.running = false;
    if (livenessRef.current.timer) clearTimeout(livenessRef.current.timer);
    if (livenessRef.current.stepTimer) clearTimeout(livenessRef.current.stepTimer);
  };

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setCameraOn(true);

    if (!modelsLoaded) {
      await loadModels();
      setModelsLoaded(true);
    }

    setPhase("idle");
    setMessage("Cámara activa");
  };

  const stopCamera = () => {
    stopLiveness();
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
    setPhase("idle");
  };

  const detectFace = async () => {
    return faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
      )
      .withFaceLandmarks()
      .withFaceExpressions();
  };

  const livenessTick = async () => {
    if (!livenessRef.current.running) return;

    const detection = await detectFace();

    if (!detection) {
      setPhase("no-face");
      livenessRef.current.timer = setTimeout(livenessTick, 300);
      return;
    }

    const nose = detection.landmarks.getNose()[3];
    const offset = nose.x - videoRef.current.videoWidth / 2;
    const happy = detection.expressions.happy;
    const s = livenessRef.current;

    if (s.step === 0) {
      setPhase("liveness-left");
      if (offset < -60) s.stableCount++;
      else s.stableCount = 0;
      if (s.stableCount >= 5) {
        s.stableCount = 0;
        setPhase("step-done");
        setStepComplete("Izquierda ✓");
        s.stepTimer = setTimeout(() => {
          s.step = 1;
          livenessRef.current.timer = setTimeout(livenessTick, 300);
        }, 600);
        return;
      }
    } else if (s.step === 1) {
      setPhase("liveness-right");
      if (offset > 60) s.stableCount++;
      else s.stableCount = 0;
      if (s.stableCount >= 5) {
        s.stableCount = 0;
        setPhase("step-done");
        setStepComplete("Derecha ✓");
        s.stepTimer = setTimeout(() => {
          s.step = 2;
          livenessRef.current.timer = setTimeout(livenessTick, 300);
        }, 600);
        return;
      }
    } else if (s.step === 2) {
      setPhase("liveness-smile");
      if (happy > 0.75) s.stableCount++;
      else s.stableCount = 0;
      if (s.stableCount >= 5) {
        s.stableCount = 0;
        setPhase("step-done");
        setStepComplete("Sonrisa ✓");
        s.stepTimer = setTimeout(() => {
          s.running = false;
          setLivenessPassed(true);
          setPhase("idle");
          setMessage("Identidad validada ✓ — capturando rostro...");
          handleCaptureAndValidate();
        }, 600);
        return;
      }
    }

    livenessRef.current.timer = setTimeout(livenessTick, 300);
  };

  const startLiveness = () => {
    if (!cameraOn) return setMessage("Inicia la cámara primero");

    stopLiveness();
    livenessRef.current = { running: true, step: 0, stableCount: 0, timer: null, stepTimer: null };
    setPhase("liveness-left");
    setStepComplete("");
    setMessage("");
    livenessRef.current.timer = setTimeout(livenessTick, 300);
  };

  const captureDescriptor = async () => {
    const samples = [];
    const MAX_INTENTOS = 20;
    let intentos = 0;

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
        setPhase("no-face");
        await new Promise((r) => setTimeout(r, 300));
        continue;
      }

      const box = detection.detection.box;
      const faceRatio = (box.width * box.height) /
        (videoRef.current.videoWidth * videoRef.current.videoHeight);

      if (faceRatio < 0.08) {
        await new Promise((r) => setTimeout(r, 300));
        continue;
      }

      if (!isFaceFrontal(detection.landmarks) || !isFaceVertical(detection.landmarks)) {
        await new Promise((r) => setTimeout(r, 300));
        continue;
      }

      samples.push(detection.descriptor);
      setCaptureStep(samples.length);
      await new Promise((r) => setTimeout(r, 250));
    }

    setCaptureStep(0);

    if (samples.length < 5) {
      setMessage("No se pudo capturar. Mejora la iluminación e intenta de nuevo.");
      return null;
    }

    const avg = samples[0].map((_, i) =>
      samples.reduce((s, d) => s + d[i], 0) / samples.length
    );

    return avg;
  };

  const handleCaptureAndValidate = async () => {
    if (!livenessPassed) return setMessage("Falta validación de identidad");

    setPhase("capturing");
    const descriptor = await captureDescriptor();
    if (!descriptor) {
      setPhase("idle");
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
      setPhase("loading-models");
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

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const renderOverlay = () => {
    if (!cameraOn) return null;

    return (
      <div className="mfa2-overlay">
        {phase === "no-face" && (
          <span className="mfa2-overlay-text">Enfoca tu rostro</span>
        )}

        {phase === "liveness-left" && (
          <span className="mfa2-overlay-text">Gira a la izquierda</span>
        )}

        {phase === "liveness-right" && (
          <span className="mfa2-overlay-text">Gira a la derecha</span>
        )}

        {phase === "liveness-smile" && (
          <span className="mfa2-overlay-text">Sonríe</span>
        )}

        {phase === "step-done" && (
          <span className="mfa2-overlay-text" style={{ color: "#22c55e" }}>
            {stepComplete}
          </span>
        )}

        {phase === "capturing" && (
          <>
            <span className="mfa2-overlay-text" style={{ fontSize: 14 }}>
              Capturando... {captureStep}/5
            </span>
            <div className="mfa2-overlay-progress">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className={`mfa2-overlay-dot ${n <= captureStep ? "mfa2-overlay-dot--active" : ""}`} />
              ))}
            </div>
          </>
        )}

        {phase === "validating" && (
          <span className="mfa2-overlay-text" style={{ fontSize: 14 }}>
            Validando...
          </span>
        )}

        {phase === "success" && (
          <span className="mfa2-overlay-text" style={{ color: "#22c55e" }}>
            Rostro verificado ✓
          </span>
        )}

        {phase === "error" && (
          <span className="mfa2-overlay-text" style={{ color: "#ff6b6b" }}>
            Error — intenta de nuevo
          </span>
        )}
      </div>
    );
  };

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

                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="mfa2-video"
                  style={{
                    width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px",
                    display: (phase === "idle" || phase === "loading-models") ? "none" : "block"
                  }}
                />

                {(phase === "idle" || phase === "loading-models") && (
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

                {renderOverlay()}
              </div>
            </div>

            {/* Info message */}
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

            {(phase === "loading-models" || phase === "liveness-left" ||
              phase === "liveness-right" || phase === "liveness-smile" ||
              phase === "capturing" || phase === "validating") && (
              <button className="mfa2-btn-scan" disabled style={{ opacity: 0.6 }}>
                <span className="material-symbols-outlined">hourglass_top</span>
                {phase === "loading-models" ? "Cargando modelos..." :
                 phase === "capturing"      ? "Capturando rostro..." :
                 phase === "validating"     ? "Validando identidad..." :
                                               "Verificando vida..."}
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
