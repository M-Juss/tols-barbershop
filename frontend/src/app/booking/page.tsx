import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { NewAppointmentForm } from "@/forms/NewAppointmentForm";

export default function BookingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-primary">
      <LandingHeader />
      <main className="flex-1 bg-primary px-4 pb-12 pt-28 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Schedule Your Haircut</h1>
          <p className="mt-2 text-white/75">Choose your schedule, review the total, and verify your email to submit the request.</p>
        </div>
        <NewAppointmentForm />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
