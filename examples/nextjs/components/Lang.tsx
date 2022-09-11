import type { FC } from 'react';

import { useEffect } from 'react';
import { useTranslationChange } from 'i18nano';

import { setCookie } from 'cookies-next';

export const Lang: FC = () => {
  const translation = useTranslationChange();

  useEffect(() => {
    setCookie('lang', translation.lang);
  }, [translation.lang]);

  return (
    <div>
      <div>Current: {translation.lang}</div>
      {
        translation.all.map((lang) => (
          <button
            key={lang}
            onClick={() => translation.change(lang)}
          >
            {lang}
          </button>
        ))
      }
    </div>
  );
};
