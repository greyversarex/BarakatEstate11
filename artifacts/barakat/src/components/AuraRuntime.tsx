import { useEffect } from "react";
import { useLocation } from "wouter";

type AuraWindow = Window & {
  __auraScriptLoaded?: boolean;
  BARAKAT_API_URL?: string;
  hideLoader?: () => void;
  hydrateAuraPage?: (page: string) => void;
};

function pageFromPath(pathname: string) {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment || "home";
}

export default function AuraRuntime() {
  const [pathname] = useLocation();

  useEffect(() => {
    const auraWindow = window as AuraWindow;
    const page = pageFromPath(pathname);
    const baseUrl = import.meta.env.VITE_ADMIN_API_URL ?? "";
    auraWindow.BARAKAT_API_URL = baseUrl;

    let loaderHidden = false;
    const hideLoader = () => {
      if (!loaderHidden) {
        loaderHidden = true;
        auraWindow.hideLoader?.();
      }
    };

    // Safety net: always hide loader within 3 seconds regardless of hydration
    const safetyTimer = window.setTimeout(hideLoader, 3000);

    const boot = async () => {
      try {
        // Race hydration against a 2.5s timeout so loader always clears quickly
        await Promise.race([
          auraWindow.hydrateAuraPage?.(page),
          new Promise<void>((resolve) => window.setTimeout(resolve, 2500)),
        ]);
      } catch (err) {
        console.error("Hydration failed:", err);
      } finally {
        clearTimeout(safetyTimer);
        hideLoader();
      }
    };

    if (auraWindow.__auraScriptLoaded) {
      window.setTimeout(boot, 0);
      return () => clearTimeout(safetyTimer);
    }

    const script = document.createElement("script");
    script.src = "/aura-source.js";
    script.async = false;
    script.onload = () => {
      auraWindow.__auraScriptLoaded = true;
      boot();
    };
    script.onerror = () => {
      console.error("Failed to load aura-source.js");
      clearTimeout(safetyTimer);
      hideLoader();
    };
    document.body.appendChild(script);

    return () => {
      clearTimeout(safetyTimer);
      script.remove();
    };
  }, [pathname]);

  return (
    <>
      <div className="page-loader" id="loader">
        <div className="loader-logo">
          <img src="/barakat.PNG" alt="Barakat Estate" width={200} height={200} />
        </div>
      </div>
      <div className="notif" id="notif">
        <div className="dot" />
        <span id="notif-text" />
      </div>
    </>
  );
}
