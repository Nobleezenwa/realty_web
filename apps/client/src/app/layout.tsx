import type { Metadata } from 'next'
import { Poppins, Nunito } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400','500','600','700'], // Load only regular and bold weights
  variable: '--font-poppins',
});
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400','500','600','700'], // Load only regular and bold weights
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'Homeverse — Find Your Dream Home',
  description: 'Modern real estate landing page built with Next.js, TypeScript, and TailwindCSS.',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: 'Homeverse',
    description: 'Find your dream home with Homeverse.',
    url: 'https://example.com',
    siteName: 'Homeverse',
    images: [{ url: '/hero.jpg', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.className} ${nunito.variable}`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  )
}