"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}) {
  const router = useRouter()
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetSubmitting, setResetSubmitting] = useState(false)
  const [resetMessage, setResetMessage] = useState("")
  const [resetError, setResetError] = useState("")

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormValues((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formValues.email,
          password: formValues.password,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error || "Login failed")
        return
      }

      // Successful login - store user firstName if available
      console.log("Login successful:", data.user)
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("iga_isLoggedIn", "true")
          const firstName = data?.user?.firstName || null
          if (firstName) localStorage.setItem("iga_firstName", firstName)
          else localStorage.removeItem("iga_firstName")
          window.dispatchEvent(new CustomEvent("iga-auth", { detail: { isLoggedIn: true } }))
        }
      } catch (e) {
        // ignore localStorage errors
      }

      try {
        router.push("/dashboard")
      } catch (e) {
        // ignore navigation errors
      }
    } catch (e) {
      setError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const openReset = () => {
    setShowReset(true)
    setResetEmail((prev) => prev || formValues.email)
    setResetMessage("")
    setResetError("")
  }

  const closeReset = () => {
    setShowReset(false)
    setResetSubmitting(false)
  }

  const handleResetSubmit = async (event) => {
    event?.preventDefault?.()
    setResetError("")
    setResetMessage("")
    setResetSubmitting(true)

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setResetError(data?.error || "Unable to send reset instructions")
        return
      }

      setResetMessage(
        data?.message || "If that email exists, you'll receive reset instructions shortly."
      )
    } catch (err) {
      setResetError("Network error. Please try again.")
    } finally {
      setResetSubmitting(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to International Girls Academy
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formValues.email}
                  onChange={handleInputChange}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <button
                    type="button"
                    onClick={openReset}
                    className="ml-auto text-sm text-gray-700 underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formValues.password}
                  onChange={handleInputChange}
                  required
                />
              </Field>
              <Field>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Logging in..." : "Login"}
                </Button>
              </Field>
              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
              {showReset && (
                <div className="mt-4 space-y-3 rounded-md border border-gray-200 bg-white p-4 text-left">
                  <p className="text-sm font-medium text-gray-900">Reset your password</p>
                  <p className="text-sm text-gray-600">
                    Enter the email associated with your account and we&apos;ll send you a reset link.
                  </p>
                  <div className="space-y-3">
                    <Field>
                      <FieldLabel htmlFor="reset-email">Email</FieldLabel>
                      <Input
                        id="reset-email"
                        type="email"
                        value={resetEmail}
                        onChange={(event) => setResetEmail(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") handleResetSubmit(event)
                        }}
                        required
                      />
                    </Field>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={closeReset}
                        disabled={resetSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleResetSubmit}
                        disabled={resetSubmitting}
                      >
                        {resetSubmitting ? "Sending..." : "Send reset link"}
                      </Button>
                    </div>
                  </div>
                  {resetMessage && (
                    <p className="text-sm text-green-600">{resetMessage}</p>
                  )}
                  {resetError && (
                    <p className="text-sm text-red-600">{resetError}</p>
                  )}
                </div>
              )}
              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link href="/signup">Sign up</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              width={500}
              height={600}
              src="/login2.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
