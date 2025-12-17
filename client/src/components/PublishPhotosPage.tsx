import React, { useState } from 'react';
import { ArrowLeft, MapPin, Building2, Activity, Upload, X, Image as ImageIcon } from 'lucide-react';
import { User } from '../App';

interface PublishPhotosPageProps {
  onBackToHome: () => void;
  currentUser: User | null;
  onSubmitPhotos: (placeId: string, placeName: string, placeType: string, photos: { url: string; caption: string }[]) => void;
}

export default function PublishPhotosPage({ onBackToHome, currentUser, onSubmitPhotos }: PublishPhotosPageProps) {
  const [placeType, setPlaceType] = useState<'destination' | 'hotel' | 'restaurant' | 'activity'>('destination');
  const [placeName, setPlaceName] = useState('');
  const [photos, setPhotos] = useState<{ url: string; caption: string }[]>([]);
  const [currentCaption, setCurrentCaption] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Listes de suggestions selon le type
  const suggestions = {
    destination: ['Yaoundé', 'Douala', 'Kribi', 'Mont Cameroun', 'Bamenda', 'Limbé', 'Bafoussam', 'Garoua', 'Maroua', 'Ngaoundéré'],
    hotel: ['Hilton Yaoundé', 'Hotel Sawa Douala', 'Ilomba Hotel Kribi', 'Tou Ngou Hotel Kribi', 'Mountain Hotel Buea'],
    restaurant: ['Le Biniou', 'La Fourchette', 'Chez Wou', 'Le Boeuf Sur le Toit', 'Le Mboa'],
    activity: ['Safari', 'Plongée sous-marine', 'Randonnée', 'Visite culturelle', 'Dégustation gastronomique']
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadingPhoto(true);
      // Simuler un upload de photo
      setTimeout(() => {
        const newPhotos = Array.from(files).map((file) => ({
          url: URL.createObjectURL(file),
          caption: ''
        }));
        setPhotos([...photos, ...newPhotos]);
        setUploadingPhoto(false);
      }, 500);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const updateCaption = (index: number, caption: string) => {
    const updatedPhotos = [...photos];
    updatedPhotos[index].caption = caption;
    setPhotos(updatedPhotos);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Vous devez être connecté pour publier des photos');
      return;
    }

    if (!placeName.trim()) {
      alert('Veuillez sélectionner ou saisir un lieu');
      return;
    }

    if (photos.length === 0) {
      alert('Veuillez ajouter au moins une photo');
      return;
    }

    const placeId = `${placeType}-${placeName.toLowerCase().replace(/\s+/g, '-')}`;
    onSubmitPhotos(placeId, placeName, placeType, photos);
    
    // Réinitialiser le formulaire
    setPlaceName('');
    setPhotos([]);
    
    alert('Vos photos ont été publiées avec succès !');
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-green-800 mb-2">Publier des photos</h1>
            <p className="text-gray-600">
              Partagez vos plus belles photos de voyage avec la communauté
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type de lieu */}
            <div>
              <label className="block text-gray-700 mb-3">
                Type de lieu <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['destination', 'hotel', 'restaurant', 'activity'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setPlaceType(type);
                      setPlaceName('');
                    }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      placeType === type
                        ? 'border-green-700 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {getTypeIcon(type)}
                    <span className="text-sm capitalize">
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
              <label htmlFor="placeName" className="block text-gray-700 mb-2">
                Nom du lieu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="placeName"
                list="place-suggestions"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder={`Sélectionnez ou saisissez un ${placeType === 'destination' ? 'lieu' : placeType}`}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
              />
              <datalist id="place-suggestions">
                {suggestions[placeType].map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
            </div>

            {/* Upload de photos */}
            <div>
              <label className="block text-gray-700 mb-2">
                Photos <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <input
                  type="file"
                  id="photoUpload"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <label
                  htmlFor="photoUpload"
                  className="cursor-pointer flex flex-col items-center gap-3 text-gray-600 hover:text-green-700 transition"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-green-700" />
                  </div>
                  <div>
                    <p className="text-lg">Cliquez pour ajouter des photos</p>
                    <span className="text-sm text-gray-500">
                      JPG, PNG jusqu'à 10MB par photo
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Galerie des photos uploadées */}
            {photos.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-gray-700 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Photos ajoutées ({photos.length})
                </h3>
                <div className="space-y-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex gap-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={photo.url}
                            alt={`Photo ${index + 1}`}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex-1">
                          <label htmlFor={`caption-${index}`} className="block text-sm text-gray-600 mb-2">
                            Légende (optionnelle)
                          </label>
                          <textarea
                            id={`caption-${index}`}
                            value={photo.caption}
                            onChange={(e) => updateCaption(index, e.target.value)}
                            placeholder="Décrivez cette photo..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conseils pour les photos */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="text-blue-800 mb-2">
                💡 Conseils pour de belles photos
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Prenez des photos en haute résolution pour une meilleure qualité</li>
                <li>• Capturez l'ambiance et les détails uniques du lieu</li>
                <li>• Variez les angles et les perspectives</li>
                <li>• Évitez de publier des photos floues ou mal cadrées</li>
                <li>• Respectez la vie privée des personnes photographiées</li>
              </ul>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={onBackToHome}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!currentUser}
                className="flex-1 px-6 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {currentUser ? 'Publier les photos' : 'Connectez-vous pour publier'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
