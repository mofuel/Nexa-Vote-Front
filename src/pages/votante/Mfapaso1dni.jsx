import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BrowserPDF417Reader } from "@zxing/browser";
import { DecodeHintType } from "@zxing/library";
import { toast } from "sonner";
import API_URL from "../../config/api";
import Footer from "../components/layout/footer/Footer";
import MFAStepper from "../components/ui/Mfastepper";

import "../../css/votante/Mfapaso1dni.css";



export default function MFAPaso1DNI() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [estado, setEstado] = useState("");
  const [preview, setPreview] = useState(null);

  const FILTROS = [
    null,
    "contrast(1.5) grayscale(1)",
    "contrast(2) grayscale(1)",
    "contrast(2.5) brightness(1.2) grayscale(1)",
  ];

  const preprocessImage = (imageUrl, filtro) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;

        ctx.filter = filtro;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/png"));
      };

      img.src = imageUrl;
    });
  };

  const parsearDNI = (raw) => {
    console.log("RAW PDF417:", raw);

    const numerosInicio = raw.match(/^\d{10}/);
    if (!numerosInicio) return { dni: null };

    const bloque = numerosInicio[0];
    const dni = bloque.slice(2, 10);

    return { dni };
  };

  const retryWithCanvas = (imageUrl, codeReader) => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = async () => {
        const scale = img.width < 1200 ? 2 : 1;

        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const scaledUrl = canvas.toDataURL("image/png");

        try {
          const result = await codeReader.decodeFromImageUrl(scaledUrl);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = reject;
      img.src = imageUrl;
    });
  };

  const handleImage = async (event) => {

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Debe iniciar sesión");
      navigate("/login");
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    try {
      setLoading(true);
      setEstado("Escaneando DNI...");

      const hints = new Map();
      hints.set(DecodeHintType.TRY_HARDER, true);
      hints.set(DecodeHintType.PURE_BARCODE, false);

      const codeReader = new BrowserPDF417Reader(hints);

      let scanResult = null;
      let success = false;

      for (let i = 0; i < FILTROS.length; i++) {
        try {
          setEstado(`Intento ${i + 1}/${FILTROS.length}`);

          const url = FILTROS[i]
            ? await preprocessImage(imageUrl, FILTROS[i])
            : imageUrl;

          scanResult = await codeReader.decodeFromImageUrl(url);

          success = true;
          break;
        } catch (e) {}
      }

      if (!success || !scanResult) {
        toast.error("No se pudo leer el DNI");
        return;
      }

      const rawText = scanResult.getText();
      const parsed = parsearDNI(rawText);

      if (!parsed.dni) {
        toast.error("No se pudo extraer el DNI");
        return;
      }


      setEstado("Validando con el servidor...");

      const response = await fetch(`${API_URL}/api/mfa/validate-dni`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dni_scanned: parsed.dni }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.error || "DNI no válido");
        return;
      }

      toast.success("DNI validado correctamente");
      navigate("/mfa/facial");

    } catch (err) {
      console.error(err);

      if (err.name === "ChecksumException" || err.message?.includes("Checksum")) {
        toast.error("Imagen con baja calidad");
      } else if (err.name === "NotFoundException") {
        toast.error("No se encontró código PDF417");
      } else {
        toast.error("Error al procesar DNI");
      }

    } finally {
      setLoading(false);
      setEstado("");
    }
  };

  return (
    <div className="mfa1-page">

      <header className="mfa1-header">
        <nav className="mfa1-nav">
          <span className="mfa1-logo">NEXA VOTE</span>
        </nav>
      </header>

      <main className="mfa1-main">

        <div className="mfa1-stepper-wrap">
          <MFAStepper currentStep={1} />
        </div>

        <div className="mfa1-panel">

          <div className="mfa1-panel-header">
            <h1>Validación de Identidad</h1>
            <p>Suba una foto del reverso de su DNI</p>
          </div>

          <div className="mfa1-scanner">
            <div className="mfa1-scanner-inner">
              <div className="mfa1-scan-frame">
                <div className="mfa1-corner mfa1-corner--tl" />
                <div className="mfa1-corner mfa1-corner--tr" />
                <div className="mfa1-corner mfa1-corner--bl" />
                <div className="mfa1-corner mfa1-corner--br" />

                {/* Preview de la imagen subida dentro del frame */}
                {preview ? (
                  <img
                    src={preview}
                    alt="DNI subido"
                    style={{
                      width: "100%", height: "100%",
                      objectFit: "cover", borderRadius: "6px"
                    }}
                  />
                ) : (
                  <div className="mfa1-scan-line" />
                )}
              </div>
            </div>
          </div>

          {/* Tips de calidad */}
          <div className="mfa1-tips">
            <p className="mfa1-tips-title">Para mejores resultados:</p>
            <ul className="mfa1-tips-list">
              <li>Fotografía el <strong>reverso</strong> del DNI</li>
              <li>Buena iluminación, sin reflejos ni sombras</li>
              <li>DNI plano, sin ángulo ni perspectiva</li>
              <li>Código de barras completo y visible</li>
            </ul>
          </div>

          <div className="mfa1-actions">
            <label className="mfa1-btn-scan" style={{ pointerEvents: loading ? "none" : "auto", opacity: loading ? 0.6 : 1 }}>
              <span className="material-symbols-outlined">
                {loading ? "hourglass_top" : "camera"}
              </span>

              {loading ? estado || "Procesando..." : preview ? "Cambiar foto" : "Subir DNI"}

              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImage}
                hidden
                disabled={loading}
              />
            </label>

            {estado && !loading && (
              <p className="mfa1-info-text">{estado}</p>
            )}
          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}