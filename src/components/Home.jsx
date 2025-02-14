import React from 'react'
import Navbar from './ui/shared/Navbar'
import HeroSection from './ui/shared/HeroSection';
import Slider from './ui/shared/Slider';
import Footer from './ui/shared/Footer';

function Home() {
  return (
    <div>
        <Navbar/>
        <HeroSection/>
        <Slider/>
        <Footer/>
    </div>
  )
}

export default Home