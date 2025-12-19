import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MapPin, Clock, Users, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getSitesTouristiques } from '../api/etablissementService';
import type { EtablissementListItem } from '../api/types';

interface DestinationsGridProps {
  onShowDetails?: (destination: any) => void;
}

export default function DestinationsGrid({ onShowDetails }: DestinationsGridProps) {
  const [destinations, setDestinations] = useState<EtablissementListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Nombre d'éléments visibles selon la taille d'écran
  const getVisibleCount = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }
    return 3;
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleCount());

  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await getSitesTouristiques(0, 9);
        if (response.success && response.data) {
          setDestinations(response.data.content);
        } else {
          setError(response.message || 'Erreur lors du chargement des destinations');
        }
      } catch (err) {
        setError('Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const handleShowDetails = (destination: EtablissementListItem) => {
    if (onShowDetails) {
      onShowDetails({
        id: destination.publicId,
        name: destination.nom,
        type: 'destination',
        description: destination.description,
        location: destination.ville,
        rating: destination.rating || 0,
        image: destination.photoProfile || (destination.images && destination.images[0]),
        category: 'Site Touristique'
      });
    }
  };

  const maxIndex = Math.max(0, destinations.length - visibleCount);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  // Auto-slide
  useEffect(() => {
    if (destinations.length > visibleCount) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [destinations.length, visibleCount, maxIndex]);

  return (
    <section className="bg-gray-50 py-10 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl mb-1 sm:mb-2 font-bold">Sites touristiques populaires</h2>
            <p className="text-sm sm:text-base text-gray-600">Découvrez les merveilles du Cameroun</p>
          </div>
          {destinations.length > visibleCount && (
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8 sm:py-12">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-green-700" />
            <span className="ml-2 text-sm sm:text-base text-gray-600">Chargement...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && destinations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune destination disponible pour le moment.</p>
          </div>
        )}

        {!loading && !error && destinations.length > 0 && (
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
            >
              {destinations.map((destination) => (
                <div
                  key={destination.publicId}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <div
                    onClick={() => handleShowDetails(destination)}
                    className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer group h-full"
                  >
                    <div className="relative h-40 sm:h-48 lg:h-56 overflow-hidden">
                      <ImageWithFallback
                        src={destination.photoProfile || (destination.images && destination.images[0]) || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'}
                        alt={destination.nom}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-green-700 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
                        Site Touristique
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 lg:p-5">
                      <h3 className="text-base sm:text-lg lg:text-xl mb-1 sm:mb-2 line-clamp-1 font-semibold">{destination.nom}</h3>
                      
                      <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-4">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                          <span>{destination.ville}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                          <span>{destination.nombreFavoris} favoris</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3 sm:mb-4">
                        {destination.description}
                      </p>

                      <button className="bg-green-700 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm hover:bg-green-800 transition w-full">
                        Découvrir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Indicateurs */}
            {destinations.length > visibleCount && (
              <div className="flex justify-center gap-1.5 mt-4">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentIndex ? 'w-6 bg-green-600' : 'w-1.5 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}