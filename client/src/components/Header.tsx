import React, { useState } from 'react';
import { Menu, X, ChevronDown, LogOut, User as UserIcon, Shield, Building2 } from 'lucide-react';
import AuthModal from './AuthModal';
import { User } from '../App';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onLogin: (user: User) => void;
  onDestinationSelect: (destination: string) => void;
  onDiscoverActivities: () => void;
  onAddActivity: () => void;
  onGoToProfile: () => void;
  onWriteReview: () => void;
  onShareTip: () => void;
  onPublishPhotos: () => void;
  onAddPlace: () => void;
  onAboutPage?: () => void;
  onContactPage?: () => void;
  onSearch?: (query: string, category?: 'all' | 'hotels' | 'restaurants' | 'activities') => void;
  onGoToAdmin?: () => void;
  onGoToEtablissementPanel?: () => void;
  currentPage: 'home' | 'destination' | 'activities' | 'profile' | 'write-review' | 'share-tip' | 'publish-photos' | 'add-place' | 'details' | 'about' | 'contact' | 'search' | 'admin' | 'etablissement-panel';
}

export default function Header({ currentUser, onLogout, onLogin, onDestinationSelect, onDiscoverActivities, onAddActivity, onGoToProfile, onWriteReview, onShareTip, onPublishPhotos, onAddPlace, onAboutPage, onContactPage, onSearch, onGoToAdmin, onGoToEtablissementPanel, currentPage }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDestinationsMenu, setShowDestinationsMenu] = useState(false);
  const [showActivitiesMenu, setShowActivitiesMenu] = useState(false);
  const [showReviewsMenu, setShowReviewsMenu] = useState(false);
  const [showMobileDestinations, setShowMobileDestinations] = useState(false);

  // Déterminer la page active en fonction de currentPage
  const getActivePage = () => {
    if (currentPage === 'home') return 'Accueil';
    if (currentPage === 'destination') return 'Destinations';
    if (currentPage === 'activities') return 'Découverte';
    if (currentPage === 'profile') return 'Profil';
    if (currentPage === 'write-review' || currentPage === 'share-tip' || currentPage === 'publish-photos' || currentPage === 'add-place') return 'Avis';
    if (currentPage === 'about') return 'À propos';
    if (currentPage === 'contact') return 'Contact';
    if (currentPage === 'search') return 'Recherche';
    if (currentPage === 'admin') return 'Administration';
    if (currentPage === 'etablissement-panel') return 'Mon établissement';
    return 'Accueil';
  };

  const activePage = getActivePage();

  const handleAuthSuccess = (user: User) => {
    onLogin(user);
    setIsAuthModalOpen(false);
  };

  const handleDestinationClick = (destination: string) => {
    setShowDestinationsMenu(false);
    onDestinationSelect(destination);
  };

  const getUserInitials = () => {
    if (!currentUser || !currentUser.nomComplet) return '';
    const parts = currentUser.nomComplet.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
    return currentUser.nomComplet.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center gap-1.5 sm:gap-2 text-green-800 cursor-pointer hover:opacity-80 transition"
              >
                <span className="text-2xl sm:text-3xl lg:text-4xl">🌍</span>
                <span className="text-xl sm:text-2xl lg:text-3xl font-semibold">CamerTrip</span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  window.location.reload();
                }}
                className={`transition duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all after:duration-300 pb-1 ${
                  activePage === 'Accueil' 
                    ? 'text-green-700 after:w-full after:bg-green-700' 
                    : 'text-gray-700 hover:text-green-700 after:w-0 after:bg-green-700 hover:after:w-full'
                }`}
              >
                Accueil
              </a>
              <div 
                className="relative"
                onMouseEnter={() => setShowDestinationsMenu(true)}
                onMouseLeave={() => setShowDestinationsMenu(false)}
              >
                <button 
                  className={`flex items-center transition duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all after:duration-300 pb-1 ${
                    activePage === 'Destinations' 
                      ? 'text-green-700 after:w-full after:bg-green-700' 
                      : 'text-gray-700 hover:text-green-700 after:w-0 after:bg-green-700 hover:after:w-full'
                  }`}
                >
                  Destinations
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                <div className={`absolute w-48 bg-white shadow-lg rounded-lg py-2 mt-1 transition-all duration-200 ${
                  showDestinationsMenu ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}>
                  <button 
                    onClick={() => handleDestinationClick('Adamaoua')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition duration-200"
                  >
                    Adamaoua
                  </button>
                  <button 
                    onClick={() => handleDestinationClick('Centre')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition duration-200"
                  >
                    Centre
                  </button>
                  <button 
                    onClick={() => handleDestinationClick('Est')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition duration-200"
                  >
                    Est
                  </button>
                  <button 
                    onClick={() => handleDestinationClick('Extrême-Nord')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition duration-200"
                  >
                    Extrême-Nord
                  </button>
                  <button 
                    onClick={() => handleDestinationClick('Littoral')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition duration-200"
                  >
                    Littoral
                  </button>
                  <button 
                    onClick={() => handleDestinationClick('Nord')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition duration-200"
                  >
                    Nord
                  </button>
                  <button 
                    onClick={() => handleDestinationClick('Nord-Ouest')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition duration-200"
                  >
                    Nord-Ouest
                  </button>
                  <button 
                    onClick={() => handleDestinationClick('Ouest')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition duration-200"
                  >
                    Ouest
                  </button>
                  <button 
                    onClick={() => handleDestinationClick('Sud')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition duration-200"
                  >
                    Sud
                  </button>
                  <button 
                    onClick={() => handleDestinationClick('Sud-Ouest')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition duration-200"
                  >
                    Sud-Ouest
                  </button>
                </div>
              </div>
              <div 
                className="relative"
                onMouseEnter={() => setShowActivitiesMenu(true)}
                onMouseLeave={() => setShowActivitiesMenu(false)}
              >
                <button 
                  className={`flex items-center transition duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all after:duration-300 pb-1 ${
                    activePage === 'Découverte' 
                      ? 'text-green-700 after:w-full after:bg-green-700' 
                      : 'text-gray-700 hover:text-green-700 after:w-0 after:bg-green-700 hover:after:w-full'
                  }`}
                >
                  Découverte
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                <div className={`absolute w-56 bg-white shadow-lg rounded-lg py-2 mt-1 transition-all duration-200 ${
                  showActivitiesMenu ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}>
                  <button 
                    onClick={() => {
                      setShowActivitiesMenu(false);
                      onDiscoverActivities();
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition duration-200"
                  >
                    🌍 Explorer le Cameroun
                  </button>
                  <button 
                    onClick={() => {
                      setShowActivitiesMenu(false);
                      onAddActivity();
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition duration-200"
                  >
                    ✨ Proposer une découverte
                  </button>
                </div>
              </div>
              <div 
                className="relative"
                onMouseEnter={() => setShowReviewsMenu(true)}
                onMouseLeave={() => setShowReviewsMenu(false)}
              >
                <button 
                  className={`flex items-center transition duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all after:duration-300 pb-1 ${
                    activePage === 'Avis' 
                      ? 'text-green-700 after:w-full after:bg-green-700' 
                      : 'text-gray-700 hover:text-green-700 after:w-0 after:bg-green-700 hover:after:w-full'
                  }`}
                >
                  Avis
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                <div className={`absolute w-56 bg-white shadow-lg rounded-lg py-2 mt-1 transition-all duration-200 ${
                  showReviewsMenu ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}>
                  <button 
                    onClick={() => {
                      setShowReviewsMenu(false);
                      onWriteReview();
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition duration-200"
                  >
                    Écrire un avis
                  </button>
                  <button 
                    onClick={() => {
                      setShowReviewsMenu(false);
                      onShareTip();
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition duration-200"
                  >
                    Partager un conseil
                  </button>
                  <button 
                    onClick={() => {
                      setShowReviewsMenu(false);
                      onPublishPhotos();
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition duration-200"
                  >
                    Publier des photos
                  </button>
                  <button 
                    onClick={() => {
                      setShowReviewsMenu(false);
                      onAddPlace();
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition duration-200"
                  >
                    Ajouter un lieu
                  </button>
                </div>
              </div>
              <a 
                href="#about" 
                onClick={(e) => {
                  e.preventDefault();
                  if (onAboutPage) {
                    onAboutPage();
                  }
                }}
                className={`transition duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all after:duration-300 pb-1 ${
                  activePage === 'À propos'
                    ? 'text-green-700 after:w-full after:bg-green-700'
                    : 'text-gray-700 hover:text-green-700 after:w-0 after:bg-green-700 hover:after:w-full'
                }`}
              >
                À propos
              </a>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (onContactPage) {
                    onContactPage();
                  }
                }}
                className="text-gray-700 hover:text-green-700 transition duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all after:duration-300 pb-1 after:w-0 after:bg-green-700 hover:after:w-full"
              >
                Contact
              </a>
            </nav>

            {/* User Avatar or Login Button */}
            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center hover:bg-green-800 transition-colors duration-200"
                  >
                    <span>{getUserInitials()}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg py-2 border border-gray-200">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm text-gray-900">
                          {currentUser.nomComplet}
                        </p>
                        <p className="text-xs text-gray-600">{currentUser.email}</p>
                        {currentUser.role && (
                          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                            currentUser.role === 'ADMIN' 
                              ? 'bg-red-100 text-red-700' 
                              : currentUser.role === 'ETABLISSEMENT'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {currentUser.role === 'ADMIN' ? 'Administrateur' : currentUser.role === 'ETABLISSEMENT' ? 'Établissement' : 'Utilisateur'}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          onGoToProfile();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition duration-200 flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4" />
                        Mon profil
                      </button>
                      
                      {/* Bouton Administration pour les ADMIN */}
                      {currentUser.role === 'ADMIN' && onGoToAdmin && (
                        <button
                          onClick={() => {
                            onGoToAdmin();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition duration-200 flex items-center gap-2"
                        >
                          <Shield className="w-4 h-4" />
                          Administration
                        </button>
                      )}
                      
                      {/* Bouton Mon établissement pour les ETABLISSEMENT */}
                      {currentUser.role === 'ETABLISSEMENT' && onGoToEtablissementPanel && (
                        <button
                          onClick={() => {
                            onGoToEtablissementPanel();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition duration-200 flex items-center gap-2"
                        >
                          <Building2 className="w-4 h-4" />
                          Mon établissement
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          onLogout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-200 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-800 transition"
                >
                  Connexion
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-3 border-t max-h-[calc(100vh-4rem)] overflow-y-auto">
              <nav className="flex flex-col space-y-3">
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.location.reload();
                  }}
                  className={`transition text-left ${
                    activePage === 'Accueil' 
                      ? 'text-green-700' 
                      : 'text-gray-700 hover:text-green-700'
                  }`}
                >
                  Accueil
                </button>
                <div>
                  <button
                    onClick={() => setShowMobileDestinations(!showMobileDestinations)}
                    className={`flex items-center justify-between w-full transition mb-2 ${
                      activePage === 'Destinations' 
                        ? 'text-green-700' 
                        : 'text-gray-700'
                    }`}
                  >
                    Destinations
                    <ChevronDown className={`w-4 h-4 transition-transform ${showMobileDestinations ? 'rotate-180' : ''}`} />
                  </button>
                  {showMobileDestinations && (
                    <div className="pl-4 space-y-2">
                      <button 
                        onClick={() => {
                          handleDestinationClick('Adamaoua');
                          setIsMenuOpen(false);
                        }}
                        className="block text-sm text-gray-600 hover:text-green-700 transition"
                      >
                        Adamaoua
                      </button>
                      <button 
                        onClick={() => {
                          handleDestinationClick('Centre');
                          setIsMenuOpen(false);
                        }}
                        className="block text-sm text-gray-600 hover:text-green-700 transition"
                      >
                        Centre
                      </button>
                      <button 
                        onClick={() => {
                          handleDestinationClick('Est');
                          setIsMenuOpen(false);
                        }}
                        className="block text-sm text-gray-600 hover:text-green-700 transition"
                      >
                        Est
                      </button>
                      <button 
                        onClick={() => {
                          handleDestinationClick('Extrême-Nord');
                          setIsMenuOpen(false);
                        }}
                        className="block text-sm text-gray-600 hover:text-green-700 transition"
                      >
                        Extrême-Nord
                      </button>
                      <button 
                        onClick={() => {
                          handleDestinationClick('Littoral');
                          setIsMenuOpen(false);
                        }}
                        className="block text-sm text-gray-600 hover:text-green-700 transition"
                      >
                        Littoral
                      </button>
                      <button 
                        onClick={() => {
                          handleDestinationClick('Nord');
                          setIsMenuOpen(false);
                        }}
                        className="block text-sm text-gray-600 hover:text-green-700 transition"
                      >
                        Nord
                      </button>
                      <button 
                        onClick={() => {
                          handleDestinationClick('Nord-Ouest');
                          setIsMenuOpen(false);
                        }}
                        className="block text-sm text-gray-600 hover:text-green-700 transition"
                      >
                        Nord-Ouest
                      </button>
                      <button 
                        onClick={() => {
                          handleDestinationClick('Ouest');
                          setIsMenuOpen(false);
                        }}
                        className="block text-sm text-gray-600 hover:text-green-700 transition"
                      >
                        Ouest
                      </button>
                      <button 
                        onClick={() => {
                          handleDestinationClick('Sud');
                          setIsMenuOpen(false);
                        }}
                        className="block text-sm text-gray-600 hover:text-green-700 transition"
                      >
                        Sud
                      </button>
                      <button 
                        onClick={() => {
                          handleDestinationClick('Sud-Ouest');
                          setIsMenuOpen(false);
                        }}
                        className="block text-sm text-gray-600 hover:text-green-700 transition"
                      >
                        Sud-Ouest
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <p className={`transition mb-2 ${
                    activePage === 'Découverte' 
                      ? 'text-green-700' 
                      : 'text-gray-700'
                  }`}>
                    Découverte
                  </p>
                  <div className="pl-4 space-y-2">
                    <button 
                      onClick={() => {
                        onDiscoverActivities();
                        setIsMenuOpen(false);
                      }}
                      className="block text-sm text-gray-600 hover:text-green-700 transition"
                    >
                      Explorer le Cameroun
                    </button>
                    <button 
                      onClick={() => {
                        onAddActivity();
                        setIsMenuOpen(false);
                      }}
                      className="block text-sm text-gray-600 hover:text-green-700 transition"
                    >
                      Proposer une découverte
                    </button>
                  </div>
                </div>
                <div>
                  <p className={`transition mb-2 ${
                    activePage === 'Avis' 
                      ? 'text-green-700' 
                      : 'text-gray-700'
                  }`}>
                    Avis
                  </p>
                  <div className="pl-4 space-y-2">
                    <button 
                      onClick={() => {
                        onWriteReview();
                        setIsMenuOpen(false);
                      }}
                      className="block text-sm text-gray-600 hover:text-green-700 transition"
                    >
                      Écrire un avis
                    </button>
                    <button 
                      onClick={() => {
                        onShareTip();
                        setIsMenuOpen(false);
                      }}
                      className="block text-sm text-gray-600 hover:text-green-700 transition"
                    >
                      Partager un conseil
                    </button>
                    <button 
                      onClick={() => {
                        onPublishPhotos();
                        setIsMenuOpen(false);
                      }}
                      className="block text-sm text-gray-600 hover:text-green-700 transition"
                    >
                      Publier des photos
                    </button>
                    <button 
                      onClick={() => {
                        onAddPlace();
                        setIsMenuOpen(false);
                      }}
                      className="block text-sm text-gray-600 hover:text-green-700 transition"
                    >
                      Ajouter un lieu
                    </button>
                  </div>
                </div>
                <a 
                  href="#about" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    if (onAboutPage) {
                      onAboutPage();
                    }
                  }}
                  className={`transition ${
                    activePage === 'À propos'
                      ? 'text-green-700'
                      : 'text-gray-700 hover:text-green-700'
                  }`}
                >
                  À propos
                </a>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    if (onContactPage) {
                      onContactPage();
                    }
                  }}
                  className="text-gray-700 hover:text-green-700 transition"
                >
                  Contact
                </a>
                <div className="pt-3 space-y-2">
                  {currentUser ? (
                    <div className="space-y-2">
                      <div className="px-3 py-2 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-900">
                          {currentUser.nomComplet}
                        </p>
                        <p className="text-xs text-gray-600">{currentUser.email}</p>
                        {currentUser.role && (
                          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                            currentUser.role === 'ADMIN' 
                              ? 'bg-red-100 text-red-700' 
                              : currentUser.role === 'ETABLISSEMENT'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {currentUser.role === 'ADMIN' ? 'Administrateur' : currentUser.role === 'ETABLISSEMENT' ? 'Établissement' : 'Utilisateur'}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          onGoToProfile();
                          setIsMenuOpen(false);
                        }}
                        className="w-full bg-green-600 text-white px-3 py-2 rounded-full text-sm hover:bg-green-700 transition flex items-center justify-center gap-2"
                      >
                        <UserIcon className="w-4 h-4" />
                        Mon profil
                      </button>
                      
                      {/* Bouton Administration pour les ADMIN (mobile) */}
                      {currentUser.role === 'ADMIN' && onGoToAdmin && (
                        <button
                          onClick={() => {
                            onGoToAdmin();
                            setIsMenuOpen(false);
                          }}
                          className="w-full bg-red-600 text-white px-3 py-2 rounded-full text-sm hover:bg-red-700 transition flex items-center justify-center gap-2"
                        >
                          <Shield className="w-4 h-4" />
                          Administration
                        </button>
                      )}
                      
                      {/* Bouton Mon établissement pour les ETABLISSEMENT (mobile) */}
                      {currentUser.role === 'ETABLISSEMENT' && onGoToEtablissementPanel && (
                        <button
                          onClick={() => {
                            onGoToEtablissementPanel();
                            setIsMenuOpen(false);
                          }}
                          className="w-full bg-blue-600 text-white px-3 py-2 rounded-full text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2"
                        >
                          <Building2 className="w-4 h-4" />
                          Mon établissement
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          onLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full bg-red-600 text-white px-3 py-2 rounded-full text-sm hover:bg-red-700 transition flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-green-700 text-white px-3 py-2 rounded-full text-sm hover:bg-green-800 transition"
                    >
                      Connexion
                    </button>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}