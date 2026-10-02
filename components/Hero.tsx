import Image from "next/image";
// Lives in assets/ (outside public/), so it is imported as a module: Next.js knows its size
// and builds a tiny blurred preview to show while the real image loads.
import campus from "@/assets/missouri-state-university-campus-overhead-drone.jpg";

export default function Hero() {
  return (
    // Three stacked layers inside one `relative` box (higher z sits on top):
    //   z-0  the photo (absolute, fills the box)
    //   z-10 dark overlay so white text is readable (absolute, fills the box)
    //   z-20 the text (relative, sits on top of everything)
    // -mt-16 pulls the section up under the 4rem navbar so the photo starts at the very top of the screen.
    <section
      id="top"
      aria-label="Introduction"
      className="relative isolate -mt-16 flex min-h-svh items-center overflow-hidden pt-16 text-white"
    >
      <Image
        src={campus}
        alt=""
        fill
        preload
        placeholder="blur"
        sizes="100vw"
        // scale-105: blur softens the photo's edges; zooming in 5% pushes those soft edges off-screen.
        // object-[48%_65%]: the focus point is the main building's entrance, so when a tall phone
        // screen crops the sides (or a wide screen crops top/bottom) the building stays centered.
        className="z-0 scale-105 object-cover object-[48%_65%] blur-[2px]"
      />
      {/* Darkening overlay: mostly black, shading into see-through maroon toward the bottom-right. */}
      <div aria-hidden className="absolute inset-0 z-10 bg-linear-to-br from-black/65 via-black/45 to-primary/60" />

      {/* Entrance animation is pure CSS (animate-hero-in in globals.css), so it plays even before JavaScript
          loads and always ends fully visible. motion-safe: skipped when the OS "reduce motion" setting is on.
          The soft text shadow keeps white text readable over the brighter parts of the photo. */}
      <div className="wrap relative z-20 py-24 [text-shadow:0_2px_16px_rgb(0_0_0/0.45)]">
        <h1 className="text-[28px] leading-snug font-bold tracking-[-0.02em] break-words motion-safe:animate-hero-in min-[400px]:text-[35px] min-[600px]:text-[44px] min-[900px]:text-[56px] min-[1200px]:text-[64px]">
          Hi, I&apos;m Hoang Nguyen
        </h1>
        <div className="motion-safe:animate-hero-in motion-safe:[animation-delay:80ms]">
          <p className="mt-5 max-w-2xl text-base text-white/90 sm:text-lg md:text-xl">
            Computer Science &amp; Applied Mathematics student at
          </p>
          <p className="max-w-2xl text-base text-white/90 sm:text-lg md:text-xl">
            Missouri State University
          </p>
        </div>
        <div className="motion-safe:animate-hero-in motion-safe:[animation-delay:160ms]">
          {/* A plain #about link: the page's smooth scrolling makes it glide down to the About section. */}
          <a
            href="#about"
            className="mt-10 inline-block rounded-full bg-linear-to-r from-primary to-primary-light px-6 py-3 text-lg font-semibold text-on-primary [text-shadow:none] transition-opacity duration-200 hover:opacity-90 sm:text-xl"
          >
            Know more
          </a>
        </div>
      </div>
    </section>
  );
}
