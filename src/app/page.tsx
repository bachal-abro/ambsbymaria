import Hero from '@/components/home/Hero'
import FeaturedCollections from '@/components/home/FeaturedCollections'
import BrandStory from '@/components/home/BrandStory'
import CraftsmanshipSection from '@/components/home/CraftsmanshipSection'
import NewsletterSection from '@/components/home/NewsletterSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCollections />
      <BrandStory />
      <CraftsmanshipSection />
      <NewsletterSection />
    </>
  )
}
