'use client'

import { motion } from 'framer-motion'

const features = [
    {
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-14 h-14"
                aria-hidden="true"
            >
                {/* Money bag */}
                <path d="M32 8c-4 0-8 3-8 7 0 2 1 4 3 5.5C18 23 12 30 12 38c0 10 9 18 20 18s20-8 20-18c0-8-6-15-15-17.5C39 19 40 17 40 15c0-4-4-7-8-7z" />
                <path d="M26 12 l6-6 6 6" />
                <text x="32" y="42" textAnchor="middle" fontSize="14" fontFamily="serif" stroke="none" fill="currentColor" fontWeight="bold">$</text>
            </svg>
        ),
        title: 'BEST PRICE!',
        description:
            "Beautiful designs deserve the best finish! That's our value for money promise: You can't find better quality for lower price anywhere else!",
    },
    {
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-14 h-14"
                aria-hidden="true"
            >
                {/* Diamond/Gem Icon */}
                <path d="M12 24 L32 8 L52 24 L32 56 Z" />
                <path d="M12 24 L52 24" />
                <path d="M22 24 L32 8 L42 24" />
                <path d="M22 24 L32 56 L42 24" />
            </svg>
        ),
        title: 'QUALITY YOU CAN TRUST',
        description:
            'Our jewelry is carefully crafted using high-quality materials to ensure a beautiful finish and long-lasting shine.',
    },
    {
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-14 h-14"
                aria-hidden="true"
            >
                {/* Delivery truck */}
                <rect x="4" y="18" width="36" height="26" rx="2" />
                <path d="M40 28h10l8 10v8H40V28z" />
                <circle cx="14" cy="48" r="5" />
                <circle cx="50" cy="48" r="5" />
                <line x1="4" y1="32" x2="40" y2="32" />
                {/* FREE tag */}
                <rect x="8" y="22" width="16" height="8" rx="1" strokeWidth="1.5" />
                <text x="16" y="29" textAnchor="middle" fontSize="6" stroke="none" fill="currentColor" fontWeight="bold">FREE</text>
            </svg>
        ),
        title: 'FREE SHIPPING',
        description:
            'We offer free delivery above order value of Rs 2500/- via M&P. Our Official Logistic Partner! ',
    },
]

export default function FeaturesBanner() {
    return (
        <section className="w-full bg-white border-t border-gray-100">
            <div className="luxury-container py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.5, delay: index * 0.12 }}
                            className="flex items-start gap-5 px-6 py-8 md:py-4 first:pl-0 last:pr-0"
                        >
                            {/* Icon */}
                            <div className="flex-shrink-0 text-gray-800">
                                {feature.icon}
                            </div>

                            {/* Text */}
                            <div>
                                <h3 className="font-bold text-sm text-gray-900 tracking-wide mb-2 uppercase">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
