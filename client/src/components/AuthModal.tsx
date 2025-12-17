import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Shield, KeyRound, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { login, register, sendOtp, verifyOtp, forgotPassword, resetPassword } from '../api/authService';
import type { User as UserType } from '../api/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserType) => void;
}

type AuthView = 'login' | 'register' | 'verify-email-otp' | 'forgot-password' | 'reset-password-otp' | 'new-password';

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
    }, 300);
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
      // 1. D'abord, envoyer le code OTP
      const otpResponse = await sendOtp(registerData.email);
      
      if (!otpResponse.success) {
        setError(otpResponse.message || 'Erreur lors de l\'envoi du code de vérification');
        setIsLoading(false);
        return;
      }

      // 2. Sauvegarder les données et passer à la vue OTP
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
      // 1. Vérifier le code OTP
      const verifyResponse = await verifyOtp(pendingEmail, otpValue);
      
      if (!verifyResponse.success) {
        setError(verifyResponse.message || 'Code invalide ou expiré');
        setIsLoading(false);
        return;
      }

      // 2. Procéder à l'inscription
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
      
      // On passe toujours à la vue OTP pour ne pas révéler si l'email existe
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
      // Vérifier le code OTP
      const verifyResponse = await verifyOtp(pendingEmail, otpValue);
      
      if (verifyResponse.success) {
        // Passer à la vue de nouveau mot de passe
        // On garde le code OTP car il sera utilisé pour la réinitialisation
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
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
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
          
          {/* ==================== LOGIN VIEW ==================== */}
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
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
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

          {/* ==================== REGISTER VIEW ==================== */}
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
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
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
                      placeholder="Minimum 8 caractères"
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
                      Envoi du code...
                    </>
                  ) : (
                    "Recevoir le code de vérification"
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

          {/* ==================== VERIFY EMAIL OTP VIEW (Registration) ==================== */}
          {authView === 'verify-email-otp' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
                  <Shield className="w-7 h-7 text-green-700" />
                </div>
                <h2 className="text-2xl text-gray-900 mb-2">Vérifiez votre email</h2>
                <p className="text-gray-600">
                  Code envoyé à <span className="text-green-700 font-medium">{pendingEmail}</span>
                </p>
              </div>

              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  {successMessage}
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifyEmailOtp} className="space-y-6">
                <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
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
                      className="w-11 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                      disabled={isLoading}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.join('').length !== 6}
                  className="w-full bg-green-700 text-white py-3 rounded-xl hover:bg-green-800 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    'Vérifier et créer le compte'
                  )}
                </button>

                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Vous n'avez pas reçu le code ?{' '}
                    {resendCountdown > 0 ? (
                      <span className="text-gray-400">Renvoyer dans {resendCountdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-green-700 hover:text-green-800 hover:underline transition disabled:opacity-50"
                      >
                        Renvoyer
                      </button>
                    )}
                  </p>
                </div>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => switchView('register')}
                  className="text-gray-600 hover:text-gray-800 text-sm hover:underline transition"
                >
                  ← Modifier l'email
                </button>
              </div>
            </div>
          )}

          {/* ==================== FORGOT PASSWORD VIEW ==================== */}
          {authView === 'forgot-password' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
                  <KeyRound className="w-7 h-7 text-green-700" />
                </div>
                <h2 className="text-2xl text-gray-900 mb-2">Mot de passe oublié ?</h2>
                <p className="text-gray-600">Entrez votre email pour recevoir un code</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Adresse email <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                    <input
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="exemple@email.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-700 text-white py-3 rounded-xl hover:bg-green-800 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer le code'
                  )}
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

          {/* ==================== RESET PASSWORD OTP VIEW ==================== */}
          {authView === 'reset-password-otp' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
                  <Shield className="w-7 h-7 text-green-700" />
                </div>
                <h2 className="text-2xl text-gray-900 mb-2">Vérification</h2>
                <p className="text-gray-600">
                  Code envoyé à <span className="text-green-700 font-medium">{pendingEmail}</span>
                </p>
              </div>

              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  {successMessage}
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifyResetOtp} className="space-y-6">
                <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
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
                      className="w-11 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                      disabled={isLoading}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.join('').length !== 6}
                  className="w-full bg-green-700 text-white py-3 rounded-xl hover:bg-green-800 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    'Vérifier le code'
                  )}
                </button>

                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Vous n'avez pas reçu le code ?{' '}
                    {resendCountdown > 0 ? (
                      <span className="text-gray-400">Renvoyer dans {resendCountdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-green-700 hover:text-green-800 hover:underline transition disabled:opacity-50"
                      >
                        Renvoyer
                      </button>
                    )}
                  </p>
                </div>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => switchView('forgot-password')}
                  className="text-gray-600 hover:text-gray-800 text-sm hover:underline transition"
                >
                  ← Modifier l'email
                </button>
              </div>
            </div>
          )}

          {/* ==================== NEW PASSWORD VIEW ==================== */}
          {authView === 'new-password' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
                  <Lock className="w-7 h-7 text-green-700" />
                </div>
                <h2 className="text-2xl text-gray-900 mb-2">Nouveau mot de passe</h2>
                <p className="text-gray-600">Créez votre nouveau mot de passe</p>
              </div>

              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  {successMessage}
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSetNewPassword} className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Nouveau mot de passe <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPasswordData.newPassword}
                      onChange={(e) => setNewPasswordData({ ...newPasswordData, newPassword: e.target.value })}
                      className="w-full pl-10 pr-11 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="Minimum 8 caractères"
                      required
                      minLength={8}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Confirmer le mot de passe <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={newPasswordData.confirmPassword}
                      onChange={(e) => setNewPasswordData({ ...newPasswordData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-11 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
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
                  className="w-full bg-green-700 text-white py-3 rounded-xl hover:bg-green-800 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Réinitialisation...
                    </>
                  ) : (
                    'Réinitialiser le mot de passe'
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
