import classes from './AppGrid.module.css';
import { Link } from 'react-router-dom';
import { App } from '../../../interfaces/App';

import { AppCard } from '../AppCard/AppCard';
import { Message } from '../../UI';
import { useSelector } from 'react-redux';
import { State } from '../../../store/reducers';

interface Props {
  apps: App[];
  totalApps?: number;
  searching: boolean;
}

export const AppGrid = (props: Props): JSX.Element => {
  const { config } = useSelector((state: State) => state.config);
  let apps: JSX.Element;

  if (props.searching || props.apps.length) {
    if (!props.apps.length) {
      apps = <Message>No apps match your search criteria</Message>;
    } else {
      const gridClass = config.bookmarksDynamicLayout
        ? classes.AppGridDynamic
        : classes.AppGridFixed;

      apps = (
        <div className={gridClass}>
          {props.apps.map((app: App): JSX.Element => {
            return <AppCard key={app.id} app={app} />;
          })}
        </div>
      );
    }
  } else {
    if (props.totalApps) {
      apps = (
        <Message>
          There are no pinned applications. You can pin them from the{' '}
          <Link to="/applications">/applications</Link> menu
        </Message>
      );
    } else {
      apps = (
        <Message>
          You don't have any applications. You can add a new one from{' '}
          <Link to="/applications">/applications</Link> menu
        </Message>
      );
    }
  }

  return apps;
};
