import React from 'react';
import { InquiryType } from '../types';

interface FormRadioGroupProps {
  label: string;
  value: InquiryType;
  onChange: (value: InquiryType) => void;
}

export const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.values(InquiryType).map((type) => (
          <div
            key={type}
            onClick={() => onChange(type)}
            className={`
              relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none transition-all duration-200
              ${value === type 
                ? 'border-indigo-600 ring-2 ring-indigo-600 bg-indigo-50' 
                : 'border-gray-300 bg-white hover:bg-gray-50'}
            `}
          >
            <span className="flex flex-1">
              <span className="flex flex-col">
                <span className={`block text-sm font-medium ${value === type ? 'text-indigo-900' : 'text-gray-900'}`}>
                  {type}
                </span>
                <span className={`mt-1 flex items-center text-sm ${value === type ? 'text-indigo-700' : 'text-gray-500'}`}>
                  {type === InquiryType.TYPE_A ? '일반적인 상품 및 서비스 관련 문의' : '긴급한 이슈 처리 또는 제휴 제안'}
                </span>
              </span>
            </span>
            <div
              className={`
                h-5 w-5 rounded-full border flex items-center justify-center
                ${value === type ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'}
              `}
              aria-hidden="true"
            >
              {value === type && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};