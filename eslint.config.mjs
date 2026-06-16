import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // {
  //   ignores: ['**/dist'],
  // },
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'plugin:@tanstack/eslint-plugin-query/recommended'),
  {
    rules: {
      'no-var': 'error', // var 사용 금지
      'no-unused-vars': 'off', // 아래 typescript 로 검사하므로 충돌하지 않도록 설정 해제
      'import/no-anonymous-default-export': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/no-unused-vars': 'error', // 사용하지 않는 변수는 경고
      '@typescript-eslint/no-explicit-any': 'off', // {} 빈 객체 사용 가능
      '@tanstack/query/exhaustive-deps': 'off',
      '@tanstack/query/no-rest-destructuring': 'warn',
      '@tanstack/query/stable-query-client': 'error',
    },
  },
];
