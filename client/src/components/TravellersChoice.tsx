import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Award, Star } from 'lucide-react';
import BookingModal from './BookingModal';

interface TravellersChoiceProps {
  onShowDetails?: (destination: any) => void;
}

const topDestinations = [
  {
    id: 1,
    name: 'Réserve de Faune du Dja',
    rating: 5.0,
    reviews: 587,
    image: 'https://images.unsplash.com/photo-1633716898262-0e1469d55bb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWluZm9yZXN0JTIwd2F0ZXJmYWxsfGVufDF8fHx8MTc2NDM5NDI3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Best of the Best'
  },
  {
    id: 2,
    name: 'Plages de Kribi',
    rating: 4.9,
    reviews: 892,
    image: 'https://images.unsplash.com/photo-1711802536820-186e24f0665a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYmVhY2glMjBzdW5zZXR8ZW58MXx8fHwxNzY0NDA1NjAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Best of the Best'
  },
  {
    id: 3,
    name: 'Mont Cameroun',
    rating: 4.8,
    reviews: 456,
    image: 'https://images.unsplash.com/photo-1591803026220-6385999e82b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbW91bnRhaW58ZW58MXx8fHwxNzY0NDA1NjAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Top Rated'
  },
  {
    id: 4,
    name: 'Parc National de Waza',
    rating: 4.9,
    reviews: 721,
    image: 'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWZhcmklMjBhbmltYWxzfGVufDF8fHx8MTc2NDMyMjEzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Best of the Best'
  }
];

export default function TravellersChoice({ onShowDetails }: TravellersChoiceProps) {
  const [selectedDestination, setSelectedDestination] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowDetails = (destination: any) => {
    setSelectedDestination(destination);
    setIsModalOpen(true);
    if (onShowDetails) {
      onShowDetails(destination);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-12 h-12 text-yellow-400" />
            <h2 className="text-4xl">Prix Travellers' Choice</h2>
          </div>
          <p className="text-xl text-green-100">Best of the Best 2024</p>
          <p className="text-green-200 mt-2">
            Les destinations les plus appréciées au Cameroun, selon nos voyageurs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topDestinations.map((destination, index) => (
            <div
              key={destination.id}
              className="relative group cursor-pointer"
              onClick={() => handleShowDetails(destination)}
            >
              <div className="relative h-72 rounded-xl overflow-hidden">
                <ImageWithFallback
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="absolute top-4 left-4 bg-yellow-400 text-green-900 px-3 py-1 rounded-full text-sm">
                    #{index + 1}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="mb-2">
                      <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                        {destination.badge}
                      </span>
                    </div>
                    <h3 className="text-xl mb-2">{destination.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(destination.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm">{destination.rating}</span>
                      <span className="text-sm text-gray-300">
                        ({destination.reviews} avis)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-white text-green-900 px-8 py-3 rounded-full hover:bg-gray-100 transition">
            Voir toutes les destinations primées
          </button>
        </div>
      </div>
      
      {selectedDestination && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          placeData={{
            name: selectedDestination.name,
            category: 'popular',
            location: 'Cameroun',
            image: selectedDestination.image
          }}
        />
      )}
    </section>
  );
}