'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from './icons';
import { LOCALE_CODE } from '@/models/contentful/generated/contentful';

interface Lang {
  label: {
    [key: string]: string;
  };
  value: LOCALE_CODE;
}

interface Props {
  locale: string;
}
const MenuLangSelector = ({ locale }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();

  const langsList: Array<Lang> = [
    {
      label: {
        en: 'Spanish',
        es: 'Español',
      },
      value: 'es',
    },
    {
      label: {
        en: 'English',
        es: 'Inglés',
      },
      value: 'en',
    },
  ];

  const currentLanguage = langsList.find((item) => item.value === locale);

  const handleLangChange = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prevValue: boolean) => !prevValue);
  };

  const changeLanguage = (e: any, lang: string) => {
    const restPath = path.replace(locale, lang);
    router.push(restPath);
    handleLangChange(e);
  };

  return (
    <div className='relative flex flex-col w-full justify-center select-none z-[9999]'>
      <button
        className='flex items-center justify-between w-full not-italic font-medium rounded-sm font-display text-light-secondary/60 dark:text-dark-secondary/60 hover:text-light-secondary hover:dark:text-dark-secondary text-secondary'
        onMouseEnter={handleLangChange}
        onClick={handleLangChange}
      >
        {currentLanguage?.label[locale]}
        <Icon value={'miniChevronRight'} width={18} height={18} />
      </button>
      <div className='absolute w-full left-[calc(100%+0px)] text-light-headlines dark:text-dark-headlines z-[9998]'>
        {isOpen && (
          <ul className='z-20 my-1 text-right w-full rounded-sm bg-light dark:bg-dark border-[1px] border-light-subtle-edges dark:border-dark-subtle-edges'>
            {langsList.map((item, index) => {
              return (
                <li
                  key={index}
                  value={item.value}
                  tabIndex={0}
                  className={`${
                    item.value === locale
                      ? 'cursor-not-allowed text-dark-tertiary-pressed'
                      : 'cursor-pointer text-light-secondary/60 dark:text-dark-secondary/60 hover:text-light-secondary/80 dark:hover:text-dark-secondary/80'
                  } flex text-secondary items-center p-2 w-fill`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && item.value !== locale)
                      return changeLanguage(e, item.value);
                  }}
                  onClick={(e) => {
                    if (item.value !== locale)
                      return changeLanguage(e, item.value);
                  }}
                >
                  {item.label[locale]}
                  {item.value === locale && (
                    <Icon value='miniChevronLeft' width={18} height={18} />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MenuLangSelector;
