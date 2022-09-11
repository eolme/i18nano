import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

import { getCookie } from 'cookies-next';

import { DEFAULT_LANGUAGE } from '../i18n';

type LangProps = {
  lang: string;
};

type LangInitialProps = {
  pageProps: LangProps;
};

const App: NextPage<AppProps<LangProps>, LangInitialProps> = ({ Component, pageProps }) => {
  return (
    <Component {...pageProps} />
  );
};

App.getInitialProps = async (ctx) => {
  return {
    pageProps: {
      lang: getCookie('lang', {
        req: ctx.req,
        res: ctx.res
      }) as string || DEFAULT_LANGUAGE
    }
  };
};

export default App;
