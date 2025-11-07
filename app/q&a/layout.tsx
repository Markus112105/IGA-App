import type { Metadata } from "next"
import type { ReactNode } from "react"
import "./global.css"

export const metadata: Metadata = {
  title: "IGA Chatbot",
  description: "The place to go for all your International Girls Academy questions!",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="qa-page">{children}</div>
  )
}
