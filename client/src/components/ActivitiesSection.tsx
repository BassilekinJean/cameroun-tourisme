import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star } from 'lucide-react';

interface ActivitiesSectionProps {
  onCategoryClick: (category: string) => void;
}

const activities = [
  {
    id: 1,
    title: 'Safari au parc',
    image: 'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWZhcmklMjBhbmltYWxzfGVufDF8fHx8MTc2NDMyMjEzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.8,
    reviews: 245,
    category: 'Nature & Safari',
    filterCategory: 'Safari' // Catégorie pour le filtre dans ActivityPage
  },
  {
    id: 2,
    title: 'Plages de Kribi',
    image: 'https://images.unsplash.com/photo-1711802536820-186e24f0665a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYmVhY2glMjBzdW5zZXR8ZW58MXx8fHwxNzY0NDA1NjAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.9,
    reviews: 312,
    category: 'Plage & Détente',
    filterCategory: 'Sports' // Sports nautiques
  },
  {
    id: 3,
    title: 'Plongée',
    image: 'https://images.unsplash.com/photo-1676186013887-fa1c4c658274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMHVuZGVyd2F0ZXIlMjBjb3JhbHxlbnwxfHx8fDE3NjQ0MDU2MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.7,
    reviews: 189,
    category: 'Sports aquatiques',
    filterCategory: 'Sports'
  },
  {
    id: 4,
    title: 'Cascades & Randonnée',
    image: 'https://images.unsplash.com/photo-1633716898262-0e1469d55bb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWluZm9yZXN0JTIwd2F0ZXJmYWxsfGVufDF8fHx8MTc2NDM5NDI3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.9,
    reviews: 421,
    category: 'Aventure',
    filterCategory: 'Aventure'
  }
];

export default function ActivitiesSection({ onCategoryClick }: ActivitiesSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h2 className="text-3xl mb-2">Explorez selon vos envies</h2>
        <p className="text-gray-600">Découvrez les meilleures activités au Cameroun</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {activities.map((activity) => (
          <div
            key={activity.id}
            onClick={() => onCategoryClick(activity.filterCategory)}
            className="group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
          >
            <div className="relative h-64 overflow-hidden">
              <ImageWithFallback
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm">
                {activity.category}
              </div>
            </div>
            <div className="p-4 bg-white">
              <h3 className="text-xl mb-2">{activity.title}</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{activity.rating}</span>
                </div>
                <span className="text-sm text-gray-600">({activity.reviews} avis)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}