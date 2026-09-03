import { publicFetch } from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL;

export type PublicFeedbackContext = {
  reference: string;
  barber_name: string | null;
  service_name: string | null;
};

export async function getPublicFeedbackContext(token: string): Promise<PublicFeedbackContext> {
  const params = new URLSearchParams({ token });
  const response = await publicFetch(`${API}/public-feedback-form?${params.toString()}`);
  return response.data;
}

export async function submitPublicFeedback(token: string, rating: number, comment: string): Promise<void> {
  await publicFetch(`${API}/public-feedback-form`, {
    method: "POST",
    body: JSON.stringify({ token, rating, comment: comment.trim() || null }),
  });
}
