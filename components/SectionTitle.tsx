import { ReactNode } from 'react';

import { Button as ButtonModel } from '@/models/domain/Button';

interface Props {
  children: ReactNode;
  button?: ButtonModel;
  emoji?: string;
}

const SectionTitle = ({ children, button, emoji }: Props) => {
  return (
    <div className='flex justify-between tablet:col-span-3'>
      <h2
        className={`flex italic font-medium items-center after:content-[""] after:h-[1px] after:grow w-full after:bg-primary dark:text-dark-headlines gap-x-4 font-monospace text-light-headlines`}
      >
        {children}
      </h2>
    </div>
  );
};

export default SectionTitle;