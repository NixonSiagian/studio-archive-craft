import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has a valid recovery session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // User should have a session from the recovery link
      if (session) {
        setIsValidSession(true);
      } else {
        setIsValidSession(false);
        toast.error('Invalid or expired reset link. Please request a new one.');
      }
    };

    checkSession();
  }, []);

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};
    
    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password updated successfully!');
        navigate('/auth', { replace: true });
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidSession === null) {
    return (
      <Layout>
        <section className="py-section min-h-[70vh] flex items-center justify-center">
          <p className="text-muted-foreground">Verifying reset link...</p>
        </section>
      </Layout>
    );
  }

  if (isValidSession === false) {
    return (
      <Layout>
        <title>Invalid Link — WNM</title>
        <section className="py-section min-h-[70vh] flex items-center">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-md mx-auto text-center">
              <h1 className="heading-section mb-4">LINK EXPIRED</h1>
              <p className="text-caption mb-8">
                This password reset link is invalid or has expired.
              </p>
              <button
                onClick={() => navigate('/auth?mode=forgot')}
                className="btn-primary"
              >
                REQUEST NEW LINK
              </button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <title>Set New Password — WNM</title>
      
      <section className="py-section min-h-[70vh] flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-md mx-auto">
            <h1 className="heading-section mb-4 text-center">SET NEW PASSWORD</h1>
            <p className="text-caption text-center mb-12">Enter your new password below</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                />
                {errors.password && (
                  <p className="text-destructive text-xs mt-1">{errors.password}</p>
                )}
              </div>
              
              <div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                />
                {errors.confirmPassword && (
                  <p className="text-destructive text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary w-full ${isSubmitting ? 'opacity-50' : ''}`}
              >
                {isSubmitting ? 'UPDATING...' : 'UPDATE PASSWORD'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/auth')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to sign in
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResetPassword;
