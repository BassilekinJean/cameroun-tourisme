import React, { useState } from 'react';
import { ArrowLeft, MapPin, Building2, Activity, Phone, Mail, Globe, Clock, DollarSign, Upload, X } from 'lucide-react';
import { User } from '../App';

interface AddPlacePageProps {
  onBackToHome: () => void;
  currentUser: User | null;
  onSubmitPlace: (placeData: PlaceData) => void;
}

export interface PlaceData {
  type: 'destination' | 'hotel' | 'restaurant' | 'activity';
  name: string;
  description: string;
  address: string;
  city: string;
  region: string;
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  priceRange?: string;
  amenities: string[];
  photos: string[];
}

export default function AddPlacePage({ onBackToHome, currentUser, onSubmitPlace }: AddPlacePageProps) {
  const [placeType, setPlaceType] = useState<'destination' | 'hotel' | 'restaurant' | 'activity'>('destination');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);

  const cameroonRegions = [
    'Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral',
    'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest'
  ];

  const amenitiesByType = {
    destination: ['Parking', 'Guide disponible', 'Toilettes', 'Restaurant', 'Boutique souvenir', 'Accès handicapé', 'WiFi gratuit'],
    hotel: ['WiFi gratuit', 'Parking', 'Piscine', 'Restaurant', 'Bar', 'Salle de sport', 'Spa', 'Climatisation', 'Service en chambre'],
    restaurant: ['WiFi gratuit', 'Parking', 'Terrasse', 'Climatisation', 'Livraison', 'Plats à emporter', 'Réservation en ligne', 'Musique live'],
    activity: ['Guide inclus', 'Équipement fourni', 'Transport inclus', 'Assurance incluse', 'Accessible débutants', 'Réservation requise']
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file));
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Vous devez être connecté pour ajouter un lieu');
      return;
    }

    if (!name.trim() || !description.trim() || !address.trim() || !city.trim() || !region) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const placeData: PlaceData = {
      type: placeType,
      name,
      description,
      address,
      city,
      region,
      phone: phone || undefined,
      email: email || undefined,
      website: website || undefined,
      openingHours: openingHours || undefined,
      priceRange: priceRange || undefined,
      amenities: selectedAmenities,
      photos
    };

    onSubmitPlace(placeData);
    
    // Réinitialiser le formulaire
    setName('');
    setDescription('');
    setAddress('');
    setCity('');
    setRegion('');
    setPhone('');
    setEmail('');
    setWebsite('');
    setOpeningHours('');
    setPriceRange('');
    setSelectedAmenities([]);
    setPhotos([]);
    
    alert('Le lieu a été ajouté avec succès ! Il sera vérifié par notre équipe avant publication.');
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-green-800 mb-2">Ajouter un lieu</h1>
            <p className="text-gray-600">
              Contribuez à enrichir CamerTrip en ajoutant un nouveau lieu
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
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
                      setSelectedAmenities([]);
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

            {/* Informations de base */}
            <div className="space-y-4">
              <h2 className="text-green-800">Informations de base</h2>
              
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Nom du lieu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Chutes de la Lobé"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Décrivez le lieu, ses attraits, son histoire..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Localisation */}
            <div className="space-y-4">
              <h2 className="text-green-800">Localisation</h2>
              
              <div>
                <label htmlFor="address" className="block text-gray-700 mb-2">
                  Adresse <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Route de Kribi-Campo, Km 15"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-gray-700 mb-2">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Kribi"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="region" className="block text-gray-700 mb-2">
                    Région <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
                  >
                    <option value="">Sélectionnez une région</option>
                    {cameroonRegions.map((reg) => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Coordonnées */}
            <div className="space-y-4">
              <h2 className="text-green-800">Coordonnées (optionnel)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+237 XXX XXX XXX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@exemple.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="website" className="block text-gray-700 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Site web
                </label>
                <input
                  type="url"
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.exemple.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
                />
              </div>
            </div>

            {/* Informations pratiques */}
            <div className="space-y-4">
              <h2 className="text-green-800">Informations pratiques (optionnel)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="openingHours" className="block text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Horaires d'ouverture
                  </label>
                  <input
                    type="text"
                    id="openingHours"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    placeholder="Ex: 8h-18h tous les jours"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="priceRange" className="block text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Gamme de prix
                  </label>
                  <select
                    id="priceRange"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="$">$ - Économique</option>
                    <option value="$$">$$ - Moyen</option>
                    <option value="$$$">$$$ - Élevé</option>
                    <option value="$$$$">$$$$ - Luxe</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Équipements et services */}
            <div>
              <label className="block text-gray-700 mb-3">
                Équipements et services
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenitiesByType[placeType].map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm transition-all ${
                      selectedAmenities.includes(amenity)
                        ? 'border-green-700 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div>
              <label className="block text-gray-700 mb-2">
                Photos
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
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
                  className="cursor-pointer flex flex-col items-center gap-2 text-gray-600 hover:text-green-700 transition"
                >
                  <Upload className="w-8 h-8" />
                  <span>Cliquez pour ajouter des photos</span>
                  <span className="text-sm text-gray-500">
                    JPG, PNG jusqu'à 5MB
                  </span>
                </label>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Note d'information */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-gray-700">
                <strong>Note :</strong> Toutes les soumissions sont vérifiées par notre équipe avant publication.
                Assurez-vous que les informations fournies sont exactes et à jour.
              </p>
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
                {currentUser ? 'Soumettre le lieu' : 'Connectez-vous pour soumettre'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
