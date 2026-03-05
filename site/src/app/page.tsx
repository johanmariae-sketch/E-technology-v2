import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryBanners from "@/components/CategoryBanners";
import ProductGrid from "@/components/Gallery";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CategoryBanners />
        <ProductGrid />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
