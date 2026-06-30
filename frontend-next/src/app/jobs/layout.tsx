import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pekerjaan Saya',
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
