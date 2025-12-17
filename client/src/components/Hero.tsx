import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const carouselImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1615463668140-d294c94ec8ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcm9vbiUyMGxhbmRzY2FwZSUyMHNjZW5pY3xlbnwxfHx8fDE3NjQ0MDg4NzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Paysages du Cameroun'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1689479665413-e954e8a36240?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc2FmYXJpJTIwZWxlcGhhbnRzfGVufDF8fHx8MTc2NDQwODg3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Safari & Faune'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1559934302-e25c08c23a1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwYWZyaWNhfGVufDF8fHx8MTc2NDQwODg3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Plages de Kribi'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1590159247828-50db87c9228e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbW91bnRhaW4lMjBoa2ltaW5n8ZW58MXx8fHwxNzY0NDA4ODc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Mont Cameroun'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1704183683766-37137be69d4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd2F0ZXJmYWxsJTIwbmF0dXJlfGVufDF8fHx8MTc2NDQwODg3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Cascades & Nature'
  }
];

interface HeroProps {
  onSearch?: (query: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Carousel Background */}
      <div className="relative h-full">
        {carouselImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ImageWithFallback
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur-sm transition z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur-sm transition z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Search Bar Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4">
            Découvrez le Cameroun
          </h1>
          <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl">
            L'Afrique en miniature vous attend
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-3xl px-4">
          <div className="bg-white rounded-full shadow-2xl flex flex-col sm:flex-row items-center overflow-hidden">
            <div className="flex items-center flex-1 w-full pl-4 sm:pl-6">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Rechercher une destination, activité, hôtel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 py-4 sm:py-5 outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              className="bg-green-700 text-white px-8 sm:px-10 py-4 sm:py-5 hover:bg-green-800 transition w-full sm:w-auto"
            >
              Rechercher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}