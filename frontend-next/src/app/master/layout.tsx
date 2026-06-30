import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Master Data',
};

export default function MasterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
