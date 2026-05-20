import { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import { supabase } from "../../lib/supabaseClient";
import { useRegistration } from "../../context/useRegistration";
import { useNavigate } from "react-router-dom";
import "../../css/registro/RegistroReconocimiento.css";

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

  const startLiveness = () => {
    if (!cameraOn) return setMessage("Inicia la cámara primero");

    runningLiveness.current = true;
    step.current = 0;
    stableCounter.current = 0;

    const interval = setInterval(async () => {
      if (!runningLiveness.current) return;

      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceExpressions();

      if (!detection) { setMessage("No se detecta rostro"); return; }

      const nose = detection.landmarks.getNose()[3];
      const offset = nose.x - videoRef.current.videoWidth / 2;

      if (step.current === 0) {
        setMessage("Mira a la izquierda");
        if (offset < -60) stableCounter.current++;
        else stableCounter.current = 0;
        if (stableCounter.current >= 5) { step.current = 1; stableCounter.current = 0; setMessage("Izquierda confirmada"); }
      } else if (step.current === 1) {
        setMessage("Mira a la derecha");
        if (offset > 60) stableCounter.current++;
        else stableCounter.current = 0;
        if (stableCounter.current >= 5) { step.current = 2; stableCounter.current = 0; setMessage("Derecha confirmada"); }
      } else if (step.current === 2) {
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

  const captureDescriptor = async () => {
    setLoading(true);
    const samples = [];

    for (let i = 0; i < 5; i++) {
      setCaptureStep(i + 1);
      setMessage(`Capturando rostro (${i + 1}/5)`);

      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 224 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) samples.push(detection.descriptor);
      await new Promise((r) => setTimeout(r, 250));
    }

    setCaptureStep(0);
    setMessage("Procesando rostro...");

    if (samples.length === 0) { setLoading(false); setMessage("Error en captura"); return null; }

    const avg = samples[0].map((_, i) => samples.reduce((s, d) => s + d[i], 0) / samples.length);
    setLoading(false);
    return avg;
  };

  const registerFace = async () => {
    if (!livenessPassed) return setMessage("Falta verificación");

    const descriptor = await captureDescriptor();
    if (!descriptor) return;

    const { error: bioError } = await supabase
      .from("biometric_data")
      .upsert({ voter_id: registrationId, face_embedding: JSON.stringify(Array.from(descriptor)) }, { onConflict: "voter_id" });

    if (bioError) { console.log(bioError); setMessage("Error guardando biometría"); return; }

    const { error: statusError } = await supabase
      .from("registration_status")
      .update({ current_step: 2, status: "pending" })
      .eq("voter_id", registrationId);

    if (statusError) { console.log(statusError); setMessage("Error actualizando estado"); return; }

    setFaceSaved(true);
    setMessage("Rostro guardado correctamente");
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) { stream.getTracks().forEach((t) => t.stop()); videoRef.current.srcObject = null; }
    setCameraOn(false);
  };

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
          <video ref={videoRef} autoPlay muted width={640} height={480} className="rr-webcam" />
          <div className="rr-scan-frame" />
        </div>

        <div className="rr-buttons">
          <button onClick={startCamera} className="rr-btn-primary" disabled={cameraOn}>
            Iniciar cámara
          </button>

          <button onClick={startLiveness} className="rr-btn-primary" disabled={!cameraOn || livenessPassed}>
            Verificar vida
          </button>

          <button onClick={registerFace} className="rr-btn-primary" disabled={!livenessPassed}>
            Registrar rostro
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