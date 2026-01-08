import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages와 같은 정적 호스팅 서비스에서 하위 경로(subdirectory)에 배포될 때
  // 에셋(JS, CSS) 경로가 깨지는 것을 방지하기 위해 상대 경로('./')를 기본 경로로 설정합니다.
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  define: {
    // 브라우저 환경에서 process.env가 정의되지 않아 발생하는 런타임 오류 방지
    'process.env': {}
  }
});