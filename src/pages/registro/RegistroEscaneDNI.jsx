import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserPDF417Reader } from "@zxing/browser";
import { toast } from "sonner";
import { useRegistration } from "../../context/useRegistration";
import { useTheme } from "../../context/ThemeContext";
import Footer from "../components/layout/footer/Footer";
import { scanIdentity } from "../../services/api";
import "../../css/registro/Registroidentidad.css";


const parsearDNI = (raw) => {
    console.log("RAW PDF417:", raw);

    const partes = raw
        .split(/  +/)
        .map(s => s.trim())
        .filter(Boolean);

    const bloque0 = partes[0] ?? "";
    const dniRaw = bloque0.match(/^\d+/)?.[0] ?? "";
    const apellidoP = bloque0.replace(/^\d+/, "").trim() || "";
    const apellidoM = partes[1] ?? "";
    const nombres = partes[2] ?? "";

    // limpiar prefijo/sufijo del DNI
    const dni = dniRaw.length === 10 && dniRaw.startsWith("01")
        ? dniRaw.slice(2)
        : dniRaw.slice(0, 8);

    // nombre completo
    const full_name = [
        nombres,
        apellidoP,
        apellidoM
    ]
        .filter(Boolean)
        .join(" ");

    return {
        dni,
        full_name
    };
};


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



export default function RegistroEscaneDNI() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const { setRegistrationId } = useRegistration();

    const [loading, setLoading] = useState(false);
    const [estado, setEstado] = useState("");
    const [preview, setPreview] = useState(null);
    const [datosLeidos, setDatosLeidos] = useState(null); 


    const handleImage = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
        setDatosLeidos(null);
        setLoading(true);

        const codeReader = new BrowserPDF417Reader();
        let exitoso = false;

        for (let i = 0; i < FILTROS.length; i++) {
            try {
                setEstado(`Escaneando... intento ${i + 1} de ${FILTROS.length}`);

                const url = FILTROS[i]
                    ? await preprocessImage(imageUrl, FILTROS[i])
                    : imageUrl;

                const result = await codeReader.decodeFromImageUrl(url);
                const rawText = result.getText();
                const parsed = parsearDNI(rawText);

                if (!parsed.dni || parsed.dni === "?") {
                    throw new Error("DNI no extraído");
                }

                setDatosLeidos(parsed);
                setEstado(`Leído correctamente ✓`);
                exitoso = true;
                break;

            } catch (_) {
                // silencioso — siguiente filtro
            }
        }

        if (!exitoso) {
            setEstado("No se pudo leer el código. Intenta con mejor iluminación.");
            toast.error("No se pudo leer el DNI. Intenta otra foto.");
        }

        setLoading(false);
    };


    const handleContinuar = async () => {
        if (!datosLeidos) return;
        setLoading(true);
        setEstado("Registrando datos...");

        try {
            const result = await scanIdentity(datosLeidos.dni, datosLeidos.full_name);

            if (!result.success) {
                toast.error(result.error || "Error al registrar");
                return;
            }

            setRegistrationId(result.data.voter_id);
            toast.success("DNI escaneado correctamente");
            navigate("/registro/identidad"); 

        } catch (err) {
            console.error(err);
            toast.error("Error de conexión con el servidor");
        } finally {
            setLoading(false);
            setEstado("");
        }
    };

    return (
        <div className="ri-page">

            <header className="ri-header">
                <nav className="ri-nav">
                    <span className="ri-logo">NEXA VOTE</span>
                    <div className="ri-nav-icons">
                        <button className="theme-toggle" onClick={toggleTheme}>
                          <span className="material-symbols-outlined">{theme === "light" ? "dark_mode" : "light_mode"}</span>
                        </button>
                        <span className="material-symbols-outlined ri-nav-icon">id_card</span>
                    </div>
                </nav>
            </header>

            <main className="ri-main">
                <div className="ri-glass-panel">

                    <div className="ri-panel-header">
                        <h1 className="ri-title">Escanear DNI</h1>
                        <p className="ri-subtitle">
                            Fotografía el reverso de tu DNI para cargar tus datos automáticamente.
                        </p>
                    </div>

                    {/* Zona de preview / scanner */}
                    <div className="ri-scan-zone">
                        <div className="ri-scan-frame">
                            <div className="ri-corner ri-corner--tl" />
                            <div className="ri-corner ri-corner--tr" />
                            <div className="ri-corner ri-corner--bl" />
                            <div className="ri-corner ri-corner--br" />

                            {preview ? (
                                <img
                                    src={preview}
                                    alt="DNI preview"
                                    className="ri-scan-preview"
                                />
                            ) : (
                                <div className="ri-scan-placeholder">
                                    <span className="material-symbols-outlined ri-scan-icon">
                                        document_scanner
                                    </span>
                                    <p>El reverso de tu DNI aparecerá aquí</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Datos leídos */}
                    {datosLeidos && (
                        <div className="ri-datos-leidos">
                            <p className="ri-datos-title">
                                <span className="material-symbols-outlined">check_circle</span>
                                Datos detectados
                            </p>
                            <div className="ri-datos-grid">
                                <span className="ri-datos-label">DNI</span>
                                <span className="ri-datos-value">{datosLeidos.dni}</span>
                                <span className="ri-datos-label">Nombre completo</span>
                                <span className="ri-datos-value">{datosLeidos.full_name}</span>
                            </div>
                        </div>
                    )}

                    {/* Tips */}
                    {!datosLeidos && (
                        <div className="ri-tips">
                            <p className="ri-tips-title">Para mejores resultados:</p>
                            <ul className="ri-tips-list">
                                <li>Fotografía el <strong>reverso</strong> del DNI</li>
                                <li>Buena iluminación, sin reflejos ni sombras</li>
                                <li>DNI plano, sin ángulo</li>
                                <li>Código de barras completo y visible</li>
                            </ul>
                        </div>
                    )}

                    {estado && (
                        <p className="ri-estado">{estado}</p>
                    )}

                    {/* Botones */}
                    <div className="ri-actions-row">

                        <label
                            className="ri-btn-submit"
                        >
                            <span className="material-symbols-outlined">
                                {loading ? "hourglass_top" : "camera"}
                            </span>
                            {loading ? estado || "Procesando..." : preview ? "Cambiar foto" : "Fotografiar DNI"}
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleImage}
                                hidden
                                disabled={loading}
                            />
                        </label>

                        {datosLeidos && (
                            <button
                                className="ri-btn-submit ri-btn-success"
                                onClick={handleContinuar}
                                disabled={loading}
                            >
                                <span className="material-symbols-outlined">
                                    arrow_forward
                                </span>
                                Continuar
                            </button>
                        )}

                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}