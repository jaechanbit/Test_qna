import { GoogleGenAI } from "@google/genai";
import { InquiryFormData } from "../types";

const processInquiryWithAI = async (formData: InquiryFormData): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("API Key not found. Skipping AI processing.");
    return "문의가 성공적으로 접수되었습니다. (AI 응답 기능 비활성화됨: API 키 없음)";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      사용자로부터 다음과 같은 문의가 접수되었습니다.
      
      [문의 내용]
      이름: ${formData.name}
      문의 유형: ${formData.inquiryType}
      예산: ${formData.budget}원
      내용: ${formData.details}
      
      역할: 당신은 전문적이고 친절한 고객 상담 AI입니다.
      작업: 위 내용을 바탕으로 고객에게 보낼 정중하고 간결한 접수 확인 메시지를 작성해주세요. 
      문의 내용을 요약하고, 담당자가 검토 후 ${formData.email} 또는 ${formData.phone}으로 연락드릴 것이라는 점을 명시하세요.
      공백 포함 300자 이내로 작성하세요. 한국어로 작성하세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "접수 확인 메시지를 생성하지 못했습니다.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "문의가 접수되었습니다. 현재 AI 서버 연결이 원활하지 않아 자동 응답 메시지를 생성할 수 없으나, 담당자가 확인 후 연락드리겠습니다.";
  }
};

export { processInquiryWithAI };