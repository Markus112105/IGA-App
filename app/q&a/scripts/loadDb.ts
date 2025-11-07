// app/q&a/scripts/loadDb.ts
import "dotenv/config";
import OpenAI from "openai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const {
  ASTRA_DB_KEYSPACE,          
  ASTRA_DB_NAMESPACE,         
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY
} = process.env;


const KEYSPACE = (ASTRA_DB_KEYSPACE ?? ASTRA_DB_NAMESPACE)!;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY! });

const cfgData = [
  "https://www.theinternationalgirlsacademy.com/ourteam",
  "https://www.theinternationalgirlsacademy.com/programs",
  "https://www.theinternationalgirlsacademy.com/volunteer",
  "https://www.theinternationalgirlsacademy.com/donate",
];

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN!);

const db = client.db(ASTRA_DB_API_ENDPOINT!, { keyspace: KEYSPACE });

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

const createCollection = async (similarityMetric: SimilarityMetric = "dot_product") => {
  try {
    const res = await db.createCollection(ASTRA_DB_COLLECTION!, {
      vector: {
        dimension: 1536,
        metric: similarityMetric,
      },
    });
    console.log("Collection created:", res);
  } catch (err: any) {
    if (err.name === "CollectionAlreadyExistsError") {
      console.log("Collection already exists, continuing...");
    } else {
      throw err;
    }
  }
};

const loadSampleData = async () => {
  const collection = await db.collection(ASTRA_DB_COLLECTION!);

  for (const url of cfgData) {
    console.log(`Scraping ${url}`);
    const content = await scrapePage(url);
    const chunks = await splitter.splitText(content);

    for (const chunk of chunks) {
      // skip duplicates (by text)
      const existing = await collection.findOne({ text: chunk });
      if (existing) {
        console.log("Duplicate chunk found, skipping.");
        continue;
      }

      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
        encoding_format: "float",
      });

      const vector = embedding.data[0].embedding;

      const res = await collection.insertOne({
        $vector: vector,
        text: chunk,
      });

      console.log("Inserted:", res);
    }
  }
};

async function scrapePage(url: string): Promise<string> {

  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: true, // or 'new'
      // args: ['--no-sandbox','--disable-setuid-sandbox'], // useful on CI
    },
    gotoOptions: { waitUntil: "domcontentloaded" },
  });

  // loader.load() returns Document[] with HTML in pageContent
  const docs = await loader.load();
  const html = docs.map(d => d.pageContent).join("\n");

  // strip tags → plain text
  return html.replace(/<[^>]*>?/gm, "");
}

createCollection().then(() => loadSampleData()).catch((e) => {
  console.error(e);
  process.exit(1);
});