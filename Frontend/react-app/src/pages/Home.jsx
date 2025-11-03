import HeroSection from "../components/HeroSection";
import NavBarSection from "../components/NavBarSection";
import NewArrivals from "../components/NewArrivals";
import WhyShopWithUs from "../components/WhyShopWithUs";
import ProductsSection from "../components/ProductsSection";
import TestimonialSection from "../components/TestimonialSection";
import Footer from "../components/Footer";

const Home=()=>{
   return(
    <>
    <NavBarSection/>
    <HeroSection/>
    <WhyShopWithUs/>
    <NewArrivals/>
    <ProductsSection/>
    <TestimonialSection/>
    <Footer/>
    
    </>
   )
}


export  default Home;