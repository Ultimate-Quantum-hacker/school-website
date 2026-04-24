import { schoolConfig } from "@/config/school";

/**
 * Floating WhatsApp chat button, fixed to the bottom-right.
 *
 * Renders as a plain `<a>` so no client JS is required. Opens the
 * `wa.me` deep link in a new tab with a prefilled message so the
 * parent/prospect lands on the school's WhatsApp already mid-convo.
 */
export function WhatsAppChat() {
  const href = `https://wa.me/${schoolConfig.whatsapp.number}?text=${encodeURIComponent(
    schoolConfig.whatsapp.defaultMessage,
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${schoolConfig.name} on WhatsApp`}
      title="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
    >
      <svg
        className="w-7 h-7"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path d="M20.52 3.48A11.86 11.86 0 0012.03 0C5.46 0 .13 5.32.13 11.88c0 2.09.55 4.13 1.6 5.93L0 24l6.36-1.67a11.9 11.9 0 005.67 1.44h.01c6.56 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.17-3.41-8.4zM12.04 21.6h-.01a9.73 9.73 0 01-4.96-1.36l-.35-.21-3.77.99 1-3.67-.23-.38a9.73 9.73 0 01-1.49-5.17c0-5.38 4.39-9.76 9.78-9.76 2.61 0 5.07 1.02 6.92 2.86a9.7 9.7 0 012.87 6.91c0 5.38-4.39 9.79-9.76 9.79zm5.37-7.32c-.29-.15-1.74-.86-2.01-.96-.27-.1-.46-.15-.66.15s-.76.96-.93 1.16c-.17.2-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.44-.87-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.6-.9-2.19-.24-.58-.48-.5-.66-.51l-.56-.01c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.43s1.04 2.82 1.19 3.02c.15.2 2.05 3.13 4.97 4.39.69.3 1.24.48 1.66.61.7.22 1.33.19 1.83.12.56-.08 1.74-.71 1.98-1.4.24-.69.24-1.28.17-1.4-.07-.12-.27-.19-.56-.34z" />
      </svg>
    </a>
  );
}
