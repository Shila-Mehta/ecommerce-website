import "../css/Basis.css";
import "../css/NewArrivals.css";

const NewArrivals = () => {
  return (
    <section className="new-arrivals">
      <div className="overlay"></div>
      <div className="content">
        <h1>What’s New & What’s Next</h1>
        <h4>Trend-setting picks, straight from our latest drop.</h4>
        <p>
          Stay ahead of the curve with our new arrivals — the trendiest styles,
          freshest colors, and most-wanted pieces of the season.
        </p>
        <button className="cta">Discover More</button>
      </div>
    </section>
  );
};

export default NewArrivals;
