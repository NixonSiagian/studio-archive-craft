import { useState, FormEvent } from 'react';
import Layout from '@/components/layout/Layout';
import { toast } from '@/components/ui/sonner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Message sent. We\'ll be in touch.');
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <title>Contact — WNM</title>
      <meta name="description" content="Get in touch with WNM Studio. For collaborations, inquiries, or just to say hello." />

      <section className="py-section min-h-[80vh] flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Info */}
            <div>
              <p className="text-caption mb-4">CONTACT</p>
              <h1 className="heading-section mb-8">GET IN TOUCH</h1>
              <p className="text-editorial text-muted-foreground mb-12 max-w-md">
                For collaborations, press inquiries, or general questions.
              </p>

              <div className="space-y-8">
                <div>
                  <p className="text-mono text-muted-foreground mb-2">EMAIL</p>
                  <a 
                    href="mailto:studio@wnm.co"
                    className="text-lg hover:opacity-70 transition-opacity"
                  >
                    studio@wnm.co
                  </a>
                </div>
                <div>
                  <p className="text-mono text-muted-foreground mb-2">INSTAGRAM</p>
                  <a 
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg hover:opacity-70 transition-opacity"
                  >
                    @wnm.studio
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="text-mono text-muted-foreground mb-2 block">
                    NAME
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-0 py-3 bg-transparent border-b border-border text-base focus:outline-none focus:border-foreground transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-mono text-muted-foreground mb-2 block">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full px-0 py-3 bg-transparent border-b border-border text-base focus:outline-none focus:border-foreground transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="text-mono text-muted-foreground mb-2 block">
                    MESSAGE
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    required
                    rows={5}
                    className="w-full px-0 py-3 bg-transparent border-b border-border text-base focus:outline-none focus:border-foreground transition-colors resize-none"
                    placeholder="Your message"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-primary w-full md:w-auto ${isSubmitting ? 'opacity-50' : ''}`}
                >
                  {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
