"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { TextAreaWithLabel } from "@/components/common/TextAreaWithLabel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPublicFeedbackContext, submitPublicFeedback, type PublicFeedbackContext } from "@/services/public-feedback.api";

function FeedbackForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [context, setContext] = useState<PublicFeedbackContext | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("This rating link is invalid.");
      setLoading(false);
      return;
    }
    void getPublicFeedbackContext(token)
      .then(setContext)
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "This rating link is unavailable."))
      .finally(() => setLoading(false));
  }, [token]);

  async function submit() {
    if (rating < 1) {
      toast.error("Select a rating first.");
      return;
    }
    setLoading(true);
    try {
      await submitPublicFeedback(token, rating, comment);
      setSubmitted(true);
      toast.success("Thank you for your feedback!");
    } catch (requestError) {
      toast.error(requestError instanceof Error ? requestError.message : "Feedback could not be submitted.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[75dvh] w-full max-w-2xl items-center px-4 pb-12 pt-28 sm:px-6">
      <div className="w-full rounded-xl border bg-white p-6 shadow-sm sm:p-8">
        {loading && !context ? <p className="text-center text-sm text-gray-500">Loading rating form...</p> : error ? <p className="text-center text-sm text-red-500">{error}</p> : submitted ? <div className="text-center"><h1 className="text-2xl font-bold text-gray-900">Thank you!</h1><p className="mt-2 text-gray-600">Your rating has been submitted.</p></div> : context ? <>
          <div className="text-center"><h1 className="text-2xl font-bold text-gray-900">Rate Your Visit</h1><p className="mt-2 text-sm text-gray-500">{context.reference} · {context.service_name} · {context.barber_name}</p></div>
          <div className="my-7 flex justify-center gap-2">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" aria-label={`${value} stars`} onClick={() => setRating(value)}><Star className={cn("size-9", value <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300")} /></button>)}</div>
          <TextAreaWithLabel id="feedback-comment" label="Comment (optional)" value={comment} onChange={(event) => setComment(event.target.value)} maxLength={300} rows={4} placeholder="Tell us about your visit" />
          <Button type="button" className="mt-6 w-full" disabled={loading || rating < 1} onClick={() => void submit()}>{loading ? "Submitting..." : "Submit Rating"}</Button>
        </> : null}
      </div>
    </main>
  );
}

export default function FeedbackPage() {
  return <div className="min-h-dvh bg-slate-100"><LandingHeader /><Suspense fallback={<div className="min-h-[75dvh]" />}><FeedbackForm /></Suspense><LandingFooter /></div>;
}
