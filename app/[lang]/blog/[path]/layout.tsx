import React from 'react';
import { PageSeo } from '@/models/PageSeo';
import { Article } from '@/models/domain/Article';
import ArticleCard from '@/components/ArticleCard';
import PageLayout from '@/components/PageLayout';
import Section from '@/components/Section';
import SectionTitle from '@/components/SectionTitle';
import Image from 'next/image';

interface ArticleData {
  content: { parent: string };
  seo: Omit<PageSeo, 'loading'>;
  properties: Article;
}

const ArticleLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    lang: string;
    path: string;
  };
}) => {
  const articleFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${params.lang}/api/articles/${params.path}`,
    { cache: 'no-cache' }
  );

  const articleResponse: ArticleData = await articleFetch.json();

  const latestArticlesFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${params.lang}/api/articles/latest`,
    { cache: 'no-cache' }
  );

  const latestArticlesResponse: Article[] = await latestArticlesFetch.json();
  console.log('layout lang', params.lang);
  return (
    <PageLayout>
      <div className='flex flex-col gap-y-8 dark:text-dark-text text-light-text tablet:grid tablet:grid-cols-3 tablet:gap-4'>
        {children}
      </div>
      <Section>
        <SectionTitle emoji='article'>Latest Articles</SectionTitle>
        <div className='flex w-full snap-x tablet:col-span-3'>
          <ul className='flex flex-col w-full gap-4 mobile:grid mobile:grid-cols-2 tablet:grid-cols-3'>
            {latestArticlesResponse.map((article, index) => (
              <li
                key={article.id}
                className={`cursor-pointer group ${
                  index === 0
                    ? 'mobile:col-span-2 tablet:col-span-1'
                    : 'mobile:col-span-1'
                }`}
              >
                <ArticleCard
                  article={article}
                  path={article.path}
                  locale={params.lang}
                />
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </PageLayout>
  );
};

export default ArticleLayout;
