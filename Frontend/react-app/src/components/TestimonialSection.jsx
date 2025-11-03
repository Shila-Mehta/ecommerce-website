import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/Basis.css";
import "../css/TestimonialSection.css";

// Custom Arrows
const NextArrow = ({ onClick }) => <div className="arrow next" onClick={onClick}>➡</div>;
const PrevArrow = ({ onClick }) => <div className="arrow prev" onClick={onClick}>⬅</div>;

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);

  // Fetch testimonials from backend
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/testimonials"); // call your backend
        const data = await res.json();
        setTestimonials(data);
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      }
    };

    fetchTestimonials();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="testimonials">
      <h2>What Our Customers Say</h2>
      {testimonials.length > 0 ? (
        <Slider {...settings}>
          {testimonials.map((t) => (
            <div key={t._id} className="testimonial-card">
              <img src={`http://localhost:5000/uploads/${t.image}`} alt={t.customerName} />
              <p className="testimonial-text">“{t.comment}”</p>
              <h4 className="testimonial-name">- {t.name}</h4>
            </div>
          ))}
        </Slider>
      ) : (
        <p>Loading testimonials...</p>
      )}
    </div>
  );
};

export default TestimonialsSection;
