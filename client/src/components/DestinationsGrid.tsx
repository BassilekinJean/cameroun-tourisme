import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MapPin, Clock, Users } from 'lucide-react';

const destinations = [
  {
    id: 1,
    title: 'Mont Cameroun',
    location: 'Buea',
    duration: '2-3 jours',
    price: '150 000 FCFA',
    image: 'https://images.unsplash.com/photo-1591803026220-6385999e82b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbW91bnRhaW58ZW58MXx8fHwxNzY0NDA1NjAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    participants: '2-8 personnes',
    type: 'Randonnée'
  },
  {
    id: 2,
    title: 'Parc National de Waza',
    location: 'Région du Nord',
    duration: '1 journée',
    price: '80 000 FCFA',
    image: 'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWZhcmklMjBhbmltYWxzfGVufDF8fHx8MTc2NDMyMjEzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    participants: '4-12 personnes',
    type: 'Safari'
  },
  {
    id: 3,
    title: 'Chutes de la Lobé',
    location: 'Kribi',
    duration: '½ journée',
    price: '25 000 FCFA',
    image: 'https://images.unsplash.com/photo-1633716898262-0e1469d55bb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWluZm9yZXN0JTIwd2F0ZXJmYWxsfGVufDF8fHx8MTc2NDM5NDI3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    participants: 'Tous',
    type: 'Nature'
  },
  {
    id: 4,
    title: 'Séjour Balnéaire Kribi',
    location: 'Kribi',
    duration: '3-7 jours',
    price: 'À partir de 200 000 FCFA',
    image: 'https://images.unsplash.com/photo-1629711129507-d09c820810b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMHJlc29ydCUyMHBvb2x8ZW58MXx8fHwxNzY0MzI5NjI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    participants: 'Familles',
    type: 'Plage & Resort'
  },
  {
    id: 5,
    title: 'Culture Bamiléké',
    location: 'Ouest Cameroun',
    duration: '1 journée',
    price: '45 000 FCFA',
    image: 'https://images.unsplash.com/photo-1583166614230-ce6c3a0d20b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwY3VsdHVyZSUyMGZlc3RpdmFsfGVufDF8fHx8MTc2NDQwNTYwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    participants: '2-20 personnes',
    type: 'Culture'
  },
  {
    id: 6,
    title: 'Plongée Limbe',
    location: 'Limbe',
    duration: '½ journée',
    price: '35 000 FCFA',
    image: 'https://images.unsplash.com/photo-1676186013887-fa1c4c658274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMHVuZGVyd2F0ZXIlMjBjb3JhbHxlbnwxfHx8fDE3NjQ0MDU2MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    participants: '2-6 personnes',
    type: 'Sports aquatiques'
  }
];

export default function DestinationsGrid() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl mb-2">Les meilleures offres du moment</h2>
          <p className="text-gray-600">Réservez vos expériences inoubliables</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer group"
            >
              <div className="relative h-56 overflow-hidden">
                <ImageWithFallback
                  src={destination.image}
                  alt={destination.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-4 left-4 bg-green-700 text-white px-3 py-1 rounded-full text-sm">
                  {destination.type}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl mb-2">{destination.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{destination.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{destination.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{destination.participants}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">À partir de</p>
                    <p className="text-green-700">{destination.price}</p>
                  </div>
                  <button className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-800 transition">
                    Réserver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
