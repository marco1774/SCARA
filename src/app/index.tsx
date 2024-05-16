/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Routes, Route, HashRouter } from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';

import { HomePage } from './pages/HomePage/Loadable';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { useTranslation } from 'react-i18next';
import { ScaraSimulation2d } from './containers/ScaraSimulation2d';

export function App() {
  const { i18n } = useTranslation();

  return (
    <div data-theme="ligh">
      <HashRouter>
        <Helmet
          titleTemplate="%s - React Boilerplate"
          defaultTitle="React Boilerplate"
          htmlAttributes={{ lang: i18n.language }}
        >
          <meta name="description" content="A React Boilerplate application" />
        </Helmet>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/simulation2d" element={<ScaraSimulation2d />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <GlobalStyle />
      </HashRouter>
    </div>
  );
}
