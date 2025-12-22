import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star, Utensils, Music, TreePine, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

interface ActivitiesSectionProps {
  onCategoryClick: (category: string) => void;
}

const discoveries = [
  {
    id: 1,
    title: 'Gastronomie Camerounaise',
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    rating: 4.9,
    reviews: 412,
    category: 'Gastronomie',
    filterCategory: 'Gastronomie',
    description: 'Ndolè, Eru, Poulet DG, Koki... Découvrez les saveurs authentiques du Cameroun',
    icon: Utensils
  },
  {
    id: 2,
    title: 'Culture & Traditions',
    image: 'https://images.unsplash.com/photo-1660675134062-7d3bbb340608?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    rating: 4.8,
    reviews: 356,
    category: 'Culture',
    filterCategory: 'Culture',
    description: 'Festivals traditionnels, danses, artisanat et cérémonies ancestrales',
    icon: Music
  },
  {
    id: 3,
    title: 'Safari & Nature',
    image: 'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    rating: 4.9,
    reviews: 289,
    category: 'Safari',
    filterCategory: 'Safari',
    description: 'Parcs de Waza, réserve de Dja, forêt de Lobéké et faune sauvage',
    icon: TreePine
  },
  {
    id: 4,
    title: 'Histoire & Patrimoine',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    rating: 4.7,
    reviews: 198,
    category: 'Histoire',
    filterCategory: 'Histoire',
    description: 'Royaumes Bamoun et Bamiléké, musées, sites historiques et monuments',
    icon: BookOpen
  }
];

export default function ActivitiesSection({ onCategoryClick }: ActivitiesSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const maxIndex = discoveries.length - 1;

  const goToPrev = () => {
    setCurrentIndex(prev => (prev === 0 ? maxIndex : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev === maxIndex ? 0 : prev + 1));
  };

  // Card component réutilisable
  const DiscoveryCard = ({ discovery, size = 'normal' }: { discovery: typeof discoveries[0], size?: 'normal' | 'large' }) => {
    const IconComponent = discovery.icon;
    const isLarge = size === 'large';
    return (
      <div
        onClick={() => onCategoryClick(discovery.filterCategory)}
        className="group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border border-gray-100 hover:-translate-y-1"
      >
        <div className={`relative ${isLarge ? 'h-48 sm:h-56' : 'h-40 sm:h-48'} overflow-hidden`}>
          <ImageWithFallback
            src={discovery.image}
            alt={discovery.title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-green-800 shadow-sm">
              <IconComponent className="w-4 h-4" />
              {discovery.category}
            </span>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
            {discovery.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {discovery.description}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-800">{discovery.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({discovery.reviews} avis)</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
      <div className="mb-8 sm:mb-10 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3 font-bold text-gray-900">
          🇨🇲 Découvrez la Terre de nos Ancêtres
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
          Le Cameroun, l'Afrique en miniature : une mosaïque de cultures, de saveurs et de paysages uniques
        </p>
      </div>

      {/* Carrousel sur mobile */}
      {isMobile ? (
        <div className="relative">
          {/* Bouton précédent */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all -ml-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Carte active */}
          <div className="overflow-hidden px-6">
            <div 
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {discoveries.map((discovery) => (
                <div key={discovery.id} className="w-full flex-shrink-0 px-1">
                  <DiscoveryCard discovery={discovery} size="large" />
                </div>
              ))}
            </div>
          </div>

          {/* Bouton suivant */}
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all -mr-2"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicateurs */}
          <div className="flex justify-center gap-2 mt-4">
            {discoveries.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-green-600' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Grille sur desktop et tablette */
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {discoveries.map((discovery) => (
            <DiscoveryCard key={discovery.id} discovery={discovery} size="large" />
          ))}
        </div>
      )}

      {/* Citation culturelle */}
      <div className="mt-8 sm:mt-10 text-center">
        <div className="inline-block bg-gradient-to-r from-green-50 to-yellow-50 border border-green-100 rounded-2xl px-6 py-4 sm:px-8 sm:py-5">
          <p className="text-sm sm:text-base text-gray-700 italic">
            "Le Cameroun, c'est toute l'Afrique réunie en un seul pays"
          </p>
          <p className="text-xs sm:text-sm text-green-700 mt-1 font-medium">
            — Proverbe camerounais
          </p>
        </div>
      </div>
    </section>
  );
}