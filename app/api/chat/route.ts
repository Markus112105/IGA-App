
import OpenAI from "openai"
import { DataAPIClient } from "@datastax/astra-db-ts"

type MessagePart = {
    type?: string
    text?: string
    value?: string
    content?: string
}

type IncomingMessage = {
    role: string
    content?: string | Array<MessagePart | string>
    parts?: Array<MessagePart | string>
}

type NormalizedMessage = {
    role: string
    content: string
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
})

const KEYSPACE = process.env.ASTRA_DB_KEYSPACE ?? process.env.ASTRA_DB_NAMESPACE!
const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN!)
const db = client.db(process.env.ASTRA_DB_API_ENDPOINT!, { keyspace: KEYSPACE })
const COLLECTION_NAME = process.env.ASTRA_DB_COLLECTION!

const flattenParts = (parts?: Array<MessagePart | string>) => {
    if (!Array.isArray(parts)) {
        return ""
    }

    return parts
        .map((part) => {
            if (!part) {
                return ""
            }

            if (typeof part === "string") {
                return part
            }

            if (part.text) {
                return part.text
            }

            if (part.value) {
                return part.value
            }

            if (part.content && typeof part.content === "string") {
                return part.content
            }

            return ""
        })
        .join("")
        .trim()
}

const extractText = (message: IncomingMessage) => {
    if (typeof message.content === "string") {
        const trimmed = message.content.trim()
        if (trimmed) {
            return trimmed
        }
    }

    const textFromContent = flattenParts(message.content)
    if (textFromContent) {
        return textFromContent
    }

    return flattenParts(message.parts)
}

const flattenAssistantContent = (content: unknown): string => {
    if (typeof content === "string") {
        return content
    }

    if (Array.isArray(content)) {
        return content
            .map((part) => {
                if (typeof part === "string") {
                    return part
                }

                if (part && typeof part === "object" && "text" in part) {
                    const maybeText = (part as { text?: string }).text
                    return maybeText ?? ""
                }

                return ""
            })
            .join("")
    }

    return ""
}

export async function POST(req: Request) {
    try {
        const { messages } = (await req.json()) as { messages?: IncomingMessage[] }
        console.log(messages, "API")
        const normalizedMessages: NormalizedMessage[] =
            messages
                ?.map((message) => ({
                    role: message.role,
                    content: extractText(message).trim(),
                }))
                .filter((message) => message.content.length > 0) ?? []

        const latestUserMessage = [...normalizedMessages]
            .reverse()
            .find((message) => message.role === "user")?.content

        if (!latestUserMessage) {
            return new Response("Missing user message", { status: 400 })
        }

        const chatHistory = normalizedMessages.filter((message) => message.role !== "system")

        let docContext = ""

        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: latestUserMessage,
            encoding_format: "float",
        })

        try {
            const collection = await db.collection(COLLECTION_NAME)
            const cursor = collection.find(null, {
                sort: {
                    $vector: embedding.data[0].embedding,
                },
                limit: 10,
            })

            const documents = await cursor.toArray()
            const docsMap = documents?.map((doc: { text?: string }) => doc.text).filter(Boolean)

            if (docsMap && docsMap.length > 0) {
                docContext = JSON.stringify(docsMap)
            }
        } catch (error) {
            console.error("Error querying Astra DB:", error)
        }

        const systemMessage: NormalizedMessage = {
            role: "system",
            content: `You are an AI assistant who knows everything about International Girls Academy.
Use the below context to augment what you know about International Girls Academy.
The context will provide you with the most recent page data from wikipedia,
the official International Girls Academy website and others.
If the context doesn't include the information you need answer based on your
existing knowledge and don't mention the source of your information or
what the context does or doesn't include.
Format responses using markdown where applicable and don't return
images.
---------------------
START CONTEXT
${docContext}
END CONTEXT
---------------------
QUESTION: ${latestUserMessage}
---------------------
`,
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [systemMessage, ...chatHistory],
        })

        const assistantChoice = completion.choices[0]
        const assistantContent = flattenAssistantContent(assistantChoice?.message?.content).trim()

        if (!assistantContent) {
            return new Response("Failed to generate response", { status: 500 })
        }

        return Response.json({
            message: {
                role: "assistant",
                content: assistantContent,
            },
        })
    } catch (error) {
        console.error("Chat API error:", error)
        return new Response("Failed to generate response", { status: 500 })
    }
}
