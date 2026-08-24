"use client";

import { useCallback, useEffect, useState } from "react";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import EmailList, {
  type DashboardEmail,
} from "../components/dashboard/EmailList";

import type { User } from "@/types/auth";
import {
  getCampaignEmails,
  getCampaigns,
  getCurrentUser,
} from "@/lib/api";

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<"scheduled" | "sent">(
    "scheduled",
  );

  const [search, setSearch] = useState("");

  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  const [emails, setEmails] = useState<DashboardEmail[]>([]);
  const [loading, setLoading] = useState(true);

  // Load authenticated user
  const loadUser = useCallback(async () => {
    try {
      setUserLoading(true);

      const response = await getCurrentUser();

      setUser(response.user);
    } catch (error) {
      console.error("Failed to load current user:", error);
      setUser(null);
    } finally {
      setUserLoading(false);
    }
  }, []);

  // Load all campaign emails
  const loadEmails = useCallback(async () => {
    try {
      setLoading(true);

      const campaignsResponse = await getCampaigns();

      const emailResponses = await Promise.all(
        campaignsResponse.campaigns.map((campaign) =>
          getCampaignEmails(campaign.id),
        ),
      );

      const allEmails = emailResponses.flatMap(
        (response) => response.emails,
      );

      // Convert backend Email type to DashboardEmail
      const dashboardEmails: DashboardEmail[] = allEmails.map(
        (email) => ({
          id: email.id,
          recipient: email.recipient,
          subject: email.subject,
          body: email.body,
          scheduledAt: email.scheduledAt,
          sentAt: email.sentAt ?? null,
          status: email.status as
            | "scheduled"
            | "processing"
            | "sent"
            | "failed",
          attempts: email.attempts ?? 0,
          errorMessage: email.errorMessage ?? null,
        }),
      );

      setEmails(dashboardEmails);
    } catch (error) {
      console.error("Failed to load emails:", error);
      setEmails([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial loading
  useEffect(() => {
    loadUser();
    loadEmails();
  }, [loadUser, loadEmails]);

  // Filter by Scheduled / Sent
  const visibleEmails = emails.filter((email) => {
    if (activeView === "scheduled") {
      return email.status === "scheduled";
    }

    return email.status === "sent";
  });

  // Search
  const searchedEmails = visibleEmails.filter((email) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      email.recipient.toLowerCase().includes(query) ||
      email.subject.toLowerCase().includes(query) ||
      email.body.toLowerCase().includes(query)
    );
  });

  // Sidebar counts
  const scheduledCount = emails.filter(
    (email) => email.status === "scheduled",
  ).length;

  const sentCount = emails.filter(
    (email) => email.status === "sent",
  ).length;

  // Refresh
  const handleRefresh = async () => {
    await loadEmails();
  };

  // Compose
  const handleCompose = () => {
    console.log("Compose clicked");
  };

  // Email click
  const handleEmailClick = (email: DashboardEmail) => {
    console.log("Selected email:", email);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <Sidebar
          user={userLoading ? null : user}
          activeView={activeView}
          onViewChange={setActiveView}
          scheduledCount={scheduledCount}
          sentCount={sentCount}
          onCompose={handleCompose}
        />

        <section className="min-w-0 flex-1 px-8 py-7">
          <DashboardHeader
            activeView={activeView}
            search={search}
            onSearchChange={setSearch}
            onRefresh={handleRefresh}
          />

          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200">
            <EmailList
              emails={searchedEmails}
              loading={loading}
              onEmailClick={handleEmailClick}
            />
          </div>
        </section>
      </div>
    </main>
  );
}