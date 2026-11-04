import { artifacts } from "@/lib/data";
import ArtifactGrid from "@/components/ArtifactGrid";
import Link from "next/link";

export default function ArchivePage() {
  return (
    <div className="min-h-screen bg-[#F8F8F6] px-6 py-12 font-mono">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="mb-16 text-center relative">
          <div className="absolute top-0 left-0">
             <Link 
              href="/" 
              className="text-xs border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors uppercase font-mono"
            >
              ← Back to Desk
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-[#1A1A1A] mb-4 pt-8 md:pt-0">
            The Archive Room
          </h1>
          <p className="text-lg text-[#888888] max-w-2xl mx-auto">
            Full Collection Index
          </p>
        </header>

        {/* Grid with Sorting */}
        <ArtifactGrid initialArtifacts={artifacts} />
      </div>
    </div>
  );
}

