import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// 파일명 Main.tsx -> main.tsx
createRoot(document.getElementById("root")!).render(<App />);
