import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Redux
import { useDispatch, useSelector } from 'react-redux';

// Typescript
import { App } from '../../interfaces';

// CSS
import classes from './Apps.module.css';

// UI
import { Headline, Spinner, ActionButton, Modal, Container } from '../UI';

// Subcomponents
import { AppGrid } from './AppGrid/AppGrid';
import { AppForm } from './AppForm/AppForm';
import { AppTable } from './AppTable/AppTable';

// Utils
import { State } from '../../store/reducers';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../store';

interface Props {
  searching?: boolean;
}

export const Apps = ({ searching = false }: Props): JSX.Element => {
  // Get Redux state
  const {
    apps: { apps, loading },
    auth: { isAuthenticated },
  } = useSelector((state: State) => state);

  // Get Redux action creators
  const dispatch = useDispatch();
  const { getApps, setEditApp } = bindActionCreators(actionCreators, dispatch);

  // Load apps if array is empty
  useEffect(() => {
    if (!apps.length) {
      getApps();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Intentionally empty: load-once on mount. The Redux store state and
    // action creators are stable; we don't want to re-fetch on every render.
  }, []);

  // Form
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);

  // Observe if user is authenticated -> set default view if not
  useEffect(() => {
    if (!isAuthenticated) {
      setShowTable(false);
      setModalIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Only re-run when isAuthenticated changes; setters are stable.
  }, [isAuthenticated]);

  // Form actions
  const toggleModal = (): void => {
    setModalIsOpen(!modalIsOpen);
  };

  const toggleEdit = (): void => {
    setShowTable(!showTable);
  };

  const openFormForUpdating = (app: App): void => {
    setEditApp(app);
    setModalIsOpen(true);
  };

  return (
    <Container>
      <Modal isOpen={modalIsOpen} setIsOpen={setModalIsOpen}>
        <AppForm modalHandler={toggleModal} />
      </Modal>

      <Headline
        title="All Applications"
        subtitle={<Link to="/">Go back</Link>}
      />

      {isAuthenticated && (
        <div className={classes.ActionsContainer}>
          <ActionButton
            name="Add"
            icon="mdiPlusBox"
            handler={() => {
              setEditApp(null);
              toggleModal();
            }}
          />
          <ActionButton name="Edit" icon="mdiPencil" handler={toggleEdit} />
        </div>
      )}

      <div className={classes.Apps}>
        {loading ? (
          <Spinner />
        ) : !showTable ? (
          <AppGrid apps={apps} searching={searching} />
        ) : (
          <AppTable openFormForUpdating={openFormForUpdating} />
        )}
      </div>
    </Container>
  );
};
