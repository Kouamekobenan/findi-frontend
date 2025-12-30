
/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public", // les fichiers générés (service worker, cache)
  register: true, // auto-register le service worker
  skipWaiting: true, // mise à jour automatique du SW
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**", // Autorise tous les chemins
      },
    ],
  },
  // tu peux ajouter d'autres options Next.js ici
};

module.exports = withPWA(nextConfig);
