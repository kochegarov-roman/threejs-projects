import { Spinner } from './spinner';
import { useAppearanceDelay } from '@/shared/lib/react';

export function FullPageSpinner({
  isLoading,
  isUseAppearanceDelay = false,
}: {
  isLoading?: boolean;
  isUseAppearanceDelay?: boolean;
}) {
  const show = useAppearanceDelay(isLoading);

  if (!isUseAppearanceDelay || show) {
    return (
      <div className="inset-0 flex items-center justify-center absolute">
        <Spinner
          className="w-10 h-10 text-primary"
          aria-label="Загрузка страницы"
        />
      </div>
    );
  }

  return null;
}
