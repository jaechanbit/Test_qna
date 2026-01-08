import { InquiryFormData } from "../types";

// 🔴 주의: Google Apps Script를 배포하고 얻은 '웹 앱 URL'을 아래 변수에 입력해야 작동합니다.
// 예: "https://script.google.com/macros/s/AKfycbx.../exec"
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw-5BzrLi6mlhRl9pXa5rsJiHNC7_eYeJBwWA8v4A0FawcXTvsVKbB0DX6JNoysKjlluA/exec";

export const submitToGoogleSheet = async (data: InquiryFormData): Promise<boolean> => {
  if (GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL" || !GOOGLE_SCRIPT_URL) {
    console.warn("Google Sheet URL이 설정되지 않았습니다. services/googleSheetService.ts 파일의 GOOGLE_SCRIPT_URL 값을 변경해주세요.");
    // URL이 설정되지 않아도 UI 흐름을 막지 않기 위해 true 반환 (테스트 용도)
    return true;
  }

  const payload = {
    timestamp: new Date().toLocaleString('ko-KR'),
    ...data
  };

  try {
    // Google Apps Script Web App은 기본적으로 CORS 정책으로 인해 브라우저에서 직접 호출 시 오류가 발생할 수 있습니다.
    // 'no-cors' 모드를 사용하면 응답 내용을 읽을 수는 없지만, 데이터는 정상적으로 전송됩니다.
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    return true;
  } catch (error) {
    console.error("Google Sheet submission error:", error);
    return false;
  }
};