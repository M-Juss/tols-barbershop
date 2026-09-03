import { authFetch } from "@/lib/api";

export type NavigationSummary = {
  pending_appointments: number | null;
};

const SUMMARY_STALE_MS = 5_000;

let cachedSummary: NavigationSummary | null = null;
let cacheExpiresAt = 0;
let inFlightRequest: Promise<NavigationSummary> | null = null;

export async function getNavigationSummary(
  signal?: AbortSignal,
  force = false,
): Promise<NavigationSummary> {
  if (!force && cachedSummary && Date.now() < cacheExpiresAt) {
    return cachedSummary;
  }

  if (inFlightRequest) {
    return inFlightRequest;
  }

  inFlightRequest = authFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/navigation-summary`,
    { signal },
  ).then((response) => response.data as NavigationSummary);

  try {
    cachedSummary = await inFlightRequest;
    cacheExpiresAt = Date.now() + SUMMARY_STALE_MS;
    return cachedSummary;
  } finally {
    inFlightRequest = null;
  }
}
