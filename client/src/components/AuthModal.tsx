import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Shield, KeyRound, Loader2, CheckCircle, AlertCircle, MapPin, Globe } from 'lucide-react';
import { login, register, sendOtp, verifyOtp, forgotPassword, resetPassword } from '../api/authService';
import { API_BASE_URL } from '../api/config';
import type { User as UserType } from '../api/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserType) => void;
}

type AuthView = 'login' | 'register' | 'verify-email-otp' | 'forgot-password' | 'reset-password-otp' | 'new-password';

// SVG Google Logo Component
const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [authView, setAuthView] = useState<AuthView>('login');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    nomComplet: '',
    email: '',
    paysOrigine: 'Cameroun',
    password: '',
    validatePassword: ''
  });

  // Forgot password state
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  // OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [pendingEmail, setPendingEmail] = useState('');

  // New password state (for reset)
  const [newPasswordData, setNewPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Countdown for resend OTP
  const [resendCountdown, setResendCountdown] = useState(0);

  const startResendCountdown = () => {
    setResendCountdown(60);
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetAllForms = () => {
    setLoginData({ email: '', password: '' });
    setRegisterData({
      nomComplet: '',
      email: '',
      paysOrigine: 'Cameroun',
      password: '',
      validatePassword: ''
    });
    setForgotPasswordEmail('');
    setOtp(['', '', '', '', '', '']);
    setPendingEmail('');
    setNewPasswordData({ newPassword: '', confirmPassword: '' });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowNewPassword(false);
    setError(null);
    setSuccessMessage(null);
  };

  const switchView = (newView: AuthView) => {
    setIsTransitioning(true);
    setError(null);
    setSuccessMessage(null);
    setTimeout(() => {
      setAuthView(newView);
      setIsTransitioning(false);
    }, 200);
  };

  // ==================== GOOGLE OAUTH ====================
  const handleGoogleLogin = () => {
    // Rediriger vers l'endpoint OAuth2 du backend
    // Le backend gère tout: client_secret, redirect, et retourne les cookies HttpOnly
    const backendUrl = API_BASE_URL.replace('/api', '');
    window.location.href = `${backendUrl}/oauth2/authorization/google`;
  };

  // ==================== LOGIN ====================
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

  // ==================== REGISTER ====================
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
      const otpResponse = await sendOtp(registerData.email);
      
      if (!otpResponse.success) {
        setError(otpResponse.message || 'Erreur lors de l\'envoi du code de vérification');
        setIsLoading(false);
        return;
      }

      setPendingEmail(registerData.email);
      setOtp(['', '', '', '', '', '']);
      startResendCountdown();
      switchView('verify-email-otp');
      setSuccessMessage('Un code de vérification a été envoyé à votre email');
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== VERIFY EMAIL OTP (Registration) ====================
  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Veuillez entrer le code complet');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const verifyResponse = await verifyOtp(pendingEmail, otpValue);
      
      if (!verifyResponse.success) {
        setError(verifyResponse.message || 'Code invalide ou expiré');
        setIsLoading(false);
        return;
      }

      const registerResponse = await register({
        nomComplet: registerData.nomComplet,
        email: registerData.email,
        paysOrigine: registerData.paysOrigine,
        password: registerData.password,
        validatePassword: registerData.validatePassword
      });

      if (registerResponse.success && registerResponse.user) {
        localStorage.setItem('camertrip_user', JSON.stringify(registerResponse.user));
        onAuthSuccess(registerResponse.user);
        resetAllForms();
        onClose();
      } else {
        setError(registerResponse.message || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== FORGOT PASSWORD ====================
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await forgotPassword(forgotPasswordEmail);
      
      setPendingEmail(forgotPasswordEmail);
      setOtp(['', '', '', '', '', '']);
      startResendCountdown();
      switchView('reset-password-otp');
      
      if (response.success) {
        setSuccessMessage('Si un compte existe avec cet email, un code a été envoyé');
      } else {
        setSuccessMessage('Si un compte existe avec cet email, un code a été envoyé');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== VERIFY RESET PASSWORD OTP ====================
  const handleVerifyResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Veuillez entrer le code complet');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const verifyResponse = await verifyOtp(pendingEmail, otpValue);
      
      if (verifyResponse.success) {
        switchView('new-password');
        setSuccessMessage('Code vérifié ! Créez votre nouveau mot de passe');
      } else {
        setError(verifyResponse.message || 'Code invalide ou expiré');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== SET NEW PASSWORD ====================
  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPasswordData.newPassword !== newPasswordData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPasswordData.newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const otpValue = otp.join('');
      const response = await resetPassword(
        pendingEmail,
        otpValue,
        newPasswordData.newPassword,
        newPasswordData.confirmPassword
      );

      if (response.success) {
        setSuccessMessage('Mot de passe réinitialisé avec succès !');
        setTimeout(() => {
          resetAllForms();
          switchView('login');
        }, 2000);
      } else {
        setError(response.message || 'Erreur lors de la réinitialisation');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== RESEND OTP ====================
  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = authView === 'verify-email-otp' 
        ? await sendOtp(pendingEmail)
        : await forgotPassword(pendingEmail);

      if (response.success) {
        setOtp(['', '', '', '', '', '']);
        startResendCountdown();
        setSuccessMessage('Nouveau code envoyé !');
      } else {
        setError(response.message || 'Erreur lors du renvoi du code');
      }
    } catch (err) {
      setError('Erreur lors du renvoi du code');
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== OTP INPUT HANDLER ====================
  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split('').forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop avec effet glassmorphism amélioré */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-green-900/50 via-black/70 to-yellow-900/40 backdrop-blur-xl"
        onClick={() => {
          resetAllForms();
          setAuthView('login');
          onClose();
        }}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-300">
        {/* Decorative Elements améliorés */}
        <div className="hidden sm:block absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-3xl opacity-30 pointer-events-none animate-pulse" />
        <div className="hidden sm:block absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-20 pointer-events-none animate-pulse" />
        <div className="hidden sm:block absolute top-1/2 -left-10 w-20 h-20 bg-green-500/30 rounded-full blur-2xl pointer-events-none" />
        
        {/* Main Card avec design amélioré */}
        <div className="relative bg-white rounded-3xl shadow-2xl shadow-black/30 overflow-hidden max-h-[95vh] overflow-y-auto">
          {/* Header avec dégradé aux couleurs du Cameroun */}
          <div className="h-2 bg-gradient-to-r from-green-600 via-red-500 to-yellow-500" />
          
          {/* Close Button amélioré */}
          <button
            onClick={() => {
              resetAllForms();
              setAuthView('login');
              onClose();
            }}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 z-10 hover:rotate-90"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            
            {/* ==================== LOGIN VIEW ==================== */}
            {authView === 'login' && (
              <div className="p-6 sm:p-8">
                {/* Header amélioré */}
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl blur-xl opacity-40 animate-pulse" />
                    <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl shadow-xl shadow-green-500/30">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Bon retour ! 👋
                  </h2>
                  <p className="mt-2 text-gray-500">Connectez-vous pour explorer le Cameroun</p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                    <div className="p-1 bg-red-100 rounded-full">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <p className="text-sm text-red-700 flex-1">{error}</p>
                  </div>
                )}

                {/* Google OAuth Button amélioré */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <GoogleLogo />
                  <span className="group-hover:translate-x-0.5 transition-transform">Continuer avec Google</span>
                </button>

                {/* Divider amélioré */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-100" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white text-sm text-gray-400 font-medium">ou avec votre email</span>
                  </div>
                </div>

                {/* Login Form amélioré */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-700">Email</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                      </div>
                      <input
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 text-base bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200"
                        placeholder="exemple@email.com"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-700">Mot de passe</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="w-full pl-12 pr-12 py-3.5 text-base bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-green-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded-md focus:ring-green-500 focus:ring-2 cursor-pointer" 
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">Se souvenir de moi</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => switchView('forgot-password')}
                      className="text-sm text-green-600 hover:text-green-700 font-semibold hover:underline transition-all"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-base hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Connexion...</span>
                      </>
                    ) : (
                      <span>Se connecter</span>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Nouveau sur CamerTrip ?{' '}
                    <button
                      type="button"
                      onClick={() => switchView('register')}
                      className="text-green-600 hover:text-green-700 font-bold hover:underline transition-all"
                    >
                      Créer un compte
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* ==================== REGISTER VIEW ==================== */}
            {authView === 'register' && (
              <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
                {/* Header amélioré */}
                <div className="text-center mb-5">
                  <div className="relative inline-block mb-3">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl blur-xl opacity-40 animate-pulse" />
                    <div className="relative inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl shadow-xl shadow-green-500/30">
                      <User className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Rejoignez-nous ! 🇨🇲
                  </h2>
                  <p className="mt-1 text-gray-500 text-sm">Créez votre compte CamerTrip</p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                    <div className="p-1 bg-red-100 rounded-full">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <p className="text-sm text-red-700 flex-1">{error}</p>
                  </div>
                )}

                {/* Google OAuth Button amélioré */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <GoogleLogo />
                  <span className="group-hover:translate-x-0.5 transition-transform">S'inscrire avec Google</span>
                </button>

                {/* Divider amélioré */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-100" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white text-sm text-gray-400 font-medium">ou</span>
                  </div>
                </div>

                {/* Register Form amélioré */}
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-700">Nom complet</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={registerData.nomComplet}
                        onChange={(e) => setRegisterData({ ...registerData, nomComplet: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200"
                        placeholder="Prénom et Nom"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-700">Email</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                      </div>
                      <input
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200"
                        placeholder="exemple@email.com"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-700">Pays d'origine</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Globe className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                      </div>
                      <select
                        value={registerData.paysOrigine}
                        onChange={(e) => setRegisterData({ ...registerData, paysOrigine: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200 appearance-none cursor-pointer"
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
                        <option value="Gabon">🇬🇦 Gabon</option>
                        <option value="Nigeria">🇳🇬 Nigeria</option>
                        <option value="Autre">🌍 Autre</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-gray-700">Mot de passe</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          className="w-full pl-10 pr-10 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200 text-sm"
                          placeholder="Min. 8 car."
                          required
                          minLength={8}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-gray-700">Confirmer</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                        </div>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={registerData.validatePassword}
                          onChange={(e) => setRegisterData({ ...registerData, validatePassword: e.target.value })}
                          className="w-full pl-10 pr-10 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200 text-sm"
                          placeholder="Confirmer"
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-bold text-base hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 hover:-translate-y-0.5 active:translate-y-0 mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Envoi du code...</span>
                      </>
                    ) : (
                      <span>Recevoir le code de vérification</span>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-5 text-center">
                  <p className="text-sm text-gray-600">
                    Déjà un compte ?{' '}
                    <button
                      type="button"
                      onClick={() => switchView('login')}
                      className="text-green-600 hover:text-green-700 font-bold hover:underline transition-all"
                    >
                      Se connecter
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* ==================== VERIFY EMAIL OTP VIEW ==================== */}
            {authView === 'verify-email-otp' && (
              <div className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-3">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl blur-xl opacity-40 animate-pulse" />
                    <div className="relative inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl shadow-green-500/30">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Vérifiez votre email</h2>
                  <p className="mt-2 text-gray-500">
                    Code envoyé à <span className="text-green-600 font-semibold">{pendingEmail}</span>
                  </p>
                </div>

                {successMessage && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                    <div className="p-1 bg-green-100 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-sm text-green-700 flex-1">{successMessage}</p>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                    <div className="p-1 bg-red-100 rounded-full">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <p className="text-sm text-red-700 flex-1">{error}</p>
                  </div>
                )}

                <form onSubmit={handleVerifyEmailOtp} className="space-y-5">
                  <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-9 h-11 sm:w-10 sm:h-12 text-center text-lg sm:text-xl font-bold bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all duration-200"
                        disabled={isLoading}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otp.join('').length !== 6}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/25"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Vérification...</span>
                      </>
                    ) : (
                      <span>Vérifier et créer le compte</span>
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-gray-500 text-xs">
                      Pas de code reçu ?{' '}
                      {resendCountdown > 0 ? (
                        <span className="text-gray-400 font-medium">Renvoyer dans {resendCountdown}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isLoading}
                          className="text-green-600 hover:text-green-700 font-semibold hover:underline transition disabled:opacity-50"
                        >
                          Renvoyer le code
                        </button>
                      )}
                    </p>
                  </div>
                </form>

                <div className="mt-3 sm:mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => switchView('register')}
                    className="text-gray-500 hover:text-gray-700 text-xs hover:underline transition"
                  >
                    ← Modifier l'adresse email
                  </button>
                </div>
              </div>
            )}

            {/* ==================== FORGOT PASSWORD VIEW ==================== */}
            {authView === 'forgot-password' && (
              <div className="p-4 pt-6 sm:p-5 sm:pt-7">
                <div className="text-center mb-4 sm:mb-5">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl blur-lg opacity-30 animate-pulse" />
                    <div className="relative inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
                      <KeyRound className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <h2 className="mt-2 sm:mt-3 text-lg sm:text-xl font-bold text-gray-900">Mot de passe oublié ?</h2>
                  <p className="mt-1 text-gray-500 text-xs sm:text-sm">Entrez votre email pour réinitialiser</p>
                </div>

                {error && (
                  <div className="mb-3 p-2 sm:p-2.5 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 animate-in slide-in-from-top-2">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">Adresse email</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <Mail className="w-3.5 h-3.5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                      </div>
                      <input
                        type="email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all duration-200 text-sm"
                        placeholder="exemple@email.com"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-amber-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/25"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <span>Envoyer le code</span>
                    )}
                  </button>
                </form>

                <div className="mt-4 sm:mt-5 text-center">
                  <button
                    type="button"
                    onClick={() => switchView('login')}
                    className="text-gray-500 hover:text-gray-700 text-xs hover:underline transition"
                  >
                    ← Retour à la connexion
                  </button>
                </div>
              </div>
            )}

            {/* ==================== RESET PASSWORD OTP VIEW ==================== */}
            {authView === 'reset-password-otp' && (
              <div className="p-4 pt-6 sm:p-5 sm:pt-7">
                <div className="text-center mb-4 sm:mb-5">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl blur-lg opacity-30 animate-pulse" />
                    <div className="relative inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <h2 className="mt-2 sm:mt-3 text-lg sm:text-xl font-bold text-gray-900">Vérification</h2>
                  <p className="mt-1 text-gray-500 text-xs sm:text-sm">
                    Code envoyé à <span className="text-amber-600 font-medium">{pendingEmail}</span>
                  </p>
                </div>

                {successMessage && (
                  <div className="mb-3 p-2 sm:p-2.5 bg-green-50 border border-green-100 rounded-lg flex items-start gap-2 animate-in slide-in-from-top-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-green-700">{successMessage}</p>
                  </div>
                )}

                {error && (
                  <div className="mb-3 p-2 sm:p-2.5 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 animate-in slide-in-from-top-2">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleVerifyResetOtp} className="space-y-4">
                  <div className="flex justify-center gap-1.5 sm:gap-2" onPaste={handleOtpPaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-9 h-11 sm:w-10 sm:h-12 text-center text-lg sm:text-xl font-bold bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all duration-200"
                        disabled={isLoading}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otp.join('').length !== 6}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-amber-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/25"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Vérification...</span>
                      </>
                    ) : (
                      <span>Vérifier le code</span>
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-gray-500 text-xs">
                      Pas de code reçu ?{' '}
                      {resendCountdown > 0 ? (
                        <span className="text-gray-400 font-medium">Renvoyer dans {resendCountdown}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isLoading}
                          className="text-amber-600 hover:text-amber-700 font-semibold hover:underline transition disabled:opacity-50"
                        >
                          Renvoyer le code
                        </button>
                      )}
                    </p>
                  </div>
                </form>

                <div className="mt-3 sm:mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => switchView('forgot-password')}
                    className="text-gray-500 hover:text-gray-700 text-xs hover:underline transition"
                  >
                    ← Modifier l'adresse email
                  </button>
                </div>
              </div>
            )}

            {/* ==================== NEW PASSWORD VIEW ==================== */}
            {authView === 'new-password' && (
              <div className="p-4 pt-6 sm:p-5 sm:pt-7">
                <div className="text-center mb-4 sm:mb-5">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl blur-lg opacity-30 animate-pulse" />
                    <div className="relative inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                      <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <h2 className="mt-2 sm:mt-3 text-lg sm:text-xl font-bold text-gray-900">Nouveau mot de passe</h2>
                  <p className="mt-1 text-gray-500 text-xs sm:text-sm">Créez un mot de passe sécurisé</p>
                </div>

                {successMessage && (
                  <div className="mb-3 p-2 sm:p-2.5 bg-green-50 border border-green-100 rounded-lg flex items-start gap-2 animate-in slide-in-from-top-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-green-700">{successMessage}</p>
                  </div>
                )}

                {error && (
                  <div className="mb-3 p-2 sm:p-2.5 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 animate-in slide-in-from-top-2">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSetNewPassword} className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">Nouveau mot de passe</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <Lock className="w-3.5 h-3.5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                      </div>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPasswordData.newPassword}
                        onChange={(e) => setNewPasswordData({ ...newPasswordData, newPassword: e.target.value })}
                        className="w-full pl-8 pr-8 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all duration-200 text-sm"
                        placeholder="Minimum 8 caractères"
                        required
                        minLength={8}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-green-600 transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">Confirmer le mot de passe</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <Lock className="w-3.5 h-3.5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={newPasswordData.confirmPassword}
                        onChange={(e) => setNewPasswordData({ ...newPasswordData, confirmPassword: e.target.value })}
                        className="w-full pl-8 pr-8 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all duration-200 text-sm"
                        placeholder="Confirmez votre mot de passe"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-green-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/25"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Réinitialisation...</span>
                      </>
                    ) : (
                      <span>Réinitialiser</span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
