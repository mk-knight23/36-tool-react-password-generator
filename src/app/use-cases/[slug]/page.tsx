import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/content/ArticleLayout";
import { pageMetadata } from "@/lib/seo";
import { getUseCase, USE_CASE_SLUGS } from "@/content/use-cases";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): Array<{ slug: string }> {
  return USE_CASE_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) return {};
  return pageMetadata({
    title: useCase.title,
    description: useCase.description,
    path: `/use-cases/${useCase.slug}`,
    type: "article",
  });
}

export default async function UseCasePage({ params }: Params) {
  const { slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) notFound();
  return (
    <ArticleLayout
      doc={useCase}
      basePath="/use-cases"
      sectionLabel="Use-cases"
      trackEvent="guide_opened"
    />
  );
}
