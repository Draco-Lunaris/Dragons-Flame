import { Link } from 'react-router-dom';

import classes from './BookmarkGrid.module.css';

import { Category } from '../../../interfaces';

import { BookmarkCard } from '../BookmarkCard/BookmarkCard';
import { Message } from '../../UI';
import { useSelector } from 'react-redux';
import { State } from '../../../store/reducers';

interface Props {
  categories: Category[];
  totalCategories?: number;
  searching: boolean;
  fromHomepage?: boolean;
}

export const BookmarkGrid = (props: Props): JSX.Element => {
  const {
    categories,
    totalCategories,
    searching,
    fromHomepage = false,
  } = props;

  const { config } = useSelector((state: State) => state.config);

  let bookmarks: JSX.Element;

  if (categories.length) {
    if (searching && !categories[0].bookmarks.length) {
      bookmarks = <Message>No bookmarks match your search criteria</Message>;
    } else {
      const gridClass = config.bookmarksDynamicLayout
        ? classes.BookmarkGridDynamic
        : classes.BookmarkGridFixed;

      bookmarks = (
        <div className={gridClass}>
          {categories.map(
            (category: Category): JSX.Element => (
              <BookmarkCard
                category={category}
                fromHomepage={fromHomepage}
                key={category.id}
              />
            )
          )}
        </div>
      );
    }
  } else {
    if (totalCategories) {
      bookmarks = (
        <Message>
          There are no pinned categories. You can pin them from the{' '}
          <Link to="/bookmarks">/bookmarks</Link> menu
        </Message>
      );
    } else {
      bookmarks = (
        <Message>
          You don't have any bookmarks. You can add a new one from{' '}
          <Link to="/bookmarks">/bookmarks</Link> menu
        </Message>
      );
    }
  }

  return bookmarks;
};
