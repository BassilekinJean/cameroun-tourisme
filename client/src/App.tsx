import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedBanner from './components/FeaturedBanner';
import ActivitiesSection from './components/ActivitiesSection';
import DestinationsGrid from './components/DestinationsGrid';
import HotelsSection from './components/HotelsSection';
import TravellersChoice from './components/TravellersChoice';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import DestinationPage from './components/DestinationPage';
import ActivityPage from './components/ActivityPage';
import ActivityFormModal from './components/ActivityFormModal';
import UserProfilePage from './components/UserProfilePage';
import WriteReviewPage from './components/WriteReviewPage';
import ShareTipPage from './components/ShareTipPage';
import PublishPhotosPage from './components/PublishPhotosPage';
import AddPlacePage, { PlaceData } from './components/AddPlacePage';
import DetailsPage, { DetailsItem } from './components/DetailsPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import SearchResultsPage from './components/SearchResultsPage';
import AdminDashboard from './components/AdminDashboard';
import EtablissementPanel from './components/EtablissementPanel';
import { Review } from './components/ReviewSection';
import { checkAuth, logout as apiLogout } from './api/authService';
import type { User, Role } from './api/types';

// Ré-exporter le type User pour les composants qui l'importent depuis App.tsx
export type { User } from './api/types';

type PageType = 'home' | 'destination' | 'activities' | 'profile' | 'write-review' | 'share-tip' | 'publish-photos' | 'add-place' | 'details' | 'about' | 'contact' | 'search' | 'admin' | 'etablissement-panel';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [selectedActivityCategory, setSelectedActivityCategory] = useState<string>('all');
  const [isActivityFormOpen, setIsActivityFormOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedDetailsItem, setSelectedDetailsItem] = useState<DetailsItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<'all' | 'hotels' | 'restaurants' | 'activities'>('all');

  // Vérifier l'authentification au démarrage (via cookie HttpOnly)
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Gérer le callback OAuth2 si on est sur /auth/callback
        const currentPath = window.location.pathname;
        if (currentPath === '/auth/callback') {
          // Après OAuth2, les cookies HttpOnly sont déjà définis par le backend
          // On récupère l'utilisateur et on nettoie l'URL
          const user = await checkAuth();
          if (user) {
            setCurrentUser(user);
            localStorage.setItem('camertrip_user', JSON.stringify(user));
          }
          // Nettoyer l'URL pour revenir à la racine
          window.history.replaceState({}, document.title, '/');
          return;
        }

        // D'abord essayer de récupérer l'utilisateur depuis le serveur
        const user = await checkAuth();
        if (user) {
          setCurrentUser(user);
          localStorage.setItem('camertrip_user', JSON.stringify(user));
        } else {
          // Si pas authentifié côté serveur, vérifier le localStorage comme fallback
          const savedUser = localStorage.getItem('camertrip_user');
          if (savedUser) {
            try {
              setCurrentUser(JSON.parse(savedUser));
            } catch (error) {
              console.error('Erreur lors du chargement de l\'utilisateur', error);
              localStorage.removeItem('camertrip_user');
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification', error);
        // Fallback sur localStorage
        const savedUser = localStorage.getItem('camertrip_user');
        if (savedUser) {
          try {
            setCurrentUser(JSON.parse(savedUser));
          } catch (e) {
            localStorage.removeItem('camertrip_user');
          }
        }
      }
    };

    initAuth();

    // Charger les avis depuis localStorage
    const savedReviews = localStorage.getItem('camertrip_reviews');
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (error) {
        console.error('Erreur lors du chargement des avis', error);
        localStorage.removeItem('camertrip_reviews');
      }
    }

    // Écouter l'événement de déconnexion automatique
    const handleAutoLogout = () => {
      setCurrentUser(null);
      localStorage.removeItem('camertrip_user');
      setCurrentPage('home');
    };
    window.addEventListener('auth:logout', handleAutoLogout);
    return () => window.removeEventListener('auth:logout', handleAutoLogout);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // Sauvegarder dans localStorage
    localStorage.setItem('camertrip_user', JSON.stringify(user));
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
    setCurrentUser(null);
    setCurrentPage('home');
    // Supprimer de localStorage
    localStorage.removeItem('camertrip_user');
  };

  const handleDestinationSelect = (destination: string) => {
    setSelectedDestination(destination);
    setCurrentPage('destination');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleDiscoverActivities = () => {
    setSelectedActivityCategory('all');
    setCurrentPage('activities');
  };

  const handleActivityCategoryClick = (category: string) => {
    setSelectedActivityCategory(category);
    setCurrentPage('activities');
  };

  const handleAddActivity = () => {
    setIsActivityFormOpen(true);
  };

  const handleGoToProfile = () => {
    setCurrentPage('profile');
  };

  const handleUpdateUser = (user: User) => {
    setCurrentUser(user);
    // Mettre à jour dans localStorage
    localStorage.setItem('camertrip_user', JSON.stringify(user));
  };

  const handleAddReview = (placeId: string, placeName: string, rating: number, comment: string) => {
    if (!currentUser) return;

    const newReview: Review = {
      id: Date.now().toString(),
      placeId,
      placeName,
      userId: currentUser.email,
      userName: currentUser.nomComplet,
      rating,
      comment,
      date: new Date().toISOString(),
      helpful: 0
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('camertrip_reviews', JSON.stringify(updatedReviews));
  };

  const handleSubmitReview = (placeId: string, placeName: string, placeType: string, rating: number, comment: string, images: string[]) => {
    if (!currentUser) return;

    const newReview: Review = {
      id: Date.now().toString(),
      placeId,
      placeName,
      userId: currentUser.email,
      userName: currentUser.nomComplet,
      rating,
      comment,
      date: new Date().toISOString(),
      helpful: 0
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem('camertrip_reviews', JSON.stringify(updatedReviews));

    // Sauvegarder les images associées (pour une future implémentation)
    console.log('Photos soumises:', images);
  };

  const handleSubmitTip = (placeId: string, placeName: string, placeType: string, tipCategory: string, tipContent: string) => {
    if (!currentUser) return;
    
    // Pour l'instant, on stocke les conseils dans localStorage
    const tips = JSON.parse(localStorage.getItem('camertrip_tips') || '[]');
    const newTip = {
      id: Date.now().toString(),
      placeId,
      placeName,
      placeType,
      category: tipCategory,
      content: tipContent,
      userId: currentUser.email,
      userName: currentUser.nomComplet,
      date: new Date().toISOString(),
      helpful: 0
    };
    
    tips.push(newTip);
    localStorage.setItem('camertrip_tips', JSON.stringify(tips));
  };

  const handleSubmitPhotos = (placeId: string, placeName: string, placeType: string, photos: { url: string; caption: string }[]) => {
    if (!currentUser) return;
    
    // Pour l'instant, on stocke les photos dans localStorage
    const allPhotos = JSON.parse(localStorage.getItem('camertrip_photos') || '[]');
    const newPhotoEntry = {
      id: Date.now().toString(),
      placeId,
      placeName,
      placeType,
      photos,
      userId: currentUser.email,
      userName: currentUser.nomComplet,
      date: new Date().toISOString()
    };
    
    allPhotos.push(newPhotoEntry);
    localStorage.setItem('camertrip_photos', JSON.stringify(allPhotos));
  };

  const handleSubmitPlace = (placeData: PlaceData) => {
    if (!currentUser) return;
    
    // Pour l'instant, on stocke les lieux dans localStorage
    const places = JSON.parse(localStorage.getItem('camertrip_places') || '[]');
    const newPlace = {
      ...placeData,
      id: Date.now().toString(),
      submittedBy: currentUser.email,
      submitterName: currentUser.nomComplet,
      submittedDate: new Date().toISOString(),
      status: 'pending' // En attente de validation
    };
    
    places.push(newPlace);
    localStorage.setItem('camertrip_places', JSON.stringify(places));
  };

  const handleWriteReview = () => {
    setCurrentPage('write-review');
  };

  const handleShareTip = () => {
    setCurrentPage('share-tip');
  };

  const handlePublishPhotos = () => {
    setCurrentPage('publish-photos');
  };

  const handleAddPlace = () => {
    setCurrentPage('add-place');
  };

  const handleDetailsPage = (item: DetailsItem) => {
    setSelectedDetailsItem(item);
    setCurrentPage('details');
    // Scroll vers le haut immédiatement
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAboutPage = () => {
    setCurrentPage('about');
  };

  const handleContactPage = () => {
    setCurrentPage('contact');
  };

  const handleSearch = (query: string, category?: 'all' | 'hotels' | 'restaurants' | 'activities') => {
    setSearchQuery(query);
    if (category) setSearchCategory(category);
    setCurrentPage('search');
  };

  const handleGoToAdmin = () => {
    if (currentUser?.role === 'ADMIN') {
      setCurrentPage('admin');
    }
  };

  const handleGoToEtablissementPanel = () => {
    if (currentUser?.role === 'ETABLISSEMENT' || currentUser?.role === 'ADMIN') {
      setCurrentPage('etablissement-panel');
    }
  };

  // Si on est sur le panneau admin, ne pas afficher le header/footer standard
  if (currentPage === 'admin' && currentUser?.role === 'ADMIN') {
    return (
      <AdminDashboard
        currentUser={currentUser}
        onBack={handleBackToHome}
      />
    );
  }

  // Si on est sur le panneau établissement
  if (currentPage === 'etablissement-panel' && (currentUser?.role === 'ETABLISSEMENT' || currentUser?.role === 'ADMIN')) {
    return (
      <EtablissementPanel
        currentUser={currentUser}
        onBack={handleBackToHome}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <Header 
        currentUser={currentUser} 
        onLogout={handleLogout} 
        onLogin={handleLogin}
        onDestinationSelect={handleDestinationSelect}
        onDiscoverActivities={handleDiscoverActivities}
        onAddActivity={handleAddActivity}
        onGoToProfile={handleGoToProfile}
        onWriteReview={handleWriteReview}
        onShareTip={handleShareTip}
        onPublishPhotos={handlePublishPhotos}
        onAddPlace={handleAddPlace}
        onAboutPage={handleAboutPage}
        onContactPage={handleContactPage}
        currentPage={currentPage}
        onSearch={handleSearch}
        onGoToAdmin={handleGoToAdmin}
        onGoToEtablissementPanel={handleGoToEtablissementPanel}
      />
      
      {currentPage === 'home' && (
        <main>
          <Hero onSearch={handleSearch} />
          <FeaturedBanner onLearnMore={handleAboutPage} />
          <ActivitiesSection onCategoryClick={handleActivityCategoryClick} />
          <DestinationsGrid onShowDetails={handleDetailsPage} />
          <HotelsSection onShowDetails={handleDetailsPage} />
          <TravellersChoice />
          <Newsletter />
        </main>
      )}

      {currentPage === 'destination' && (
        <DestinationPage 
          destination={selectedDestination} 
          onBackToHome={handleBackToHome}
          currentUser={currentUser}
          reviews={reviews}
          onAddReview={handleAddReview}
          onShowDetails={handleDetailsPage}
        />
      )}

      {currentPage === 'activities' && (
        <ActivityPage 
          onBackToHome={handleBackToHome}
          onAddActivity={handleAddActivity}
          initialCategory={selectedActivityCategory}
          currentUser={currentUser}
          reviews={reviews}
          onAddReview={handleAddReview}
          onShowDetails={handleDetailsPage}
        />
      )}

      {currentPage === 'profile' && currentUser && (
        <UserProfilePage 
          user={currentUser}
          onUpdateUser={handleUpdateUser}
          onBackToHome={handleBackToHome}
        />
      )}
      
      {currentPage === 'write-review' && (
        <WriteReviewPage 
          onBackToHome={handleBackToHome}
          currentUser={currentUser}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {currentPage === 'share-tip' && (
        <ShareTipPage 
          onBackToHome={handleBackToHome}
          currentUser={currentUser}
          onSubmitTip={handleSubmitTip}
        />
      )}

      {currentPage === 'publish-photos' && (
        <PublishPhotosPage 
          onBackToHome={handleBackToHome}
          currentUser={currentUser}
          onSubmitPhotos={handleSubmitPhotos}
        />
      )}

      {currentPage === 'add-place' && (
        <AddPlacePage 
          onBackToHome={handleBackToHome}
          currentUser={currentUser}
          onSubmitPlace={handleSubmitPlace}
        />
      )}
      
      {currentPage === 'details' && selectedDetailsItem && (
        <DetailsPage 
          item={selectedDetailsItem}
          onBack={handleBackToHome}
          currentUser={currentUser}
          reviews={reviews}
          onAddReview={handleAddReview}
          onUpdateUser={handleUpdateUser}
        />
      )}
      
      {currentPage === 'about' && (
        <AboutPage 
          onBack={handleBackToHome}
        />
      )}
      
      {currentPage === 'contact' && (
        <ContactPage 
          onBack={handleBackToHome}
        />
      )}
      
      {currentPage === 'search' && (
        <SearchResultsPage 
          searchQuery={searchQuery}
          initialCategory={searchCategory}
          onBack={handleBackToHome}
          onShowDetails={handleDetailsPage}
        />
      )}
      
      <Footer />

      <ActivityFormModal 
        isOpen={isActivityFormOpen}
        onClose={() => setIsActivityFormOpen(false)}
      />
    </div>
  );
}