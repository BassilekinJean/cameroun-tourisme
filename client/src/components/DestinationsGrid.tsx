import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MapPin, Clock, Users, Loader2 } from 'lucide-react';
import { getSitesTouristiques } from '../api/etablissementService';
import type { EtablissementListItem } from '../api/types';

interface DestinationsGridProps {
  onShowDetails?: (destination: any) => void;
}

export default function DestinationsGrid({ onShowDetails }: DestinationsGridProps) {
  const [destinations, setDestinations] = useState<EtablissementListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await getSitesTouristiques(0, 6);
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
        rating: destination.nombreFavoris,
        image: destination.photoProfile || (destination.images && destination.images[0]),
        category: 'Site Touristique'
      });
    }
  };
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl mb-2">Sites touristiques populaires</h2>
          <p className="text-gray-600">Découvrez les merveilles du Cameroun</p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-700" />
            <span className="ml-2 text-gray-600">Chargement des destinations...</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <div
                key={destination.publicId}
                onClick={() => handleShowDetails(destination)}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer group"
              >
                <div className="relative h-56 overflow-hidden">
                  <ImageWithFallback
                    src={destination.photoProfile || (destination.images && destination.images[0]) || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'}
                    alt={destination.nom}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-green-700 text-white px-3 py-1 rounded-full text-sm">
                    Site Touristique
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl mb-2">{destination.nom}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{destination.ville}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{destination.nombreFavoris} favoris</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {destination.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <button className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-800 transition w-full">
                      Voir plus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
