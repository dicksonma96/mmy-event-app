import React from "react";
import Carousel from "../../component/Slider";

function Events() {
  const banners = [
    {
      title: "ONGOING EVENTS",
      layout: 1,
      showTitle: false,
      banners: [
        {
          name: "banner",
          img: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
          link: "https://www.google.com/",
        },
        {
          name: "banner",
          img: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
          link: "https://www.google.com/",
        },
        {
          name: "banner",
          img: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
          link: "https://www.google.com/",
        },
      ],
    },
    {
      title: "ONGOING EVENTS",
      layout: 2,
      showTitle: true,
      banners: [
        {
          name: "banner",
          img: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
          link: "https://www.google.com/",
        },
        {
          name: "banner",
          img: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
          link: "https://www.google.com/",
        },
        {
          name: "banner",
          img: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
          link: "https://www.google.com/",
        },
        {
          name: "banner",
          img: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
          link: "https://www.google.com/",
        },
      ],
    },
    {
      title: "YOU MAY ALSO INTERESTED",
      layout: 2,
      showTitle: true,
      banners: [
        {
          name: "banner",
          img: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
          link: "https://www.google.com/",
        },
        {
          name: "banner",
          img: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
          link: "https://www.google.com/",
        },
        {
          name: "banner",
          img: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
          link: "https://www.google.com/",
        },
        {
          name: "banner",
          img: "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg",
          link: "https://www.google.com/",
        },
      ],
    },
  ];

  return (
    <>
      {banners.map((info, index) => (
        <Carousel key={index} info={info} />
      ))}
    </>
  );
}

export default Events;
