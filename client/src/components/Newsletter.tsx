import React, { useState } from 'react';
import { Mail, Send, MapPin, Sparkles, CheckCircle } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background avec motifs camerounais stylisés */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-600 to-yellow-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-24 h-24 border-4 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/20 rotate-45" />
          <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-white/10 rotate-12 rounded-lg" />
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-white/20">
          <div className="text-center max-w-2xl mx-auto">
            {/* En-tête */}
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm font-medium">Restez connecté au Cameroun</span>
            </div>

            <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              Explorez le Cameroun avec nous
            </h2>
            <p className="text-white/90 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
              Recevez chaque semaine les trésors cachés du Cameroun : nouveaux sites à découvrir, 
              événements culturels, recettes traditionnelles et conseils de voyage.
            </p>

            {/* Formulaire */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Votre adresse email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3.5 rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
                  >
                    <Send className="w-4 h-4" />
                    <span>S'abonner</span>
                  </button>
                </div>
                <p className="text-white/60 text-xs mt-3">
                  📬 Pas de spam, uniquement les meilleures découvertes camerounaises
                </p>
              </form>
            ) : (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <p className="text-white text-lg font-semibold">Merci pour votre inscription !</p>
                <p className="text-white/80 text-sm">Bienvenue dans la communauté CamerTrip 🇨🇲</p>
              </div>
            )}

            {/* Stats ou info */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-yellow-400" />
                  <span>10 régions à explorer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎭</span>
                  <span>250+ ethnies</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🍲</span>
                  <span>Gastronomie unique</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
