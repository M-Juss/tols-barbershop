import { MessageCircle } from "lucide-react";

const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61550652631553";

export function FacebookFab() {
  return (
    <a
      href={FACEBOOK_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Message TOL Barbershop on Facebook"
      title="Message TOL Barbershop on Facebook"
      className="fixed bottom-5 right-5 z-30 flex size-12 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-black/25 transition-transform hover:scale-105 hover:bg-accent/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="size-6" aria-hidden="true" />
    </a>
  );
}
