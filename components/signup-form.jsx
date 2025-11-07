"use client"

import { useRef, useState } from "react"

import { Button } from "./ui/button"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "./ui/field"
import { Input } from "./ui/input"

export function SignupForm({
  ...props
}) {
  const [step, setStep] = useState(1)
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
    schoolOrWork: "",
    location: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const formRef = useRef(null)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormValues((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleNext = () => {
    if (!formRef.current) {
      setStep(2)
      return
    }

    const stepOneFields = ["firstName", "lastName", "email", "age"]
    for (const fieldName of stepOneFields) {
      const field = formRef.current.elements.namedItem(fieldName)
      if (field && typeof field.reportValidity === "function") {
        if (!field.reportValidity()) {
          return
        }
      }
    }

    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (formValues.password !== formValues.confirmPassword) {
      const confirmField = formRef.current?.elements.namedItem("confirmPassword")
      if (confirmField && typeof confirmField.setCustomValidity === "function") {
        confirmField.setCustomValidity("Passwords do not match")
        confirmField.reportValidity()
        confirmField.setCustomValidity("")
      }
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          age: formValues.age,
          password: formValues.password,
          schoolOrWork: formValues.schoolOrWork,
          location: formValues.location,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error || "Failed to create account")
        return
      }

      setSuccess("Account created! You can now log in.")
      // Optionally reset form
      setFormValues({
        firstName: "",
        lastName: "",
        email: "",
        age: "",
        password: "",
        confirmPassword: "",
        schoolOrWork: "",
        location: "",
      })
      setStep(1)
    } catch (e) {
      setError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit}>
          {step === 1 && (
            <FieldGroup className="gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Jane"
                    autoComplete="given-name"
                    value={formValues.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    autoComplete="family-name"
                    value={formValues.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </Field>
                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jane@example.com"
                    autoComplete="email"
                    value={formValues.email}
                    onChange={handleInputChange}
                    required
                  />
                  <FieldDescription>
                    We&apos;ll use this to contact you. We will not share your email
                    with anyone else.
                  </FieldDescription>
                </Field>
                <Field className="md:col-span-1">
                  <FieldLabel htmlFor="age">Age</FieldLabel>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    min="4"
                    placeholder="21"
                    value={formValues.age}
                    onChange={handleInputChange}
                    required
                  />
                  <FieldDescription>
                    You must be at least 4 years old to create an account.
                  </FieldDescription>
                </Field>
              </div>
              <Field orientation="horizontal" className="flex-col items-center gap-2 md:flex-row md:items-center md:justify-between">
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
                <FieldDescription className="text-center md:text-left">
                  Already have an account? <Link href="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          )}

          {step === 2 && (
            <FieldGroup className="gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={formValues.password}
                    onChange={handleInputChange}
                    required
                  />
                  <FieldDescription>Must be at least 8 characters long.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={formValues.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <FieldDescription>Please confirm your password.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="schoolOrWork">School or Work</FieldLabel>
                  <Input
                    id="schoolOrWork"
                    name="schoolOrWork"
                    type="text"
                    placeholder="School name or workplace"
                    autoComplete="organization"
                    value={formValues.schoolOrWork || ""}
                    onChange={handleInputChange}
                    required
                  />
                  <FieldDescription>
                    This helps us tailor the experience to your current focus.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="location">Location</FieldLabel>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="City, Country"
                    autoComplete="address-level2"
                    value={formValues.location}
                    onChange={handleInputChange}
                    required
                  />
                  <FieldDescription>Select the region where you currently live.</FieldDescription>
                </Field>
              </div>
              <Field orientation="horizontal" className="flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <div className="flex flex-col items-end gap-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Creating..." : "Create Account"}
                  </Button>
                  <FieldDescription className="text-center md:text-right">
                    Already have an account? <Link href="/login">Sign in</Link>
                  </FieldDescription>
                </div>
              </Field>
            </FieldGroup>
          )}
          {error && (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          )}
          {success && (
            <p className="mt-4 text-sm text-green-600">{success}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}