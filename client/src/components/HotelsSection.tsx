import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star, MapPin, Wifi, Coffee, Utensils, Car, Loader2 } from 'lucide-react';
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

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await getHotels(0, 6);
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

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl mb-2">Hôtels recommandés</h2>
          <p className="text-gray-600">Séjournez dans les meilleurs établissements du Cameroun</p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-700" />
            <span className="ml-2 text-gray-600">Chargement des hôtels...</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <div
                key={hotel.publicId}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition group border border-gray-200"
              >
                <div className="relative h-56 overflow-hidden">
                  <ImageWithFallback
                    src={hotel.photoProfile || (hotel.images && hotel.images[0]) || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
                    alt={hotel.nom}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-green-700 text-white px-3 py-1 rounded-full text-sm">
                    Hôtel
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{hotel.nombreFavoris} favoris</span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl mb-2">{hotel.nom}</h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 text-green-700" />
                    <span>{hotel.ville}</span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {hotel.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleShowDetails(hotel)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition text-sm"
                      >
                        Détails
                      </button>
                      <button 
                        onClick={() => handleReserve(hotel)}
                        className="bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-800 transition text-sm"
                      >
                        Réserver
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <button className="bg-green-700 text-white px-8 py-3 rounded-full hover:bg-green-800 transition">
            Voir tous les hôtels
          </button>
        </div>
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