import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star, MapPin, Wifi, Coffee, Utensils, Car, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import BookingModal from './BookingModal';
import { getHotels } from '../api/etablissementService';
import type { EtablissementListItem } from '../api/types';

interface HotelsSectionProps {
  onShowDetails?: (hotel: any) => void;
}

const amenityIcons: { [key: string]: any } = {
  'Wifi': Wifi,
  'Restaurant': Utensils,
  'Parking': Car,
  'Petit-déjeuner': Coffee
};

export default function HotelsSection({ onShowDetails }: HotelsSectionProps) {
  const [hotels, setHotels] = useState<EtablissementListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await getHotels(0, 9);
        if (response.success && response.data) {
          setHotels(response.data.content);
        } else {
          setError(response.message || 'Erreur lors du chargement des hôtels');
        }
      } catch (err) {
        setError('Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleReserve = (hotel: EtablissementListItem) => {
    setSelectedHotel(hotel);
    setIsModalOpen(true);
  };

  const handleShowDetails = (hotel: EtablissementListItem) => {
    if (onShowDetails) {
      onShowDetails({
        id: hotel.publicId,
        name: hotel.nom,
        type: 'hotel',
        description: hotel.description,
        location: hotel.ville,
        rating: hotel.nombreFavoris,
        image: hotel.photoProfile || (hotel.images && hotel.images[0]),
        category: 'Hôtel'
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const maxIndex = Math.max(0, hotels.length - visibleCount);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  // Auto-slide
  useEffect(() => {
    if (hotels.length > visibleCount) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [hotels.length, visibleCount, maxIndex]);

  return (
    <section className="bg-white py-10 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl mb-1 sm:mb-2 font-bold">Hébergements recommandés</h2>
            <p className="text-sm sm:text-base text-gray-600">Séjournez dans les meilleurs établissements du Cameroun</p>
          </div>
          {hotels.length > visibleCount && (
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
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

        {!loading && !error && hotels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun hôtel disponible pour le moment.</p>
          </div>
        )}

        {!loading && !error && hotels.length > 0 && (
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
            >
              {hotels.map((hotel) => (
                <div
                  key={hotel.publicId}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition group border border-gray-100 h-full">
                    <div className="relative h-40 sm:h-48 lg:h-56 overflow-hidden">
                      <ImageWithFallback
                        src={hotel.photoProfile || (hotel.images && hotel.images[0]) || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
                        alt={hotel.nom}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-green-700 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
                        Hôtel
                      </div>
                      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{hotel.nombreFavoris}</span>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 lg:p-5">
                      <h3 className="text-base sm:text-lg lg:text-xl mb-1 sm:mb-2 font-semibold line-clamp-1">{hotel.nom}</h3>
                      
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        <span>{hotel.ville}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3 sm:mb-4">
                        {hotel.description}
                      </p>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleShowDetails(hotel)}
                          className="flex-1 bg-gray-100 text-gray-700 px-3 py-1.5 sm:py-2 rounded-full hover:bg-gray-200 transition text-xs sm:text-sm"
                        >
                          Détails
                        </button>
                        <button 
                          onClick={() => handleReserve(hotel)}
                          className="flex-1 bg-green-700 text-white px-3 py-1.5 sm:py-2 rounded-full hover:bg-green-800 transition text-xs sm:text-sm"
                        >
                          Réserver
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Indicateurs */}
            {hotels.length > visibleCount && (
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

      {selectedHotel && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          placeData={{
            name: selectedHotel.nom,
            category: 'hotels',
            location: selectedHotel.ville,
            image: selectedHotel.photoProfile || (selectedHotel.images && selectedHotel.images[0])
          }}
        />
      )}
    </section>
  );
}