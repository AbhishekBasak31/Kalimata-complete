interface HeroSectionAltProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  videoSrc?: string;
  backgroundImage?: string;
}

const HeroSectionAlt = ({ title, subtitle, ctaText, ctaLink, videoSrc, backgroundImage }: HeroSectionAltProps) => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      {videoSrc && (
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Fallback background image */}
      {!videoSrc && backgroundImage && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
        <p className="text-lg md:text-2xl mb-6">{subtitle}</p>
        <a
          href={ctaLink}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition"
        >
          {ctaText}
        </a>
      </div>
    </section>
  );
};

export default HeroSectionAlt;
