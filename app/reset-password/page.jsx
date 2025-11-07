"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useRef(getSupabaseBrowserClient()).current;

  const [initializing, setInitializing] = useState(true);
  const [sessionAccessToken, setSessionAccessToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updating, setUpdating] = useState(false);
  const canReset = Boolean(sessionAccessToken);

  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      setError("");
      setMessage("");
      setInitializing(true);

      try {
        const code = searchParams.get("code");
        const accessToken = searchParams.get("access_token");
        const refreshToken = searchParams.get("refresh_token");

        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            throw exchangeError;
          }

          if (!isMounted) return;
          setSessionAccessToken(data?.session?.access_token || "");
          setInitializing(false);
          return;
        }

        if (accessToken && refreshToken) {
          const { data, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (setSessionError) {
            throw setSessionError;
          }

          if (!isMounted) return;
          setSessionAccessToken(data?.session?.access_token || accessToken);
          setInitializing(false);
          return;
        }

        throw new Error("Missing reset token");
      } catch (err) {
        console.error("/reset-password init error", err);
        if (!isMounted) return;
        setError("This reset link is invalid or has expired.");
        setInitializing(false);
      }
    }

    initialize();

    return () => {
      isMounted = false;
    };
  }, [searchParams, supabase]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setUpdating(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || sessionAccessToken;

      if (!accessToken) {
        throw new Error("Missing session token");
      }

      const res = await fetch("/api/password/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Unable to update saved password");
      }

      setMessage("Your password has been updated. You can now sign in with the new password.");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error("/reset-password submit error", err);
      setError(err?.message || "Unable to update your password.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffeded] px-4 py-10">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Reset your password</CardTitle>
            <CardDescription>
              Choose a new password for your International Girls Academy account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            {initializing ? (
              <p className="text-sm text-gray-600">Validating your reset link…</p>
            ) : !canReset ? (
              <div className="space-y-4">
                <p className="text-sm text-red-600">
                  {error || "This reset link is invalid or has expired."}
                </p>
                <Button type="button" className="w-full" onClick={() => router.push("/login")}>Return to login</Button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    className="mb-1 block text-sm font-medium text-gray-800"
                    htmlFor="new-password"
                  >
                    New password
                  </label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Enter a new password"
                    required
                  />
                </div>
                <div>
                  <label
                    className="mb-1 block text-sm font-medium text-gray-800"
                    htmlFor="confirm-password"
                  >
                    Confirm password
                  </label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Re-enter the new password"
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
                {message && (
                  <p className="text-sm text-green-600">{message}</p>
                )}
                <Button type="submit" disabled={initializing || updating} className="w-full">
                  {updating ? "Updating password…" : "Update password"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
