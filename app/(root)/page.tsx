import { DoctorsSection } from "@/components/web/Doctor"
import { HeroSection } from "@/components/web/Hero"
import Review from "@/components/web/review"
import Services from "@/components/web/Services"
import WhyChoose from "@/components/web/WhyChoose"

export default function Home() {
  return (
    <main className="m-0 p-0">
      <HeroSection />
      <Services />
      <WhyChoose/>
      <DoctorsSection />
      <Review/>
    </main>
  )
}