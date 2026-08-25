"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getCurrentUser, getEmail } from "@/lib/api";
import type { User } from "@/types/auth";
import type { EmailDetail } from "@/types/email";

import EmailHeader from "./EmailHeader";
import EmailMetadata from "./EmailMetadata";
import EmailBody from "./EmailBody";

type Props = {
  emailId: string;
};

export default function EmailDetailPage({ emailId }: Props) {
  const router = useRouter();

  const [email, setEmail] = useState<EmailDetail | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadEmail() {
      try {
        setLoading(true);
        setError("");

        const [emailResponse, userResponse] = await Promise.all([
          getEmail(emailId),
          getCurrentUser(),
        ]);

        if (!cancelled) {
          setEmail(emailResponse.email);
          setUser(userResponse.user);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load email",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadEmail();

    return () => {
      cancelled = true;
    };
  }, [emailId]);

  if (loading) {
    return (
      <main className="ml-70 flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-gray-500">
          Loading email...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="ml-70 flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-sm font-medium text-red-600">
            Failed to load email
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-4 text-sm font-medium text-gray-900 underline"
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  if (!email) {
    return null;
  }

  return (
    <main className="ml-70 min-h-screen bg-white">
      <EmailHeader subject={email.subject} />

      <div className="mx-auto max-w-5xl">
        <EmailMetadata
          email={email}
          user={user}
        />

        <div className="border-t border-gray-100" />

        <EmailBody body={email.body} />
      </div>
    </main>
  );
}