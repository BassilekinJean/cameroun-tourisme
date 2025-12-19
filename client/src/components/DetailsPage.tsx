import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, MapPin, Star, Clock, Calendar, Users, Phone, 
  Mail, Globe, Share2, Heart, MessageCircle, Loader2, HeartOff,
  X, Copy, Check, Facebook, Twitter, Linkedin, Link2
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import BookingModal from './BookingModal';
import AddReviewModal from './AddReviewModal';
import ReviewSection, { Review } from './ReviewSection';
import GoogleMap from './GoogleMap';
import type { User } from '../api/types';
import { getEtablissementById } from '../api/etablissementService';
import { getAvisByEtablissement } from '../api/avisService';
import { toggleFavori } from '../api/userService';

export interface DetailsItem {
  id: string | number;
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
  // Localisation GPS
  latitude?: number;
  longitude?: number;
}

interface DetailsPageProps {
  item: DetailsItem;
  onBack: () => void;
  currentUser: User | null;
  reviews: Review[];
  onAddReview: (placeId: string, placeName: string, rating: number, comment: string) => void;
  onOpenAuthModal?: () => void;
  onUpdateUser?: (user: User) => void;
}

export default function DetailsPage({ 
  item, 
  onBack, 
  currentUser, 
  reviews, 
  onAddReview,
  onOpenAuthModal,
  onUpdateUser
}: DetailsPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  
  // État pour les avis chargés depuis l'API
  const [apiReviews, setApiReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Fonction pour charger les avis depuis l'API
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await getAvisByEtablissement(item.id.toString(), 0, 50, 'dateCreation', 'desc');
      if (response.success && response.data?.content) {
        // Transformer les avis de l'API en format Review
        const transformedReviews: Review[] = response.data.content.map((avis: any) => ({
          id: avis.publicId,
          placeId: item.id.toString(),
          placeName: item.name,
          userId: avis.auteurId || '',
          userName: avis.auteurName || avis.auteur?.nomComplet || 'Utilisateur',
          rating: avis.note,
          comment: avis.message,
          date: avis.dateCreation,
          helpful: avis.nombreFavoris || avis.nombreLikes || 0,
        }));
        setApiReviews(transformedReviews);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Charger les avis depuis l'API au montage et changement d'item
  useEffect(() => {
    fetchReviews();
  }, [item.id, item.name]);

  // Handler pour après l'ajout d'un avis
  const handleReviewAdded = (placeId: string, placeName: string, rating: number, comment: string) => {
    // Appeler le handler parent si nécessaire
    onAddReview(placeId, placeName, rating, comment);
    // Recharger les avis depuis l'API pour avoir les données à jour
    setTimeout(() => {
      fetchReviews();
    }, 500); // Petit délai pour laisser le temps au serveur de traiter
  };

  // Scroll vers le haut lors du chargement de la page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [item.id]);

  // Vérifier si l'établissement est dans les favoris de l'utilisateur
  useEffect(() => {
    if (currentUser && currentUser.favorisIds) {
      setIsFavorite(currentUser.favorisIds.includes(item.id.toString()));
    } else {
      setIsFavorite(false);
    }
  }, [currentUser, item.id]);

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      // Ouvrir le modal d'authentification si l'utilisateur n'est pas connecté
      onOpenAuthModal?.();
      return;
    }

    setIsTogglingFavorite(true);
    try {
      const response = await toggleFavori(item.id.toString());
      if (response.success) {
        const newIsFavorite = !isFavorite;
        setIsFavorite(newIsFavorite);
        
        // Mettre à jour le contexte utilisateur pour synchroniser avec UserProfilePage
        if (onUpdateUser) {
          const itemIdStr = item.id.toString();
          const currentFavorisIds = currentUser.favorisIds || [];
          let newFavorisIds: string[];
          
          if (newIsFavorite) {
            // Ajouter aux favoris
            newFavorisIds = [...currentFavorisIds, itemIdStr];
          } else {
            // Retirer des favoris
            newFavorisIds = currentFavorisIds.filter(id => id !== itemIdStr);
          }
          
          onUpdateUser({
            ...currentUser,
            favorisIds: newFavorisIds
          });
        }
      } else {
        console.error('Erreur:', response.message);
        alert(response.message || 'Erreur lors de la mise à jour des favoris');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des favoris:', error);
      alert('Erreur de connexion au serveur');
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const allImages = item.images || [item.image];

  // Utiliser les avis de l'API (ils sont déjà filtrés par établissement)
  const itemReviews = apiReviews;

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

  // URL de partage
  const shareUrl = `${window.location.origin}/lieux/${item.id}`;
  const shareText = `Découvrez ${item.name} - ${item.description}`;

  const handleShare = () => {
    setIsShareModalOpen(true);
    setLinkCopied(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank', 'width=600,height=400');
  };

  const handleShareLinkedin = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(item.name)}`, '_blank', 'width=600,height=400');
  };

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
  };

  const handleShareEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(item.name)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
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
                    onClick={handleToggleFavorite}
                    disabled={isTogglingFavorite}
                    className={`p-3 rounded-full backdrop-blur-sm transition ${
                      isFavorite 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/90 text-gray-700 hover:bg-red-50'
                    } ${isTogglingFavorite ? 'opacity-50 cursor-wait' : ''}`}
                    title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  >
                    {isTogglingFavorite ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                    )}
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

              {/* Location Map */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Localisation</h3>
                {item.latitude && item.longitude ? (
                  <GoogleMap
                    latitude={item.latitude}
                    longitude={item.longitude}
                    name={item.name}
                    address={item.location}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">{item.location}</p>
                    </div>
                  </div>
                )}
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
            category: item.category === 'events' ? 'activities' : item.category,
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
          onAddReview={handleReviewAdded}
          currentUser={currentUser}
          onOpenAuthModal={onOpenAuthModal}
        />
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Partager</h3>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Aperçu */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                  <p className="text-sm text-gray-500 truncate">{item.location}</p>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                <button
                  onClick={handleShareFacebook}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-blue-50 transition group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                    <Facebook className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-600">Facebook</span>
                </button>
                
                <button
                  onClick={handleShareTwitter}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-sky-50 transition group"
                >
                  <div className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center group-hover:scale-110 transition">
                    <Twitter className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-600">Twitter</span>
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-green-50 transition group"
                >
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center group-hover:scale-110 transition">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-600">WhatsApp</span>
                </button>

                <button
                  onClick={handleShareLinkedin}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-blue-50 transition group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center group-hover:scale-110 transition">
                    <Linkedin className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-600">LinkedIn</span>
                </button>
              </div>

              {/* Email */}
              <button
                onClick={handleShareEmail}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition mb-4"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-gray-700 font-medium">Envoyer par email</span>
              </button>

              {/* Copier le lien */}
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-xl">
                  <Link2 className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">{shareUrl}</span>
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-3 rounded-xl font-medium transition flex items-center gap-2 ${
                    linkCopied 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {linkCopied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copier
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}