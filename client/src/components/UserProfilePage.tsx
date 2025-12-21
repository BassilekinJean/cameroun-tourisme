import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Mail, MapPin, Lock, Camera, Save, X, Eye, EyeOff, Loader2, 
  Heart, Star, MessageCircle, Calendar, Edit3, Trash2,
  ChevronRight, Clock, TrendingUp, Award, AlertCircle, KeyRound, CheckCircle
} from 'lucide-react';
import type { User as UserType } from '../api/types';
import { updateProfile, toggleFavori, sendPasswordChangeOtp, changePasswordWithOtp } from '../api/userService';
import { getAvisByUser, updateAvis, deleteAvis } from '../api/avisService';
import { getEtablissementById } from '../api/etablissementService';
import { mediaService } from '../api/mediaService';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface UserProfilePageProps {
  user: UserType;
  onUpdateUser: (user: UserType) => void;
  onBackToHome: () => void;
  onViewDetails?: (item: any) => void;
}

interface FavoriItem {
  publicId: string;
  nom: string;
  ville: string;
  categorie: string;
  photoProfile?: string;
  rating?: number;
}

interface UserAvis {
  publicId: string;
  message: string;
  note: number;
  dateCreation: string;
  etablissementNom?: string;
  etablissementId?: string;
}

type TabType = 'profile' | 'favoris' | 'avis' | 'activite';

export default function UserProfilePage({ user, onUpdateUser, onBackToHome, onViewDetails }: UserProfilePageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFavoris, setLoadingFavoris] = useState(false);
  const [loadingAvis, setLoadingAvis] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // États pour le changement de mot de passe avec OTP
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [otpStep, setOtpStep] = useState<'idle' | 'verify' | 'success'>('idle');
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [passwordOtpError, setPasswordOtpError] = useState<string | null>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [formData, setFormData] = useState({
    nomComplet: user.nomComplet,
    email: user.email,
    paysOrigine: user.paysOrigine || 'Cameroun',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // Données chargées
  const [favoris, setFavoris] = useState<FavoriItem[]>([]);
  const [userAvis, setUserAvis] = useState<UserAvis[]>([]);
  
  // États pour l'édition et suppression des avis
  const [editingAvis, setEditingAvis] = useState<UserAvis | null>(null);
  const [editAvisForm, setEditAvisForm] = useState({ message: '', note: 0 });
  const [isUpdatingAvis, setIsUpdatingAvis] = useState(false);
  const [deletingAvisId, setDeletingAvisId] = useState<string | null>(null);
  const [isDeletingAvis, setIsDeletingAvis] = useState(false);
  const [avisError, setAvisError] = useState<string | null>(null);
  const [avisSuccess, setAvisSuccess] = useState<string | null>(null);

  // Charger les favoris
  useEffect(() => {
    const loadFavoris = async () => {
      if (user.favorisIds && user.favorisIds.length > 0) {
        setLoadingFavoris(true);
        try {
          const favorisData: FavoriItem[] = [];
          for (const id of user.favorisIds.slice(0, 10)) { // Limiter à 10
            try {
              const response = await getEtablissementById(id);
              if (response.success && response.data) {
                favorisData.push({
                  publicId: response.data.publicId,
                  nom: response.data.nom,
                  ville: response.data.ville,
                  categorie: response.data.categorie,
                  photoProfile: response.data.photoProfile,
                  rating: response.data.rating
                });
              }
            } catch (err) {
              // Ignorer les erreurs individuelles
            }
          }
          setFavoris(favorisData);
        } catch (error) {
          console.error('Erreur lors du chargement des favoris', error);
        } finally {
          setLoadingFavoris(false);
        }
      }
    };
    
    if (activeTab === 'favoris') {
      loadFavoris();
    }
  }, [activeTab, user.favorisIds]);

  // Charger les avis de l'utilisateur
  useEffect(() => {
    const loadAvis = async () => {
      setLoadingAvis(true);
      try {
        const response = await getAvisByUser(user.id, 0, 20);
        if (response.success && response.data) {
          setUserAvis(response.data.content.map(a => ({
            publicId: a.publicId,
            message: a.message,
            note: a.note,
            dateCreation: a.dateCreation,
            etablissementNom: a.auteurName // À ajuster selon la structure
          })));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des avis', error);
      } finally {
        setLoadingAvis(false);
      }
    };
    
    if (activeTab === 'avis') {
      loadAvis();
    }
  }, [activeTab, user.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Gestion OTP pour le changement de mot de passe
  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    
    // Auto-focus sur le prochain input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    // Focus sur le dernier champ rempli ou le suivant
    const focusIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[focusIndex]?.focus();
  };

  const handleSendPasswordOtp = async () => {
    // Valider les mots de passe avant d'envoyer l'OTP
    if (!formData.currentPassword) {
      setErrors(prev => ({ ...prev, currentPassword: 'Mot de passe actuel requis' }));
      return;
    }
    if (formData.newPassword.length < 8) {
      setErrors(prev => ({ ...prev, newPassword: 'Minimum 8 caractères' }));
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Les mots de passe ne correspondent pas' }));
      return;
    }

    setIsOtpLoading(true);
    setPasswordOtpError(null);
    
    try {
      await sendPasswordChangeOtp();
      setOtpStep('verify');
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (error) {
      setPasswordOtpError('Erreur lors de l\'envoi du code. Veuillez réessayer.');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyAndChangePassword = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setPasswordOtpError('Veuillez entrer le code complet à 6 chiffres');
      return;
    }

    setIsOtpLoading(true);
    setPasswordOtpError(null);

    try {
      await changePasswordWithOtp(formData.newPassword, formData.confirmPassword, otpCode);
      setOtpStep('success');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setTimeout(() => {
        setIsChangingPassword(false);
        setOtpStep('idle');
        setSuccessMessage('Mot de passe modifié avec succès !');
        setTimeout(() => setSuccessMessage(''), 3000);
      }, 2000);
    } catch (error: any) {
      setPasswordOtpError(error.response?.data || 'Code incorrect ou expiré. Veuillez réessayer.');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setOtpStep('idle');
    setOtp(['', '', '', '', '', '']);
    setPasswordOtpError(null);
    setIsOtpLoading(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nomComplet.trim()) {
      newErrors.nomComplet = 'Le nom complet est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Mot de passe actuel requis';
      }
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Minimum 8 caractères';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await updateProfile({
        publicId: user.id,
        nomComplet: formData.nomComplet,
        email: formData.email,
        paysOrigine: formData.paysOrigine,
        photoProfile: user.photoProfile,
        favorisIds: user.favorisIds,
      });

      if (response.success && response.data) {
        onUpdateUser(response.data);
        setIsEditing(false);
        setSuccessMessage('Profil mis à jour avec succès !');
      } else {
        const updatedUser: UserType = {
          ...user,
          nomComplet: formData.nomComplet,
          paysOrigine: formData.paysOrigine,
        };
        onUpdateUser(updatedUser);
        setIsEditing(false);
        setSuccessMessage('Profil mis à jour');
      }
    } catch (error) {
      const updatedUser: UserType = {
        ...user,
        nomComplet: formData.nomComplet,
        paysOrigine: formData.paysOrigine,
      };
      onUpdateUser(updatedUser);
      setIsEditing(false);
      setSuccessMessage('Profil mis à jour localement');
    } finally {
      setIsLoading(false);
    }
    
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      nomComplet: user.nomComplet,
      email: user.email,
      paysOrigine: user.paysOrigine || 'Cameroun',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setPhotoError('Veuillez sélectionner une image');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('L\'image ne doit pas dépasser 5 Mo');
      return;
    }

    setIsUploadingPhoto(true);
    setPhotoError(null);

    try {
      // 1. Upload to Supabase
      const photoUrl = await mediaService.uploadUserPhoto(file, user.id);

      // 2. Update user profile with new URL
      const response = await updateProfile({
        publicId: user.id, // Ensure publicId is passed if needed, though endpoint might infer from token
        nomComplet: user.nomComplet,
        email: user.email,
        paysOrigine: user.paysOrigine || 'Cameroun',
        photoProfile: photoUrl,
        favorisIds: user.favorisIds
      });

      if (response.success) {
        // Mettre à jour l'utilisateur avec la nouvelle photo
        const updatedUser = {
          ...user,
          photoProfile: photoUrl
        };
        onUpdateUser(updatedUser);
        setSuccessMessage('Photo de profil mise à jour !');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setPhotoError(response.message || 'Erreur lors de la mise à jour du profil');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setPhotoError('Erreur lors de l\'upload de la photo');
    } finally {
      setIsUploadingPhoto(false);
      // Reset l'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFavori = async (etablissementId: string) => {
    try {
      const response = await toggleFavori(etablissementId);
      if (response.success) {
        setFavoris(prev => prev.filter(f => f.publicId !== etablissementId));
        // Mettre à jour l'utilisateur
        const updatedUser = {
          ...user,
          favorisIds: user.favorisIds.filter(id => id !== etablissementId)
        };
        onUpdateUser(updatedUser);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du favori', error);
    }
  };

  const getUserInitials = () => {
    const parts = user.nomComplet.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return user.nomComplet.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategorieLabel = (categorie: string) => {
    const labels: Record<string, string> = {
      'HOTEL': '🏨 Hôtel',
      'RESTAURATION': '🍽️ Restaurant',
      'SITE_TOURISTIQUE': '🏛️ Site touristique'
    };
    return labels[categorie] || categorie;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  // Handlers pour édition et suppression des avis
  const handleEditAvis = (avis: UserAvis) => {
    setEditingAvis(avis);
    setEditAvisForm({ message: avis.message, note: avis.note });
    setAvisError(null);
  };

  const handleCancelEdit = () => {
    setEditingAvis(null);
    setEditAvisForm({ message: '', note: 0 });
    setAvisError(null);
  };

  const handleUpdateAvis = async () => {
    if (!editingAvis) return;
    
    if (!editAvisForm.message.trim()) {
      setAvisError('Le message ne peut pas être vide');
      return;
    }
    if (editAvisForm.note < 1 || editAvisForm.note > 5) {
      setAvisError('La note doit être entre 1 et 5');
      return;
    }

    setIsUpdatingAvis(true);
    setAvisError(null);
    
    try {
      const response = await updateAvis(editingAvis.publicId, {
        message: editAvisForm.message,
        note: editAvisForm.note
      });
      
      if (response.success) {
        // Mettre à jour la liste locale
        setUserAvis(prev => prev.map(a => 
          a.publicId === editingAvis.publicId 
            ? { ...a, message: editAvisForm.message, note: editAvisForm.note }
            : a
        ));
        setAvisSuccess('Avis mis à jour avec succès');
        setEditingAvis(null);
        setEditAvisForm({ message: '', note: 0 });
        setTimeout(() => setAvisSuccess(null), 3000);
      } else {
        setAvisError(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      setAvisError('Erreur lors de la mise à jour de l\'avis');
    } finally {
      setIsUpdatingAvis(false);
    }
  };

  const handleConfirmDelete = (avisId: string) => {
    setDeletingAvisId(avisId);
    setAvisError(null);
  };

  const handleCancelDelete = () => {
    setDeletingAvisId(null);
  };

  const handleDeleteAvis = async () => {
    if (!deletingAvisId) return;
    
    setIsDeletingAvis(true);
    setAvisError(null);
    
    try {
      const response = await deleteAvis(deletingAvisId);
      
      if (response.success) {
        // Retirer de la liste locale
        setUserAvis(prev => prev.filter(a => a.publicId !== deletingAvisId));
        setAvisSuccess('Avis supprimé avec succès');
        setDeletingAvisId(null);
        setTimeout(() => setAvisSuccess(null), 3000);
      } else {
        setAvisError(response.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      setAvisError('Erreur lors de la suppression de l\'avis');
    } finally {
      setIsDeletingAvis(false);
    }
  };

  const renderEditableStars = (currentRating: number, onRatingChange: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`w-6 h-6 ${star <= currentRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
            />
          </button>
        ))}
      </div>
    );
  };

  // Calcul des statistiques
  const stats = {
    favoris: user.favorisIds?.length || 0,
    avis: userAvis.length,
    reservations: 0, // À implémenter
    noteMoyenne: userAvis.length > 0 
      ? (userAvis.reduce((acc, a) => acc + a.note, 0) / userAvis.length).toFixed(1) 
      : '0'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header du profil */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white relative overflow-hidden">
        {/* Motif décoratif subtil */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          {/* Bouton retour */}
          <div className="pt-6">
            <button 
              onClick={onBackToHome}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
              Retour à l'accueil
            </button>
          </div>
          
          {/* Info utilisateur */}
          <div className="py-12 flex flex-col md:flex-row items-center gap-8">
            {/* Avatar - Zone cliquable pour modifier la photo */}
            <div className="relative group">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={handlePhotoClick}
                disabled={isUploadingPhoto}
                className="w-32 h-32 rounded-full bg-white text-emerald-700 flex items-center justify-center text-4xl font-bold shadow-xl ring-4 ring-emerald-400/30 overflow-hidden cursor-pointer hover:ring-emerald-400/50 transition-all group relative"
                title="Cliquez pour changer la photo"
              >
                {isUploadingPhoto ? (
                  <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
                ) : user.photoProfile ? (
                  <>
                    <img src={user.photoProfile} alt={user.nomComplet} className="w-full h-full rounded-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <span>{getUserInitials()}</span>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </>
                )}
              </button>
              <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full shadow-lg pointer-events-none">
                <Camera className="w-5 h-5" />
              </div>
              {photoError && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                  {photoError}
                </div>
              )}
            </div>

            {/* Infos */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold mb-2">{user.nomComplet}</h1>
              <p className="text-slate-300 mb-2">{user.email}</p>
              {user.paysOrigine && (
                <p className="text-emerald-300 text-sm flex items-center gap-1 justify-center md:justify-start">
                  <MapPin className="w-4 h-4" />
                  {user.paysOrigine}
                </p>
              )}
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <div className="text-3xl font-bold">{stats.favoris}</div>
                <div className="text-slate-300 text-sm">Favoris</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <div className="text-3xl font-bold">{stats.avis}</div>
                <div className="text-slate-300 text-sm">Avis</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <div className="text-3xl font-bold flex items-center justify-center gap-1">
                  {stats.noteMoyenne}
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="text-slate-300 text-sm">Note moy.</div>
              </div>
            </div>
          </div>

          {/* Onglets */}
          <div className="flex gap-1 overflow-x-auto pb-0">
            {[
              { id: 'profile', label: 'Mon Profil', icon: User },
              { id: 'favoris', label: 'Mes Favoris', icon: Heart },
              { id: 'avis', label: 'Mes Avis', icon: MessageCircle },
              { id: 'activite', label: 'Mon Activité', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gray-50 text-emerald-700'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="container mx-auto px-4 max-w-6xl py-8">
        {/* Message de succès */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-100 border border-emerald-400 text-emerald-700 rounded-xl flex items-center gap-2 animate-fade-in">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            {successMessage}
          </div>
        )}

        {/* Tab: Profil */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">Informations personnelles</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Modifier
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom complet */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="nomComplet"
                    value={formData.nomComplet}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl transition-all ${
                      isEditing 
                        ? 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white' 
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    } ${errors.nomComplet ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.nomComplet && (
                  <p className="mt-1 text-sm text-red-500">{errors.nomComplet}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled={true}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 bg-gray-50 cursor-not-allowed rounded-xl"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">L'email ne peut pas être modifié</p>
              </div>

              {/* Pays d'origine */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Pays d'origine</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="paysOrigine"
                    value={formData.paysOrigine}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl transition-all appearance-none ${
                      isEditing 
                        ? 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white' 
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                  >
                    <option value="Cameroun">🇨🇲 Cameroun</option>
                    <option value="France">🇫🇷 France</option>
                    <option value="Belgique">🇧🇪 Belgique</option>
                    <option value="Canada">🇨🇦 Canada</option>
                    <option value="États-Unis">🇺🇸 États-Unis</option>
                    <option value="Royaume-Uni">🇬🇧 Royaume-Uni</option>
                    <option value="Allemagne">🇩🇪 Allemagne</option>
                    <option value="Suisse">🇨🇭 Suisse</option>
                    <option value="Sénégal">🇸🇳 Sénégal</option>
                    <option value="Côte d'Ivoire">🇨🇮 Côte d'Ivoire</option>
                    <option value="Nigeria">🇳🇬 Nigeria</option>
                    <option value="Autre">🌍 Autre</option>
                  </select>
                </div>
              </div>

              {/* Section mot de passe */}
              {isEditing && (
                <div className="pt-6 border-t">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-gray-600" />
                    Changer le mot de passe
                  </h3>
                  
                  {!isChangingPassword ? (
                    <div>
                      <p className="text-gray-600 mb-4">Pour des raisons de sécurité, un code de vérification sera envoyé à votre email.</p>
                      <button
                        type="button"
                        onClick={() => setIsChangingPassword(true)}
                        className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2"
                      >
                        <KeyRound className="w-5 h-5" />
                        Modifier mon mot de passe
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Étape de succès */}
                      {otpStep === 'success' ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-emerald-600" />
                          </div>
                          <h4 className="text-xl font-semibold text-emerald-700 mb-2">Mot de passe modifié !</h4>
                          <p className="text-gray-600">Votre mot de passe a été changé avec succès.</p>
                        </div>
                      ) : otpStep === 'verify' ? (
                        /* Étape de vérification OTP */
                        <div className="bg-blue-50 rounded-xl p-6">
                          <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Mail className="w-6 h-6 text-blue-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">Vérifiez votre email</h4>
                            <p className="text-gray-600 text-sm">
                              Un code à 6 chiffres a été envoyé à <span className="font-medium">{user.email}</span>
                            </p>
                          </div>
                          
                          {/* Input OTP */}
                          <div className="flex justify-center gap-2 mb-4" onPaste={handleOtpPaste}>
                            {otp.map((digit, index) => (
                              <input
                                key={index}
                                ref={(el) => { otpInputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                disabled={isOtpLoading}
                              />
                            ))}
                          </div>
                          
                          {passwordOtpError && (
                            <div className="flex items-center justify-center gap-2 text-red-600 mb-4">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-sm">{passwordOtpError}</span>
                            </div>
                          )}
                          
                          <div className="flex gap-3 justify-center">
                            <button
                              type="button"
                              onClick={handleCancelPasswordChange}
                              disabled={isOtpLoading}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Annuler
                            </button>
                            <button
                              type="button"
                              onClick={handleVerifyAndChangePassword}
                              disabled={isOtpLoading || otp.join('').length !== 6}
                              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {isOtpLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Vérification...
                                </>
                              ) : (
                                'Confirmer'
                              )}
                            </button>
                          </div>
                          
                          <p className="text-center text-sm text-gray-500 mt-4">
                            Vous n'avez pas reçu le code ?{' '}
                            <button
                              type="button"
                              onClick={handleSendPasswordOtp}
                              className="text-blue-600 hover:underline font-medium"
                              disabled={isOtpLoading}
                            >
                              Renvoyer
                            </button>
                          </p>
                        </div>
                      ) : (
                        /* Formulaire de saisie des mots de passe */
                        <div>
                          <p className="text-gray-600 mb-6">Entrez votre mot de passe actuel et le nouveau mot de passe souhaité.</p>
                          
                          <div className="grid gap-4">
                            {/* Mot de passe actuel */}
                            <div>
                              <label className="block text-gray-700 mb-2">Mot de passe actuel</label>
                              <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                  type={showCurrentPassword ? 'text' : 'password'}
                                  name="currentPassword"
                                  value={formData.currentPassword}
                                  onChange={handleChange}
                                  className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 ${
                                    errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  placeholder="••••••••"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              </div>
                              {errors.currentPassword && <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>}
                            </div>

                            {/* Nouveau mot de passe */}
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-gray-700 mb-2">Nouveau mot de passe</label>
                                <div className="relative">
                                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                  <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 ${
                                      errors.newPassword ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="••••••••"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                  >
                                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                  </button>
                                </div>
                                {errors.newPassword && <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>}
                              </div>

                              <div>
                                <label className="block text-gray-700 mb-2">Confirmer</label>
                                <div className="relative">
                                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                  <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 ${
                                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="••••••••"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                  >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                  </button>
                                </div>
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                              </div>
                            </div>
                          </div>
                          
                          {passwordOtpError && (
                            <div className="flex items-center gap-2 text-red-600 mt-4">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-sm">{passwordOtpError}</span>
                            </div>
                          )}
                          
                          <div className="flex gap-3 mt-6">
                            <button
                              type="button"
                              onClick={handleCancelPasswordChange}
                              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                              Annuler
                            </button>
                            <button
                              type="button"
                              onClick={handleSendPasswordOtp}
                              disabled={isOtpLoading}
                              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {isOtpLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Envoi du code...
                                </>
                              ) : (
                                <>
                                  <Mail className="w-4 h-4" />
                                  Envoyer le code de vérification
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Boutons d'action */}
              {isEditing && (
                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Enregistrer
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Tab: Favoris */}
        {activeTab === 'favoris' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Mes Favoris</h2>
                <p className="text-gray-600 mt-1">{stats.favoris} établissement(s) enregistré(s)</p>
              </div>
            </div>

            {loadingFavoris ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              </div>
            ) : favoris.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl text-gray-600 mb-2">Aucun favori pour le moment</h3>
                <p className="text-gray-500 mb-6">Explorez nos établissements et ajoutez-les à vos favoris</p>
                <button
                  onClick={onBackToHome}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
                >
                  Explorer
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoris.map((favori) => (
                  <div 
                    key={favori.publicId}
                    className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="relative h-40">
                      <ImageWithFallback
                        src={favori.photoProfile || ''}
                        alt={favori.nom}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => handleRemoveFavori(favori.publicId)}
                        className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-red-500 hover:bg-red-50 transition"
                      >
                        <Heart className="w-5 h-5 fill-red-500" />
                      </button>
                      <span className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 rounded-full text-sm font-medium">
                        {getCategorieLabel(favori.categorie)}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{favori.nom}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {favori.ville}
                        </span>
                        {favori.rating && (
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            {favori.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Avis */}
        {activeTab === 'avis' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Mes Avis</h2>
                <p className="text-gray-600 mt-1">{userAvis.length} avis publié(s)</p>
              </div>
            </div>

            {/* Messages de succès/erreur */}
            {avisSuccess && (
              <div className="mb-4 p-4 bg-emerald-50 border border-green-200 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-700">{avisSuccess}</span>
              </div>
            )}
            {avisError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700">{avisError}</span>
              </div>
            )}

            {loadingAvis ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              </div>
            ) : userAvis.length === 0 ? (
              <div className="text-center py-16">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl text-gray-600 mb-2">Aucun avis pour le moment</h3>
                <p className="text-gray-500 mb-6">Partagez votre expérience avec la communauté</p>
                <button
                  onClick={onBackToHome}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
                >
                  Écrire un avis
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userAvis.map((avis) => (
                  <div 
                    key={avis.publicId}
                    className="border border-gray-200 rounded-xl p-5 hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        {avis.etablissementNom && (
                          <h3 className="font-semibold text-gray-900">{avis.etablissementNom}</h3>
                        )}
                        <div className="flex items-center gap-3 mt-1">
                          {renderStars(avis.note)}
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(avis.dateCreation)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditAvis(avis)}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title="Modifier l'avis"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleConfirmDelete(avis.publicId)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer l'avis"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700">{avis.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Activité */}
        {activeTab === 'activite' && (
          <div className="space-y-6">
            {/* Statistiques détaillées */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <Heart className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.favoris}</div>
                    <div className="text-gray-600 text-sm">Favoris</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.avis}</div>
                    <div className="text-gray-600 text-sm">Avis publiés</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.noteMoyenne}</div>
                    <div className="text-gray-600 text-sm">Note moyenne</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">Explorateur</div>
                    <div className="text-gray-600 text-sm">Niveau</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Historique récent */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Activité récente</h2>
              
              {userAvis.length === 0 && stats.favoris === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl text-gray-600 mb-2">Pas encore d'activité</h3>
                  <p className="text-gray-500">Commencez à explorer le Cameroun pour voir votre activité ici</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userAvis.slice(0, 5).map((avis) => (
                    <div key={avis.publicId} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-emerald-100 rounded-full">
                        <MessageCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">Vous avez laissé un avis {avis.note} ⭐</p>
                        <p className="text-sm text-gray-500">{formatDate(avis.dateCreation)}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Badges / Accomplissements */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Badges</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`text-center p-4 rounded-xl ${stats.avis >= 1 ? 'bg-emerald-50' : 'bg-gray-100 opacity-50'}`}>
                  <div className="text-3xl mb-2">✍️</div>
                  <div className="font-medium text-gray-900">Premier Avis</div>
                  <div className="text-xs text-gray-500">Publier votre premier avis</div>
                </div>
                <div className={`text-center p-4 rounded-xl ${stats.favoris >= 5 ? 'bg-emerald-50' : 'bg-gray-100 opacity-50'}`}>
                  <div className="text-3xl mb-2">❤️</div>
                  <div className="font-medium text-gray-900">Collectionneur</div>
                  <div className="text-xs text-gray-500">5 favoris enregistrés</div>
                </div>
                <div className={`text-center p-4 rounded-xl ${stats.avis >= 10 ? 'bg-emerald-50' : 'bg-gray-100 opacity-50'}`}>
                  <div className="text-3xl mb-2">🌟</div>
                  <div className="font-medium text-gray-900">Critique</div>
                  <div className="text-xs text-gray-500">10 avis publiés</div>
                </div>
                <div className={`text-center p-4 rounded-xl bg-gray-100 opacity-50`}>
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="font-medium text-gray-900">Expert</div>
                  <div className="text-xs text-gray-500">50 avis publiés</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal d'édition d'avis */}
      {editingAvis && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <Edit3 className="w-6 h-6" />
                Modifier l'avis
              </h3>
              {editingAvis.etablissementNom && (
                <p className="text-slate-300 mt-1">{editingAvis.etablissementNom}</p>
              )}
            </div>
            
            <div className="p-6 space-y-6">
              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre note
                </label>
                {renderEditableStars(editAvisForm.note, (rating) => setEditAvisForm(prev => ({ ...prev, note: rating })))}
              </div>
              
              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre commentaire
                </label>
                <textarea
                  value={editAvisForm.message}
                  onChange={(e) => setEditAvisForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition"
                  placeholder="Partagez votre expérience..."
                />
              </div>
              
              {avisError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {avisError}
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleCancelEdit}
                disabled={isUpdatingAvis}
                className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateAvis}
                disabled={isUpdatingAvis}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {isUpdatingAvis ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {deletingAvisId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Supprimer cet avis ?
              </h3>
              <p className="text-gray-600">
                Cette action est irréversible. Votre avis sera définitivement supprimé.
              </p>
              
              {avisError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {avisError}
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-center gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={isDeletingAvis}
                className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAvis}
                disabled={isDeletingAvis}
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {isDeletingAvis ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
