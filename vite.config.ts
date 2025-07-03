import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],

  server: {
    https: {
      // 인증서와 키 파일을 지정하는 객체
      key: "./.cert/key.pem",
      cert: "./.cert/cert.pem",
    },
  },
});
