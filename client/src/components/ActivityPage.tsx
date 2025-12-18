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

  // Activités réelles du Cameroun : festivals, événements culturels, gastronomie
  const activities: Activity[] = [
    // ==================== FESTIVALS & ÉVÉNEMENTS CULTURELS ====================
    {
      id: 1,
      name: 'Festival du Ngondo',
      category: 'Culture',
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
      rating: 4.9,
      description: 'La fête traditionnelle Sawa inscrite au patrimoine UNESCO : courses de pirogues, danses traditionnelles, rites sacrés et immersion du vase sacré dans le fleuve Wouri',
      location: 'Douala, Région du Littoral',
      duration: '3 semaines (Novembre-Décembre)',
      participants: 'Plus de 200 000 visiteurs'
    },
    {
      id: 2,
      name: 'Festival Nguon des Bamouns',
      category: 'Culture',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      rating: 4.8,
      description: 'Festival biennal célébrant la culture Bamoun au Palais Royal de Foumban : danses royales, musique traditionnelle, exposition d\'art et célébration du Sultan',
      location: 'Foumban, Région de l\'Ouest',
      duration: '2 semaines (Décembre)',
      participants: '50 000+ visiteurs'
    },
    {
      id: 3,
      name: 'FENAC - Festival National des Arts et de la Culture',
      category: 'Culture',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      rating: 4.7,
      description: 'Événement biennal célébrant les talents artistiques des 10 régions du Cameroun : danses Bikutsi, Toupouri, Pygmées, musique, artisanat et gastronomie régionale',
      location: 'Différentes villes du Cameroun',
      duration: '1 semaine',
      participants: '100 000+ visiteurs'
    },
    {
      id: 4,
      name: 'Ascension du Mont Cameroun - Race of Hope',
      category: 'Aventure',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
      rating: 4.9,
      description: 'Course internationale d\'ascension du Mont Cameroun (4 095m), le plus haut sommet d\'Afrique de l\'Ouest, avec randonnées guidées à travers différents écosystèmes',
      location: 'Buéa, Région du Sud-Ouest',
      duration: '2-3 jours (Février)',
      participants: '500+ coureurs, 10 000 spectateurs'
    },
    // ==================== GASTRONOMIE CAMEROUNAISE ====================
    {
      id: 5,
      name: 'Atelier Cuisine Ndolé',
      category: 'Gastronomie',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      rating: 4.8,
      description: 'Apprenez à préparer le Ndolé, plat national camerounais à base de feuilles de vernonia, pâte d\'arachides, crevettes et viande - accompagné de miondo ou plantains',
      location: 'Douala, Région du Littoral',
      duration: '3-4 heures',
      participants: '4-12 personnes'
    },
    {
      id: 6,
      name: 'Dégustation Poulet DG et Eru',
      category: 'Gastronomie',
      image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800',
      rating: 4.9,
      description: 'Découverte des classiques camerounais : le célèbre Poulet DG (Directeur Général) aux plantains, l\'Eru du Sud-Ouest et les soya (brochettes de viande)',
      location: 'Yaoundé, Région du Centre',
      duration: '2-3 heures',
      participants: '2-20 personnes'
    },
    {
      id: 7,
      name: 'Route des Saveurs Bamiléké',
      category: 'Gastronomie',
      image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800',
      rating: 4.7,
      description: 'Circuit gastronomique : Kondré (ragoût de plantain à la chèvre), Nkui, Taro à la sauce jaune aux 30 épices, et Koki - spécialités de l\'Ouest Cameroun',
      location: 'Bafoussam, Région de l\'Ouest',
      duration: '1 journée',
      participants: '4-15 personnes'
    },
    {
      id: 8,
      name: 'Safari Poissons Braisés de Kribi',
      category: 'Gastronomie',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
      rating: 4.8,
      description: 'Expérience culinaire unique : poissons frais (bar, sole, maquereau) braisés au feu de bois avec épices locales sur les plages dorées de Kribi',
      location: 'Kribi, Région du Sud',
      duration: '4-5 heures',
      participants: '2-30 personnes'
    },
    // ==================== AVENTURE & NATURE ====================
    {
      id: 9,
      name: 'Safari au Parc National de Waza',
      category: 'Safari',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
      rating: 4.8,
      description: 'Observation de la faune africaine : lions, éléphants, girafes, antilopes et plus de 300 espèces d\'oiseaux dans la savane du Grand Nord camerounais',
      location: 'Waza, Région de l\'Extrême-Nord',
      duration: '1-2 jours',
      participants: '2-12 personnes'
    },
    {
      id: 10,
      name: 'Randonnée aux Chutes de la Lobé',
      category: 'Aventure',
      image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800',
      rating: 4.9,
      description: 'Découverte des seules chutes d\'eau au monde se jetant directement dans l\'océan - balade en pirogue, baignade et rencontre avec les pêcheurs Pygmées Bagyeli',
      location: 'Kribi, Région du Sud',
      duration: '4-6 heures',
      participants: '2-20 personnes'
    },
    {
      id: 11,
      name: 'Excursion Lac Nyos et Cratères',
      category: 'Aventure',
      image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800',
      rating: 4.6,
      description: 'Visite du mystérieux lac volcanique Nyos dans les hauts plateaux - paysages lunaires, villages traditionnels et histoire de la catastrophe de 1986',
      location: 'Wum, Région du Nord-Ouest',
      duration: '1-2 jours',
      participants: '4-10 personnes'
    },
    {
      id: 12,
      name: 'Trek Réserve de Biosphère du Dja',
      category: 'Safari',
      image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
      rating: 4.7,
      description: 'Exploration de la plus grande forêt tropicale protégée d\'Afrique (UNESCO) : primates, éléphants de forêt, rencontre avec les Pygmées Baka',
      location: 'Somalomo, Région de l\'Est',
      duration: '3-5 jours',
      participants: '4-8 personnes'
    },
    // ==================== SPORTS & LOISIRS ====================
    {
      id: 13,
      name: 'Sports Nautiques Plages de Kribi',
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=800',
      rating: 4.7,
      description: 'Surf, jet-ski, kayak, paddle et plongée dans les eaux cristallines de la Côte Sud camerounaise - location d\'équipement et moniteurs certifiés',
      location: 'Kribi, Région du Sud',
      duration: '2-6 heures',
      participants: '1-20 personnes'
    },
    {
      id: 14,
      name: 'Visite Chefferie Royale de Bafut',
      category: 'Culture',
      image: 'https://images.unsplash.com/photo-1590845947670-c009801ffa74?w=800',
      rating: 4.8,
      description: 'Découverte du Palais Royal Fondom de Bafut (site UNESCO tentative) : architecture traditionnelle, musée royal, danses Abakwa et audience avec le Fon',
      location: 'Bafut, Région du Nord-Ouest',
      duration: '3-4 heures',
      participants: '2-30 personnes'
    },
    {
      id: 15,
      name: 'Immersion Village Pygmée Baka',
      category: 'Culture',
      image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800',
      rating: 4.9,
      description: 'Séjour authentique avec les Pygmées Baka : techniques de chasse, médecine traditionnelle, danses rituelles et nuit en campement forestier',
      location: 'Forêt de l\'Est Cameroun',
      duration: '2-3 jours',
      participants: '4-8 personnes'
    }
  ];

  const categories = ['all', 'Culture', 'Aventure', 'Safari', 'Gastronomie', 'Sports'];

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