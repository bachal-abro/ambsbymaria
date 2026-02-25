'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, Twitter } from 'lucide-react'

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
    { name: 'Shipping & Returns', href: '/support/shipping' },
    { name: 'Size Guide', href: '/support/size-guide' },
    { name: 'Care Instructions', href: '/support/care' },
    { name: 'FAQ', href: '/support/faq' },
  ],
}

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
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
              Crafting timeless elegance since 1925. Each piece tells a story of
              unparalleled craftsmanship and luxury.
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

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-luxury-charcoal-light flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-luxury-white/60 text-sm">
            &copy; {new Date().getFullYear()} AmbsbyMaria. All rights
            reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link
              href="/privacy"
              className="text-luxury-white/60 hover:text-luxury-gold transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-luxury-white/60 hover:text-luxury-gold transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
