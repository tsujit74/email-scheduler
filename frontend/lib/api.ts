import type { User } from "@/types/auth";
import type {
  Campaign,
  CreateCampaignInput,
} from "@/types/campaign";
import type { Email, EmailDetail } from "@/types/email";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type ApiOptions = RequestInit & {
  params?: Record<string, string>;
};

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { params, ...fetchOptions } = options;

  const url = new URL(`${API_URL}${path}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export function getCurrentUser() {
  return apiFetch<{
    success: boolean;
    user: User;
  }>("/api/auth/me");
}

export function logout() {
  return apiFetch<{
    success: boolean;
    message: string;
  }>("/api/auth/logout", {
    method: "POST",
  });
}

export function getCampaigns() {
  return apiFetch<{
    success: boolean;
    campaigns: Campaign[];
  }>("/api/campaigns");
}

export function getCampaign(campaignId: string) {
  return apiFetch<{
    success: boolean;
    campaign: Campaign;
  }>(`/api/campaigns/${campaignId}`);
}

export function getCampaignEmails(campaignId: string) {
  return apiFetch<{
    success: boolean;
    emails: Email[];
  }>(`/api/campaigns/${campaignId}/emails`);
}

export function createCampaign(data: CreateCampaignInput) {
  return apiFetch<{
    success: boolean;
    campaign: Campaign;
  }>("/api/campaigns", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function addRecipients(
  campaignId: string,
  recipients: string[],
) {
  return apiFetch<{
    success: boolean;
    emails: Email[];
  }>(`/api/campaigns/${campaignId}/emails`, {
    method: "POST",
    body: JSON.stringify({ recipients }),
  });
}

export function cancelCampaign(campaignId: string) {
  return apiFetch<{
    success: boolean;
    campaign: Campaign;
  }>(`/api/campaigns/${campaignId}/cancel`, {
    method: "POST",
  });
}

// export function getEmail(
//   campaignId: string,
//   emailId: string,
// ) {
//   return apiFetch<{
//     success: boolean;
//     email: Email;
//   }>(`/api/${campaignId}/emails/${emailId}`);
// }

export function getEmail(emailId: string) {
  return apiFetch<{
    success: boolean;
    email: EmailDetail;
  }>(`/api/emails/${emailId}`);
}
