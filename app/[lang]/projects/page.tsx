import React from 'react';
import PageLayout from '../../../components/PageLayout';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/models/domain/Project';
import Section from '@/components/Section';
import { metadataAdapter } from '@/adapters/metadataAdapter';
import { Metadata } from 'next';
import { PageSeo } from '@/models/PageSeo';
import { Article } from '@/models/domain/Article';
import FilterByTag from '@/components/FilterByTag';
import CustomCard from '@/components/CustomCard';

interface Props {
  params: {
    path: string;
    lang: string;
  };
  searchParams: {
    tags: string;
  };
}

interface ArticleData {
  markdown: { parent: string };
  seo: Omit<PageSeo, 'loading'>;
  metadata: Article;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const articleFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${params.lang}/api/articles/projects`,
    { next: { revalidate: 3600 } }
  );

  const articleResponse: ArticleData = await articleFetch.json();

  return metadataAdapter(articleResponse.seo);
}

const ProjectsPage = async ({ searchParams, params }: Props) => {
  console.log('searchParams', searchParams);
  const projectsFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${params.lang}/api/projects${
      searchParams.tags ? `?tags=${searchParams.tags}` : ''
    }`,
    { cache: 'default' }
  );

  const projectsResponse: { projects: Project[] } = await projectsFetch.json();

  return (
    <PageLayout>
      <Section>
        <div className='flex flex-col gap-y-8 mobile:grid mobile:grid-cols-2 mobile:gap-4 tablet:col-span-2 tablet:gap-4'>
          <CustomCard
            lang={params.lang}
            iterableArray={projectsResponse.projects}
            fallback={
              <p className='col-span-1 dark:text-dark-text text-light-text'>
                No se encontró proyectos que cumplan con el filtro ingresado
              </p>
            }
          >
            <ProjectCard
              className='mobile:col-span-1'
              locale={params.lang}
              featured={false}
            />
          </CustomCard>
        </div>

        <div className='sidebar'>
          <div className='sidebar-group'>
            <h3 className='sidebar-group-title'>tags</h3>
            <ul className='flex flex-row flex-wrap items-center w-full gap-2'>
              <FilterByTag />
            </ul>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default ProjectsPage;
