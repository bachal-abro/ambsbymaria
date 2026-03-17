'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, Twitter } from 'lucide-react'

// Custom TikTok Icon as Lucide doesn't have it in this version
const TiktokIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

const footerLinks = {
  collections: [
    { name: 'Rings', href: '/shop?category=rings' },
    { name: 'Necklaces', href: '/shop?category=necklaces' },
    { name: 'Bracelets', href: '/shop?category=bracelets' },
    { name: 'Earrings', href: '/shop?category=earrings' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Craftsmanship', href: '/about#craftsmanship' },
    { name: 'Contact', href: '/contact' },
    { name: 'Locations', href: '/contact#locations' },
  ],
  support: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Return & Refund Policy', href: '/return-policy' },
    { name: 'Shipping & Service Policy', href: '/shipping-policy' },
    { name: 'Terms & Conditions', href: '/terms' },
  ],
}

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/ambsbymaria/' },
  { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/people/AmbsbyMaria/61578887583824/#' },
  { name: 'Tiktok', icon: TiktokIcon, href: 'https://www.tiktok.com/@ambsbymaria' },
]

export default function Footer() {
  return (
    <footer className="bg-luxury-charcoal border-t border-luxury-charcoal-light">
      <div className="luxury-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/logo.png"
                alt="Ambs by Maria"
                width={180}
                height={64}
                className="h-16 w-auto object-contain"
                style={{ width: 'auto' }}
              />
            </Link>
            <p className="text-luxury-white/60 mb-6 max-w-sm leading-relaxed">
              Experience the beauty of handcrafted jewelry. Timeless designs, effortless elegance, and luxury you can wear every day.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-luxury-charcoal-light flex items-center justify-center text-luxury-white/60 hover:border-luxury-gold hover:text-luxury-gold transition-all duration-300"
                    aria-label={social.name}
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-luxury-gold font-display text-lg mb-4">
              Collections
            </h3>
            <ul className="space-y-3">
              {footerLinks.collections.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-luxury-white/60 hover:text-luxury-gold transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-luxury-gold font-display text-lg mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-luxury-white/60 hover:text-luxury-gold transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-luxury-gold font-display text-lg mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-luxury-white/60 hover:text-luxury-gold transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Logistics Partner */}
        <div className="mt-16 pt-10 border-t border-luxury-charcoal-light flex flex-col items-center space-y-4">
          <p className="text-luxury-white/40 text-xs uppercase tracking-widest">
            Official Logistics Partner
          </p>
          <div className="flex items-center space-x-4 px-6 py-3 border border-luxury-gold/30 bg-white/95">
            <Image
              src="/mp-logo.svg"
              alt="M&P Express Logistics"
              width={90}
              height={74}
              className="h-12 w-auto object-contain"
              style={{ width: 'auto' }}
            />
            <span className="text-gray-500 text-xs border-l border-gray-300 pl-4">Official Courier Partner</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-luxury-charcoal-light flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-luxury-white/60 text-sm">
            &copy; {new Date().getFullYear()} AmbsbyMaria. All rights
            reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-sm">
            <Link
              href="/privacy-policy"
              className="text-luxury-white/60 hover:text-luxury-gold transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/return-policy"
              className="text-luxury-white/60 hover:text-luxury-gold transition-colors duration-300"
            >
              Return Policy
            </Link>
            <Link
              href="/shipping-policy"
              className="text-luxury-white/60 hover:text-luxury-gold transition-colors duration-300"
            >
              Shipping Policy
            </Link>
            <Link
              href="/terms"
              className="text-luxury-white/60 hover:text-luxury-gold transition-colors duration-300"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
