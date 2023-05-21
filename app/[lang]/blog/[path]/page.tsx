import { pageSeoAdapter } from '@/adapters/pageSeoAdapter';
import PageLayout from '@/components/PageLayout';
import { getNotionSinglePage, queryNotionDatabase } from '@/services/notion';
import { Metadata, ResolvingMetadata } from 'next';
import React from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

interface Props {
  params: {
    path: string;
  };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const databaseId = process.env.NEXT_PUBLIC_NOTION_PAGES_DATABASE_ID!;

  const seoResponse = await queryNotionDatabase({
    databaseId,
    filter: {
      property: 'SeoPath',
      formula: {
        string: {
          equals: params.path,
        },
      },
    },
  });

  const seo = pageSeoAdapter(seoResponse[0]);

  return {
    title: seo.title,
    category: 'technology',
    description: seo.description,
    twitter: {
      card: 'summary_large_image',
      site: '@site',
      creator: '@creator',
      images: {
        url: seo.image,
        alt: seo.imageAlt,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.url,
      siteName: seo.title,
      type: 'website',
      images: [
        {
          url: seo.image,
          alt: seo.imageAlt,
        },
      ],
    },
  };
}

const ArticlePage = async ({ params }: Props) => {
  const databaseId = process.env.NEXT_PUBLIC_NOTION_PAGES_DATABASE_ID!;

  const blogResponse = await getNotionSinglePage({
    databaseId,
    filter: {
      property: 'SeoPath',
      formula: {
        string: {
          equals: params.path,
        },
      },
    },
  });

  return (
    <>
      <div className='relative h-64'></div>
      <PageLayout>
        <div className='flex flex-col gap-y-4'>
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className='font-medium text-title dark:text-dark-headlines text-light-headlines'
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className='italic font-medium font-monospace dark:text-dark-headlines text-light-headlines'
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p className='dark:text-dark-text text-light-text' {...props} />
              ),
            }}
          >
            {blogResponse?.markdown.parent}
          </ReactMarkdown>
        </div>
      </PageLayout>
    </>
  );
};

export default ArticlePage;
