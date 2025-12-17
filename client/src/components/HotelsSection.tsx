import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star, MapPin, Wifi, Coffee, Utensils, Car } from 'lucide-react';
import BookingModal from './BookingModal';

interface HotelsSectionProps {
  onShowDetails?: (hotel: any) => void;
}

const hotels = [
  {
    id: 1,
    name: 'Hilton Yaoundé',
    location: 'Yaoundé, Centre',
    stars: 5,
    rating: 4.8,
    reviews: 342,
    price: '85 000 FCFA',
    image: 'https://images.unsplash.com/photo-1729673766770-83160c576668?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJlc29ydHxlbnwxfHx8fDE3NjU4NjUxMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    amenities: ['Wifi', 'Restaurant', 'Piscine', 'Parking'],
    category: 'Luxe'
  },
  {
    id: 2,
    name: 'Seme Beach Hotel',
    location: 'Kribi, Littoral',
    stars: 4,
    rating: 4.6,
    reviews: 278,
    price: '65 000 FCFA',
    image: 'https://images.unsplash.com/photo-1559235196-7a82724ca9a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGhvdGVsJTIwdHJvcGljYWx8ZW58MXx8fHwxNzY1OTQ2OTkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    amenities: ['Wifi', 'Restaurant', 'Plage privée', 'Spa'],
    category: 'Balnéaire'
  },
  {
    id: 3,
    name: 'Hôtel Azur',
    location: 'Douala, Littoral',
    stars: 4,
    rating: 4.5,
    reviews: 195,
    price: '55 000 FCFA',
    image: 'https://images.unsplash.com/photo-1654355628827-860147b38be3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc2NTk0NDc2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    amenities: ['Wifi', 'Restaurant', 'Bar', 'Parking'],
    category: 'Business'
  },
  {
    id: 4,
    name: 'La Résidence Boutique',
    location: 'Bafoussam, Ouest',
    stars: 4,
    rating: 4.7,
    reviews: 156,
    price: '48 000 FCFA',
    image: 'https://images.unsplash.com/photo-1649731000184-7ced04998f44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGhvdGVsfGVufDF8fHx8MTc2NTg1MjgyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    amenities: ['Wifi', 'Petit-déjeuner', 'Jardin', 'Parking'],
    category: 'Boutique'
  },
  {
    id: 5,
    name: 'Hotel Prince de Galles',
    location: 'Yaoundé, Centre',
    stars: 4,
    rating: 4.4,
    reviews: 223,
    price: '60 000 FCFA',
    image: 'https://images.unsplash.com/photo-1668393986849-f6d13594410e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHBvb2wlMjB2aWV3fGVufDF8fHx8MTc2NTg3MjE4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    amenities: ['Wifi', 'Restaurant', 'Piscine', 'Gym'],
    category: 'Confort'
  },
  {
    id: 6,
    name: 'Hotel Mermoz',
    location: 'Douala, Littoral',
    stars: 5,
    rating: 4.9,
    reviews: 410,
    price: '95 000 FCFA',
    image: 'https://images.unsplash.com/photo-1632598024410-3d8f24daab57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHN1aXRlJTIwcm9vbXxlbnwxfHx8fDE3NjU4NjAwNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    amenities: ['Wifi', 'Restaurant', 'Spa', 'Parking'],
    category: 'Premium'
  }
];

const amenityIcons: { [key: string]: any } = {
  'Wifi': Wifi,
  'Restaurant': Utensils,
  'Parking': Car,
  'Petit-déjeuner': Coffee
};

export default function HotelsSection({ onShowDetails }: HotelsSectionProps) {
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReserve = (hotel: any) => {
    setSelectedHotel(hotel);
    setIsModalOpen(true);
  };

  const handleShowDetails = (hotel: any) => {
    if (onShowDetails) {
      onShowDetails({
        id: hotel.id.toString(),
        name: hotel.name,
        type: 'hotel',
        description: `${hotel.name} est un hôtel ${hotel.category.toLowerCase()} situé à ${hotel.location}. Cet établissement ${hotel.stars} étoiles offre un excellent rapport qualité-prix et dispose de nombreux équipements pour rendre votre séjour agréable.`,
        location: hotel.location,
        price: hotel.price,
        rating: hotel.rating,
        reviews: hotel.reviews,
        image: hotel.image,
        amenities: hotel.amenities,
        category: hotel.category
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition group border border-gray-200"
            >
              <div className="relative h-56 overflow-hidden">
                <ImageWithFallback
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-4 left-4 bg-green-700 text-white px-3 py-1 rounded-full text-sm">
                  {hotel.category}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                  {[...Array(hotel.stars)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl mb-2">{hotel.name}</h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 text-green-700" />
                  <span>{hotel.location}</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{hotel.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({hotel.reviews} avis)
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.amenities.slice(0, 4).map((amenity, index) => {
                    const Icon = amenityIcons[amenity] || Wifi;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-700"
                      >
                        <Icon className="w-3 h-3" />
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">À partir de</p>
                    <p className="text-green-700">{hotel.price}</p>
                    <p className="text-xs text-gray-400">par nuit</p>
                  </div>
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
            name: selectedHotel.name,
            category: selectedHotel.category,
            location: selectedHotel.location,
            image: selectedHotel.image
          }}
        />
      )}
    </section>
  );
}