import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BrowserPDF417Reader } from "@zxing/browser";
import { toast } from "sonner";

import Footer from "../components/layout/footer/Footer";
import MFAStepper from "../components/ui/MFAStepper";

import "../../css/votante/Mfapaso1dni.css";

const API_URL = "http://127.0.0.1:5000";

export default function MFAPaso1DNI() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [estado, setEstado] = useState("");

  const parsearDNI = (raw) => {

    const clean = raw.replace(/\s+/g, " ").trim();
    const numeros = clean.replace(/\D/g, "");

    let sinPadding = numeros;

    if (numeros.startsWith("0")) {
      sinPadding = numeros.slice(1);
    }

    const dni = sinPadding.slice(0, 8);

    return { dni };
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

    try {

      setLoading(true);
      setEstado("Escaneando DNI...");

      const imageUrl = URL.createObjectURL(file);

      const codeReader = new BrowserPDF417Reader();
      const scanResult = await codeReader.decodeFromImageUrl(imageUrl);

      const rawText = scanResult.getText();
      const parsed = parsearDNI(rawText);

      console.log("RAW PDF417:", rawText);
      console.log("DNI ESCANEADO:", parsed.dni);

      const response = await fetch(
        `${API_URL}/api/mfa/validate-dni`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            dni_scanned: parsed.dni
          })
        }
      );

      const data = await response.json(); 

      if (!response.ok || !data.success) {
        toast.error(data.error || "DNI no válido");
        return;
      }

      toast.success("DNI validado correctamente");

      navigate("/mfa/facial");

    } catch (err) {

      console.error(err);
      toast.error("Error al procesar el DNI");

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
                <div className="mfa1-scan-line" />
              </div>
            </div>
          </div>

          <div className="mfa1-actions">

            <label className="mfa1-btn-scan">
              <span className="material-symbols-outlined">camera</span>

              {loading ? "Escaneando..." : "Subir DNI"}

              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImage}
                hidden
              />
            </label>

            {estado && (
              <p className="mfa1-info-text">{estado}</p>
            )}

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}