import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

const Carousel = ({ slides, options, thumb3D }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi]);

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  return (
    <div className="embla swiper-no-swiping">
      <div className="embla__viewport" ref={emblaMainRef}>
        <div className="embla__container ">
          {slides.map((slide, index) => (
            <div
              className="embla__slide flex justify-center items-center"
              key={index}
            >
              <div
                className="max-h-[60svh] overflow-y-auto"
                onClick={
                  index === slides.length - 1 && thumb3D
                    ? stopPropagation
                    : undefined
                }
                onMouseDown={
                  index === slides.length - 1 && thumb3D
                    ? stopPropagation
                    : undefined
                }
                onMouseMove={
                  index === slides.length - 1 && thumb3D
                    ? stopPropagation
                    : undefined
                }
              >
                {slide}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="embla-thumbs">
        <div
          className="embla-thumbs__viewport bg-white rounded-box"
          ref={emblaThumbsRef}
        >
          <div className="embla-thumbs__container flex justify-center items-center">
            {slides.map((slide, index) => (
              <Thumb
                key={index}
                onClick={() => onThumbClick(index)}
                selected={index === selectedIndex}
                index={index}
                slide={index === slides.length - 1 && thumb3D ? thumb3D : slide}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Thumb = ({ selected, index, onClick, slide }) => {
  return (
    <div
      className={`embla-thumbs__slide ${
        selected ? "embla-thumbs__slide--selected" : ""
      }`}
    >
      <button
        onClick={onClick}
        type="button"
        className="embla-thumbs__slide__number max-h-16"
      >
        {slide}
      </button>
    </div>
  );
};

export default Carousel;
