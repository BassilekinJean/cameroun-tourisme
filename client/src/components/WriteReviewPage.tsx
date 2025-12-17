import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Building2, Activity, Upload, X } from 'lucide-react';
import { User } from '../App';

interface WriteReviewPageProps {
  onBackToHome: () => void;
  currentUser: User | null;
  onSubmitReview: (placeId: string, placeName: string, placeType: string, rating: number, comment: string, images: string[]) => void;
}

export default function WriteReviewPage({ onBackToHome, currentUser, onSubmitReview }: WriteReviewPageProps) {
  const [placeType, setPlaceType] = useState<'destination' | 'hotel' | 'restaurant' | 'activity'>('destination');
  const [placeName, setPlaceName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Listes de suggestions selon le type
  const suggestions = {
    destination: ['Yaoundé', 'Douala', 'Kribi', 'Mont Cameroun', 'Bamenda', 'Limbé', 'Bafoussam', 'Garoua', 'Maroua', 'Ngaoundéré'],
    hotel: ['Hilton Yaoundé', 'Hotel Sawa Douala', 'Ilomba Hotel Kribi', 'Tou Ngou Hotel Kribi', 'Mountain Hotel Buea'],
    restaurant: ['Le Biniou', 'La Fourchette', 'Chez Wou', 'Le Boeuf Sur le Toit', 'Le Mboa'],
    activity: ['Safari', 'Plongée sous-marine', 'Randonnée', 'Visite culturelle', 'Dégustation gastronomique']
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadingImage(true);
      // Simuler un upload d'image
      setTimeout(() => {
        const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
        setImages([...images, ...newImages]);
        setUploadingImage(false);
      }, 500);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Vous devez être connecté pour écrire un avis');
      return;
    }

    if (!placeName.trim()) {
      alert('Veuillez sélectionner ou saisir un lieu');
      return;
    }

    if (rating === 0) {
      alert('Veuillez donner une note');
      return;
    }

    if (!comment.trim()) {
      alert('Veuillez écrire un commentaire');
      return;
    }

    const placeId = `${placeType}-${placeName.toLowerCase().replace(/\s+/g, '-')}`;
    onSubmitReview(placeId, placeName, placeType, rating, comment, images);
    
    // Réinitialiser le formulaire
    setPlaceName('');
    setRating(0);
    setComment('');
    setImages([]);
    
    alert('Votre avis a été publié avec succès !');
    onBackToHome();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'destination':
        return <MapPin className="w-5 h-5" />;
      case 'hotel':
        return <Building2 className="w-5 h-5" />;
      case 'restaurant':
        return <Building2 className="w-5 h-5" />;
      case 'activity':
        return <Activity className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec retour */}
      <div className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-gray-600 hover:text-green-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-md p-5 md:p-6">
          <div className="mb-5">
            <h1 className="text-2xl text-green-800 mb-1">Écrire un avis</h1>
            <p className="text-sm text-gray-600">
              Partagez votre expérience avec la communauté CamerTrip
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Type de lieu */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Type de lieu <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(['destination', 'hotel', 'restaurant', 'activity'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setPlaceType(type);
                      setPlaceName('');
                    }}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all text-sm ${
                      placeType === type
                        ? 'border-green-700 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {getTypeIcon(type)}
                    <span className="text-xs capitalize">
                      {type === 'destination' ? 'Destination' : 
                       type === 'hotel' ? 'Hôtel' : 
                       type === 'restaurant' ? 'Restaurant' : 
                       'Activité'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Nom du lieu */}
            <div>
              <label htmlFor="placeName" className="block text-sm text-gray-700 mb-2">
                Nom du lieu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="placeName"
                list="place-suggestions"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder={`Sélectionnez ou saisissez un ${placeType === 'destination' ? 'lieu' : placeType}`}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
              />
              <datalist id="place-suggestions">
                {suggestions[placeType].map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
            </div>

            {/* Notation */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Note <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    {rating === 1 ? 'Décevant' :
                     rating === 2 ? 'Moyen' :
                     rating === 3 ? 'Bien' :
                     rating === 4 ? 'Très bien' :
                     'Excellent'}
                  </span>
                )}
              </div>
            </div>

            {/* Commentaire */}
            <div>
              <label htmlFor="comment" className="block text-sm text-gray-700 mb-2">
                Votre avis <span className="text-red-500">*</span>
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                placeholder="Décrivez votre expérience, ce que vous avez aimé ou moins aimé..."
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {comment.length} caractères
              </p>
            </div>

            {/* Upload d'images */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Photos (optionnel)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer flex flex-col items-center gap-1 text-gray-600 hover:text-green-700 transition"
                >
                  <Upload className="w-6 h-6" />
                  <span className="text-sm">Cliquez pour ajouter des photos</span>
                  <span className="text-xs text-gray-500">
                    JPG, PNG jusqu'à 5MB
                  </span>
                </label>
              </div>

              {/* Aperçu des images */}
              {images.length > 0 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-2 pt-3">
              <button
                type="button"
                onClick={onBackToHome}
                className="flex-1 px-5 py-2.5 text-sm border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!currentUser}
                className="flex-1 px-5 py-2.5 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {currentUser ? 'Publier l\'avis' : 'Connectez-vous pour publier'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}