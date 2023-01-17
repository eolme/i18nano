import type { FC } from 'react';
import type { AppProps, AppContext, AppInitialProps } from 'next/app';

import { getCookie } from 'cookies-next';

import { DEFAULT_LANGUAGE } from '../i18n';

type NextApp = FC<AppProps> & {
  getInitialProps: (app: AppContext) => Promise<AppInitialProps>;
}

const App: NextApp = ({ Component, pageProps }) => {
  return (
    <Component {...pageProps} />
  );
};

App.getInitialProps = async (app) => {
  return {
    pageProps: {
      lang: getCookie('lang', {
        req: app.ctx.req,
        res: app.ctx.res
      }) as string || DEFAULT_LANGUAGE
    }
  };
};

export default App;
