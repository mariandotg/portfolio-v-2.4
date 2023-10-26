import React from 'react';
import PageLayout from '../../../components/PageLayout';
import ProjectCard from '@/components/ProjectCard';
import Section from '@/components/Section';
import { fetchProjects } from '@/services/content/projects';
import { fetchPageByPath } from '@/services/content/pages';
import { Meta } from '@/models/blog/blog.models';
import { Metadata } from 'next';
import { metadataAdapter } from '@/adapters/metadataAdapter';
import { getDictionary } from '../dictionaries';

interface Props {
  params: {
    path: string;
    lang: string;
  };
  searchParams: {
    tags: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchPageByPath<{ seo: Meta }>('projects', params.lang);
  return metadataAdapter(data!.seo);
}

const ProjectsPage = async ({ searchParams, params }: Props) => {
  const projects = await fetchProjects(params.lang);
  const dict = await getDictionary(params.lang);

  const renderProjectCards = () =>
    projects !== undefined ? (
      projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          locale={params.lang}
          featured={false}
          project={project}
          delay={0.5 + index * 0.1}
        />
      ))
    ) : (
      <p className='col-span-1 dark:text-dark-text text-light-text'>
        {dict.projects.notFound}
      </p>
    );

  return (
    <PageLayout>
      <Section>
        <div className='grid grid-cols-4 gap-y-8 mobile:grid-cols-5 mobile:gap-4 tablet:grid-cols-6 tablet:col-span-4 tablet:gap-4'>
          <h1 className='col-span-4 mobile:col-span-5 tablet:col-span-6 text-title text-light-headlines dark:text-dark-headlines h-[300px]'>
            Welcome to my blog. I'm Oli, and this is where I share my passion
            about programming and design. I believe in a practical approach, so
            here I document my latest explorations.
          </h1>
          {renderProjectCards()}
        </div>
        <div className='w-full h-full bg-primary sidebar'>a</div>
      </Section>
    </PageLayout>
  );
};

export default ProjectsPage;
