import { ArrowUpRight, Layers, Sparkles, Wand2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PortfolioScene from "@/components/portfolio/PortfolioScene";

const highlights = [
  { label: "Years", value: "6+" },
  { label: "Projects", value: "18" },
  { label: "Industries", value: "9" },
];

const projects = [
  {
    title: "Liquid Archive",
    description: "Eksplorasi digital untuk koleksi fashion dengan efek kaca cair dan micro-interactions.",
    tags: ["Three.js", "WebGL", "Interaction"],
  },
  {
    title: "Nebula Sound",
    description: "Landing page immersive untuk studio musik dengan visual audio-reactive real-time.",
    tags: ["R3F", "Audio", "Realtime"],
  },
  {
    title: "Chromatic Atelier",
    description: "Showcase portfolio arsitektur dengan tur 3D, lighting sinematik, dan motion lembut.",
    tags: ["Lighting", "Cinematics", "UX"],
  },
];

const services = [
  {
    title: "3D Web Experiences",
    description: "Konsep dan produksi pengalaman 3D yang terasa ringan di semua perangkat.",
    Icon: Sparkles,
  },
  {
    title: "Liquid Glass UI",
    description: "Sistem UI modern dengan efek kaca, glow halus, dan layout responsif.",
    Icon: Layers,
  },
  {
    title: "Motion & Story",
    description: "Animasi, micro-motion, dan storytelling yang membuat brand terasa hidup.",
    Icon: Wand2,
  },
];

const processSteps = [
  {
    title: "Discovery",
    description: "Menyelaraskan visi, audiens, dan narasi visual brand.",
  },
  {
    title: "Prototype",
    description: "Membangun moodboard, storyboard, dan scene 3D awal.",
  },
  {
    title: "Build",
    description: "Implementasi Three.js, motion, dan optimasi performa mobile.",
  },
  {
    title: "Launch",
    description: "Polishing visual, QA, dan deployment ke production.",
  },
];

const stack = [
  "Three.js",
  "React",
  "R3F",
  "GSAP",
  "Spline",
  "Figma",
  "Vite",
];

const Index = () => {
  return (
    <Layout>
      <title>Nixon Studio — 3D Portfolio Liquid Glass</title>
      <meta
        name="description"
        content="Portfolio 3D dengan konsep liquid glass modern, dibuat dengan Three.js dan pengalaman mobile-first."
      />

      <section
        id="home"
        className="relative min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(120,238,230,0.18),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,_rgba(164,125,255,0.2),_transparent_55%)]" />
          <div className="absolute inset-0 opacity-80 pointer-events-none">
            <PortfolioScene />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-8 md:pt-12">
          <div className="max-w-3xl glass-panel p-8 md:p-12">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-4">
              3D PORTFOLIO • LIQUID GLASS
            </p>
            <h1 className="heading-hero mb-6">
              Membangun pengalaman web 3D yang terasa cair, modern, dan mobile-first.
            </h1>
            <p className="text-editorial text-muted-foreground mb-8">
              Saya Nixon Siagian, creative technologist yang fokus pada Three.js, motion, dan desain
              antarmuka glassmorphism untuk brand yang ingin tampil futuristik.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact" className="btn-liquid">
                Mulai Proyek
              </a>
              <a href="#projects" className="btn-liquid-outline">
                Lihat Karya
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>

          <div className="mt-10 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {highlights.map((item) => (
              <div key={item.label} className="glass-card p-6 text-center">
                <p className="text-2xl font-semibold">{item.value}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-2">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12">
            <div>
              <p className="section-label">ABOUT</p>
              <h2 className="heading-section mt-4 mb-6">
                Menggabungkan estetika liquid glass dengan performa web yang ringan.
              </h2>
              <p className="text-editorial text-muted-foreground mb-6">
                Fokus saya ada pada pengalaman digital yang terasa hidup: parallax halus, material
                transparan, dan transisi cair yang tetap nyaman di perangkat mobile. Setiap scene
                dibangun dengan perhatian pada optimasi, aksesibilitas, dan detail visual.
              </p>
              <div className="flex flex-wrap gap-3">
                {stack.map((item) => (
                  <span key={item} className="glass-pill">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                AVAILABILITY
              </p>
              <p className="text-editorial">
                Terbuka untuk kolaborasi dengan studio kreatif, startup, dan brand fashion yang ingin
                membangun showcase 3D premium.
              </p>
              <div className="mt-6 flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span>Jakarta / Remote</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Response</span>
                  <span>&lt; 24 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Timezone</span>
                  <span>GMT+7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="section-label">SELECTED PROJECTS</p>
              <h2 className="heading-section mt-4">Kurasi karya immersive terbaru.</h2>
            </div>
            <a href="#contact" className="btn-liquid-outline">
              Diskusi Karya
              <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.title} className="glass-card p-6 md:p-8 flex flex-col gap-5">
                <div>
                  <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="glass-pill text-[10px] tracking-[0.25em]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <p className="section-label">SERVICES</p>
          <h2 className="heading-section mt-4 mb-10">Layanan end-to-end untuk web 3D premium.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map(({ title, description, Icon }) => (
              <div key={title} className="glass-card p-6 md:p-8">
                <div className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                  <Icon size={18} />
                </div>
                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10">
            <div>
              <p className="section-label">PROCESS</p>
              <h2 className="heading-section mt-4 mb-6">Workflow yang transparan dan terukur.</h2>
              <p className="text-editorial text-muted-foreground">
                Setiap tahap disusun agar klien dapat melihat progres visual, performa, dan arah
                kreatif sejak awal.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {processSteps.map((step, index) => (
                <div key={step.title} className="glass-card p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
                    0{index + 1}
                  </p>
                  <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="glass-panel p-8 md:p-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <p className="section-label">CONTACT</p>
              <h2 className="heading-section mt-4 mb-4">Siap membangun pengalaman 3D baru?</h2>
              <p className="text-editorial text-muted-foreground max-w-xl">
                Kirim brief singkat dan saya akan merespons dalam 24 jam dengan estimasi timeline,
                scope, dan ide konsep.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <a href="mailto:hello@nixonstudio.io" className="btn-liquid">
                hello@nixonstudio.io
              </a>
              <a href="https://cal.com" target="_blank" rel="noreferrer" className="btn-liquid-outline">
                Jadwalkan Call
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
