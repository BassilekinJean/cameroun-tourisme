import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Loader2, Map } from 'lucide-react';

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
  className?: string;
  height?: string;
}

// Intégration Google Maps via iframe embed - SANS API KEY nécessaire !
export default function GoogleMap({ 
  latitude, 
  longitude, 
  name, 
  address, 
  className = '',
  height = 'h-64'
}: GoogleMapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // URLs pour les actions
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  
  // URL embed Google Maps - fonctionne SANS API key !
  const embedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <MapPin className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Localisation</h3>
            <p className="text-sm text-gray-600">{address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Voir sur Google Maps
          </a>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white border-2 border-green-600 text-green-600 py-3 px-4 rounded-xl hover:bg-green-50 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            Itinéraire
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl overflow-hidden shadow-lg ${className}`}>
      {/* Carte Google Maps via iframe embed - GRATUIT ! */}
      <div className={`relative w-full ${height} bg-gray-100`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
              <span className="text-sm text-gray-500">Chargement de la carte...</span>
            </div>
          </div>
        )}
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Carte de ${name}`}
          onLoad={handleLoad}
          onError={handleError}
          className="w-full h-full"
        />
      </div>
      
      {/* Informations et Actions */}
      <div className="bg-white p-4">
        {/* Adresse si disponible */}
        {address && (
          <div className="flex items-start gap-2 mb-3 pb-3 border-b border-gray-100">
            <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600">{address}</p>
          </div>
        )}
        
        {/* Boutons d'action */}
        <div className="flex gap-3">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 px-4 rounded-xl hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <Map className="w-4 h-4" />
            Ouvrir dans Maps
          </a>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border-2 border-green-600 text-green-600 py-2.5 px-4 rounded-xl hover:bg-green-50 transition-colors text-sm font-medium"
          >
            <Navigation className="w-4 h-4" />
            Itinéraire
          </a>
        </div>
      </div>
    </div>
  );
}
