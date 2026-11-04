import { artifacts } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArtifactImage from '@/components/ArtifactImage';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return artifacts.map((artifact) => ({
    id: artifact.id,
  }));
}

export default function ArtifactDetailPage({ params }: PageProps) {
  const artifact = artifacts.find((a) => a.id === params.id);

  if (!artifact) {
    notFound();
  }


  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col font-mono">
      {/* Header with back button */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-10 px-6 py-4">
        <Link 
          href="/archive"
          className="inline-flex items-center gap-2 text-sm text-[#888888] hover:text-[#1A1A1A] transition-colors"
        >
          ← Back to Archive
        </Link>
      </header>

      {/* Main Content - Vertically Centered */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 md:py-20">
        <div className="max-w-7xl w-full">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left: Narrative + Artifact Image */}
            <div className="flex justify-center">
              <div className="w-full max-w-[400px] space-y-4">
                <div className="text-[10px] text-[#555555] leading-relaxed">
                  <p className="uppercase tracking-[0.2em] text-[9px] text-[#999999] mb-1">
                    Color Application Note
                  </p>
                </div>
                <ArtifactImage 
                  src={artifact.imageUrl}
                  alt={artifact.title}
                />
              </div>
            </div>

            {/* Right: The Giant Pantone Card */}
            <div className="flex justify-center">
              <div 
                className="w-full max-w-[400px] bg-white rounded-lg overflow-hidden"
                style={{ 
                  aspectRatio: '2/3'
                }}
              >
                {/* Top: Color Block (65%) */}
                <div 
                  className="h-[65%] w-full relative"
                  style={{ backgroundColor: artifact.hex }}
                >
                  {/* Optional: Subtle gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5"></div>
                </div>

                {/* Bottom: Data Section (35%) */}
                <div className="h-[35%] flex flex-col justify-between p-6 bg-white">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-tight mb-2">
                      {artifact.colorName}
                    </h1>
                    <p className="font-mono text-lg text-[#888888] tracking-wider">
                      {artifact.hex}
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <p className="text-xs font-medium text-[#1A1A1A] mb-1">
                      {artifact.title}
                    </p>
                    <p className="text-[10px] text-[#888888] mb-4">
                      {artifact.culture} · {artifact.date}
                    </p>
                    {/* External Link */}
                    <a
                      href={artifact.metUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs text-[#888888] hover:text-[#1A1A1A] transition-colors"
                    >
                      View on Met Museum →
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
