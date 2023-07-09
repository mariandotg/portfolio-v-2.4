import React from 'react';
import SkillItem from '@/components/SkillItem';
import Markdown from '@/components/Markdown';
import { PageSeo } from '@/models/PageSeo';
import { Project } from '@/models/domain/Project';
import Button from '@/components/Button';
import { metadataAdapter } from '@/adapters/metadataAdapter';
import { Metadata } from 'next';
import PageIndexes from '@/components/PageIndexes';
import Share from '@/components/Share';
import { getDictionary } from '../../dictionaries';
import Image from 'next/image';
import { redirect } from 'next/navigation';

interface Props {
  params: {
    path: string;
    lang: string;
  };
}

interface ProjectData {
  content: { parent: string };
  seo: Omit<PageSeo, 'loading'>;
  properties: Project;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const projectFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${params.lang}/api/projects/${params.path}`,
    { next: { revalidate: 86400 } }
  );

  if (!projectFetch.ok) {
    return redirect(`../../${params.lang}/projects/not-found`);
  }

  const projectResponse: ProjectData = await projectFetch.json();

  return metadataAdapter(projectResponse.seo);
}

const ProjectPage = async ({ params }: Props) => {
  const projectFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${params.lang}/api/projects/${params.path}`,
    { next: { revalidate: 86400 } }
  );

  if (!projectFetch.ok) {
    return redirect(`../../${params.lang}/projects/not-found`);
  }

  const projectResponse: ProjectData = await projectFetch.json();

  const dict = await getDictionary(params.lang);

  const renderTags = () =>
    projectResponse.properties.tags.map((tag, index) => (
      <li>
        <SkillItem key={tag.id} skill={tag.name} variant='base' />
      </li>
    ));

  return (
    <>
      <div className='flex flex-col col-span-4 gap-y-2'>
        <div className='relative h-64 tablet:col-span-4'>
          <Image
            src={projectResponse.properties.image}
            alt={projectResponse.properties.imageAlt}
            className='absolute object-cover rounded'
            fill={true}
            priority
            quality={90}
            placeholder='blur'
            blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAFCAIAAADzBuo/AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAASSURBVBhXY3gro4IHDZy0jAoA9QM6yzHo/PoAAAAASUVORK5CYII='
          />
        </div>
      </div>
      <div className='flex flex-col gap-y-4 tablet:col-span-2'>
        <div className='flex flex-col gap-y-2'>
          <h1 className='font-medium text-title dark:text-dark-headlines text-light-headlines'>
            {projectResponse.properties.name}
          </h1>
          <p className='dark:text-dark-text text-light-text'>
            {projectResponse.properties.description}
          </p>
        </div>
        <div className='flex flex-row gap-x-4'>
          <Button
            variant='secondary'
            url={projectResponse.properties.repository}
          >
            {dict.project.repository}
          </Button>
          <Button variant='primary' url={projectResponse.properties.live}>
            {dict.project.live}
          </Button>
        </div>
        <div className='flex flex-col gap-y-4'>
          <Markdown>{projectResponse.content.parent}</Markdown>
        </div>
      </div>
      <div className='sidebar'>
        <div className='sidebar-group'>
          <h3 className='sidebar-group-title'>{dict.pageIndex.tags}</h3>
          <ul className='flex flex-row flex-wrap items-center w-full gap-2'>
            {renderTags()}
          </ul>
        </div>
        <div className='sticky top-[73px] flex flex-col gap-y-4'>
          <div className='hidden tablet:sidebar-group'>
            <h3 className='sidebar-group-title'>{dict.pageIndex.content}</h3>
            <PageIndexes />
          </div>
          <div className='sidebar-group'>
            <h3 className='sidebar-group-title'>{dict.pageIndex.share}</h3>
            <Share />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectPage;
