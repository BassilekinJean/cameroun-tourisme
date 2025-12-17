import React from 'react';
import { 
  ArrowLeft, MapPin, Users, Award, Heart, TrendingUp, 
  Globe, Shield, Star, CheckCircle 
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AboutPageProps {
  onBack: () => void;
}

export default function AboutPage({ onBack }: AboutPageProps) {
  const stats = [
    { icon: MapPin, value: '100+', label: 'Destinations' },
    { icon: Users, value: '50K+', label: 'Voyageurs heureux' },
    { icon: Award, value: '25+', label: 'Récompenses' },
    { icon: Star, value: '4.9', label: 'Note moyenne' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Passion pour le Cameroun',
      description: 'Nous aimons notre pays et nous voulons partager ses merveilles avec le monde entier.'
    },
    {
      icon: Shield,
      title: 'Sécurité et confiance',
      description: 'Votre sécurité est notre priorité. Toutes nos activités sont vérifiées et sécurisées.'
    },
    {
      icon: Globe,
      title: 'Authenticité locale',
      description: 'Découvrez le vrai Cameroun à travers des expériences authentiques et des guides locaux.'
    },
    {
      icon: TrendingUp,
      title: 'Excellence continue',
      description: 'Nous nous efforçons d\'améliorer constamment nos services pour votre satisfaction.'
    },
  ];

  const features = [
    'Réservation en ligne facile et sécurisée',
    'Support client 24/7',
    'Guides touristiques certifiés',
    'Meilleurs prix garantis',
    'Annulation flexible',
    'Paiements sécurisés',
    'Recommandations personnalisées',
    'Expériences uniques et authentiques',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-green-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour à l'accueil</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1615463668140-d294c94ec8ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcm9vbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjQ0MDU2MDF8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="À propos de CamerTrip"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent">
          <div className="h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-white text-5xl md:text-6xl mb-4">
              À propos de CamerTrip
            </h1>
            <p className="text-white text-xl md:text-2xl max-w-2xl">
              Votre guide de confiance pour explorer l'Afrique en miniature
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
              >
                <Icon className="w-10 h-10 text-green-700 mx-auto mb-3" />
                <p className="text-3xl text-gray-900 mb-1">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-12 mb-12">
          <h2 className="text-4xl text-gray-900 mb-6">Notre Mission</h2>
          <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
            <p>
              <strong className="text-green-700">CamerTrip</strong> est né d'une passion profonde pour le Cameroun 
              et d'un désir de partager ses trésors cachés avec le monde entier. Notre mission est de rendre 
              le tourisme camerounais accessible, authentique et inoubliable.
            </p>
            <p>
              Nous croyons que le Cameroun, souvent appelé "l'Afrique en miniature", mérite d'être découvert 
              dans toute sa diversité : des plages paradisiaques de Kribi aux sommets majestueux du Mont Cameroun, 
              des forêts tropicales luxuriantes du Sud aux savanes du Nord, chaque région offre une expérience unique.
            </p>
            <p>
              Notre plateforme connecte les voyageurs avec des expériences authentiques, des guides locaux 
              certifiés et des hébergements de qualité, tout en soutenant le développement du tourisme local 
              et la préservation de notre patrimoine naturel et culturel.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-4xl text-gray-900 mb-8 text-center">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                      <h3 className="text-xl text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 rounded-2xl shadow-xl p-8 md:p-12 text-white mb-12">
          <h2 className="text-4xl mb-8 text-center">Pourquoi choisir CamerTrip ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0" />
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-12">
          <h2 className="text-4xl text-gray-900 mb-6 text-center">Notre Équipe</h2>
          <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto mb-8">
            CamerTrip est composée d'une équipe passionnée de professionnels du tourisme, 
            de guides locaux expérimentés et d'experts en technologie, tous unis par 
            l'amour du Cameroun et le désir d'offrir des expériences exceptionnelles.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-16 h-16 text-green-700" />
              </div>
              <h3 className="text-xl text-gray-900 mb-2">Experts locaux</h3>
              <p className="text-gray-600">
                Des guides certifiés qui connaissent chaque recoin du Cameroun
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-16 h-16 text-green-700" />
              </div>
              <h3 className="text-xl text-gray-900 mb-2">Service client dédié</h3>
              <p className="text-gray-600">
                Une équipe disponible 24/7 pour répondre à vos besoins
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-16 h-16 text-green-700" />
              </div>
              <h3 className="text-xl text-gray-900 mb-2">Partenaires vérifiés</h3>
              <p className="text-gray-600">
                Hôtels, restaurants et prestataires soigneusement sélectionnés
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white text-4xl mb-4">
            Prêt à explorer le Cameroun ?
          </h2>
          <p className="text-green-100 text-xl mb-8">
            Rejoignez des milliers de voyageurs qui ont découvert l'Afrique en miniature avec CamerTrip
          </p>
          <button
            onClick={onBack}
            className="bg-white text-green-700 px-8 py-4 rounded-full hover:bg-gray-100 transition text-lg font-semibold"
          >
            Commencer mon voyage
          </button>
        </div>
      </div>
    </div>
  );
}
