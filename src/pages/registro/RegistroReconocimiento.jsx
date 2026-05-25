import { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import { useRegistration } from "../../context/useRegistration";
import { useNavigate } from "react-router-dom";
import "../../css/registro/RegistroReconocimiento.css";
import API_URL from "../../config/api";

// ─── Helpers de calidad ───────────────────────────────────────────────────────

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

  // nariz no debe desviarse más del 25% de la distancia entre ojos
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

  // La nariz debe estar DEBAJO de los ojos (Y mayor en canvas)
  // y no demasiado lejos (cabeza inclinada hacia abajo)
  const eyeDistance = Math.abs(
    landmarks.getRightEye().reduce((s, p) => s + p.x, 0) / rightEye.length -
    landmarks.getLeftEye().reduce((s, p)  => s + p.x, 0) / leftEye.length
  );

  const verticalOffset = noseTipY - eyesCenterY;

  // La nariz debe estar entre 0.5x y 2.5x la distancia ocular por debajo
  return verticalOffset > eyeDistance * 0.5 && verticalOffset < eyeDistance * 2.5;
};


export default function RegistroReconocimiento() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { registrationId } = useRegistration();

  const [message, setMessage]           = useState("Listo para iniciar");
  const [loading, setLoading]           = useState(false);
  const [livenessPassed, setLivenessPassed] = useState(false);
  const [cameraOn, setCameraOn]         = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureStep, setCaptureStep]   = useState(0);
  const [faceSaved, setFaceSaved]       = useState(false);

  const step           = useRef(0);
  const stableCounter  = useRef(0);
  const runningLiveness = useRef(false);

  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
  };


  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setCameraOn(true);

    if (!modelsLoaded) {
      await loadModels();
      setModelsLoaded(true);
    }

    setMessage("Cámara activa");
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
  };

  // Liveness 
  const startLiveness = () => {
    if (!cameraOn) return setMessage("Inicia la cámara primero");

    runningLiveness.current = true;
    step.current        = 0;
    stableCounter.current = 0;

    const interval = setInterval(async () => {
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
        setMessage("Mira a la izquierda");
        if (offset < -60) stableCounter.current++;
        else stableCounter.current = 0;
        if (stableCounter.current >= 5) {
          step.current = 1; stableCounter.current = 0;
          setMessage("Izquierda confirmada ✓");
        }
      } else if (step.current === 1) {
        setMessage("Mira a la derecha");
        if (offset > 60) stableCounter.current++;
        else stableCounter.current = 0;
        if (stableCounter.current >= 5) {
          step.current = 2; stableCounter.current = 0;
          setMessage("Derecha confirmada ✓");
        }
      } else if (step.current === 2) {
        setMessage("Sonríe");
        if (detection.expressions.happy > 0.75) stableCounter.current++;
        else stableCounter.current = 0;
        if (stableCounter.current >= 5) {
          clearInterval(interval);
          runningLiveness.current = false;
          setLivenessPassed(true);
          setMessage("Liveness aprobado ✓");
        }
      }
    }, 300);
  };

  // Captura con validación de calidad 
  const captureDescriptor = async () => {
    setLoading(true);
    const samples     = [];
    const MAX_INTENTOS = 20;
    let intentos      = 0;

    while (samples.length < 5 && intentos < MAX_INTENTOS) {
      intentos++;
      setCaptureStep(samples.length + 1);

      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 224,
            scoreThreshold: 0.85,   
          })
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

    if (samples.length < 5) {
      setLoading(false);
      setMessage("No se pudo capturar. Mejora la iluminación e intenta de nuevo.");
      return null;
    }

    setMessage("Procesando rostro...");

    const avg = samples[0].map((_, i) =>
      samples.reduce((s, d) => s + d[i], 0) / samples.length
    );

    setLoading(false);
    return avg;
  };

  // Registro
  const registerFace = async () => {
    if (!livenessPassed) return setMessage("Falta verificación de vida");

    const descriptor = await captureDescriptor();
    if (!descriptor) return;

    try {
      const response = await fetch(`${API_URL}/register/face`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voter_id:   registrationId,
          descriptor: Array.from(descriptor),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.error || "Error guardando biometría");
        return;
      }

      setFaceSaved(true);
      setMessage(result.message);

    } catch (err) {
      console.error(err);
      setMessage("Error de conexión con el servidor");
    }
  };

  // Navegación
  const goNext = () => { stopCamera(); navigate("/registro/biometrico"); };

  useEffect(() => {
    loadModels();
    return () => stopCamera();
  }, []);

  
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
        </div>

        {/* Barra de progreso de captura */}
        {captureStep > 0 && (
          <div className="rr-progress">
            {[1,2,3,4,5].map((n) => (
              <div
                key={n}
                className={`rr-progress-dot ${n <= captureStep ? "active" : ""}`}
              />
            ))}
          </div>
        )}

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
            Verificar vida
          </button>

          <button
            onClick={registerFace}
            className="rr-btn-primary"
            disabled={!livenessPassed || loading}
          >
            {loading ? "Capturando..." : "Registrar rostro"}
          </button>

          {faceSaved && (
            <button className="rr-btn-continue" onClick={goNext}>
              Continuar a biometría →
            </button>
          )}
        </div>

        <p className="rr-message">{message}</p>
      </div>
    </div>
  );
}