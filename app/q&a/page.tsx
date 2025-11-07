"use client"

import Image from "next/image"
import { useCallback, useState, type ChangeEvent, type FormEvent } from "react"
import IGALogo from "./assets/IGA.png"
import Bubble from "./components/Bubble"
import LoadingBubble from "./components/LoadingBubble"
import PromptSuggestionsRow from "./components/PromptSuggestionsRow"

type ChatMessage = {
    id: string
    role: "system" | "user" | "assistant"
    content: string
}

const Home = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [status, setStatus] = useState<"idle" | "loading">("idle")
    const [input, setInput] = useState("")

    const isLoading = status === "loading"
    const noMessages = messages.length === 0

    const fetchAssistantResponse = useCallback(async (history: ChatMessage[]) => {
        setStatus("loading")

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: history.map(({ role, content }) => ({ role, content })),
                }),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(errorText || "Failed to fetch chat response")
            }

            const result = (await response.json()) as {
                message?: { role?: string; content?: string }
            }

            const assistantContent = result.message?.content?.trim()

            if (assistantContent) {
                const assistantMessage: ChatMessage = {
                    id: typeof crypto !== "undefined" && "randomUUID" in crypto
                        ? crypto.randomUUID()
                        : `assistant-${Date.now()}`,
                    role: "assistant",
                    content: assistantContent,
                }

                setMessages((prev) => [...prev, assistantMessage])
            } else {
                console.error("Chat API returned an empty response")
            }
        } catch (error) {
            console.error("Chat request failed", error)
            const fallbackMessage: ChatMessage = {
                id: typeof crypto !== "undefined" && "randomUUID" in crypto
                    ? crypto.randomUUID()
                    : `assistant-error-${Date.now()}`,
                role: "assistant",
                content: "Sorry, I ran into a problem responding. Please try again.",
            }
            setMessages((prev) => [...prev, fallbackMessage])
        } finally {
            setStatus("idle")
        }
    }, [])

    const sendUserMessage = useCallback(
        (text: string) => {
            if (status === "loading") {
                return
            }

            const trimmed = text.trim()
            if (!trimmed) {
                return
            }

            const userMessage: ChatMessage = {
                id: typeof crypto !== "undefined" && "randomUUID" in crypto
                    ? crypto.randomUUID()
                    : `user-${Date.now()}`,
                role: "user",
                content: trimmed,
            }

            const history = [...messages, userMessage]
            setMessages(history)
            void fetchAssistantResponse(history)
        },
        [fetchAssistantResponse, messages, status],
    )

    const handlePrompt = useCallback(
        (promptText: string) => {
            sendUserMessage(promptText)
        },
        [sendUserMessage],
    )

    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value)
    }, [])

    const handleSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            if (!input.trim()) {
                return
            }

            sendUserMessage(input)
            setInput("")
        },
        [input, sendUserMessage],
    )

    return (
        <main>
            <Image src={IGALogo} width="250" alt="IGA Logo" />
            <section className={noMessages ? "" : "populated"}>
                {noMessages ? (
                    <>
                        <p className="starter-text">
                            The Ultimate place for The International Girls Academy!
                            Ask IGA anything about the fantastic organization
                            and it will come back with the most up-to-date answers.
                            We hope you enjoy!
                        </p>

                        <br />
                        <PromptSuggestionsRow onPromptClick={handlePrompt} />
                    </>
                ) : (
                    <>
                        {messages.map((message) => (
                            <Bubble key={message.id} message={message} />
                        ))}
                        {isLoading && <LoadingBubble />}
                    </>
                )}
                <form onSubmit={handleSubmit}>
                    <input
                        className="question-box"
                        onChange={handleInputChange}
                        value={input}
                        placeholder="Ask me something..."
                    />
                    <input type="submit" />
                </form>
            </section>
        </main>
    )
}

export default Home
