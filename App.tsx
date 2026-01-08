import React, { useState, useCallback } from 'react';
import { User, Phone, Mail, FileText, Send, Sparkles, CheckCircle } from 'lucide-react';
import { InquiryFormData, InquiryType, BUDGET_OPTIONS } from './types';
import { FormInput } from './components/FormInput';
import { FormSelect } from './components/FormSelect';
import { FormRadioGroup } from './components/FormRadioGroup';
import { processInquiryWithAI } from './services/geminiService';
import { submitToGoogleSheet } from './services/googleSheetService';

const App: React.FC = () => {
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    phone: '',
    email: '',
    inquiryType: InquiryType.TYPE_A,
    details: '',
    budget: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleRadioChange = useCallback((value: InquiryType) => {
    setFormData((prev) => ({ ...prev, inquiryType: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Google Sheet로 데이터 전송 (병렬 처리 가능하지만, 데이터 저장이 우선이므로 순차적으로 진행 권장)
      await submitToGoogleSheet(formData);

      // 2. Gemini AI를 통한 응답 메시지 생성
      const result = await processInquiryWithAI(formData);
      
      setAiResponse(result);
      setSubmitted(true);
    } catch (error) {
      console.error("Submission failed", error);
      alert("접수 처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setAiResponse(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      inquiryType: InquiryType.TYPE_A,
      details: '',
      budget: '',
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all">
          <div className="p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">문의가 접수되었습니다!</h2>
            <p className="text-gray-500 mb-6">
              귀하의 소중한 문의 내역이 구글 시트에 안전하게 저장되었습니다.
            </p>
            
            {aiResponse && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-left mb-6">
                <div className="flex items-center mb-2">
                  <Sparkles className="h-4 w-4 text-indigo-600 mr-2" />
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">AI 자동 응답</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {aiResponse}
                </p>
              </div>
            )}

            <button
              onClick={handleReset}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              새로운 문의 작성하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            문의하기
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            프로젝트나 서비스에 대해 궁금한 점을 남겨주세요.<br/>
            내용은 담당자에게 전달되며 AI가 접수 확인을 도와드립니다.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h3 className="text-lg font-medium text-white flex items-center">
              <FileText className="mr-2 h-5 w-5" /> 문의 작성 양식
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                id="name"
                label="이름"
                value={formData.name}
                onChange={handleChange}
                placeholder="홍길동"
                required
                icon={User}
              />
              <FormInput
                id="phone"
                label="전화번호"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-1234-5678"
                required
                icon={Phone}
              />
            </div>

            <FormInput
              id="email"
              label="이메일"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@company.com"
              required
              icon={Mail}
            />

            <FormRadioGroup
              label="문의 유형"
              value={formData.inquiryType}
              onChange={handleRadioChange}
            />

            <FormSelect
              id="budget"
              label="가용 예산"
              value={formData.budget}
              onChange={handleChange}
              options={BUDGET_OPTIONS}
              required
            />

            <div>
              <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                상세 문의안 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <textarea
                  id="details"
                  name="details"
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-3"
                  placeholder="문의하실 내용을 구체적으로 적어주세요."
                  value={formData.details}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                  transition-all duration-200
                  ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}
                `}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    처리 중...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" /> 문의 접수하기
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Smart Inquiry Corp. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default App;