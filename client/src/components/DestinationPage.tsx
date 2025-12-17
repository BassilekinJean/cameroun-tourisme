import React, { useState } from 'react';
import { Search, MapPin, Star, Clock, Calendar, Compass } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import BookingModal from './BookingModal';
import ReviewSection, { Review } from './ReviewSection';
import AddReviewModal from './AddReviewModal';
import { User } from '../App';
import { DetailsItem } from './DetailsPage';

interface DestinationPageProps {
  destination: string;
  onBackToHome: () => void;
  currentUser: User | null;
  reviews: Review[];
  onAddReview: (placeId: string, placeName: string, rating: number, comment: string) => void;
  onShowDetails?: (item: DetailsItem) => void;
}

type FilterCategory = 'all' | 'popular' | 'hotels' | 'restaurants' | 'events' | 'activities';

interface Place {
  id: number;
  name: string;
  category: FilterCategory;
  image: string;
  rating: number;
  description: string;
  location: string;
}

export default function DestinationPage({ destination, onBackToHome, currentUser, reviews, onAddReview, onShowDetails }: DestinationPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [selectedReviewPlace, setSelectedReviewPlace] = useState<Place | null>(null);

  const handleBookingClick = (place: Place) => {
    setSelectedPlace(place);
    setIsBookingModalOpen(true);
  };

  const handleAddReviewClick = (place: Place) => {
    setSelectedReviewPlace(place);
    setIsAddReviewModalOpen(true);
  };

  const handleDetailsClick = (place: Place) => {
    if (onShowDetails) {
      const detailsItem: DetailsItem = {
        id: place.id,
        name: place.name,
        category: place.category as 'hotels' | 'restaurants' | 'activities' | 'popular' | 'events',
        image: place.image,
        rating: place.rating,
        description: place.description,
        location: place.location,
        detailedDescription: `Explorez ${place.name}, l'un des joyaux de ${destination}. Un lieu unique qui combine authenticité et excellence pour une expérience mémorable.`,
        price: place.category === 'hotels' ? '50 000 FCFA/nuit' : place.category === 'restaurants' ? '15 000 FCFA' : '30 000 FCFA',
        phone: '+237 6 XX XX XX XX',
        email: 'contact@' + place.name.toLowerCase().replace(/\s+/g, '') + '.cm',
        openingHours: place.category === 'restaurants' ? '11h00 - 23h00' : '08h00 - 18h00',
        amenities: 
          place.category === 'hotels' ? ['WiFi gratuit', 'Piscine', 'Restaurant', 'Bar', 'Parking gratuit', 'Spa'] :
          place.category === 'restaurants' ? ['Terrasse', 'Climatisé', 'Wi-Fi', 'Parking', 'Service de livraison'] :
          place.category === 'activities' ? ['Guide inclus', 'Transport', 'Matériel fourni', 'Assurance'] :
          ['Guide touristique', 'Photos autorisées', 'Accessibilité'],
        cuisine: place.category === 'restaurants' ? 'Camerounaise et internationale' : undefined,
        eventDate: place.category === 'events' ? 'Du 15 au 20 Décembre 2025' : undefined,
      };
      onShowDetails(detailsItem);
    }
  };

  // Mock data for each destination
  const getPlacesData = (): Place[] => {
    return [
      // Lieux populaires
      {
        id: 1,
        name: 'Monument de la Réunification',
        category: 'popular',
        image: 'https://images.unsplash.com/photo-1703437872595-4b571ddcf72d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb251bWVudCUyMGxhbmRtYXJrJTIwdG91cmlzdHxlbnwxfHx8fDE3NjQ1NTEwODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.8,
        description: 'Symbole historique de l\'unité du Cameroun',
        location: 'Centre-ville'
      },
      {
        id: 2,
        name: 'Cathédrale Notre-Dame',
        category: 'popular',
        image: 'https://images.unsplash.com/photo-1615463669098-521a22047a1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxZYW91bmRlJTIwQ2FtZXJvb24lMjBjaXR5fGVufDF8fHx8MTc2NDU1MTA4MHww&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.7,
        description: 'Architecture coloniale magnifique',
        location: 'Quartier Mvolyé'
      },
      {
        id: 3,
        name: 'Musée National',
        category: 'popular',
        image: 'https://images.unsplash.com/photo-1615463669098-521a22047a1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxZYW91bmRlJTIwQ2FtZXJvb24lMjBjaXR5fGVufDF8fHx8MTc2NDU1MTA4MHww&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.5,
        description: 'Découvrez l\'histoire et la culture camerounaise',
        location: 'Avenue Foch'
      },
      // Hotels
      {
        id: 4,
        name: 'Hilton Hotel ' + destination,
        category: 'hotels',
        image: 'https://images.unsplash.com/photo-1738407282253-979e31f45785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHBvb2x8ZW58MXx8fHwxNzY0NDI5NDc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.9,
        description: 'Luxe et confort au cœur de la ville',
        location: 'Boulevard du 20 Mai'
      },
      {
        id: 5,
        name: 'Hôtel Mont Fébé',
        category: 'hotels',
        image: 'https://images.unsplash.com/photo-1738407282253-979e31f45785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHBvb2x8ZW58MXx8fHwxNzY0NDI5NDc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.6,
        description: 'Vue panoramique sur la ville',
        location: 'Mont Fébé'
      },
      {
        id: 6,
        name: 'Merina Hotel',
        category: 'hotels',
        image: 'https://images.unsplash.com/photo-1738407282253-979e31f45785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHBvb2x8ZW58MXx8fHwxNzY0NDI5NDc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.4,
        description: 'Confort et hospitalité camerounaise',
        location: 'Bastos'
      },
      // Restaurants
      {
        id: 7,
        name: 'Le Biniou',
        category: 'restaurants',
        image: 'https://images.unsplash.com/photo-1609792790758-0994786ad983?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwcmVzdGF1cmFudCUyMGZvb2R8ZW58MXx8fHwxNzY0NDQ5NjM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.7,
        description: 'Cuisine française et camerounaise raffinée',
        location: 'Bastos'
      },
      {
        id: 8,
        name: 'Chez Wou',
        category: 'restaurants',
        image: 'https://images.unsplash.com/photo-1609792790758-0994786ad983?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwcmVzdGF1cmFudCUyMGZvb2R8ZW58MXx8fHwxNzY0NDQ5NjM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.8,
        description: 'Spécialités chinoises authentiques',
        location: 'Centre-ville'
      },
      {
        id: 9,
        name: 'La Safouterie',
        category: 'restaurants',
        image: 'https://images.unsplash.com/photo-1609792790758-0994786ad983?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwcmVzdGF1cmFudCUyMGZvb2R8ZW58MXx8fHwxNzY0NDQ5NjM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.6,
        description: 'Cuisine locale traditionnelle',
        location: 'Mfoundi'
      },
      // Événements
      {
        id: 10,
        name: 'Festival de Ngondo',
        category: 'events',
        image: 'https://images.unsplash.com/photo-1761299167698-d2283f61a52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMGZlc3RpdmFsJTIwZXZlbnR8ZW58MXx8fHwxNzY0NDkwODc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.9,
        description: 'Célébration culturelle traditionnelle',
        location: 'Berge du Wouri'
      },
      {
        id: 11,
        name: 'Marché d\'Art de Bastos',
        category: 'events',
        image: 'https://images.unsplash.com/photo-1761299167698-d2283f61a52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMGZlc3RpdmFsJTIwZXZlbnR8ZW58MXx8fHwxNzY0NDkwODc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.5,
        description: 'Exposition d\'artisanat local',
        location: 'Bastos'
      },
      {
        id: 12,
        name: 'Concert au Palais des Sports',
        category: 'events',
        image: 'https://images.unsplash.com/photo-1761299167698-d2283f61a52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMGZlc3RpdmFsJTIwZXZlbnR8ZW58MXx8fHwxNzY0NDkwODc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.7,
        description: 'Concerts et spectacles en direct',
        location: 'Quartier Omnisport'
      },
      // Activités
      {
        id: 13,
        name: 'Randonnée Mont Fébé',
        category: 'activities',
        image: 'https://images.unsplash.com/photo-1763910496374-fe6a5b75c6f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwYWR2ZW50dXJlJTIwYWN0aXZpdHl8ZW58MXx8fHwxNzY0NTExMDI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.8,
        description: 'Trekking avec vue panoramique',
        location: 'Mont Fébé'
      },
      {
        id: 14,
        name: 'Visite du Parc National',
        category: 'activities',
        image: 'https://images.unsplash.com/photo-1763910496374-fe6a5b75c6f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwYWR2ZW50dXJlJTIwYWN0aXZpdHl8ZW58MXx8fHwxNzY0NTExMDI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.6,
        description: 'Découverte de la faune locale',
        location: 'Périphérie'
      },
      {
        id: 15,
        name: 'Tour Culturel de la Ville',
        category: 'activities',
        image: 'https://images.unsplash.com/photo-1763910496374-fe6a5b75c6f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwYWR2ZW50dXJlJTIwYWN0aXZpdHl8ZW58MXx8fHwxNzY0NTExMDI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.7,
        description: 'Exploration guidée des quartiers historiques',
        location: 'Centre-ville'
      },
    ];
  };

  const places = getPlacesData();

  const filteredPlaces = places.filter(place => {
    const matchesFilter = activeFilter === 'all' || place.category === activeFilter;
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         place.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterButtons = [
    { id: 'all', label: 'Tout', icon: Compass },
    { id: 'popular', label: 'Lieux populaires', icon: Star },
    { id: 'hotels', label: 'Hôtels', icon: MapPin },
    { id: 'restaurants', label: 'Restaurants', icon: Clock },
    { id: 'events', label: 'Événements en cours', icon: Calendar },
    { id: 'activities', label: 'Activités', icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-[350px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1615463668140-d294c94ec8ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcm9vbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjQ0MDU2MDF8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt={`${destination} paysage`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
            <button
              onClick={onBackToHome}
              className="text-white hover:text-green-300 transition flex items-center gap-2 mb-6"
            >
              ← Retour à l'accueil
            </button>
            <h1 className="text-white text-5xl md:text-6xl mb-4">
              {destination}
            </h1>
            <p className="text-white text-xl md:text-2xl">
              Découvrez les merveilles de {destination}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="bg-white shadow-sm border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            {/* Search Bar */}
            <div className="w-full max-w-3xl">
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher des lieux, hôtels, restaurants..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
                <button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      console.log('Recherche:', searchQuery);
                    }
                  }}
                  className="bg-green-700 text-white px-6 py-3 rounded-full hover:bg-green-800 transition-colors duration-200 whitespace-nowrap"
                >
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white shadow-sm border-b sticky top-32 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-3">
            {filterButtons.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as FilterCategory)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-200 ${
                    activeFilter === filter.id
                      ? 'bg-green-700 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-green-500 hover:text-green-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Places Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl text-gray-900 mb-3">
            {activeFilter === 'all' ? 'Tous les lieux' : filterButtons.find(f => f.id === activeFilter)?.label}
          </h2>
          
          {/* Search Results Display */}
          {searchQuery && (
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Résultats de recherche pour "<span className="text-gray-900">{searchQuery}</span>" à
              </p>
              <div className="inline-flex items-center bg-gray-200 rounded-full px-4 py-2">
                <MapPin className="w-4 h-4 text-green-700 mr-2" />
                <span className="text-green-700">{destination}</span>
              </div>
            </div>
          )}
          
          <p className="text-gray-600 mt-2">
            {filteredPlaces.length} {filteredPlaces.length > 1 ? 'résultats trouvés' : 'résultat trouvé'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative h-56 overflow-hidden">
                <ImageWithFallback
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm">{place.rating}</span>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-xl text-gray-900 mb-2">{place.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{place.description}</p>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{place.location}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleBookingClick(place)}
                    className="flex-1 bg-green-700 text-white py-2.5 rounded-lg hover:bg-green-800 transition-colors duration-200"
                  >
                    {place.category === 'hotels' && 'Réserver'}
                    {place.category === 'restaurants' && 'Réserver une table'}
                    {place.category === 'activities' && 'Réserver'}
                    {place.category === 'popular' && 'Réserver'}
                  </button>
                  <button
                    onClick={() => handleDetailsClick(place)}
                    className="px-4 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Détails
                  </button>
                </div>
                {currentUser && (
                  <button
                    onClick={() => handleAddReviewClick(place)}
                    className="mt-2 px-4 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Ajouter une évaluation
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredPlaces.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl text-gray-900 mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-600">
              Essayez de modifier votre recherche ou vos filtres
            </p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedPlace && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedPlace(null);
          }}
          placeData={{
            name: selectedPlace.name,
            category: selectedPlace.category as 'hotels' | 'restaurants' | 'activities' | 'popular',
            location: selectedPlace.location,
            image: selectedPlace.image,
          }}
        />
      )}

      {/* Add Review Modal */}
      {selectedReviewPlace && (
        <AddReviewModal
          isOpen={isAddReviewModalOpen}
          onClose={() => {
            setIsAddReviewModalOpen(false);
            setSelectedReviewPlace(null);
          }}
          placeName={selectedReviewPlace.name}
          placeId={selectedReviewPlace.id.toString()}
          onSubmit={(rating, comment) => {
            onAddReview(selectedReviewPlace.id.toString(), selectedReviewPlace.name, rating, comment);
          }}
        />
      )}

      {/* Review Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ReviewSection
          placeId="destination"
          placeName={destination}
          reviews={reviews}
          currentUser={currentUser}
          onAddReview={() => {
            // Avis générique pour la destination
            setSelectedReviewPlace({
              id: 0,
              name: destination,
              category: 'popular',
              image: '',
              rating: 0,
              description: '',
              location: ''
            });
            setIsAddReviewModalOpen(true);
          }}
        />
      </div>
    </div>
  );
}