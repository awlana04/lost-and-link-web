import type { Metadata } from 'next';
import { Rakkas, Scope_One } from 'next/font/google';
import './globals.css';

const rakkas = Rakkas({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-rakkas',
});

const ScopeOne = Scope_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-scope-one',
});

export const metadata: Metadata = {
  title: 'Lost and Link',
  description: 'A solução de Achados e Perdidos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${rakkas.variable} ${ScopeOne.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
