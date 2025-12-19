import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Hotel, Utensils, Compass, Grid3X3, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const carouselImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1615463668140-d294c94ec8ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    title: 'Paysages du Cameroun',
    subtitle: 'Découvrez des panoramas à couper le souffle'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1689479665413-e954e8a36240?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    title: 'Safari & Faune',
    subtitle: 'Rencontrez la faune sauvage africaine'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1559934302-e25c08c23a1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    title: 'Plages de Kribi',
    subtitle: 'Détendez-vous sur nos plages paradisiaques'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    title: 'Mont Cameroun',
    subtitle: "Aventurez-vous sur le toit de l'Afrique de l'Ouest"
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1704183683766-37137be69d4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
    title: 'Cascades & Nature',
    subtitle: 'Explorez nos merveilles naturelles'
  }
];

// Types pour les catégories de recherche
type SearchCategory = 'all' | 'hotels' | 'restaurants' | 'activities';

interface HeroProps {
  onSearch?: (query: string, category?: SearchCategory) => void;
}

// Configuration des onglets style TripAdvisor
const searchTabs = [
  { value: 'all' as SearchCategory, label: 'Tout rechercher', icon: Grid3X3, placeholder: 'Rechercher destination, hôtel, restaurant...' },
  { value: 'hotels' as SearchCategory, label: 'Hôtels', icon: Hotel, placeholder: 'Où souhaitez-vous séjourner ?' },
  { value: 'restaurants' as SearchCategory, label: 'Restaurants', icon: Utensils, placeholder: 'Trouver un restaurant...' },
  { value: 'activities' as SearchCategory, label: 'Activités', icon: Compass, placeholder: 'Que voulez-vous faire ?' },
];

export default function Hero({ onSearch }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchCategory>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery.trim(), activeTab);
    }
  };

  const handleTabChange = (tab: SearchCategory) => {
    setActiveTab(tab);
    setSearchQuery('');
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

  const currentTab = searchTabs.find(tab => tab.value === activeTab) || searchTabs[0];

  return (
    <div className="relative h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] overflow-hidden">
      {/* Carousel Background */}
      <div className="absolute inset-0">
        {carouselImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <ImageWithFallback
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 rounded-full backdrop-blur-md transition z-10 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 rounded-full backdrop-blur-md transition z-10 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6">
        {/* Title Section */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
            Découvrez le <span className="text-emerald-400">Cameroun</span>
          </h1>
          <p className="text-white/90 text-base sm:text-lg md:text-xl lg:text-2xl drop-shadow-md max-w-2xl mx-auto">
            L'Afrique en miniature vous ouvre ses portes
          </p>
        </div>

        {/* Search Box - Style TripAdvisor */}
        <div className="w-full max-w-3xl">
          {/* Search Card */}
          <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
            isSearchFocused ? 'ring-4 ring-emerald-500/30 shadow-emerald-500/20' : ''
          }`}>
            {/* Tabs */}
            <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
              {searchTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => handleTabChange(tab.value)}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium whitespace-nowrap transition-all relative ${
                      isActive 
                        ? 'text-emerald-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-emerald-600' : ''}`} />
                    <span className="hidden sm:inline">{tab.label}</span>
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {activeTab === 'all' ? (
                      <Search className="w-5 h-5" />
                    ) : (
                      <MapPin className="w-5 h-5" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder={currentTab.placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full pl-12 pr-4 py-3.5 sm:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-gray-700 placeholder-gray-400 text-base transition"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl hover:bg-emerald-700 transition font-medium flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40"
                >
                  <Search className="w-5 h-5" />
                  <span>Rechercher</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
            <span className="text-white/70 text-sm">Populaire:</span>
            {['Yaoundé', 'Douala', 'Kribi', 'Limbé'].map((city) => (
              <button
                key={city}
                onClick={() => {
                  setSearchQuery(city);
                  if (onSearch) onSearch(city, activeTab);
                }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm rounded-full transition border border-white/20"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Info & Dots */}
      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 px-4">
        <div className="max-w-7xl mx-auto flex items-end justify-between">
          {/* Current Slide Info */}
          <div className="hidden md:block text-white">
            <h3 className="text-lg font-semibold mb-1 drop-shadow-md">
              {carouselImages[currentSlide].title}
            </h3>
            <p className="text-white/80 text-sm drop-shadow-md">
              {carouselImages[currentSlide].subtitle}
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-2 mx-auto md:mx-0">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all rounded-full ${
                  index === currentSlide 
                    ? 'bg-white w-8 h-2' 
                    : 'bg-white/40 hover:bg-white/60 w-2 h-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
