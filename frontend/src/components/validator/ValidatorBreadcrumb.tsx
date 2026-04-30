import Link from 'next/link';

interface ValidatorBreadcrumbProps {
  name: string;
}

export default function ValidatorBreadcrumb({ name }: ValidatorBreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-[#8892ab] mb-6 fade-up">
      <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
      <span>&gt;</span>
      <Link href="/validator" className="hover:text-white transition-colors">Validators</Link>
      <span>&gt;</span>
      <span className="text-white">{name}</span>
    </div>
  );
}
