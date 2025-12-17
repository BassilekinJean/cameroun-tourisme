import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ContactPageProps {
  onBack: () => void;
}

export default function ContactPage({ onBack }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simuler l'envoi du formulaire
    setTimeout(() => {
      alert('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec retour */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-green-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-green-800 to-green-600">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1553775282-20af80779df7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250YWN0JTIwc3VwcG9ydCUyMGN1c3RvbWVyJTIwc2VydmljZXxlbnwxfHx8fDE3NjU5NDg3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Contact"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl mb-2">Contactez-nous</h1>
            <p className="text-xl text-green-100">
              Notre équipe est à votre écoute pour répondre à toutes vos questions
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations de contact */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl mb-4">Nos coordonnées</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Phone className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="text-gray-800">+237 699 123 456</p>
                    <p className="text-gray-800">+237 677 987 654</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">contact@camertrip.cm</p>
                    <p className="text-gray-800">support@camertrip.cm</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p className="text-gray-800">
                      Boulevard de la Liberté<br />
                      Douala, Cameroun
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Horaires</p>
                    <p className="text-gray-800">
                      Lun - Ven : 8h00 - 18h00<br />
                      Sam : 9h00 - 13h00<br />
                      Dim : Fermé
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-700 to-green-800 rounded-xl p-6 shadow-md text-white">
              <h3 className="text-xl mb-3">Besoin d'aide ?</h3>
              <p className="text-green-100 mb-4">
                Notre équipe d'assistance est disponible pour vous aider à planifier votre voyage au Cameroun.
              </p>
              <p className="text-sm text-green-200">
                Temps de réponse moyen : 2 heures
              </p>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-md">
              <h3 className="text-2xl mb-6">Envoyez-nous un message</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                      placeholder="+237 6XX XXX XXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Sujet <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="reservation">Réservation</option>
                      <option value="information">Demande d'information</option>
                      <option value="reclamation">Réclamation</option>
                      <option value="partenariat">Partenariat</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
                    placeholder="Décrivez votre demande..."
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-gray-500">
                    <span className="text-red-500">*</span> Champs obligatoires
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-green-700 text-white px-8 py-3 rounded-full hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Envoyer le message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
