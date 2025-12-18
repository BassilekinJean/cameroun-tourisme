import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, ExternalLink, Loader2 } from 'lucide-react';

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
  className?: string;
}

// Note: Pour utiliser l'API Google Maps, vous devez :
// 1. Obtenir une clé API Google Maps sur https://console.cloud.google.com
// 2. Activer les APIs: Maps JavaScript API, Places API
// 3. Ajouter la clé dans les variables d'environnement VITE_GOOGLE_MAPS_API_KEY

export default function GoogleMap({ latitude, longitude, name, address, className = '' }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL pour ouvrir dans Google Maps
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      // Mode fallback sans API key - affiche une carte statique ou un lien
      setError('no-api-key');
      return;
    }

    // Charger le script Google Maps
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => setError('Erreur de chargement de Google Maps');
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      // Ajouter un marqueur
      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: name,
        animation: window.google.maps.Animation.DROP,
      });

      setMapLoaded(true);
    };

    loadGoogleMaps();
  }, [latitude, longitude, name]);

  // Mode fallback sans API key
  if (error === 'no-api-key') {
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
        
        {/* Image statique de carte (OpenStreetMap) */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-gray-200">
          <img
            src={`https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=15&size=600x300&maptype=mapnik&markers=${latitude},${longitude},red-pushpin`}
            alt={`Carte de ${name}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
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

  if (error) {
    return (
      <div className={`bg-red-50 rounded-2xl p-6 text-center ${className}`}>
        <MapPin className="w-12 h-12 text-red-400 mx-auto mb-2" />
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl overflow-hidden shadow-lg ${className}`}>
      {/* Carte Google Maps */}
      <div ref={mapRef} className="w-full h-64 bg-gray-100">
        {!mapLoaded && (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="bg-white p-4 flex gap-3">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition-colors text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          Ouvrir dans Google Maps
        </a>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border border-green-600 text-green-600 py-2 px-4 rounded-xl hover:bg-green-50 transition-colors text-sm"
        >
          <Navigation className="w-4 h-4" />
          Itinéraire
        </a>
      </div>
    </div>
  );
}

// Déclaration de types pour Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: object) => object;
        Marker: new (options: object) => object;
        Animation: {
          DROP: number;
          BOUNCE: number;
        };
      };
    };
  }
}
