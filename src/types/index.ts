export interface PasswordConfig {
  length: number;
  useUppercase: boolean;
  useLowercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  excludeSimilar: boolean;
}

export interface PasswordStrength {
  score: number; // 0-4
  label: 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Secure';
  entropy: number;
  color: string;
}

export interface GeneratedHistory {
  id: string;
  value: string;
  timestamp: number;
  note?: string;
}
