import type { Metadata } from 'next'
import { Inter, Playfair_Display, Cormorant_Garamond, Great_Vibes } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import PageTransition from '@/components/animations/PageTransition'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const greatVibes = Great_Vibes({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-great-vibes',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ambsbymaria.com'),
  title: 'AmbsbyMaria | Shop Trendy Earrings & Premium Jewellery Pakistan',
  description: 'Shop the latest collection of trendy earrings and premium jewellery at AmbsbyMaria. Discover handcrafted rings, necklaces, and bracelets for every occasion in Pakistan.',
  keywords: [
    'AMBS by Maria',
    'AmbsbyMaria',
    'trendy earrings',
    'trendy jewellery',
    'premium jewellery Pakistan',
    'artificial jewelry online shop',
    'handcrafted earrings',
    'stylish necklaces',
    'designer rings Pakistan',
    'fashion jewellery brand',
    'elegant jhumkas',
    'daily wear jewelry'
  ],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'AmbsbyMaria | Shop Trendy Earrings & Premium Jewellery Pakistan',
    description: 'Shop the latest collection of trendy earrings and premium jewellery. Handcrafted elegance delivered across Pakistan.',
    url: 'https://ambsbymaria.com',
    siteName: 'AmbsbyMaria',
    images: [
      {
        url: 'https://ambsbymaria.com/logo.png',
        width: 800,
        height: 600,
        alt: 'AmbsbyMaria - Premium Jewellery',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AmbsbyMaria | Shop Trendy Earrings & Premium Jewellery',
    description: 'Discover exquisite handcrafted jewellery. Shop trendy earrings, rings, and more at AmbsbyMaria.',
    images: ['https://ambsbymaria.com/logo.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AmbsbyMaria',
  url: 'https://ambsbymaria.com',
  logo: 'https://ambsbymaria.com/logo.png',
  sameAs: [
    'https://www.facebook.com/ambsbymaria',
    'https://www.instagram.com/ambsbymaria',
    'https://www.tiktok.com/@ambsbymaria'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+92-300-1234567', // Placeholder, user should update
    contactType: 'customer service'
  }
}

const localBusinessLd = {
  '@context': 'https://schema.org',
  '@type': 'JewelryStore',
  name: 'AmbsbyMaria',
  image: 'https://ambsbymaria.com/logo.png',
  '@id': 'https://ambsbymaria.com',
  url: 'https://ambsbymaria.com',
  telephone: '+92-300-1234567', // Placeholder
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Main Boulevard', // Placeholder
    addressLocality: 'Lahore',
    addressRegion: 'Punjab',
    postalCode: '54000',
    addressCountry: 'PK'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 31.5204,
    longitude: 74.3587
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ],
    opens: '09:00',
    closes: '18:00'
  },
  sameAs: [
    'https://www.facebook.com/ambsbymaria',
    'https://www.instagram.com/ambsbymaria',
    'https://www.tiktok.com/@ambsbymaria'
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${cormorant.variable} ${greatVibes.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
        />
      </head>
      <body>
        <Header />
        <CartDrawer />
        <PageTransition>
          <main className="min-h-screen">
            {children}
          </main>
        </PageTransition>
        <Footer />
      </body>
    </html>
  )
}
