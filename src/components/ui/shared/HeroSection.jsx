import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function HeroSection() {
  return (
    <>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Grievance Portal</h1>
          <p className="text-xl mb-8">Empowering voices, resolving issues, and building trust in our community.</p>
          <Link to="/submit"><Button className="bg-black hover:bg-[#222222] text-[#FFFFFF]" size="lg">
            File a Grievance
          </Button></Link>
        </div>
      </section>
    </>
  )
}

