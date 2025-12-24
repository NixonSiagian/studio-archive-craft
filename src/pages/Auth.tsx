import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

type AuthMode = 'login' | 'signup' | 'forgot';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({});
  
  const { signIn, signUp, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin/orders', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, isAdmin, navigate, from]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; fullName?: string } = {};
    
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }
    
    if (mode !== 'forgot') {
      try {
        passwordSchema.parse(password);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.password = e.errors[0].message;
        }
      }
    }
    
    if (mode === 'signup' && !fullName.trim()) {
      newErrors.fullName = 'Please enter your name';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        // Handle rate limiting
        if (error.message.toLowerCase().includes('rate') || error.status === 429) {
          toast.error('Too many requests. Please wait a few minutes before trying again.');
          return;
        }
      }
      
      // Always show success message (don't reveal if account exists)
      toast.success(
        <div>
          <p className="font-medium">If this email is registered, a reset link has been sent.</p>
          <p className="text-sm mt-1 opacity-80">Check your inbox. If you don't see it, check your Spam or Promotions folder.</p>
        </div>,
        { duration: 8000 }
      );
      setMode('login');
    } catch {
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (mode === 'forgot') {
      return handleForgotPassword();
    }
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success('Welcome back!');
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please sign in instead.');
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success('Account created successfully!');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'forgot': return 'RESET PASSWORD';
      case 'signup': return 'CREATE ACCOUNT';
      default: return 'SIGN IN';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'forgot': return 'Enter your email to receive a reset link';
      case 'signup': return 'Join the WNM community';
      default: return 'Welcome back to WNM';
    }
  };

  const getButtonText = () => {
    if (isSubmitting) return 'PLEASE WAIT...';
    switch (mode) {
      case 'forgot': return 'SEND RESET LINK';
      case 'signup': return 'CREATE ACCOUNT';
      default: return 'SIGN IN';
    }
  };

  return (
    <Layout>
      <title>{getTitle()} — WNM</title>
      
      <section className="py-section min-h-[70vh] flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-md mx-auto">
            <h1 className="heading-section mb-4 text-center">{getTitle()}</h1>
            <p className="text-caption text-center mb-12">{getSubtitle()}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'signup' && (
                <div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                  {errors.fullName && (
                    <p className="text-destructive text-xs mt-1">{errors.fullName}</p>
                  )}
                </div>
              )}
              
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                />
                {errors.email && (
                  <p className="text-destructive text-xs mt-1">{errors.email}</p>
                )}
              </div>
              
              {mode !== 'forgot' && (
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                  {errors.password && (
                    <p className="text-destructive text-xs mt-1">{errors.password}</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary w-full ${isSubmitting ? 'opacity-50' : ''}`}
              >
                {getButtonText()}
              </button>
            </form>

            <div className="mt-8 text-center space-y-3">
              {mode === 'login' && (
                <button
                  onClick={() => { setMode('forgot'); setErrors({}); }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block w-full"
                >
                  Forgot your password?
                </button>
              )}
              
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setErrors({});
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {mode === 'signup' ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
              </button>

              {mode === 'forgot' && (
                <button
                  onClick={() => { setMode('login'); setErrors({}); }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block w-full"
                >
                  Back to sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
