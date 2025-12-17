import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Shield, Phone, KeyRound, Loader2 } from 'lucide-react';
import { login, register } from '../api/authService';
import type { User as UserType } from '../api/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserType) => void;
}

type AuthView = 'login' | 'register' | 'otp' | 'forgot-password' | 'reset-otp';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [authView, setAuthView] = useState<AuthView>('login');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login form state - ajusté pour correspondre au backend
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state - ajusté pour correspondre au backend
  const [registerData, setRegisterData] = useState({
    nomComplet: '',
    email: '',
    paysOrigine: 'Cameroun',
    password: '',
    validatePassword: ''
  });

  // Forgot password state
  const [forgotPasswordData, setForgotPasswordData] = useState({
    contactMethod: 'email', // 'email' or 'phone'
    email: '',
    phone: '',
    countryCode: '+237'
  });

  // OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [userEmail, setUserEmail] = useState('');
  const [resetContact, setResetContact] = useState('');

  const resetAllForms = () => {
    setLoginData({ email: '', password: '' });
    setRegisterData({
      nomComplet: '',
      email: '',
      paysOrigine: 'Cameroun',
      password: '',
      validatePassword: ''
    });
    setForgotPasswordData({
      contactMethod: 'email',
      email: '',
      phone: '',
      countryCode: '+237'
    });
    setOtp(['', '', '', '', '', '']);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError(null);
  };

  const switchView = (newView: AuthView) => {
    setIsTransitioning(true);
    setError(null);
    setTimeout(() => {
      setAuthView(newView);
      setIsTransitioning(false);
      // Reset forms when switching views
      if (newView === 'login') {
        setLoginData({ email: '', password: '' });
      } else if (newView === 'register') {
        setRegisterData({
          nomComplet: '',
          email: '',
          paysOrigine: 'Cameroun',
          password: '',
          validatePassword: ''
        });
      } else if (newView === 'forgot-password') {
        setForgotPasswordData({
          contactMethod: 'email',
          email: '',
          phone: '',
          countryCode: '+237'
        });
      }
    }, 300);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await login({
        email: loginData.email,
        password: loginData.password
      });
      
      if (response.success && response.user) {
        // Sauvegarder l'utilisateur dans localStorage pour persistance
        localStorage.setItem('camertrip_user', JSON.stringify(response.user));
        onAuthSuccess(response.user);
        resetAllForms();
        onClose();
      } else {
        setError(response.message || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.validatePassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (registerData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await register({
        nomComplet: registerData.nomComplet,
        email: registerData.email,
        paysOrigine: registerData.paysOrigine,
        password: registerData.password,
        validatePassword: registerData.validatePassword
      });
      
      if (response.success && response.user) {
        setUserEmail(registerData.email);
        // Pour l'instant, on considère l'inscription réussie
        // Dans le futur, implémenter la vérification OTP
        localStorage.setItem('camertrip_user', JSON.stringify(response.user));
        onAuthSuccess(response.user);
        resetAllForms();
        onClose();
      } else {
        setError(response.message || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const contact = forgotPasswordData.contactMethod === 'email' 
      ? forgotPasswordData.email 
      : `${forgotPasswordData.countryCode} ${forgotPasswordData.phone}`;
    
    setResetContact(contact);
    console.log('Forgot Password:', forgotPasswordData);
    switchView('reset-otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    console.log('OTP:', otpValue);
    alert(`Compte vérifié avec succès ! OTP: ${otpValue}`);
    resetAllForms();
    setAuthView('login');
    onClose();
  };

  const handleResetOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    console.log('Reset OTP:', otpValue);
    alert(`Code vérifié ! Vous pouvez maintenant créer un nouveau mot de passe.`);
    resetAllForms();
    setAuthView('login');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden animate-fade-in max-h-[95vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={() => {
            resetAllForms();
            setAuthView('login');
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-green-600 transition-colors duration-200 z-10"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content wrapper with slide animation */}
        <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
          {/* Login View */}
          {authView === 'login' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
                  <User className="w-7 h-7 text-green-700" />
                </div>
                <h2 className="text-3xl text-gray-900 mb-2">Bon retour !</h2>
                <p className="text-gray-600">Connectez-vous pour continuer</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="exemple@email.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Mot de passe <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full pl-10 pr-11 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="Entrez votre mot de passe"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="mr-2 w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                    <span className="text-gray-600">Se souvenir de moi</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => switchView('forgot-password')}
                    className="text-green-700 hover:text-green-800 hover:underline transition"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-700 text-white py-3 rounded-xl hover:bg-green-800 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Vous n'avez pas de compte ?{' '}
                  <button
                    type="button"
                    onClick={() => switchView('register')}
                    className="text-green-700 hover:text-green-800 hover:underline transition"
                  >
                    S'inscrire
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Register View */}
          {authView === 'register' && (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <Mail className="w-6 h-6 text-green-700" />
                </div>
                <h2 className="text-2xl text-gray-900 mb-1">Créer un compte</h2>
                <p className="text-sm text-gray-600">Rejoignez CamerTrip aujourd'hui</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Nom complet <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                    <input
                      type="text"
                      value={registerData.nomComplet}
                      onChange={(e) => setRegisterData({ ...registerData, nomComplet: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm"
                      placeholder="Prénom et Nom"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm"
                      placeholder="exemple@email.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Pays d'origine</label>
                  <select
                    value={registerData.paysOrigine}
                    onChange={(e) => setRegisterData({ ...registerData, paysOrigine: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm"
                    disabled={isLoading}
                  >
                    <option value="Cameroun">🇨🇲 Cameroun</option>
                    <option value="France">🇫🇷 France</option>
                    <option value="États-Unis">🇺🇸 États-Unis</option>
                    <option value="Canada">🇨🇦 Canada</option>
                    <option value="Belgique">🇧🇪 Belgique</option>
                    <option value="Suisse">🇨🇭 Suisse</option>
                    <option value="Côte d'Ivoire">🇨🇮 Côte d'Ivoire</option>
                    <option value="Sénégal">🇸🇳 Sénégal</option>
                    <option value="Autre">🌍 Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Mot de passe <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="w-full pl-10 pr-11 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm"
                      placeholder="Minimum 8 caractères (1 majuscule, 1 chiffre, 1 spécial)"
                      required
                      minLength={8}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Confirmer le mot de passe <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={registerData.validatePassword}
                      onChange={(e) => setRegisterData({ ...registerData, validatePassword: e.target.value })}
                      className="w-full pl-10 pr-11 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm"
                      placeholder="Confirmez votre mot de passe"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-700 text-white py-2.5 rounded-xl hover:bg-green-800 transition-colors duration-200 mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Inscription en cours...
                    </>
                  ) : (
                    "S'inscrire"
                  )}
                </button>
              </form>

              <div className="mt-5 text-center">
                <p className="text-sm text-gray-600">
                  Vous avez déjà un compte ?{' '}
                  <button
                    type="button"
                    onClick={() => switchView('login')}
                    className="text-green-700 hover:text-green-800 hover:underline transition"
                  >
                    Se connecter
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Forgot Password View */}
          {authView === 'forgot-password' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
                  <KeyRound className="w-7 h-7 text-green-700" />
                </div>
                <h2 className="text-3xl text-gray-900 mb-2">Mot de passe oublié ?</h2>
                <p className="text-gray-600">Choisissez comment recevoir votre code</p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-5">
                {/* Contact Method Selection */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordData({ ...forgotPasswordData, contactMethod: 'email' })}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                      forgotPasswordData.contactMethod === 'email'
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-300 text-gray-600 hover:border-green-300'
                    }`}
                  >
                    <Mail className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm">Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordData({ ...forgotPasswordData, contactMethod: 'phone' })}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                      forgotPasswordData.contactMethod === 'phone'
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-300 text-gray-600 hover:border-green-300'
                    }`}
                  >
                    <Phone className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm">Téléphone</span>
                  </button>
                </div>

                {/* Email Input */}
                {forgotPasswordData.contactMethod === 'email' && (
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Adresse email <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                      <input
                        type="email"
                        value={forgotPasswordData.email}
                        onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        placeholder="exemple@email.com"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Phone Input */}
                {forgotPasswordData.contactMethod === 'phone' && (
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Numéro de téléphone <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <select
                        value={forgotPasswordData.countryCode}
                        onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, countryCode: e.target.value })}
                        className="w-24 px-2 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        required
                      >
                        <option value="+237">🇨🇲 +237</option>
                        <option value="+33">🇫🇷 +33</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+225">🇨🇮 +225</option>
                        <option value="+221">🇸🇳 +221</option>
                        <option value="+229">🇧🇯 +229</option>
                      </select>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                        <input
                          type="tel"
                          value={forgotPasswordData.phone}
                          onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                          placeholder="6 XX XX XX XX"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-green-700 text-white py-3 rounded-xl hover:bg-green-800 transition-colors duration-200"
                >
                  Envoyer le code
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => switchView('login')}
                  className="text-gray-600 hover:text-gray-800 text-sm hover:underline transition"
                >
                  ← Retour à la connexion
                </button>
              </div>
            </div>
          )}

          {/* OTP Verification View (for registration) */}
          {authView === 'otp' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
                  <Shield className="w-7 h-7 text-green-700" />
                </div>
                <h2 className="text-3xl text-gray-900 mb-2">Vérification OTP</h2>
                <p className="text-gray-600">
                  Nous avons envoyé un code à{' '}
                  <span className="text-green-700">{userEmail}</span>
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-11 h-12 text-center border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                      required
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-700 text-white py-3 rounded-xl hover:bg-green-800 transition-colors duration-200"
                >
                  Vérifier le code
                </button>

                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Vous n'avez pas reçu le code ?{' '}
                    <button
                      type="button"
                      className="text-green-700 hover:text-green-800 hover:underline transition"
                      onClick={() => alert('Code OTP renvoyé !')}
                    >
                      Renvoyer
                    </button>
                  </p>
                </div>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => switchView('register')}
                  className="text-gray-600 hover:text-gray-800 text-sm hover:underline transition"
                >
                  ← Retour à l'inscription
                </button>
              </div>
            </div>
          )}

          {/* Reset Password OTP View */}
          {authView === 'reset-otp' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
                  <Shield className="w-7 h-7 text-green-700" />
                </div>
                <h2 className="text-3xl text-gray-900 mb-2">Vérification de sécurité</h2>
                <p className="text-gray-600">
                  Code envoyé à{' '}
                  <span className="text-green-700">{resetContact}</span>
                </p>
              </div>

              <form onSubmit={handleResetOtpSubmit} className="space-y-6">
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-11 h-12 text-center border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                      required
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-700 text-white py-3 rounded-xl hover:bg-green-800 transition-colors duration-200"
                >
                  Vérifier le code
                </button>

                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Vous n'avez pas reçu le code ?{' '}
                    <button
                      type="button"
                      className="text-green-700 hover:text-green-800 hover:underline transition"
                      onClick={() => alert('Code renvoyé !')}
                    >
                      Renvoyer
                    </button>
                  </p>
                </div>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => switchView('forgot-password')}
                  className="text-gray-600 hover:text-gray-800 text-sm hover:underline transition"
                >
                  ← Retour
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}