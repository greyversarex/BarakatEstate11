import { createRoot } from "react-dom/client";
import App from "./App";
import "./app/globals.css";
import "./index.css";

// Load the Yandex Maps JS API only when a valid key is configured. The key is
// injected from VITE_YANDEX_MAPS_API_KEY (dev: env var; prod: Docker build arg).
// Without a key we skip the script entirely to avoid the "Invalid API key"
// console error — maps simply won't render.
const yandexKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;
if (typeof yandexKey === "string" && yandexKey.trim()) {
  const script = document.createElement("script");
  script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(yandexKey.trim())}&lang=ru_RU`;
  script.defer = true;
  document.head.appendChild(script);
}

createRoot(document.getElementById("root")!).render(<App />);
