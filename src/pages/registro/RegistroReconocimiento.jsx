import { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import { useRegistration } from "../../context/useRegistration";
import { useNavigate } from "react-router-dom";
import "../../css/registro/RegistroReconocimiento.css";
import { registerFace } from "../../services/api";

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

function HeadSilhouette() {
  return (
    <svg viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="rr-hologram-svg">
      <ellipse cx="50" cy="45" rx="32" ry="38" stroke="rgba(34,211,238,0.9)" strokeWidth="2" fill="rgba(34,211,238,0.08)" />
      <circle cx="35" cy="38" r="4" fill="rgba(34,211,238,0.6)" />
      <circle cx="65" cy="38" r="4" fill="rgba(34,211,238,0.6)" />
      <path d="M38 55 Q50 62 62 55" stroke="rgba(34,211,238,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="90" rx="20" ry="25" stroke="rgba(34,211,238,0.4)" strokeWidth="1.5" fill="rgba(34,211,238,0.05)" />
      <line x1="30" y1="118" x2="70" y2="118" stroke="rgba(34,211,238,0.3)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="rr-hologram-svg">
      <circle cx="40" cy="40" r="36" stroke="rgba(34,211,238,0.7)" strokeWidth="2" fill="rgba(34,211,238,0.05)" />
      <path d="M50 20 L25 40 L50 60" stroke="rgba(34,211,238,0.9)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="30" cy="40" r="3" fill="rgba(34,211,238,0.9)" />
      <ellipse cx="48" cy="28" rx="8" ry="10" stroke="rgba(34,211,238,0.3)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="rr-hologram-svg">
      <circle cx="40" cy="40" r="36" stroke="rgba(34,211,238,0.7)" strokeWidth="2" fill="rgba(34,211,238,0.05)" />
      <path d="M30 20 L55 40 L30 60" stroke="rgba(34,211,238,0.9)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="50" cy="40" r="3" fill="rgba(34,211,238,0.9)" />
      <ellipse cx="32" cy="28" rx="8" ry="10" stroke="rgba(34,211,238,0.3)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function SmileFace() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="rr-hologram-svg">
      <circle cx="50" cy="50" r="42" stroke="rgba(34,211,238,0.7)" strokeWidth="2" fill="rgba(34,211,238,0.05)" />
      <circle cx="32" cy="38" r="5" fill="rgba(34,211,238,0.8)" />
      <circle cx="68" cy="38" r="5" fill="rgba(34,211,238,0.8)" />
      <path d="M28 58 Q50 80 72 58" stroke="rgba(34,211,238,0.9)" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="rr-hologram-svg">
      <circle cx="40" cy="40" r="36" stroke="#22c55e" strokeWidth="2" fill="rgba(34,197,94,0.1)" />
      <path d="M22 42 L35 55 L58 28" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export default function RegistroReconocimiento() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { registrationId } = useRegistration();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [livenessPassed, setLivenessPassed] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureStep, setCaptureStep] = useState(0);
  const [faceSaved, setFaceSaved] = useState(false);
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
          setMessage("Identidad validada ✓");
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
    setLoading(true);
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
      setLoading(false);
      setMessage("No se pudo capturar. Mejora la iluminación e intenta de nuevo.");
      return null;
    }

    const avg = samples[0].map((_, i) =>
      samples.reduce((s, d) => s + d[i], 0) / samples.length
    );

    setLoading(false);
    return avg;
  };

  const handleSaveFace = async () => {
    if (!livenessPassed) return setMessage("Falta validación de identidad");

    setPhase("capturing");
    const descriptor = await captureDescriptor();
    if (!descriptor) {
      setPhase("idle");
      return;
    }

    try {
      const result = await registerFace(registrationId, Array.from(descriptor));

      if (!result.success) {
        setMessage(result.error || "Error guardando biometría");
        setPhase("idle");
        return;
      }

      setFaceSaved(true);
      setPhase("saved");
      setMessage("");

    } catch (err) {
      console.error(err);
      setMessage("Error de conexión con el servidor");
      setPhase("idle");
    }
  };

  const goNext = () => { stopCamera(); navigate("/registro/biometrico"); };

  useEffect(() => {
    loadModels();
    return () => {
      stopCamera();
    };
  }, []);

  const renderOverlay = () => {
    if (!cameraOn) return null;

    return (
      <div className="rr-overlay">
        {phase === "no-face" && (
          <>
            <div className="rr-hologram">
              <HeadSilhouette />
            </div>
            <span className="rr-overlay-text">Enfoca tu rostro</span>
          </>
        )}

        {phase === "liveness-left" && (
          <>
            <div className="rr-hologram rr-hologram--left">
              <ArrowLeft />
            </div>
            <span className="rr-overlay-text">Gira a la izquierda</span>
          </>
        )}

        {phase === "liveness-right" && (
          <>
            <div className="rr-hologram">
              <ArrowRight />
            </div>
            <span className="rr-overlay-text">Gira a la derecha</span>
          </>
        )}

        {phase === "liveness-smile" && (
          <>
            <div className="rr-hologram">
              <SmileFace />
            </div>
            <span className="rr-overlay-text">Sonríe</span>
          </>
        )}

        {phase === "step-done" && (
          <>
            <div className="rr-hologram">
              <CheckIcon />
            </div>
            <span className="rr-overlay-text" style={{ color: "#22c55e" }}>
              {stepComplete}
            </span>
          </>
        )}

        {phase === "capturing" && (
          <>
            <div className="rr-hologram">
              <CheckIcon />
            </div>
            <span className="rr-overlay-text" style={{ fontSize: 14 }}>
              Capturando... {captureStep}/5
            </span>
            <div className="rr-overlay-progress">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className={`rr-overlay-dot ${n <= captureStep ? "rr-overlay-dot--active" : ""}`} />
              ))}
            </div>
          </>
        )}

        {phase === "saved" && (
          <>
            <div className="rr-hologram">
              <CheckIcon />
            </div>
            <span className="rr-overlay-text" style={{ color: "#22c55e" }}>
              Rostro registrado ✓
            </span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="rr-page">
      <div className="rr-card">
        <h2>Registro Biométrico</h2>

        <div className="rr-camera-container">
          <video
            ref={videoRef}
            autoPlay
            muted
            width={640}
            height={480}
            className="rr-webcam"
          />
          <div className="rr-scan-frame" />
          {renderOverlay()}
        </div>

        <div className="rr-buttons">
          <button
            onClick={startCamera}
            className="rr-btn-primary"
            disabled={cameraOn}
          >
            Iniciar cámara
          </button>

          <button
            onClick={startLiveness}
            className="rr-btn-primary"
            disabled={!cameraOn || livenessPassed}
          >
            Validar identidad
          </button>

          <button
            onClick={handleSaveFace}
            className="rr-btn-primary"
            disabled={!livenessPassed || loading || faceSaved}
          >
            {loading ? "Capturando..." : "Registrar rostro"}
          </button>

          {faceSaved && (
            <button className="rr-btn-continue" onClick={goNext}>
              Continuar a biometría →
            </button>
          )}
        </div>

        {message && (
          <p className="rr-message">{message}</p>
        )}
      </div>
    </div>
  );
}
