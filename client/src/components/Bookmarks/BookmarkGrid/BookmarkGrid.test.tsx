import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { BookmarkGrid } from './BookmarkGrid';
import classes from './BookmarkGrid.module.css';
import { State } from '../../../store/reducers';
import { Category } from '../../../interfaces';

const makeState = (bookmarksDynamicLayout: boolean): State => {
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
        bookmarksDynamicLayout,
      },
      customQueries: [],
    },
    notification: { notifications: [] },
    apps: { loading: false, apps: [], editMode: false },
    bookmarks: { loading: false, categories: [], editCategory: null },
    auth: { isAuthenticated: true },
  } as unknown as State;
};

const categories: Category[] = [
  {
    id: 1,
    name: 'Category',
    isPinned: true,
    orderId: 0,
    isPublic: 1,
    bookmarks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('BookmarkGrid layout toggle', () => {
  it('renders fixed grid when bookmarksDynamicLayout is false', () => {
    const store = createStore((s) => s as any, makeState(false));
    const { container } = render(
      <Provider store={store}>
        <BookmarkGrid categories={categories} searching={false} />
      </Provider>
    );

    const grid = container.querySelector('div');
    expect(grid?.className).toContain(classes.BookmarkGridFixed);
  });

  it('renders dynamic grid when bookmarksDynamicLayout is true', () => {
    const store = createStore((s) => s as any, makeState(true));
    const { container } = render(
      <Provider store={store}>
        <BookmarkGrid categories={categories} searching={false} />
      </Provider>
    );

    const grid = container.querySelector('div');
    expect(grid?.className).toContain(classes.BookmarkGridDynamic);
  });
});

