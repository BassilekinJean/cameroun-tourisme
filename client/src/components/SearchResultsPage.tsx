import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Search, MapPin, Star, Loader2, Hotel, Utensils, Compass, Grid3X3, X, ChevronDown } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DetailsItem } from './DetailsPage';
import type { EtablissementListItem, TypeLieu, SearchParams } from '../api/types';
import { searchEtablissements, getEtablissementsByCategorie, getAllEtablissements } from '../api/etablissementService';

// Types pour les catégories de recherche
type SearchCategory = 'all' | 'hotels' | 'restaurants' | 'activities';

interface SearchResultsPageProps {
  searchQuery: string;
  initialCategory?: SearchCategory;
  onBack: () => void;
  onShowDetails: (item: DetailsItem) => void;
}

// Helper pour convertir un EtablissementListItem API en DetailsItem
const etablissementToDetailsItem = (e: EtablissementListItem): DetailsItem => ({
  id: e.publicId,
  name: e.nom,
  category: e.categorie === 'HOTEL' ? 'hotels' : 
            e.categorie === 'RESTAURATION' ? 'restaurants' : 
            e.categorie === 'SITE_TOURISTIQUE' ? 'activities' : 'popular',
  image: e.photoProfile || e.images?.[0] || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
  rating: e.rating || 0,
  description: e.description || '',
  location: e.ville || 'Cameroun',
  price: undefined,
  phone: undefined,
  email: undefined,
  amenities: [],
});

// Mapper la catégorie frontend vers TypeLieu backend
const categoryToTypeLieu = (category: SearchCategory): TypeLieu | undefined => {
  switch (category) {
    case 'hotels': return 'HOTEL' as TypeLieu;
    case 'restaurants': return 'RESTAURATION' as TypeLieu;
    case 'activities': return 'SITE_TOURISTIQUE' as TypeLieu;
    default: return undefined;
  }
};

// Configuration des catégories
const categories = [
  { value: 'all' as SearchCategory, label: 'Tout', icon: Grid3X3, color: 'emerald' },
  { value: 'hotels' as SearchCategory, label: 'Hôtels', icon: Hotel, color: 'blue' },
  { value: 'restaurants' as SearchCategory, label: 'Restaurants', icon: Utensils, color: 'orange' },
  { value: 'activities' as SearchCategory, label: 'Activités', icon: Compass, color: 'purple' },
];

export default function SearchResultsPage({ 
  searchQuery, 
  initialCategory = 'all',
  onBack, 
  onShowDetails 
}: SearchResultsPageProps) {
  const [activeCategory, setActiveCategory] = useState<SearchCategory>(initialCategory);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<DetailsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'name'>('relevance');

  // Fonction de recherche
  const performSearch = useCallback(async (query: string, category: SearchCategory) => {
    setIsLoading(true);
    setError(null);

    try {
      let items: EtablissementListItem[] = [];
      const typeLieu = categoryToTypeLieu(category);

      if (query.trim() || typeLieu) {
        // Utiliser la recherche avec les bons paramètres (objet SearchParams)
        const searchParams: SearchParams = {
          query: query.trim() || undefined,
          categorie: typeLieu,
          page: 0,
          size: 50,
        };
        
        const response = await searchEtablissements(searchParams);
        
        if (response.success && response.data) {
          items = response.data.content || [];
        }
      } else {
        // Charger tous les établissements
        const response = await getAllEtablissements(0, 50);
        if (response.success && response.data) {
          items = response.data.content || [];
        }
      }

      // Convertir en DetailsItem
      const detailsItems = items.map(etablissementToDetailsItem);

      // Trier selon le critère sélectionné
      const sortedItems = [...detailsItems].sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });

      setResults(sortedItems);
    } catch (err) {
      console.error('Erreur de recherche:', err);
      setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [sortBy]);

  // Effet pour la recherche initiale et quand les paramètres changent
  useEffect(() => {
    performSearch(localSearchQuery, activeCategory);
  }, [localSearchQuery, activeCategory, performSearch]);

  // Mettre à jour la recherche locale quand la prop change
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Handler de recherche locale
  const handleLocalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(localSearchQuery, activeCategory);
  };

  // Handler de changement de catégorie
  const handleCategoryChange = (category: SearchCategory) => {
    setActiveCategory(category);
  };

  // Obtenir le label de la catégorie
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      hotels: 'Hôtel',
      restaurants: 'Restaurant',
      activities: 'Activité',
      popular: 'Lieu populaire',
    };
    return labels[category] || 'Lieu';
  };

  // Obtenir la couleur de la catégorie
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      hotels: 'bg-blue-100 text-blue-700',
      restaurants: 'bg-orange-100 text-orange-700',
      activities: 'bg-purple-100 text-purple-700',
      popular: 'bg-emerald-100 text-emerald-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header avec recherche */}
      <div className="bg-white shadow-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Bouton retour et titre */}
          <div className="py-4 flex items-center justify-between border-b border-gray-100">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Retour à l'accueil</span>
            </button>
          </div>

          {/* Barre de recherche */}
          <div className="py-4">
            <form onSubmit={handleLocalSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  placeholder="Rechercher hôtels, restaurants, activités..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                />
                {localSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setLocalSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Rechercher</span>
              </button>
            </form>
          </div>

          {/* Onglets de catégorie */}
          <div className="flex items-center gap-2 pb-4 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition whitespace-nowrap font-medium ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Résumé et tri */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {localSearchQuery ? (
                <>Résultats pour "<span className="text-emerald-600">{localSearchQuery}</span>"</>
              ) : (
                <>Tous les {activeCategory === 'all' ? 'établissements' : categories.find(c => c.value === activeCategory)?.label.toLowerCase()}</>
              )}
            </h1>
            <p className="text-gray-500 mt-1">
              {isLoading ? 'Recherche en cours...' : `${results.length} résultat${results.length > 1 ? 's' : ''} trouvé${results.length > 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Options de tri */}
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm">Trier par:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="appearance-none px-4 py-2 pr-10 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none cursor-pointer"
              >
                <option value="relevance">Pertinence</option>
                <option value="rating">Note</option>
                <option value="name">Nom (A-Z)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* État de chargement */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-emerald-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-emerald-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mt-6">Recherche en cours...</h3>
            <p className="text-gray-500 mt-2">Nous trouvons les meilleurs résultats pour vous</p>
          </div>
        )}

        {/* Erreur */}
        {!isLoading && error && (
          <div className="bg-red-50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur de recherche</h3>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => performSearch(localSearchQuery, activeCategory)}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Aucun résultat */}
        {!isLoading && !error && results.length === 0 && (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Aucun résultat trouvé</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Nous n'avons pas trouvé de résultats pour "{localSearchQuery}". 
              Essayez avec d'autres mots-clés ou explorez nos catégories.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {categories.filter(c => c.value !== 'all').map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setLocalSearchQuery('');
                      handleCategoryChange(cat.value);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition"
                  >
                    <Icon className="w-4 h-4" />
                    <span>Voir les {cat.label.toLowerCase()}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Grille de résultats */}
        {!isLoading && !error && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item) => (
              <div
                key={item.id}
                onClick={() => onShowDetails(item)}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Badge catégorie */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getCategoryColor(item.category)}`}>
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>

                  {/* Note */}
                  {item.rating > 0 && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-semibold text-gray-900">{item.rating.toFixed(1)}</span>
                    </div>
                  )}

                  {/* Localisation en bas de l'image */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.location}</span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Prix si disponible */}
                  {item.price && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-emerald-600 font-bold">{item.price}</span>
                      <span className="text-sm text-gray-400">par nuit</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
