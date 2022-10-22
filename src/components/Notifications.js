import { SnackbarList } from '@wordpress/components';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch, useSelect } from '@wordpress/data';
 
export default function Notifications() {
  const notices = useSelect(
      ( select ) => select( noticesStore ).getNotices(),
      []
  );
  const { removeNotice } = useDispatch( noticesStore );
  const snackbarNotices = notices.filter( ({ type }) => type === 'snackbar' );

  return (
      <SnackbarList
          notices={ snackbarNotices }
          className="components-editor-notices__snackbar"
          onRemove={ removeNotice }
      />
  );
}