import Link from 'next/link';

interface ValidatorBreadcrumbProps {
  name: string;
}

export default function ValidatorBreadcrumb({ name }: ValidatorBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-vigil-muted mb-8 fade-up"
    >
      <Link href="/dashboard" className="hover:text-white transition-colors">
        Dashboard
      </Link>
      <span className="text-vigil-muted/50">/</span>
      <Link href="/validator" className="hover:text-white transition-colors">
        Validators
      </Link>
      <span className="text-vigil-muted/50">/</span>
      <span className="text-white truncate">{name}</span>
    </nav>
  );
}
