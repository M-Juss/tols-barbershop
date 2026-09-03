import { authFetch } from "@/lib/api";
import { invalidateRequestCache } from "@/lib/request-cache";

export interface ServiceAddOn {
  id: number;
  name: string;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceAddOnData {
  name: string;
  price: number;
  is_active?: boolean;
}

const addOnUrl = (id?: number): string =>
  process.env.NEXT_PUBLIC_API_URL +
  "/service-add-ons" +
  (id ? "/" + id : "");

export const getServiceAddOns = async (): Promise<ServiceAddOn[]> => {
  const response = await authFetch(addOnUrl());
  return response.data.add_ons;
};

export const createServiceAddOn = async (
  data: CreateServiceAddOnData,
): Promise<ServiceAddOn | null> => {
  const response = await authFetch(addOnUrl(), {
    method: "POST",
    body: JSON.stringify(data),
  });
  invalidateRequestCache("service-add-ons:");
  return response.data ?? null;
};

export const updateServiceAddOn = async (
  id: number,
  data: CreateServiceAddOnData,
): Promise<ServiceAddOn | null> => {
  const response = await authFetch(addOnUrl(id), {
    method: "PUT",
    body: JSON.stringify(data),
  });
  invalidateRequestCache("service-add-ons:");
  return response.data ?? null;
};

export const deleteServiceAddOn = async (id: number): Promise<void> => {
  await authFetch(addOnUrl(id), { method: "DELETE" });
  invalidateRequestCache("service-add-ons:");
};
