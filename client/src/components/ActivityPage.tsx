import React, { useState } from 'react';
import { Search, MapPin, Star, Clock, Users, Compass, Plus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import BookingModal from './BookingModal';
import { User } from '../App';
import { Review } from './ReviewSection';
import { DetailsItem } from './DetailsPage';

interface ActivityPageProps {
  onBackToHome: () => void;
  onAddActivity: () => void;
  initialCategory?: string; // Catégorie initiale pour filtrer
  currentUser: User | null;
  reviews: Review[];
  onAddReview: (placeId: string, placeName: string, rating: number, comment: string) => void;
  onShowDetails?: (item: DetailsItem) => void;
}

interface Activity {
  id: number;
  name: string;
  category: string;
  image: string;
  rating: number;
  description: string;
  location: string;
  duration: string;
  participants: string;
}

export default function ActivityPage({ onBackToHome, onAddActivity, initialCategory = 'all', currentUser, reviews, onAddReview, onShowDetails }: ActivityPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleBookingClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsBookingModalOpen(true);
  };

  const handleDetailsClick = (activity: Activity) => {
    if (onShowDetails) {
      const detailsItem: DetailsItem = {
        id: activity.id,
        name: activity.name,
        category: 'activities',
        image: activity.image,
        rating: activity.rating,
        description: activity.description,
        location: activity.location,
        duration: activity.duration,
        participants: activity.participants,
        detailedDescription: `Vivez une expérience inoubliable avec ${activity.name}. Cette activité vous permettra de découvrir le Cameroun sous un angle unique et authentique.`,
        price: '45 000 FCFA',
        phone: '+237 6 XX XX XX XX',
        email: 'info@camertrip.cm',
        amenities: ['Guide professionnel', 'Équipement fourni', 'Assurance incluse', 'Transport depuis l\'hôtel']
      };
      onShowDetails(detailsItem);
    }
  };

  const activities: Activity[] = [
    {
      id: 1,
      name: 'Ascension du Mont Cameroun',
      category: 'Aventure',
      image: 'https://images.unsplash.com/photo-1603741614953-4187ed84cc50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWtpbmclMjBtb3VudGFpbiUyMGFkdmVudHVyZXxlbnwxfHx8fDE3NjQ1ODE5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.9,
      description: 'Randonnée guidée vers le sommet du Mont Cameroun, le point culminant de l\'Afrique de l\'Ouest',
      location: 'Buéa, Région du Sud-Ouest',
      duration: '2-3 jours',
      participants: '4-12 personnes'
    },
    {
      id: 2,
      name: 'Safari au Parc National de Waza',
      category: 'Safari',
      image: 'https://images.unsplash.com/photo-1729359035276-189519a4b072?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWZhcmklMjB3aWxkbGlmZSUyMEFmcmljYXxlbnwxfHx8fDE3NjQ2Nzk5NTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      description: 'Observation de la faune sauvage : lions, éléphants, girafes et antilopes dans leur habitat naturel',
      location: 'Waza, Région de l\'Extrême-Nord',
      duration: '1 journée',
      participants: '2-8 personnes'
    },
    {
      id: 3,
      name: 'Sports nautiques à Kribi',
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1561467314-8865a7402291?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMHNwb3J0cyUyMGJlYWNofGVufDF8fHx8MTc2NDY2Nzk1NHww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.7,
      description: 'Surf, jet-ski, kayak et plongée sous-marine sur les magnifiques plages de Kribi',
      location: 'Kribi, Région du Sud',
      duration: '4-6 heures',
      participants: '1-20 personnes'
    },
    {
      id: 4,
      name: 'Spectacle de danses traditionnelles',
      category: 'Culture',
      image: 'https://images.unsplash.com/photo-1751708692623-44fe44b6bcff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMGRhbmNlJTIwQWZyaWNhfGVufDF8fHx8MTc2NDY3OTk1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.9,
      description: 'Immersion culturelle avec spectacle de danses et musiques traditionnelles camerounaises',
      location: 'Foumban, Région de l\'Ouest',
      duration: '2-3 heures',
      participants: '10-50 personnes'
    },
    {
      id: 5,
      name: 'Visite des marchés locaux',
      category: 'Culture',
      image: 'https://images.unsplash.com/photo-1650499311129-5dc75c1038e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMG1hcmtldCUyMEFmcmljYW58ZW58MXx8fHwxNzY0Njc5OTU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.6,
      description: 'Découverte des marchés traditionnels : artisanat, épices et produits locaux',
      location: 'Yaoundé, Centre',
      duration: '3-4 heures',
      participants: '2-15 personnes'
    },
    {
      id: 6,
      name: 'Camping en forêt tropicale',
      category: 'Aventure',
      image: 'https://images.unsplash.com/photo-1666599972599-7350e0c75479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1waW5nJTIwbmF0dXJlJTIwb3V0ZG9vcnxlbnwxfHx8fDE3NjQ2Nzk5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      description: 'Nuit en pleine nature au cœur de la forêt équatoriale avec guide expérimenté',
      location: 'Parc National de Campo Ma\'an',
      duration: '2 jours',
      participants: '4-10 personnes'
    }
  ];

  const categories = ['all', 'Aventure', 'Safari', 'Sports', 'Culture'];

  const filteredActivities = activities.filter(activity => {
    const matchesCategory = activeCategory === 'all' || activity.category === activeCategory;
    const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <button
            onClick={onBackToHome}
            className="text-white hover:text-green-100 transition flex items-center gap-2 mb-6"
          >
            ← Retour à l'accueil
          </button>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Compass className="w-10 h-10" />
                <h1 className="text-5xl">Activités au Cameroun</h1>
              </div>
              <p className="text-xl text-green-100 max-w-2xl">
                Découvrez les meilleures activités et expériences à vivre au Cameroun
              </p>
            </div>
            <button
              onClick={onAddActivity}
              className="bg-white text-green-700 px-6 py-3 rounded-full hover:bg-green-50 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter une activité
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-sm border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une activité..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-green-700 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-green-500 hover:text-green-700'
                }`}
              >
                {category === 'all' ? 'Toutes les activités' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl text-gray-900 mb-2">
            {activeCategory === 'all' ? 'Toutes les activités' : `Activités - ${activeCategory}`}
          </h2>
          <p className="text-gray-600">
            {filteredActivities.length} {filteredActivities.length > 1 ? 'activités disponibles' : 'activité disponible'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative h-56 overflow-hidden">
                <ImageWithFallback
                  src={activity.image}
                  alt={activity.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-green-700 text-white px-3 py-1 rounded-full text-sm">
                  {activity.category}
                </div>
                <div className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm">{activity.rating}</span>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-xl text-gray-900 mb-2">{activity.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{activity.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-green-600" />
                    <span>{activity.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-2 text-green-600" />
                    <span>{activity.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Users className="w-4 h-4 mr-2 text-green-600" />
                    <span>{activity.participants}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleBookingClick(activity)}
                    className="flex-1 bg-green-700 text-white py-2.5 rounded-lg hover:bg-green-800 transition-colors duration-200"
                  >
                    Réserver
                  </button>
                  <button
                    onClick={() => handleDetailsClick(activity)}
                    className="px-4 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl text-gray-900 mb-2">Aucune activité trouvée</h3>
            <p className="text-gray-600">
              Essayez de modifier votre recherche ou vos filtres
            </p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedActivity && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedActivity(null);
          }}
          placeData={{
            name: selectedActivity.name,
            category: 'activities',
            location: selectedActivity.location,
            image: selectedActivity.image,
          }}
        />
      )}
    </div>
  );
}