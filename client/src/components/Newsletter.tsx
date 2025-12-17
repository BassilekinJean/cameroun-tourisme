import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Merci pour votre inscription : ${email}`);
    setEmail('');
  };

  return (
    <section className="bg-gradient-to-r from-green-600 to-teal-600 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Mail className="w-10 h-10 text-white" />
          <h2 className="text-white text-3xl">Restez informé(e)</h2>
        </div>
        <p className="text-white text-lg mb-8">
          Inscrivez-vous à notre newsletter et recevez les meilleures offres et conseils de voyage
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="bg-green-900 text-white px-6 py-3 rounded-full hover:bg-green-950 transition flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              S'inscrire
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
