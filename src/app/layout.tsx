import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a modern, readable font
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans', // Changed from Geist to Inter as per typography guidelines
});

export const metadata: Metadata = {
  title: 'Math Hero: Brain Battle',
  description: 'Test your math skills with AI-generated questions!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
