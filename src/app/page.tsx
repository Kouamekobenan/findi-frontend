"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogoFindi, NameApp } from "./lib/constant/constant";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirection après une animation fluide
    const timer = setTimeout(() => {
      router.push("/page");
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 overflow-hidden">
      {/* Éléments décoratifs en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-slate-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 text-center">
        {/* Logo avec animation */}
        <div className="mb-8 animate-fade-in-up">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-orange-400 rounded-full filter blur-2xl opacity-30 animate-pulse"></div>
            <Image
              src={LogoFindi}
              width={120}
              height={120}
              alt={NameApp}
              className="relative z-10 drop-shadow-lg"
              priority
            />
          </div>
        </div>
        {/* Spinner personnalisé */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-orange-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-orange-600 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-orange-400 rounded-full animate-spin-slow"></div>
        </div>

        {/* Texte avec animation */}
        <div className="space-y-2 animate-fade-in-up animation-delay-200">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            {NameApp}
          </h2>
          <p className="text-slate-600 font-medium">Chargement en cours...</p>

          {/* Barre de progression */}
          <div className="mt-6 w-64 h-1 bg-slate-200 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-progress"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
