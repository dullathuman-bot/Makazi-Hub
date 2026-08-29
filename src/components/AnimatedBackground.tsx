interface AnimatedBackgroundProps {
  imageUrl: string | null;
}

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/7031607/pexels-photo-7031607.jpeg?auto=compress&cs=tinysrgb&w=1920';

// Solid black base, with a modern house photo showing very faintly in the
// distance behind it — a slow "breathing" scale animation keeps it feeling
// alive without ever competing with the black background or the glass UI.
export function AnimatedBackground({ imageUrl }: AnimatedBackgroundProps) {
  const url = imageUrl || FALLBACK_IMAGE;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <div className="absolute inset-0 animate-breathe">
        <img
          src={url}
          alt=""
          className="h-full w-full object-cover"
          style={{ filter: 'blur(1px) brightness(0.3) saturate(0.7)' }}
        />
      </div>
      {/* Heavy black wash so the house stays a faint, distant presence */}
      <div className="absolute inset-0 bg-black/70" />
    </div>
  );
}
