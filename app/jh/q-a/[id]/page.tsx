import { redirect } from 'next/navigation';

// /jh/q-a/[id] は廃止。/jh/q-a にリダイレクト
export default function QARedirectPage() {
  redirect('/jh/q-a');
}

export async function generateStaticParams() {
  // 旧IDリスト（1〜18）
  return Array.from({ length: 18 }, (_, i) => ({ id: String(i + 1) }));
}
