import React, { useState } from 'react';
import { User, Mail, MapPin, Lock, Camera, Save, X, Eye, EyeOff, Loader2 } from 'lucide-react';
import type { User as UserType } from '../api/types';
import { updateProfile } from '../api/userService';

interface UserProfilePageProps {
  user: UserType;
  onUpdateUser: (user: UserType) => void;
  onBackToHome: () => void;
}

export default function UserProfilePage({ user, onUpdateUser, onBackToHome }: UserProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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

    // Validation du mot de passe seulement si l'utilisateur souhaite le changer
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
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Appeler l'API pour mettre à jour le profil
      const response = await updateProfile({
        nomComplet: formData.nomComplet,
        paysOrigine: formData.paysOrigine,
      });

      if (response.success && response.data) {
        onUpdateUser(response.data);
        setIsEditing(false);
        setSuccessMessage('Profil mis à jour avec succès !');
      } else {
        // Mise à jour locale en cas d'échec API (mode dégradé)
        const updatedUser: UserType = {
          ...user,
          nomComplet: formData.nomComplet,
          paysOrigine: formData.paysOrigine,
        };
        onUpdateUser(updatedUser);
        setIsEditing(false);
        setSuccessMessage('Profil mis à jour localement');
      }
    } catch (error) {
      // Mise à jour locale en cas d'erreur
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
    
    // Réinitialiser les champs de mot de passe
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));

    // Masquer le message après 3 secondes
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

  const getUserInitials = () => {
    const parts = user.nomComplet.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return user.nomComplet.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la page */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <button 
            onClick={onBackToHome}
            className="mb-6 flex items-center gap-2 text-white/90 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
            Retour à l'accueil
          </button>
          
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-white text-green-600 flex items-center justify-center text-3xl shadow-lg">
                {user.photoProfile ? (
                  <img src={user.photoProfile} alt={user.nomComplet} className="w-full h-full rounded-full object-cover" />
                ) : (
                  getUserInitials()
                )}
              </div>
              <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Info utilisateur */}
            <div>
              <h1 className="text-3xl mb-2">{user.nomComplet}</h1>
              <p className="text-green-100">{user.email}</p>
              {user.paysOrigine && (
                <p className="text-green-200 text-sm flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {user.paysOrigine}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        {/* Message de succès */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl">Informations personnelles</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Modifier le profil
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom complet */}
            <div>
              <label className="block text-gray-700 mb-2">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="nomComplet"
                  value={formData.nomComplet}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg transition-all ${
                    isEditing 
                      ? 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  } ${errors.nomComplet ? 'border-red-500' : ''}`}
                  placeholder="Votre nom complet"
                />
              </div>
              {errors.nomComplet && (
                <p className="mt-1 text-sm text-red-500">{errors.nomComplet}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={true}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 bg-gray-50 cursor-not-allowed rounded-lg"
                  placeholder="votre.email@exemple.com"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">L'email ne peut pas être modifié</p>
            </div>

            {/* Pays d'origine */}
            <div>
              <label className="block text-gray-700 mb-2">
                Pays d'origine
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  name="paysOrigine"
                  value={formData.paysOrigine}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg transition-all appearance-none ${
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

            {/* Changement de mot de passe (seulement en mode édition) */}
            {isEditing && (
              <div className="pt-6 border-t">
                <h3 className="text-xl mb-4">Changer le mot de passe</h3>
                <p className="text-gray-600 mb-6">Laissez vide si vous ne souhaitez pas changer votre mot de passe</p>
                
                <div className="space-y-4">
                  {/* Mot de passe actuel */}
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 ${
                          errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>
                    )}
                  </div>

                  {/* Nouveau mot de passe */}
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 ${
                          errors.newPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
                    )}
                  </div>

                  {/* Confirmer nouveau mot de passe */}
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Confirmer le nouveau mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            {isEditing && (
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Enregistrer les modifications
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Section supplémentaire - Statistiques / Historique */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-3xl text-gray-900 mb-2">0</div>
            <div className="text-gray-600">Réservations</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="text-3xl text-gray-900 mb-2">0</div>
            <div className="text-gray-600">Favoris</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="text-3xl text-gray-900 mb-2">0</div>
            <div className="text-gray-600">Avis donnés</div>
          </div>
        </div>
      </div>
    </div>
  );
}
