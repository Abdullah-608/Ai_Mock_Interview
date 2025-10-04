import Image from "next/image";

import { cn } from "@/lib/utils";

interface TechIcon {
  tech: string;
  url: string;
}

interface DisplayTechIconsProps {
  techStack?: string[];
  techIcons?: TechIcon[];
}

const DisplayTechIcons = ({ techStack, techIcons }: DisplayTechIconsProps) => {
  // If techIcons are provided (pre-fetched), use them
  // Otherwise, create default icons from techStack
  const icons = techIcons || (techStack || []).map(tech => ({
    tech,
    url: "/tech.svg" // fallback icon
  }));

  return (
    <div className="flex flex-row -space-x-2">
      {icons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className="relative group"
          style={{ zIndex: icons.length - index }}
        >
          {/* Tooltip */}
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg border border-white/10 z-50">
            {tech}
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-white/10" />
          </span>

          {/* Icon Container */}
          <div className="relative w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full p-2 border-2 border-white/10 group-hover:border-purple-500/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/25">
            <Image
              src={url}
              alt={tech}
              width={24}
              height={24}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      ))}
      
      {/* Show +N if there are more icons */}
      {icons.length > 3 && (
        <div className="relative w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-slate-900 shadow-lg z-0">
          +{icons.length - 3}
        </div>
      )}
    </div>
  );
};

export default DisplayTechIcons;
