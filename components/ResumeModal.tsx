"use client";

import { useEffect, useRef, useState } from "react";
import { FaDownload } from "react-icons/fa6";

// The file lives at public/resume.pdf. Files in public/ are served from the site root,
// so the URL is "/resume.pdf" (no "public" in the path).
const RESUME_PATH = "/resume.pdf";

// Phones: narrower than 768px, or a touch screen that is short (a phone held sideways).
// iOS Safari can't show a PDF inside a page well (cut off, zoomed in), so phones open the PDF
// in a new tab instead, where the built-in iOS PDF viewer takes over. Keep in sync with the
// `phone:` variant in globals.css.
const PHONE_QUERY = "(max-width: 767px), (pointer: coarse) and (max-height: 500px)";

// "View Resume" button + a modal that shows the PDF (iPad and desktop).
// The button is a real link to the PDF, so it still works on phones and without JavaScript;
// on larger screens a click is intercepted and opens the modal instead.
// The modal uses the browser's native <dialog>: showModal() gives us the dark backdrop,
// Esc-to-close and keyboard focus kept inside the modal for free.
export default function ResumeModal() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Keep the <dialog> in sync with `open`, and lock page scrolling while it is open.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!open) {
      dialog.close();
      return;
    }
    dialog.showModal();
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <a
          href={RESUME_PATH}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            // Phones (and ctrl/cmd/middle-clicks) follow the link and open the PDF in a new tab.
            if (window.matchMedia(PHONE_QUERY).matches || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
            e.preventDefault();
            setOpen(true);
          }}
          className="inline-block cursor-pointer border-2 border-white px-6 py-3 font-semibold transition-colors duration-200 hover:bg-white hover:text-accent focus-visible:outline-white"
        >
          View Resume
        </a>
        {/* Phones get the PDF viewer instead of the modal, so their Download link lives here.
            On iPad and desktop it's hidden and the modal's Download button is used. */}
        <a
          href={RESUME_PATH}
          download
          className="hidden items-center gap-2 text-sm font-medium text-white/90 underline decoration-white/40 underline-offset-[3px] transition-colors duration-200 hover:decoration-white phone:inline-flex"
        >
          <FaDownload aria-hidden className="size-3.5" />
          Download PDF
        </a>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="resume-title"
        // Fires however the dialog closes (Esc, X, backdrop), so the state never goes stale.
        onClose={() => setOpen(false)}
        // A click whose target is the <dialog> itself landed on the backdrop, not the content.
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        // Sizing (iPad and desktop; phones never open it): as wide as possible while
        //   - leaving 16px on each side (100vw - 2rem), and
        //   - letting a whole Letter page (8.5 x 11) plus the ~3.5rem header fit in 90% of the screen height.
        // m-auto centers it both ways. h-fit (not h-auto) matters: a modal dialog is pinned top:0/bottom:0,
        // so h-auto would stretch it to max-h and leave empty space under the page.
        // lg: (1024px+) switches to a fixed desktop size instead: ~900px wide (max 90% of the screen), 90vh tall.
        className="m-auto h-fit max-h-[90dvh] w-[min(calc(100vw-2rem),calc((90dvh-3.5rem)*8.5/11))] max-w-none overflow-hidden rounded-2xl border-0 bg-bg p-0 text-fg shadow-2xl backdrop:bg-black/55 backdrop:backdrop-blur-[3px] lg:h-[90dvh] lg:w-[min(900px,90vw)]"
      >
        <div className="@container flex max-h-[90dvh] flex-col lg:h-full">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2 sm:px-4">
            {/* @xs: = the popup itself is at least 20rem wide (container query), not the screen. */}
            <h2 id="resume-title" className="mr-auto hidden font-semibold @xs:block">
              Resume
            </h2>
            <a
              href={RESUME_PATH}
              download
              aria-label="Download resume"
              title="Download"
              className="ml-auto grid size-9 place-items-center rounded-full bg-linear-to-r from-primary to-secondary text-on-primary transition-opacity duration-200 hover:opacity-90"
            >
              <FaDownload aria-hidden className="size-4" />
            </a>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close resume"
              className="grid size-9 cursor-pointer place-items-center rounded-full text-2xl leading-none text-muted transition-colors duration-200 hover:bg-surface hover:text-fg"
            >
              <span aria-hidden>×</span>
            </button>
          </div>
          {/* Only mounted while open, so the PDF isn't downloaded until someone asks for it.
              aspect-[8.5/11]: below lg the frame is exactly one Letter page tall at the dialog's width
              (without it an iframe defaults to 150px tall, the "thin strip"). On lg it fills the 90dvh dialog.
              #toolbar=0 hides Chrome/Edge's PDF toolbar (our Download button replaces it); view=FitH fits the page width. */}
          {open && (
            <iframe
              src={`${RESUME_PATH}#toolbar=0&view=FitH`}
              title="Resume PDF"
              className="aspect-[8.5/11] w-full bg-surface lg:aspect-auto lg:flex-1"
            />
          )}
        </div>
      </dialog>
    </>
  );
}
