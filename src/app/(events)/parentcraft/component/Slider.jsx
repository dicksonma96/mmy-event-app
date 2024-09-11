"use client";
import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

export default function Carousel({ info }) {
  const [isSliding, setIsSliding] = useState(false);
  let settings = {
    dots: info.layout == 1 ? true : false,
    infinite: info.layout == 1 ? true : false,
    speed: 500,
    slidesToShow: info.layout == 1 ? 1 : 1.1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: () => setIsSliding(true),
    afterChange: () => setIsSliding(false),
  };

  return (
    <div
      className="col carousel"
      style={{ width: info.layout == 1 ? "calc(100% + 1em)" : "100%" }}
    >
      {info.showTitle && <div className="section_title">{info.title}</div>}
      <Slider {...settings}>
        {info.banners.map((item, index) => (
          <Link
            key={index}
            href={isSliding ? "#" : item.link}
            onClick={(e) => isSliding && e.preventDefault()}
            className="slide"
            target="_blank"
          >
            <img src={item.img} />
          </Link>
        ))}
      </Slider>
    </div>
  );
}
