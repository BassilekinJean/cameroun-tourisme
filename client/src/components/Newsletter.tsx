import React, { useState } from 'react';
import { Mail, Send, MapPin, Sparkles, CheckCircle, Gift, Plane } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsLoading(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 4000);
  };

  return (
    <section className="relative overflow-hidden py-20">
      {/* Background avec palette harmonieuse - Teintes analogues (émeraude/teal/cyan) */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700">
        {/* Pattern subtil */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Formes décoratives avec couleurs cohérentes */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-36 h-36 bg-teal-300/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-cyan-400/15 rounded-full blur-xl" />
        <div className="absolute bottom-1/3 left-1/5 w-16 h-16 bg-emerald-300/15 rounded-full blur-lg" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/25 shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Contenu gauche */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm mb-6 backdrop-blur-sm border border-white/20">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Restez connecté au Cameroun</span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-5 leading-tight">
                Explorez le Cameroun
                <span className="block bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                  avec nous
                </span>
              </h2>
              
              <p className="text-white/85 text-lg mb-8 leading-relaxed">
                Recevez chaque semaine les trésors cachés du Cameroun : nouveaux sites, 
                événements culturels, recettes traditionnelles et conseils de voyage.
              </p>

              {/* Caractéristiques avec icônes */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: Gift, text: 'Offres exclusives' },
                  { icon: Plane, text: 'Guides gratuits' },
                  { icon: Mail, text: 'Conseils voyage' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-sm">
                    <feature.icon className="w-5 h-5 text-amber-300 flex-shrink-0" />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulaire à droite */}
            <div className="lg:pl-6">
              {isSubmitted ? (
                <div className="bg-white/20 backdrop-blur-md rounded-3xl p-10 text-center border border-white/30 shadow-xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg ring-4 ring-white/20">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Merci pour votre inscription !
                  </h3>
                  <p className="text-white/80 text-lg">
                    Bienvenue dans la communauté CamerTrip 🇨🇲
                  </p>
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Votre adresse email"
                        required
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-amber-400/40 text-lg shadow-lg border border-gray-100"
                      />
                    </div>
                    
                    {/* Bouton avec couleur complémentaire (ambre/doré) */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 py-4 rounded-2xl font-bold text-lg hover:from-amber-400 hover:to-yellow-400 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-3"
                    >
                      {isLoading ? (
                        <div className="w-6 h-6 border-3 border-gray-900 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          S'abonner maintenant
                        </>
                      )}
                    </button>

                    <p className="text-white/60 text-xs text-center pt-2">
                      🔒 Pas de spam, uniquement les meilleures découvertes camerounaises. Désabonnement à tout moment.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats en bas */}
        <div className="mt-10 flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-white/80 text-sm">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <MapPin className="w-4 h-4 text-amber-300" />
            <span>10 régions à explorer</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <span className="text-lg">🎭</span>
            <span>250+ ethnies</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <span className="text-lg">🍲</span>
            <span>Gastronomie unique</span>
          </div>
        </div>
      </div>
    </section>
  );
}
