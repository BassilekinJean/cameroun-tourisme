import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight } from 'lucide-react';

interface FeaturedBannerProps {
  onLearnMore?: () => void;
}

export default function FeaturedBanner({ onLearnMore }: FeaturedBannerProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative rounded-3xl overflow-hidden h-[400px] group cursor-pointer">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1615463668140-d294c94ec8ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcm9vbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjQ0MDU2MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Cameroun Paysage"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent">
          <div className="h-full flex flex-col justify-center px-12">
            <h2 className="text-white text-4xl md:text-5xl mb-4">
              Trouvez des activités selon vos<br />envies
            </h2>
            <p className="text-white text-lg mb-6">
              Explorez le Cameroun authentique et découvrez ses trésors cachés
            </p>
            <button 
              onClick={onLearnMore}
              className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition inline-flex items-center gap-2 w-fit"
            >
              En savoir plus
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}