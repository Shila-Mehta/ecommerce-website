import "../css/HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero">
      <img
        src="assets/heroimage3.png"
        alt="hero background"
        className="hero-bg zoom-bg"
      />
      {/* <div className="hero-overlay"></div> */}

      <div className="hero-content">
        <h4 className="fade-up delay-1">Discover Premium Products</h4>
        <h1 className="fade-up delay-2">Style That Defines You</h1>
        <p className="fade-up delay-3">
          Shop the latest trends in fashion, curated to elevate your lifestyle.
          Experience quality, comfort, and elegance all in one place.
        </p>

        <div className="hero-buttons fade-up delay-4">
          <button className="hero-btn">✨ Shop Now</button>
          <button className="hero-btn-secondary">Learn More</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
