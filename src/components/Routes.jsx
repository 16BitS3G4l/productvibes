import React from 'react';
import { Routes, Route } from 'react-router';

// import {withRouter} from 'react-router-dom';


import { OnboardingTest } from './OnboardingCopy';
import { HomePage } from './HomePage';
import { Testing } from './Testing';

import { ResourcePage } from './ResourcePage';

import { ClientRouter, RoutePropagator } from '@shopify/app-bridge-react';

export function MyRoutes(props) {
  const { history, location } = props;

  return (
    <>
      <ClientRouter history={history} />
      <RoutePropagator location={location} />

      <Routes>
      <Route path="/onboarding" caseSensitive={false} element={<OnboardingTest pageState="initial" />} />
  
      <Route path="/" caseSensitive={false} element={<HomePage />} />
        <Route path="/files" caseSensitive={false} element={<HomePage selectedTab={1} />} />
        
        <Route path="/qr-codes" caseSensitive={false} element={<HomePage selectedTab={2} />} />
        <Route path="/emails" caseSensitive={false} element={<HomePage selectedTab={3} />} />
        <Route path="/settings" caseSensitive={false} element={<HomePage selectedTab={4} />} />
       
        <Route path="/help" caseSensitive={false} element={<HomePage selectedTab={5} />} />

        <Route path="/testing" caseSensitive={false} element={<Testing />} />

        <Route path="/resource/:rid/:type" caseSensitive={false} element={<ResourcePage />} />


      </Routes>
    </>
  );
};

