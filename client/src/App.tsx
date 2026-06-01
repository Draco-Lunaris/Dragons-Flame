import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'external-svg-loader';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { autoLogin, getConfig } from './store/action-creators';
import { actionCreators, store } from './store';
import { State } from './store/reducers';

// Utils
import { checkVersion, decodeToken, parsePABToTheme } from './utility';

// Routes
import { Home } from './components/Home/Home';
import { Apps } from './components/Apps/Apps';
import { Settings } from './components/Settings/Settings';
import { Bookmarks } from './components/Bookmarks/Bookmarks';
import { NotificationCenter } from './components/NotificationCenter/NotificationCenter';

// Get config
store.dispatch<any>(getConfig());

// Validate token
if (localStorage.token) {
  store.dispatch<any>(autoLogin());
}

export const App = (): JSX.Element => {
  const { config, loading } = useSelector((state: State) => state.config);

  const dispath = useDispatch();
  const { fetchQueries, setTheme, logout, createNotification, fetchThemes } =
    bindActionCreators(actionCreators, dispath);

  // Intentionally empty deps: mount-only effect. Action creators from
  // bindActionCreators are stable refs; including them would cause re-runs
  // that reset the token-check interval.
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // check if token is valid
    const tokenIsValid = setInterval(() => {
      if (localStorage.token) {
        const expiresIn = decodeToken(localStorage.token).exp * 1000;
        const now = new Date().getTime();

        if (now > expiresIn) {
          logout();
          createNotification({
            title: 'Info',
            message: 'Session expired. You have been logged out',
          });
        }
      }
    }, 1000);

    // load themes
    fetchThemes();

    // set user theme if present
    if (localStorage.theme) {
      setTheme(parsePABToTheme(localStorage.theme));
    }

    // check for updated
    checkVersion();

    // load custom search queries
    fetchQueries();

    return () => window.clearInterval(tokenIsValid);
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  // If there is no user theme, set the default one
  // Only depends on `loading`: set default theme once config has finished
  // loading, not on every config change.
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!loading && !localStorage.theme) {
      setTheme(parsePABToTheme(config.defaultTheme), false);
    }
  }, [loading]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings/*" element={<Settings />} />
          <Route path="/applications/*" element={<Apps />} />
          <Route path="/bookmarks/*" element={<Bookmarks />} />
        </Routes>
      </BrowserRouter>
      <NotificationCenter />
    </>
  );
};
