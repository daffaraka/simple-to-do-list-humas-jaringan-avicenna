import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'View Jobs',
};

export default function ViewJobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
