import { kv } from "@vercel/kv";
import { notFound } from "next/navigation";
import FormRSC from "@/components/form-rsc";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: {
    id: string;
  };
}): Promise<Metadata | undefined> {
  const data = await kv.hgetall<{ prompt: string; image?: string }>(params.id);
  if (!data) {
    return;
  }

  const title = `Spirals: ${data.prompt}`;
  const description = `A generated from the prompt: ${data.prompt}`;
  const image = data.image || "https://spirals.vercel.app/opengraph-image.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@steventey",
    },
  };
}

export default async function Results({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const data = await kv.hgetall<{ prompt: string; image?: string }>(params.id);
  console.log(data);
  if (!data) {
    notFound();
  }
  return <FormRSC prompt={data.prompt} image={data.image || null} />;
}
