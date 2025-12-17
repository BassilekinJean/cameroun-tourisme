import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, MapPin, Star, Clock, Calendar, Users, Phone, 
  Mail, Globe, Share2, Heart, MessageCircle 
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import BookingModal from './BookingModal';
import AddReviewModal from './AddReviewModal';
import ReviewSection, { Review } from './ReviewSection';
import { User } from '../App';

export interface DetailsItem {
  id: number;
  name: string;
  category: 'hotels' | 'restaurants' | 'activities' | 'popular' | 'events';
  image: string;
  images?: string[]; // Galerie d'images
  rating: number;
  description: string;
  location: string;
  detailedDescription?: string;
  duration?: string;
  participants?: string;
  price?: string;
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  amenities?: string[];
  cuisine?: string;
  eventDate?: string;
}

interface DetailsPageProps {
  item: DetailsItem;
  onBack: () => void;
  currentUser: User | null;
  reviews: Review[];
  onAddReview: (placeId: string, placeName: string, rating: number, comment: string) => void;
}

export default function DetailsPage({ 
  item, 
  onBack, 
  currentUser, 
  reviews, 
  onAddReview 
}: DetailsPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Scroll vers le haut lors du chargement de la page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [item.id]);

  const allImages = item.images || [item.image];

  // Filtrer les avis pour cet élément
  const itemReviews = reviews.filter(review => review.placeId === item.id.toString());

  const getCategoryLabel = () => {
    const labels: Record<string, string> = {
      hotels: 'Hôtel',
      restaurants: 'Restaurant',
      activities: 'Activité',
      popular: 'Lieu populaire',
      events: 'Événement'
    };
    return labels[item.category] || 'Lieu';
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.name,
        text: item.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copier le lien
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-green-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="relative h-96">
                <ImageWithFallback
                  src={allImages[selectedImage]}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-3 rounded-full backdrop-blur-sm transition ${
                      isFavorite 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/90 text-gray-700 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-green-50 transition"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {allImages.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === index 
                          ? 'border-green-700' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <ImageWithFallback
                        src={img}
                        alt={`${item.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title and Category */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm mb-3">
                    {getCategoryLabel()}
                  </span>
                  <h1 className="text-4xl text-gray-900 mb-2">{item.name}</h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-5 h-5 text-green-700" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{item.rating}</span>
                      <span className="text-gray-500">({itemReviews.length} avis)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t pt-6">
                <h2 className="text-2xl text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed mb-4">{item.description}</p>
                {item.detailedDescription && (
                  <p className="text-gray-700 leading-relaxed">{item.detailedDescription}</p>
                )}
              </div>

              {/* Additional Info */}
              {(item.duration || item.participants || item.cuisine || item.eventDate) && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-2xl text-gray-900 mb-4">Informations pratiques</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.duration && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-green-700" />
                        <div>
                          <p className="text-sm text-gray-500">Durée</p>
                          <p className="font-semibold text-gray-900">{item.duration}</p>
                        </div>
                      </div>
                    )}
                    {item.participants && (
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-green-700" />
                        <div>
                          <p className="text-sm text-gray-500">Participants</p>
                          <p className="font-semibold text-gray-900">{item.participants}</p>
                        </div>
                      </div>
                    )}
                    {item.cuisine && (
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🍽️</span>
                        <div>
                          <p className="text-sm text-gray-500">Cuisine</p>
                          <p className="font-semibold text-gray-900">{item.cuisine}</p>
                        </div>
                      </div>
                    )}
                    {item.eventDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-green-700" />
                        <div>
                          <p className="text-sm text-gray-500">Date de l'événement</p>
                          <p className="font-semibold text-gray-900">{item.eventDate}</p>
                        </div>
                      </div>
                    )}
                    {item.openingHours && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-green-700" />
                        <div>
                          <p className="text-sm text-gray-500">Horaires</p>
                          <p className="font-semibold text-gray-900">{item.openingHours}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {item.amenities && item.amenities.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-2xl text-gray-900 mb-4">Équipements & Services</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {item.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-700">
                        <div className="w-2 h-2 bg-green-700 rounded-full"></div>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-gray-900">Avis des voyageurs</h2>
                <button
                  onClick={() => setIsAddReviewModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  Écrire un avis
                </button>
              </div>
              <ReviewSection
                placeId={item.id.toString()}
                placeName={item.name}
                reviews={itemReviews}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-32">
              {/* Price */}
              {item.price && (
                <div className="mb-6">
                  <p className="text-gray-600 text-sm mb-1">À partir de</p>
                  <p className="text-3xl text-green-700">{item.price}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-semibold"
                >
                  Réserver maintenant
                </button>
                <button
                  onClick={() => setIsAddReviewModalOpen(true)}
                  className="w-full py-3 border-2 border-green-700 text-green-700 rounded-lg hover:bg-green-50 transition font-semibold"
                >
                  Laisser un avis
                </button>
              </div>

              {/* Contact Information */}
              {(item.phone || item.email || item.website) && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
                  <div className="space-y-3">
                    {item.phone && (
                      <a
                        href={`tel:${item.phone}`}
                        className="flex items-center gap-3 text-gray-700 hover:text-green-700 transition"
                      >
                        <Phone className="w-5 h-5 text-green-700" />
                        <span>{item.phone}</span>
                      </a>
                    )}
                    {item.email && (
                      <a
                        href={`mailto:${item.email}`}
                        className="flex items-center gap-3 text-gray-700 hover:text-green-700 transition"
                      >
                        <Mail className="w-5 h-5 text-green-700" />
                        <span className="text-sm break-all">{item.email}</span>
                      </a>
                    )}
                    {item.website && (
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 hover:text-green-700 transition"
                      >
                        <Globe className="w-5 h-5 text-green-700" />
                        <span className="text-sm break-all">Site web</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Location Map Placeholder */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Localisation</h3>
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">{item.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          placeData={{
            name: item.name,
            category: item.category,
            location: item.location,
            image: item.image,
          }}
        />
      )}

      {/* Add Review Modal */}
      {isAddReviewModalOpen && (
        <AddReviewModal
          isOpen={isAddReviewModalOpen}
          onClose={() => setIsAddReviewModalOpen(false)}
          placeId={item.id.toString()}
          placeName={item.name}
          onAddReview={onAddReview}
        />
      )}
    </div>
  );
}