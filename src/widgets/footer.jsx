import { cn } from '@/lib/utils';

export const Footer = ({ variant = 'sticky' }) => {
  return (
    <footer
      className={cn(
        'z-10 flex p-4 justify-center w-[100%] bottom-0 backdrop-blur',
        variant,
      )}
    >
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://kochegarov.pro"
        target="_blank"
        rel="noopener noreferrer"
      >
        kochegarov.pro →
      </a>
    </footer>
  );
};
