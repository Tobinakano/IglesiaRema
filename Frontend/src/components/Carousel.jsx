import { useState, useEffect } from "react";
import "../styles/carousel.css";

function Carousel() {
  const [current, setCurrent] = useState(0);
  const total = 5;

  const goTo = (index) => {
    setCurrent((index + total) % total);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="carousel-wrapper">
      <div className="carousel">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          <div className="carousel-slide">Imagen 1</div>
          <div className="carousel-slide">Imagen 2</div>
          <div className="carousel-slide">Imagen 3</div>
          <div className="carousel-slide">Imagen 4</div>
          <div className="carousel-slide">Imagen 5</div>
        </div>

        <button
          className="carousel-btn prev"
          onClick={() => goTo(current - 1)}
          aria-label="Anterior"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <button
          className="carousel-btn next"
          onClick={() => goTo(current + 1)}
          aria-label="Siguiente"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div className="carousel-dots">
        {[0, 1, 2, 3, 4].map((index) => (
          <button
            key={index}
            className={`dot ${current === index ? "active" : ""}`}
            onClick={() => goTo(index)}
            aria-label={`Ir a slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
