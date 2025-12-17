import React, { useState } from 'react';
import { X, Calendar, Users, Clock, Bed, MapPin, CheckCircle } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeData: {
    name: string;
    category: 'hotels' | 'restaurants' | 'activities' | 'popular';
    location: string;
    image: string;
  };
}

export default function BookingModal({ isOpen, onClose, placeData }: BookingModalProps) {
  const [bookingStep, setBookingStep] = useState<'form' | 'confirmation'>('form');
  
  // Hotel booking data
  const [hotelBooking, setHotelBooking] = useState({
    checkIn: '',
    checkOut: '',
    roomType: 'standard',
    numberOfRooms: 1,
    numberOfGuests: 2,
    fullName: '',
    email: '',
    phone: '',
  });

  // Restaurant booking data
  const [restaurantBooking, setRestaurantBooking] = useState({
    date: '',
    time: '',
    numberOfGuests: 2,
    specialRequests: '',
    fullName: '',
    email: '',
    phone: '',
  });

  // Activity booking data
  const [activityBooking, setActivityBooking] = useState({
    date: '',
    numberOfParticipants: 2,
    timeSlot: 'morning',
    fullName: '',
    email: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStep('confirmation');
  };

  const handleClose = () => {
    setBookingStep('form');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full relative overflow-hidden animate-fade-in max-h-[95vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-green-600 transition-colors duration-200 z-10"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {bookingStep === 'form' ? (
          <>
            {/* Header with image */}
            <div className="relative h-48">
              <img
                src={placeData.image}
                alt={placeData.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h2 className="text-3xl mb-2">{placeData.name}</h2>
                  <p className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    {placeData.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="p-8">
              <h3 className="text-2xl text-gray-900 mb-6">
                {placeData.category === 'hotels' && 'Réserver votre séjour'}
                {placeData.category === 'restaurants' && 'Réserver une table'}
                {placeData.category === 'activities' && 'Réserver votre activité'}
                {placeData.category === 'popular' && 'Faire une réservation'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Hotel Booking Form */}
                {placeData.category === 'hotels' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Date d'arrivée <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                          <input
                            type="date"
                            value={hotelBooking.checkIn}
                            onChange={(e) => setHotelBooking({ ...hotelBooking, checkIn: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            required
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Date de départ <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                          <input
                            type="date"
                            value={hotelBooking.checkOut}
                            onChange={(e) => setHotelBooking({ ...hotelBooking, checkOut: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            required
                            min={hotelBooking.checkIn || new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Type de chambre <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Bed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                        <select
                          value={hotelBooking.roomType}
                          onChange={(e) => setHotelBooking({ ...hotelBooking, roomType: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                          required
                        >
                          <option value="standard">Chambre Standard</option>
                          <option value="deluxe">Chambre Deluxe</option>
                          <option value="suite">Suite</option>
                          <option value="presidential">Suite Présidentielle</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Nombre de chambres <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Bed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={hotelBooking.numberOfRooms}
                            onChange={(e) => setHotelBooking({ ...hotelBooking, numberOfRooms: parseInt(e.target.value) })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Nombre de personnes <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={hotelBooking.numberOfGuests}
                            onChange={(e) => setHotelBooking({ ...hotelBooking, numberOfGuests: parseInt(e.target.value) })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-5 mt-5">
                      <h4 className="text-lg text-gray-900 mb-4">Informations de contact</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">
                            Nom complet <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={hotelBooking.fullName}
                            onChange={(e) => setHotelBooking({ ...hotelBooking, fullName: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            placeholder="Prénom et Nom"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-700 mb-2">
                              Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              value={hotelBooking.email}
                              onChange={(e) => setHotelBooking({ ...hotelBooking, email: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                              placeholder="exemple@email.com"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-700 mb-2">
                              Téléphone <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              value={hotelBooking.phone}
                              onChange={(e) => setHotelBooking({ ...hotelBooking, phone: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                              placeholder="+237 6XX XX XX XX"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Restaurant Booking Form */}
                {placeData.category === 'restaurants' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                          <input
                            type="date"
                            value={restaurantBooking.date}
                            onChange={(e) => setRestaurantBooking({ ...restaurantBooking, date: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            required
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Heure <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                          <select
                            value={restaurantBooking.time}
                            onChange={(e) => setRestaurantBooking({ ...restaurantBooking, time: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            required
                          >
                            <option value="">Sélectionnez l'heure</option>
                            <option value="12:00">12:00</option>
                            <option value="12:30">12:30</option>
                            <option value="13:00">13:00</option>
                            <option value="13:30">13:30</option>
                            <option value="14:00">14:00</option>
                            <option value="19:00">19:00</option>
                            <option value="19:30">19:30</option>
                            <option value="20:00">20:00</option>
                            <option value="20:30">20:30</option>
                            <option value="21:00">21:00</option>
                            <option value="21:30">21:30</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Nombre de personnes <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={restaurantBooking.numberOfGuests}
                          onChange={(e) => setRestaurantBooking({ ...restaurantBooking, numberOfGuests: parseInt(e.target.value) })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Demandes spéciales (optionnel)
                      </label>
                      <textarea
                        value={restaurantBooking.specialRequests}
                        onChange={(e) => setRestaurantBooking({ ...restaurantBooking, specialRequests: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none"
                        rows={3}
                        placeholder="Allergies, préférences de table, etc."
                      />
                    </div>

                    <div className="border-t pt-5 mt-5">
                      <h4 className="text-lg text-gray-900 mb-4">Informations de contact</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">
                            Nom complet <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={restaurantBooking.fullName}
                            onChange={(e) => setRestaurantBooking({ ...restaurantBooking, fullName: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            placeholder="Prénom et Nom"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-700 mb-2">
                              Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              value={restaurantBooking.email}
                              onChange={(e) => setRestaurantBooking({ ...restaurantBooking, email: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                              placeholder="exemple@email.com"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-700 mb-2">
                              Téléphone <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              value={restaurantBooking.phone}
                              onChange={(e) => setRestaurantBooking({ ...restaurantBooking, phone: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                              placeholder="+237 6XX XX XX XX"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Activity Booking Form */}
                {(placeData.category === 'activities' || placeData.category === 'popular') && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Date de l'activité <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                        <input
                          type="date"
                          value={activityBooking.date}
                          onChange={(e) => setActivityBooking({ ...activityBooking, date: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Créneau horaire <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                        <select
                          value={activityBooking.timeSlot}
                          onChange={(e) => setActivityBooking({ ...activityBooking, timeSlot: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                          required
                        >
                          <option value="morning">Matin (8h - 12h)</option>
                          <option value="afternoon">Après-midi (14h - 18h)</option>
                          <option value="evening">Soirée (18h - 22h)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Nombre de participants <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={activityBooking.numberOfParticipants}
                          onChange={(e) => setActivityBooking({ ...activityBooking, numberOfParticipants: parseInt(e.target.value) })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                          required
                        />
                      </div>
                    </div>

                    <div className="border-t pt-5 mt-5">
                      <h4 className="text-lg text-gray-900 mb-4">Informations de contact</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">
                            Nom complet <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={activityBooking.fullName}
                            onChange={(e) => setActivityBooking({ ...activityBooking, fullName: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            placeholder="Prénom et Nom"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-700 mb-2">
                              Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              value={activityBooking.email}
                              onChange={(e) => setActivityBooking({ ...activityBooking, email: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                              placeholder="exemple@email.com"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-700 mb-2">
                              Téléphone <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              value={activityBooking.phone}
                              onChange={(e) => setActivityBooking({ ...activityBooking, phone: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                              placeholder="+237 6XX XX XX XX"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full bg-green-700 text-white py-4 rounded-xl hover:bg-green-800 transition-colors duration-200 text-lg"
                >
                  Confirmer la réservation
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Confirmation Screen */
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-700" />
            </div>
            <h2 className="text-3xl text-gray-900 mb-4">Réservation confirmée !</h2>
            <p className="text-gray-600 mb-8">
              Votre réservation pour <span className="text-green-700">{placeData.name}</span> a été confirmée avec succès.
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="text-lg text-gray-900 mb-4">Récapitulatif de votre réservation</h3>
              <div className="space-y-3 text-sm">
                {placeData.category === 'hotels' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Arrivée:</span>
                      <span className="text-gray-900">{new Date(hotelBooking.checkIn).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Départ:</span>
                      <span className="text-gray-900">{new Date(hotelBooking.checkOut).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type de chambre:</span>
                      <span className="text-gray-900 capitalize">{hotelBooking.roomType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre de chambres:</span>
                      <span className="text-gray-900">{hotelBooking.numberOfRooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre de personnes:</span>
                      <span className="text-gray-900">{hotelBooking.numberOfGuests}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3 mt-3">
                      <span className="text-gray-600">Nom:</span>
                      <span className="text-gray-900">{hotelBooking.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-gray-900">{hotelBooking.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Téléphone:</span>
                      <span className="text-gray-900">{hotelBooking.phone}</span>
                    </div>
                  </>
                )}

                {placeData.category === 'restaurants' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="text-gray-900">{new Date(restaurantBooking.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Heure:</span>
                      <span className="text-gray-900">{restaurantBooking.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre de personnes:</span>
                      <span className="text-gray-900">{restaurantBooking.numberOfGuests}</span>
                    </div>
                    {restaurantBooking.specialRequests && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Demandes spéciales:</span>
                        <span className="text-gray-900">{restaurantBooking.specialRequests}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-3 mt-3">
                      <span className="text-gray-600">Nom:</span>
                      <span className="text-gray-900">{restaurantBooking.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-gray-900">{restaurantBooking.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Téléphone:</span>
                      <span className="text-gray-900">{restaurantBooking.phone}</span>
                    </div>
                  </>
                )}

                {(placeData.category === 'activities' || placeData.category === 'popular') && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="text-gray-900">{new Date(activityBooking.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Créneau:</span>
                      <span className="text-gray-900 capitalize">
                        {activityBooking.timeSlot === 'morning' && 'Matin (8h - 12h)'}
                        {activityBooking.timeSlot === 'afternoon' && 'Après-midi (14h - 18h)'}
                        {activityBooking.timeSlot === 'evening' && 'Soirée (18h - 22h)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Participants:</span>
                      <span className="text-gray-900">{activityBooking.numberOfParticipants}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3 mt-3">
                      <span className="text-gray-600">Nom:</span>
                      <span className="text-gray-900">{activityBooking.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-gray-900">{activityBooking.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Téléphone:</span>
                      <span className="text-gray-900">{activityBooking.phone}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Un email de confirmation vous a été envoyé à l'adresse indiquée.
            </p>

            <button
              onClick={handleClose}
              className="w-full bg-green-700 text-white py-3 rounded-xl hover:bg-green-800 transition-colors duration-200"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
