import React, { useState } from 'react';
import { ArrowLeft, MapPin, Building2, Activity, Lightbulb, DollarSign, Clock, Users } from 'lucide-react';
import { User } from '../App';

interface ShareTipPageProps {
  onBackToHome: () => void;
  currentUser: User | null;
  onSubmitTip: (placeId: string, placeName: string, placeType: string, tipCategory: string, tipContent: string) => void;
}

export default function ShareTipPage({ onBackToHome, currentUser, onSubmitTip }: ShareTipPageProps) {
  const [placeType, setPlaceType] = useState<'destination' | 'hotel' | 'restaurant' | 'activity'>('destination');
  const [placeName, setPlaceName] = useState('');
  const [tipCategory, setTipCategory] = useState<'budget' | 'timing' | 'crowd' | 'general'>('general');
  const [tipContent, setTipContent] = useState('');

  // Listes de suggestions selon le type
  const suggestions = {
    destination: ['Yaoundé', 'Douala', 'Kribi', 'Mont Cameroun', 'Bamenda', 'Limbé', 'Bafoussam', 'Garoua', 'Maroua', 'Ngaoundéré'],
    hotel: ['Hilton Yaoundé', 'Hotel Sawa Douala', 'Ilomba Hotel Kribi', 'Tou Ngou Hotel Kribi', 'Mountain Hotel Buea'],
    restaurant: ['Le Biniou', 'La Fourchette', 'Chez Wou', 'Le Boeuf Sur le Toit', 'Le Mboa'],
    activity: ['Safari', 'Plongée sous-marine', 'Randonnée', 'Visite culturelle', 'Dégustation gastronomique']
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Vous devez être connecté pour partager un conseil');
      return;
    }

    if (!placeName.trim()) {
      alert('Veuillez sélectionner ou saisir un lieu');
      return;
    }

    if (!tipContent.trim()) {
      alert('Veuillez écrire votre conseil');
      return;
    }

    const placeId = `${placeType}-${placeName.toLowerCase().replace(/\s+/g, '-')}`;
    onSubmitTip(placeId, placeName, placeType, tipCategory, tipContent);
    
    // Réinitialiser le formulaire
    setPlaceName('');
    setTipContent('');
    
    alert('Votre conseil a été partagé avec succès !');
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'budget':
        return <DollarSign className="w-5 h-5" />;
      case 'timing':
        return <Clock className="w-5 h-5" />;
      case 'crowd':
        return <Users className="w-5 h-5" />;
      case 'general':
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
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
            <h1 className="text-green-800 mb-2">Partager un conseil</h1>
            <p className="text-gray-600">
              Aidez d'autres voyageurs avec vos meilleurs conseils et astuces
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

            {/* Catégorie de conseil */}
            <div>
              <label className="block text-gray-700 mb-3">
                Catégorie de conseil <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['budget', 'timing', 'crowd', 'general'] as const).map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setTipCategory(category)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      tipCategory === category
                        ? 'border-green-700 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {getCategoryIcon(category)}
                    <span className="text-sm">
                      {category === 'budget' ? 'Budget' : 
                       category === 'timing' ? 'Timing' : 
                       category === 'crowd' ? 'Affluence' : 
                       'Général'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contenu du conseil */}
            <div>
              <label htmlFor="tipContent" className="block text-gray-700 mb-2">
                Votre conseil <span className="text-red-500">*</span>
              </label>
              <textarea
                id="tipContent"
                value={tipContent}
                onChange={(e) => setTipContent(e.target.value)}
                rows={6}
                placeholder={
                  tipCategory === 'budget' ? 'Partagez des astuces pour économiser de l\'argent...' :
                  tipCategory === 'timing' ? 'Partagez le meilleur moment pour visiter...' :
                  tipCategory === 'crowd' ? 'Partagez comment éviter les foules...' :
                  'Partagez votre conseil utile...'
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                {tipContent.length} / 200 caractères minimum recommandé
              </p>
            </div>

            {/* Exemples de conseils */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="text-green-800 mb-2 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Exemples de bons conseils
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• "Visitez tôt le matin pour éviter la chaleur et les foules"</li>
                <li>• "Négociez les prix au marché, c'est une pratique courante"</li>
                <li>• "Emportez de l'eau et de la crème solaire, il fait très chaud"</li>
                <li>• "Le guide local Amadou est excellent, demandez-le à l'entrée"</li>
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
                {currentUser ? 'Partager le conseil' : 'Connectez-vous pour partager'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
