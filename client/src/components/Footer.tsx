import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="about" className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 text-white mb-4">
              <span className="text-3xl">🌍</span>
              <span className="text-2xl">CamerTrip</span>
            </div>
            <p className="mb-4 text-sm">
              Votre guide de confiance pour explorer les merveilles du Cameroun. Découvrez l'Afrique en miniature.
            </p>
            <div className="flex gap-3">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-green-700 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-green-700 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-green-700 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-green-700 transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-green-400 transition">Accueil</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">Destinations</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">Activités</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">Offres spéciales</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">Blog</a>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-white mb-4">Destinations populaires</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-green-400 transition">Yaoundé</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">Douala</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">Kribi</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">Limbe</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">Bafoussam</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">Maroua</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Avenue Kennedy, Yaoundé, Cameroun</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+237 6 XX XX XX XX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>contact@camertrip.cm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© 2025 CamerTrip. Tous droits réservés.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-green-400 transition">Conditions d'utilisation</a>
              <a href="#" className="hover:text-green-400 transition">Politique de confidentialité</a>
              <a href="#" className="hover:text-green-400 transition">Mentions légales</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}