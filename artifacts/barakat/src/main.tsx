import { createRoot } from "react-dom/client";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import App from "./App";
import "./app/globals.css";
import "./index.css";

// Expose Leaflet to the legacy aura-source.js runtime, which draws the property
// maps using OpenStreetMap tiles. No API key or registration is required.
(window as unknown as { L: typeof L }).L = L;

createRoot(document.getElementById("root")!).render(<App />);
