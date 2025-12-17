import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, MapPin, Star, Filter, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DetailsItem } from './DetailsPage';
import type { Etablissement, EtablissementCategorie } from '../api/types';
import { searchEtablissements, getEtablissementsByCategorie, getAllEtablissements } from '../api/etablissementService';

interface SearchResultsPageProps {
  searchQuery: string;
  onBack: () => void;
  onShowDetails: (item: DetailsItem) => void;
}

// Helper pour convertir un Etablissement API en DetailsItem
const etablissementToDetailsItem = (e: Etablissement): DetailsItem => ({
  id: e.publicId,
  name: e.nom,
  category: e.categorie === 'HOTEL' ? 'hotels' : 
            e.categorie === 'RESTAURANT' ? 'restaurants' : 
            e.categorie === 'ACTIVITE' ? 'activities' : 'popular',
  image: e.imagePrincipale || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
  rating: e.noteMoyenne || 0,
  description: e.description || '',
  location: e.ville || 'Cameroun',
  price: e.prixMoyen ? `${e.prixMoyen.toLocaleString()} FCFA` : undefined,
  phone: e.telephone,
  email: e.email,
  amenities: e.commodites || [],
  cuisine: e.categorie === 'RESTAURANT' ? 'Camerounaise' : undefined,
});

export default function SearchResultsPage({ searchQuery, onBack, onShowDetails }: SearchResultsPageProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'hotels' | 'restaurants' | 'activities' | 'destinations'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [apiResults, setApiResults] = useState<Etablissement[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Charger les résultats de recherche depuis l'API
  useEffect(() => {
    const loadResults = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let response;
        
        if (searchQuery.trim()) {
          // Recherche par texte
          response = await searchEtablissements(searchQuery, 0, 50);
        } else {
          // Charger tous les établissements si pas de requête
          response = await getAllEtablissements(0, 50);
        }
        
        if (response.success && response.data) {
          setApiResults(response.data.content);
        } else {
          // Fallback vers les données statiques
          setApiResults([]);
        }
      } catch (err) {
        setError('Erreur lors de la recherche');
        setApiResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadResults();
  }, [searchQuery]);

  // Charger par catégorie quand le filtre change
  useEffect(() => {
    const loadByCategory = async () => {
      if (activeFilter === 'all') return;
      
      setIsLoading(true);
      
      try {
        const categoryMap: Record<string, EtablissementCategorie> = {
          hotels: 'HOTEL',
          restaurants: 'RESTAURANT',
          activities: 'ACTIVITE',
          destinations: 'DESTINATION'
        };
        
        const categorie = categoryMap[activeFilter];
        if (categorie) {
          const response = await getEtablissementsByCategorie(categorie, 0, 50);
          if (response.success && response.data) {
            // Filtrer aussi par la recherche si présente
            let results = response.data.content;
            if (searchQuery.trim()) {
              const query = searchQuery.toLowerCase();
              results = results.filter(e => 
                e.nom.toLowerCase().includes(query) ||
                e.ville?.toLowerCase().includes(query) ||
                e.description?.toLowerCase().includes(query)
              );
            }
            setApiResults(results);
          }
        }
      } catch (err) {
        // Ignorer les erreurs de filtre
      } finally {
        setIsLoading(false);
      }
    };
    
    if (activeFilter !== 'all') {
      loadByCategory();
    }
  }, [activeFilter, searchQuery]);

  // Données statiques de fallback
  const staticItems: DetailsItem[] = [
    // Hôtels
    {
      id: '1',
      name: 'Hôtel La Falaise',
      category: 'hotels',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      rating: 4.8,
      description: 'Hôtel de luxe avec vue panoramique sur Yaoundé',
      location: 'Yaoundé, Centre',
      price: '85 000 FCFA/nuit',
      phone: '+237 222 23 36 86',
      email: 'contact@lafalaise.cm',
      amenities: ['WiFi', 'Piscine', 'Restaurant', 'Spa', 'Parking']
    },
    {
      id: '2',
      name: 'Hilton Douala',
      category: 'hotels',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      rating: 4.9,
      description: 'Hôtel international de standing au cœur de Douala',
      location: 'Douala, Littoral',
      price: '120 000 FCFA/nuit',
      phone: '+237 233 42 46 46',
      email: 'douala@hilton.com',
      amenities: ['WiFi', 'Piscine', 'Salle de sport', 'Restaurant', 'Bar']
    },
    {
      id: '3',
      name: 'Tou\'Ngou Hotel',
      category: 'hotels',
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      rating: 4.5,
      description: 'Complexe hôtelier écologique à Kribi',
      location: 'Kribi, Sud',
      price: '65 000 FCFA/nuit',
      phone: '+237 243 46 12 34',
      email: 'info@toungou.cm',
      amenities: ['Plage privée', 'WiFi', 'Restaurant', 'Piscine']
    },
    // Restaurants
    {
      id: '4',
      name: 'La Terrasse',
      category: 'restaurants',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      rating: 4.7,
      description: 'Cuisine française et camerounaise raffinée',
      location: 'Yaoundé, Centre',
      cuisine: 'Française & Camerounaise',
      openingHours: '12h - 23h',
      phone: '+237 222 21 45 67'
    },
    {
      id: '5',
      name: 'Le Biniou',
      category: 'restaurants',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      rating: 4.6,
      description: 'Spécialités de fruits de mer et poissons',
      location: 'Douala, Littoral',
      cuisine: 'Fruits de mer',
      openingHours: '11h - 22h30',
      phone: '+237 233 42 78 90'
    },
    // Activités
    {
      id: '6',
      name: 'Ascension du Mont Cameroun',
      category: 'activities',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
      rating: 4.9,
      description: 'Randonnée guidée vers le sommet du Mont Cameroun',
      location: 'Buea, Sud-Ouest',
      duration: '2-3 jours',
      participants: '4-12 personnes',
      price: '150 000 FCFA/personne'
    },
    {
      id: '7',
      name: 'Safari Parc National de Waza',
      category: 'activities',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
      rating: 4.8,
      description: 'Safari photo dans la réserve de Waza',
      location: 'Waza, Extrême-Nord',
      duration: '1 journée',
      participants: '2-6 personnes',
      price: '80 000 FCFA/personne'
    },
    {
      id: '8',
      name: 'Visite des Chutes de la Lobé',
      category: 'activities',
      image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800',
      rating: 4.7,
      description: 'Découverte des cascades qui se jettent dans l\'océan',
      location: 'Kribi, Sud',
      duration: 'Demi-journée',
      participants: '2-20 personnes',
      price: '25 000 FCFA/personne'
    },
    {
      id: '9',
      name: 'Plongée à Limbé',
      category: 'activities',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
      rating: 4.6,
      description: 'Session de plongée sous-marine avec instructeur',
      location: 'Limbé, Sud-Ouest',
      duration: '3 heures',
      participants: '1-4 personnes',
      price: '45 000 FCFA/personne'
    },
    {
      id: '10',
      name: 'Visite du Palais Royal de Foumban',
      category: 'popular',
      image: 'https://images.unsplash.com/photo-1523568129082-c691c7c35649?w=800',
      rating: 4.8,
      description: 'Découverte du patrimoine culturel Bamoun',
      location: 'Foumban, Ouest',
      duration: '2 heures',
      price: '5 000 FCFA/personne'
    },
    {
      id: '11',
      name: 'Plages de Kribi',
      category: 'popular',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      rating: 4.9,
      description: 'Plages de sable fin bordées de cocotiers',
      location: 'Kribi, Sud',
      detailedDescription: 'Les plages de Kribi comptent parmi les plus belles du Cameroun avec leur sable blanc et leurs eaux turquoise.'
    },
    {
      id: '12',
      name: 'Lac Nyos',
      category: 'popular',
      image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800',
      rating: 4.5,
      description: 'Lac de cratère mystérieux et magnifique',
      location: 'Nord-Ouest',
      detailedDescription: 'Le Lac Nyos est un lac de cratère volcanique situé dans la région du Nord-Ouest du Cameroun.'
    }
  ];

  // Combiner les résultats de l'API avec les données statiques
  const allItems: DetailsItem[] = [
    ...apiResults.map(etablissementToDetailsItem),
    ...(apiResults.length === 0 ? staticItems : [])
  ];

  // Filtrer les résultats par recherche
  const filterBySearch = (items: DetailsItem[]) => {
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      (item.cuisine && item.cuisine.toLowerCase().includes(query))
    );
  };

  // Filtrer par catégorie
  const filterByCategory = (items: DetailsItem[]) => {
    if (activeFilter === 'all') return items;
    if (activeFilter === 'destinations') {
      return items.filter(item => item.category === 'popular');
    }
    return items.filter(item => item.category === activeFilter);
  };

  const filteredResults = filterByCategory(filterBySearch(allItems));

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      hotels: 'Hôtel',
      restaurants: 'Restaurant',
      activities: 'Activité',
      popular: 'Destination',
      events: 'Événement'
    };
    return labels[category] || 'Lieu';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-green-700 transition mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-6 h-6 text-green-700" />
            <h1 className="text-2xl text-gray-900">
              Résultats pour "{searchQuery}"
            </h1>
          </div>
          
          <p className="text-gray-600">
            {filteredResults.length} résultat{filteredResults.length > 1 ? 's' : ''} trouvé{filteredResults.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg text-gray-900">Filtrer par catégorie</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'Tout' },
              { value: 'hotels', label: 'Hôtels' },
              { value: 'restaurants', label: 'Restaurants' },
              { value: 'activities', label: 'Activités' },
              { value: 'destinations', label: 'Destinations' }
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value as any)}
                className={`px-4 py-2 rounded-lg transition ${
                  activeFilter === filter.value
                    ? 'bg-green-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Résultats */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Loader2 className="w-12 h-12 text-green-700 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl text-gray-900 mb-2">Recherche en cours...</h3>
            <p className="text-gray-600">
              Nous cherchons les meilleurs résultats pour vous
            </p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Search className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-xl text-gray-900 mb-2">Erreur de recherche</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl text-gray-900 mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-600">
              Essayez avec d'autres mots-clés ou modifiez vos filtres
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map(item => (
              <div
                key={item.id}
                onClick={() => onShowDetails(item)}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-green-700 rounded-full text-sm">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>
                  {item.rating && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm">{item.rating}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-xl text-gray-900 mb-2 group-hover:text-green-700 transition">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 text-green-700" />
                    <span className="text-sm">{item.location}</span>
                  </div>
                  <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  {item.price && (
                    <div className="pt-3 border-t">
                      <span className="text-green-700">{item.price}</span>
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
