import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { AppGrid } from './AppGrid';
import classes from './AppGrid.module.css';
import { State } from '../../../store/reducers';
import { App } from '../../../interfaces';

const makeState = (dynamic: boolean): State => {
  return {
    theme: { theme: { name: 'tron', colors: { background: '', primary: '', accent: '' }, isCustom: false } },
    config: {
      loading: false,
      config: {
        WEATHER_API_KEY: '',
        lat: 0,
        long: 0,
        isCelsius: true,
        customTitle: 'Flame',
        pinAppsByDefault: true,
        pinCategoriesByDefault: true,
        hideHeader: false,
        useOrdering: 'createdAt',
        appsSameTab: false,
        bookmarksSameTab: false,
        searchSameTab: false,
        hideApps: false,
        hideCategories: false,
        hideSearch: false,
        defaultSearchProvider: 'l',
        secondarySearchProvider: 'd',
        dockerApps: false,
        dockerHost: 'localhost',
        kubernetesApps: false,
        unpinStoppedApps: false,
        useAmericanDate: false,
        disableAutofocus: false,
        greetingsSchema: '',
        daySchema: '',
        monthSchema: '',
        showTime: false,
        defaultTheme: 'tron',
        isKilometer: true,
        weatherData: 'cloud',
        hideDate: false,
        bookmarksDynamicLayout: dynamic,
      },
      customQueries: [],
    },
    notification: { notifications: [] },
    apps: { loading: false, apps: [], editMode: false },
    bookmarks: { loading: false, categories: [], editCategory: null },
    auth: { isAuthenticated: true },
  } as unknown as State;
};

const apps: App[] = [
  {
    id: 1,
    name: 'App',
    url: 'http://example.com',
    icon: 'mdiHome',
    isPinned: true,
    isPublic: true,
    orderId: 0,
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('AppGrid layout toggle', () => {
  it('renders fixed grid when dynamic layout is false', () => {
    const store = createStore((s) => s as any, makeState(false));
    const { container } = render(
      <Provider store={store}>
        <AppGrid apps={apps} searching={false} />
      </Provider>
    );

    const grid = container.querySelector('div');
    expect(grid?.className).toContain(classes.AppGridFixed);
  });

  it('renders dynamic grid when dynamic layout is true', () => {
    const store = createStore((s) => s as any, makeState(true));
    const { container } = render(
      <Provider store={store}>
        <AppGrid apps={apps} searching={false} />
      </Provider>
    );

    const grid = container.querySelector('div');
    expect(grid?.className).toContain(classes.AppGridDynamic);
  });
});

