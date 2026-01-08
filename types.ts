export enum InquiryType {
  TYPE_A = 'A 유형 (일반 문의)',
  TYPE_B = 'B 유형 (긴급/제휴 문의)',
}

export interface InquiryFormData {
  name: string;
  phone: string;
  email: string;
  inquiryType: InquiryType;
  details: string;
  budget: string;
}

export const BUDGET_OPTIONS = [
  { value: '1000000', label: '100만원' },
  { value: '2000000', label: '200만원' },
  { value: '3000000', label: '300만원' },
  { value: '4000000', label: '400만원' },
  { value: '5000000', label: '500만원' },
];