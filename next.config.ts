import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev server only (ignored by `next build` / `next start`): lets a phone on the same Wi-Fi load
  // the dev site at http://192.168.1.208:3000. Without it, Next.js blocks its dev scripts for that
  // address, the page never starts its JavaScript, and anything waiting for JS stays hidden.
  // If your computer's local IP changes, update it here and restart `npm run dev`.
  allowedDevOrigins: ["192.168.1.208"],
};

export default nextConfig;
