import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { NewAppointmentForm } from "@/forms/NewAppointmentForm";

export default function BookingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-primary">
      <LandingHeader />
      <main className="flex-1 bg-primary px-4 pb-12 pt-28 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <NewAppointmentForm />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
