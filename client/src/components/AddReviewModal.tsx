import React, { useState } from 'react';
import { X, Star, Send } from 'lucide-react';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReview: (placeId: string, placeName: string, rating: number, comment: string) => void;
  placeName: string;
  placeId: string;
}

export default function AddReviewModal({ isOpen, onClose, onAddReview, placeName, placeId }: AddReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { rating?: string; comment?: string } = {};
    
    if (rating === 0) {
      newErrors.rating = 'Veuillez sélectionner une note';
    }
    
    if (!comment.trim()) {
      newErrors.comment = 'Veuillez rédiger un commentaire';
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'Le commentaire doit contenir au moins 10 caractères';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAddReview(placeId, placeName, rating, comment);
    handleClose();
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setComment('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative animate-fade-in">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-green-600 transition-colors duration-200 z-10"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 sticky top-0 z-10">
          <h2 className="text-xl mb-1">Laisser un avis</h2>
          <p className="text-green-100 text-sm">
            Partagez votre expérience sur <span className="font-medium">{placeName}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Rating selector */}
          <div className="mb-5">
            <label className="block text-gray-900 mb-2">
              Votre note <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600">
                {rating === 1 && 'Décevant'}
                {rating === 2 && 'Moyen'}
                {rating === 3 && 'Correct'}
                {rating === 4 && 'Très bien'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
            {errors.rating && (
              <p className="text-sm text-red-500 mt-1">{errors.rating}</p>
            )}
          </div>

          {/* Comment textarea */}
          <div className="mb-5">
            <label className="block text-gray-900 mb-2">
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
              rows={4}
              placeholder="Partagez votre expérience, ce que vous avez aimé, vos recommandations..."
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                Minimum 10 caractères
              </p>
              <p className={`text-xs ${comment.length < 10 ? 'text-gray-400' : 'text-green-600'}`}>
                {comment.length} caractères
              </p>
            </div>
            {errors.comment && (
              <p className="text-sm text-red-500 mt-1">{errors.comment}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-xl hover:bg-green-800 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Publier mon avis
          </button>
        </form>
      </div>
    </div>
  );
}