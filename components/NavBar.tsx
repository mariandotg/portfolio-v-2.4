import React from 'react';
import Image from 'next/image';
import NavLink from './NavLink';
import LangSelector from './LangSelector';
import HamburgerMenu from './HamburgerMenu';
import Link from 'next/link';
import ThemeButton from './ThemeButton';
import ToTopButton from './ToTopButton';
import { getDictionary } from '@/app/[lang]/dictionaries';

interface Props {
  locale: string;
}

const NavBar = async ({ locale }: Props) => {
  const dict = await getDictionary(locale);

  return (
    <header className='border-b-[1px] border-primary bg-light/80 z-[9999] dark:bg-dark/70 backdrop-saturate-200 fixed top-0 flex justify-center w-full px-4 py-3 backdrop-blur'>
      <nav className='relative flex items-center w-screen tablet:max-w-[1000px] justify-between mobile:justify-end gap-16 mobile:gap-4'>
        <Link
          href={`/${locale}`}
          className='absolute flex items-center h-full -translate-x-1/2 mobile:translate-x-0 mobile:left-0 left-2/4 w-fit'
        >
          <Image
            src='/public/logo-v2-4.svg'
            alt='brand marianoGuillaume logo'
            className='flex mobile:hidden tablet:dark:flex tablet:flex dark:brightness-[200] w-[164px]'
            width={164}
            height={14}
          />
          <Image
            src='/public/mdg.svg'
            alt='brand mdg logo'
            className='hidden mobile:flex left-2/4 tablet:hidden dark:brightness-[200]'
            width={50}
            height={23}
          />
        </Link>
        <div className='items-center hidden gap-4 mobile:flex dark:text-light'>
          <NavLink href={`/${locale}`}>{dict.routes['/']}</NavLink>
          <NavLink href={`/${locale}/projects`}>
            {dict.routes['/projects']}
          </NavLink>
          <NavLink href={`/${locale}/blog`}>{dict.routes['/blog']}</NavLink>
        </div>
        <HamburgerMenu locale={locale} />
        <div className='relative flex items-center gap-2'>
          <div className='hidden mobile:flex'>
            <LangSelector locale={locale} />
          </div>
          <ThemeButton />
          <ToTopButton />
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
