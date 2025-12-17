import React, { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, User } from 'lucide-react';

export interface Review {
  id: string;
  placeId: string;
  placeName: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface ReviewSectionProps {
  placeId: string;
  placeName: string;
  reviews: Review[];
  currentUser: { nomComplet: string; email: string } | null;
  onAddReview: () => void;
}

export default function ReviewSection({ placeId, placeName, reviews, currentUser, onAddReview }: ReviewSectionProps) {
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());

  // Filtrer les avis pour ce lieu
  const placeReviews = reviews.filter(r => r.placeId === placeId);

  // Calculer la note moyenne
  const averageRating = placeReviews.length > 0
    ? placeReviews.reduce((sum, r) => sum + r.rating, 0) / placeReviews.length
    : 0;

  // Calculer la distribution des notes
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: placeReviews.filter(r => r.rating === rating).length,
    percentage: placeReviews.length > 0
      ? (placeReviews.filter(r => r.rating === rating).length / placeReviews.length) * 100
      : 0
  }));

  const handleHelpful = (reviewId: string) => {
    setHelpfulReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Header avec note moyenne */}
      <div className="border-b border-gray-200 pb-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl text-gray-900 mb-2">
              Avis des voyageurs
            </h2>
            <p className="text-gray-600">
              {placeReviews.length} {placeReviews.length > 1 ? 'avis' : 'avis'}
            </p>
          </div>
          {currentUser && (
            <button
              onClick={onAddReview}
              className="bg-green-700 text-white px-6 py-3 rounded-xl hover:bg-green-800 transition-colors duration-200 flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Laisser un avis
            </button>
          )}
        </div>

        {placeReviews.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Note moyenne */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-6xl text-green-700 mb-2">
                  {averageRating.toFixed(1)}
                </div>
                {renderStars(Math.round(averageRating), 'lg')}
                <p className="text-gray-600 mt-2">Note moyenne</p>
              </div>
            </div>

            {/* Distribution des notes */}
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-8">{rating} ⭐</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-green-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Liste des avis */}
      {placeReviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl text-gray-900 mb-2">
            Aucun avis pour le moment
          </h3>
          <p className="text-gray-600 mb-6">
            Soyez le premier à partager votre expérience !
          </p>
          {currentUser && (
            <button
              onClick={onAddReview}
              className="bg-green-700 text-white px-6 py-3 rounded-xl hover:bg-green-800 transition-colors duration-200 inline-flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Rédiger un avis
            </button>
          )}
          {!currentUser && (
            <p className="text-gray-500 text-sm">
              Connectez-vous pour laisser un avis
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {placeReviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 pb-6 last:border-b-0"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-green-700" />
                  </div>
                </div>

                {/* Contenu de l'avis */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-gray-900 mb-1">
                        {review.userName}
                      </h4>
                      <div className="flex items-center gap-3">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    {review.comment}
                  </p>

                  {/* Bouton "Utile" */}
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className={`flex items-center gap-2 text-sm transition-colors ${
                      helpfulReviews.has(review.id)
                        ? 'text-green-700'
                        : 'text-gray-500 hover:text-green-700'
                    }`}
                  >
                    <ThumbsUp
                      className={`w-4 h-4 ${
                        helpfulReviews.has(review.id) ? 'fill-current' : ''
                      }`}
                    />
                    Utile ({review.helpful + (helpfulReviews.has(review.id) ? 1 : 0)})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
