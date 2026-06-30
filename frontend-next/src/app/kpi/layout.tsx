import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KPI / Goals',
};

export default function KpiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
