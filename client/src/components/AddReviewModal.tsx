import React, { useState } from 'react';
import { X, Star, Send, Loader2, LogIn, AlertCircle, CheckCircle, User } from 'lucide-react';
import type { User as UserType } from '../api/types';
import { createAvis } from '../api/avisService';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReview: (placeId: string, placeName: string, rating: number, comment: string) => void;
  placeName: string;
  placeId: string;
  currentUser: UserType | null;
  onOpenAuthModal?: () => void;
}

export default function AddReviewModal({ 
  isOpen, 
  onClose, 
  onAddReview, 
  placeName, 
  placeId,
  currentUser,
  onOpenAuthModal
}: AddReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    // Vérifier l'authentification
    if (!currentUser) {
      setSubmitError('Vous devez être connecté pour publier un avis');
      return;
    }
    
    const newErrors: { rating?: string; comment?: string } = {};
    
    if (rating === 0) {
      newErrors.rating = 'Veuillez sélectionner une note';
    }
    
    if (!comment.trim()) {
      newErrors.comment = 'Veuillez rédiger un commentaire';
    } else if (comment.trim().length < 5) {
      newErrors.comment = 'Le commentaire doit contenir au moins 5 caractères';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Appeler l'API pour créer l'avis
      const response = await createAvis(placeId, {
        message: comment,
        note: rating
      });

      if (response.success) {
        setSubmitSuccess(true);
        // Appeler aussi le callback local pour mettre à jour l'UI
        onAddReview(placeId, placeName, rating, comment);
        
        // Attendre un peu puis fermer
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setSubmitError(response.message || 'Erreur lors de la publication de l\'avis');
      }
    } catch (error) {
      setSubmitError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setComment('');
    setErrors({});
    setSubmitSuccess(false);
    setSubmitError(null);
    onClose();
  };

  const getRatingLabel = (value: number) => {
    const labels: Record<number, string> = {
      1: 'Décevant 😞',
      2: 'Moyen 😐',
      3: 'Correct 🙂',
      4: 'Très bien 😊',
      5: 'Excellent 🤩'
    };
    return labels[value] || '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative animate-fade-in">
        {/* Close button - Toujours visible */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-full flex items-center justify-center transition-all duration-200 z-20 shadow-md"
          aria-label="Fermer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-5 pr-16">
          <h2 className="text-xl font-semibold mb-1">Laisser un avis</h2>
          <p className="text-green-100 text-sm">
            Partagez votre expérience sur <span className="font-medium">{placeName}</span>
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Merci pour votre avis !</h3>
            <p className="text-gray-600">Votre avis a été publié avec succès.</p>
          </div>
        )}

        {/* Not Authenticated Message */}
        {!currentUser && !submitSuccess && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Connexion requise</h3>
            <p className="text-gray-600 mb-6">
              Pour publier un avis, vous devez être connecté à votre compte CamerTrip.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  handleClose();
                  onOpenAuthModal?.();
                }}
                className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Se connecter
              </button>
              <button
                onClick={handleClose}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Form (only if authenticated and not success) */}
        {currentUser && !submitSuccess && (
          <form onSubmit={handleSubmit} className="p-6">
            {/* User info */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold">
                {currentUser.photoProfile ? (
                  <img 
                    src={currentUser.photoProfile} 
                    alt={currentUser.nomComplet} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  currentUser.nomComplet.substring(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{currentUser.nomComplet}</p>
                <p className="text-sm text-gray-500">Votre avis sera publié publiquement</p>
              </div>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {submitError}
              </div>
            )}

            {/* Rating selector */}
            <div className="mb-6">
              <label className="block text-gray-900 font-medium mb-3">
                Votre note <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setRating(star);
                      setErrors({ ...errors, rating: undefined });
                    }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                    disabled={isSubmitting}
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {(rating > 0 || hoverRating > 0) && (
                <p className="text-sm text-gray-600 font-medium">
                  {getRatingLabel(hoverRating || rating)}
                </p>
              )}
              {errors.rating && (
                <p className="text-sm text-red-500 mt-1">{errors.rating}</p>
              )}
            </div>

            {/* Comment textarea */}
            <div className="mb-6">
              <label className="block text-gray-900 font-medium mb-3">
                Votre avis <span className="text-red-500">*</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  if (errors.comment) {
                    setErrors({ ...errors, comment: undefined });
                  }
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none ${
                  errors.comment ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={5}
                placeholder="Décrivez votre expérience, ce que vous avez aimé, vos conseils pour les futurs visiteurs..."
                disabled={isSubmitting}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  Minimum 5 caractères
                </p>
                <p className={`text-xs ${comment.length >= 5 ? 'text-green-600' : 'text-gray-400'}`}>
                  {comment.length} caractères
                </p>
              </div>
              {errors.comment && (
                <p className="text-sm text-red-500 mt-1">{errors.comment}</p>
              )}
            </div>

            {/* Tips */}
            <div className="mb-6 p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-green-800">
                <strong>💡 Conseils :</strong> Un bon avis aide les autres voyageurs ! 
                Parlez de l'ambiance, du service, de ce qui vous a marqué...
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Publication en cours...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Publier mon avis
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
