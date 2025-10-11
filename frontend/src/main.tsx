import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App.tsx";
import { InitialScreen } from "./components/InitialScreen.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InitialScreen />} />
        <Route path="*" element={<InitialScreen />} />
        <Route path="/quiz" element={<App />} />
      </Routes>
    </BrowserRouter>
  </>
);
