/**
 * LOGIN PAGE - Neomorphic Login Panel for Users and Admins
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    signInWithEmail,
    signInWithGoogle,
    createClientAccount,
    resetPassword
} from '../../auth/services/authService';

type LoginType = 'user' | 'admin';
type AuthMode = 'login' | 'register';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<LoginType>('user');
    const [authMode, setAuthMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [preferredName, setPreferredName] = useState(''); // Nickname field
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            const { isAdmin } = await signInWithEmail(email, password);

            // Redirect based on user role
            if (activeTab === 'admin') {
                if (isAdmin) {
                    navigate('/admin');
                } else {
                    setError('Você não tem permissões de administrador.');
                    setIsLoading(false);
                    return;
                }
            } else {
                navigate('/');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            // Handle Firebase auth errors
            switch (err.code) {
                case 'auth/user-not-found':
                    setError('Usuário não encontrado. Verifique seu e-mail.');
                    break;
                case 'auth/wrong-password':
                    setError('Senha incorreta. Tente novamente.');
                    break;
                case 'auth/invalid-email':
                    setError('E-mail inválido.');
                    break;
                case 'auth/too-many-requests':
                    setError('Muitas tentativas. Tente novamente mais tarde.');
                    break;
                case 'auth/invalid-credential':
                    setError('Credenciais inválidas. Verifique seu e-mail e senha.');
                    break;
                default:
                    setError('Erro ao fazer login. Tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setIsLoading(true);

        try {
            await createClientAccount(email, password, displayName, preferredName);
            setSuccessMessage('Conta criada com sucesso! Redirecionando...');
            setTimeout(() => navigate('/'), 1500);
        } catch (err: any) {
            console.error('Register error:', err);
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('Este e-mail já está em uso.');
                    break;
                case 'auth/invalid-email':
                    setError('E-mail inválido.');
                    break;
                case 'auth/weak-password':
                    setError('Senha muito fraca. Use pelo menos 6 caracteres.');
                    break;
                default:
                    setError('Erro ao criar conta. Tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setIsLoading(true);

        try {
            const { isAdmin } = await signInWithGoogle();

            if (activeTab === 'admin' && !isAdmin) {
                setError('Você não tem permissões de administrador.');
                setIsLoading(false);
                return;
            }

            navigate(activeTab === 'admin' ? '/admin' : '/');
        } catch (err: any) {
            console.error('Google login error:', err);
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Login cancelado.');
            } else {
                setError('Erro ao fazer login com Google.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError('Digite seu e-mail para recuperar a senha.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await resetPassword(email);
            setSuccessMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
        } catch (err: any) {
            console.error('Password reset error:', err);
            setError('Erro ao enviar e-mail de recuperação.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neo-bg flex flex-col items-center justify-center p-6">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-neo-accent/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-neo-info/10 rounded-full blur-3xl" />
            </div>

            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 text-center z-10"
            >
                <div className="w-20 h-20 bg-neo-bg rounded-full shadow-neo-out-lg flex items-center justify-center mx-auto mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neo-accent">
                        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                        <path d="M19.5 15l-1.5 4.5L15 21l1.5-4.5L21 15l-4.5-1.5L19.5 15z" />
                    </svg>
                </div>
                <h1 className="font-display text-2xl font-bold text-neo-text">Salão Beauty</h1>
                <p className="text-neo-text-secondary text-sm mt-1">Acesse sua conta</p>
            </motion.div>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-full max-w-md bg-neo-bg rounded-neo-lg shadow-neo-out-lg p-8 z-10"
            >
                {/* Tab Switcher */}
                <div className="flex bg-neo-bg rounded-neo shadow-neo-in p-1 mb-8">
                    <button
                        onClick={() => { setActiveTab('user'); setError(''); }}
                        className={`flex-1 py-3 px-4 rounded-neo font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'user'
                            ? 'bg-neo-bg shadow-neo-out text-neo-accent'
                            : 'text-neo-text-secondary hover:text-neo-text'
                            }`}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        Cliente
                    </button>
                    <button
                        onClick={() => { setActiveTab('admin'); setError(''); }}
                        className={`flex-1 py-3 px-4 rounded-neo font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'admin'
                            ? 'bg-neo-bg shadow-neo-out text-neo-accent'
                            : 'text-neo-text-secondary hover:text-neo-text'
                            }`}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2l1 3h3l-2.5 2 1 3-2.5-2-2.5 2 1-3L8 5h3l1-3z" />
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Administrador
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: activeTab === 'user' ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: activeTab === 'user' ? 20 : -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="mb-6 text-center">
                                <h2 className="text-lg font-semibold text-neo-text">
                                    {activeTab === 'user'
                                        ? (authMode === 'login' ? 'Olá! Bem-vinda de volta' : 'Crie sua conta')
                                        : 'Área Administrativa'}
                                </h2>
                                <p className="text-sm text-neo-text-secondary mt-1">
                                    {activeTab === 'user'
                                        ? (authMode === 'login' ? 'Entre para acessar seus agendamentos' : 'Preencha os dados abaixo')
                                        : 'Acesse o painel de controle'}
                                </p>
                            </div>

                            {/* Name Field (Register Only) */}
                            {authMode === 'register' && activeTab === 'user' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4"
                                >
                                    <label className="block text-sm font-medium text-neo-text-secondary mb-2">
                                        Nome Completo
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neo-text-secondary">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            placeholder="Seu nome"
                                            className="w-full neo-input pl-12"
                                            required={authMode === 'register'}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Email Field */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-neo-text-secondary mb-2">
                                    E-mail
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neo-text-secondary">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={activeTab === 'admin' ? 'admin@salao.com' : 'seu@email.com'}
                                        className="w-full neo-input pl-12"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Preferred Name Field (Register Only - User tab) */}
                            {authMode === 'register' && activeTab === 'user' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6"
                                >
                                    <label className="block text-sm font-medium text-neo-text-secondary mb-2">
                                        Como gostaria de ser chamada? (opcional)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neo-text-secondary">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={preferredName}
                                            onChange={(e) => setPreferredName(e.target.value)}
                                            placeholder="Ex: Mari, Bel, etc."
                                            className="w-full neo-input pl-12"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Password Field */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-neo-text-secondary mb-2">
                                    Senha
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neo-text-secondary">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full neo-input pl-12 pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neo-text-secondary hover:text-neo-text transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password (Register Only) */}
                            {authMode === 'register' && activeTab === 'user' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6"
                                >
                                    <label className="block text-sm font-medium text-neo-text-secondary mb-2">
                                        Confirmar Senha
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neo-text-secondary">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                <path d="M15 11v-1" />
                                            </svg>
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full neo-input pl-12"
                                            required={authMode === 'register'}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Success Message */}
                            {successMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-3 rounded-neo bg-neo-success/10 text-neo-success text-sm text-center"
                                >
                                    {successMessage}
                                </motion.div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-3 rounded-neo bg-neo-danger/10 text-neo-danger text-sm text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                onClick={authMode === 'register' ? handleRegister : undefined}
                                disabled={isLoading}
                                className={`w-full py-4 rounded-neo font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-neo-accent to-amber-500 shadow-neo-out hover:shadow-neo-out-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : 'active:shadow-neo-pressed'}`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        {authMode === 'login' ? 'Entrando...' : 'Cadastrando...'}
                                    </>
                                ) : (
                                    <>
                                        {activeTab === 'admin'
                                            ? 'Acessar Painel'
                                            : (authMode === 'login' ? 'Entrar' : 'Criar Conta')}
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            {/* Forgot Password */}
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="w-full text-center text-sm text-neo-text-secondary hover:text-neo-accent mt-4 transition-colors"
                            >
                                Esqueceu sua senha?
                            </button>
                        </motion.div>
                    </AnimatePresence>
                </form>

                {/* Divider */}
                {activeTab === 'user' && (
                    <>
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-neo-text-secondary/20" />
                            <span className="text-xs text-neo-text-secondary">ou continue com</span>
                            <div className="flex-1 h-px bg-neo-text-secondary/20" />
                        </div>

                        {/* Social Login */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="flex-1 py-3 bg-neo-bg rounded-neo shadow-neo-out active:shadow-neo-pressed transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span className="text-sm font-medium text-neo-text">Google</span>
                            </button>
                        </div>
                    </>
                )}
            </motion.div>

            {/* Toggle Login/Register */}
            {activeTab === 'user' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 text-sm flex gap-2 z-10"
                >
                    <span className="text-neo-text-secondary">
                        {authMode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                    </span>
                    <button
                        onClick={() => {
                            setAuthMode(authMode === 'login' ? 'register' : 'login');
                            setError('');
                            setSuccessMessage('');
                        }}
                        className="text-neo-accent font-semibold hover:underline"
                    >
                        {authMode === 'login' ? 'Cadastre-se' : 'Fazer Login'}
                    </button>
                </motion.div>
            )}

            {/* Register Business Link - Admin Only */}
            {activeTab === 'admin' && authMode === 'login' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 z-10 bg-neo-bg rounded-neo shadow-neo-out p-4 text-center border border-white/20"
                >
                    <p className="text-sm text-neo-text-secondary mb-2">
                        Ainda não tem um salão cadastrado?
                    </p>
                    <a
                        href="/register-business"
                        className="inline-flex items-center gap-2 text-neo-accent font-semibold hover:underline"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                        </svg>
                        Cadastrar Meu Salão
                    </a>
                </motion.div>
            )}

            {/* Create Account Button - Prominent CTA (Cliente Only) */}
            {authMode === 'login' && activeTab === 'user' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="mt-6 z-10"
                >
                    <button
                        onClick={() => {
                            setAuthMode('register');
                            setError('');
                        }}
                        className="relative inline-flex items-center gap-3 px-8 py-4 rounded-neo font-semibold text-white transition-all group overflow-hidden w-full justify-center"
                        style={{
                            background: 'linear-gradient(135deg, var(--color-brand-primary) 0%, var(--color-brand-gold) 100%)',
                            boxShadow: '0 8px 32px -4px rgba(232, 160, 184, 0.4), inset 0 1px 1px 0 rgba(255,255,255,0.3)'
                        }}
                    >
                        {/* Glow animation on hover */}
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-neo" />
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative z-10">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <line x1="20" y1="8" x2="20" y2="14" />
                            <line x1="23" y1="11" x2="17" y2="11" />
                        </svg>
                        <span className="relative z-10">Criar Minha Conta</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative z-10 group-hover:translate-x-1 transition-transform">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </motion.div>
            )}

            {/* Test Mode Button (Development Only) */}
            {authMode === 'login' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 z-10"
                >
                    <button
                        onClick={() => navigate(activeTab === 'admin' ? '/admin' : '/')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-neo-bg rounded-neo shadow-neo-in hover:shadow-neo-out transition-all text-neo-text-secondary font-medium text-sm"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        Entrar sem Login (Teste)
                    </button>
                </motion.div>
            )}

            {/* Admin Demo Credentials */}
            {activeTab === 'admin' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    className="mt-4 p-4 bg-neo-bg rounded-neo shadow-neo-in text-center z-10"
                >
                    <p className="text-xs text-neo-text-secondary mb-1">Modo de Teste Ativo</p>
                    <p className="text-sm text-neo-text">Clique em "Entrar sem Login" para acessar</p>
                </motion.div>
            )}

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center z-10"
            >
                <p className="text-xs text-neo-text-secondary">
                    © 2024 Salão Beauty. Todos os direitos reservados.
                </p>
            </motion.footer>
        </div>
    );
};

export default LoginPage;
