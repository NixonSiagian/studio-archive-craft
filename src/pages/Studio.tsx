import Layout from '@/components/layout/Layout';
import studioImage from '@/assets/studio-image.jpg';
import heroImage from '@/assets/hero-image.jpg';

const Studio = () => {
  const manifesto = [
    "We are a clothing studio.",
    "We make clothes the way we make photographs—each piece is a document.",
    "Produced once. Never repeated.",
    "No seasons. No trends. No noise.",
    "We believe in quiet work done well.",
    "In pieces that speak for themselves.",
    "In the beauty of restraint.",
    "WNM. EST 2025."
  ];

  return (
    <Layout>
      <title>Studio — WNM</title>
      <meta name="description" content="WNM Studio. We make clothes the way we make photographs—each piece is a document. EST 2025." />

      {/* Hero */}
      <section className="py-section">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-caption mb-4">ABOUT</p>
              <h1 className="heading-hero mb-8">THE<br />STUDIO</h1>
              <p className="text-editorial text-muted-foreground">
                A Clothing Studio based in Indonesia, producing limited-run garments since 2025.
              </p>
            </div>
            <div className="aspect-[4/5] bg-muted overflow-hidden">
              <img 
                src={studioImage}
                alt="WNM Studio Space"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-hero bg-foreground text-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <p className="text-caption text-background/60 mb-12">MANIFESTO</p>
            <div className="space-y-6">
              {manifesto.map((line, index) => (
                <p 
                  key={index}
                  className="heading-product text-lg md:text-xl lg:text-2xl font-light animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Studio Images */}
      <section className="py-section">
        <div className="container mx-auto px-6 lg:px-12">
          <p className="text-caption mb-8">THE SPACE</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-[4/3] bg-muted overflow-hidden">
              <img 
                src={heroImage}
                alt="WNM Studio"
                className="w-full h-full object-cover grayscale"
              />
            </div>
            <div className="aspect-[4/3] bg-muted overflow-hidden">
              <img 
                src={studioImage}
                alt="WNM Studio Process"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-section bg-cream">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p className="text-caption mb-4">GET IN TOUCH</p>
          <h2 className="heading-section mb-8">WORK WITH US</h2>
          <p className="text-editorial text-muted-foreground max-w-md mx-auto mb-8">
            For collaborations, inquiries, or just to say hello.
          </p>
          <a href="/contact" className="btn-outline">
            CONTACT
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Studio;
