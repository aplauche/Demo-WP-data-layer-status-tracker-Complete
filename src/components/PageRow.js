import { SelectControl, Spinner } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';

export default function PageRow({title, pageId}){ 

  const { createErrorNotice } = useDispatch( noticesStore );

  // edit entity record keeps track of edits seperately in redux store so we can globally access edited state
  const { editEntityRecord, saveEditedEntityRecord } = useDispatch( coreDataStore );

  const { page, isSaving, lastError } = useSelect(
    // we use get Edited here to be able to reflect updates realtime 
      select => ({
          page: select( coreDataStore ).getEditedEntityRecord( 'postType', 'page', pageId ),
          isSaving: select( coreDataStore ).isSavingEntityRecord( 'postType', 'page', pageId ),
          lastError: select( coreDataStore ).getLastEntitySaveError( 'postType', 'page', pageId )

      }), [pageId]
  );

  // Deal with saving - aysnc operation
  const handleSave = async () => {
      const updatedRecord = await saveEditedEntityRecord( 'postType', 'page', pageId); //returns promise resolved after save
      if ( !updatedRecord ) { // will be null if save operation failed
        // Tell the user how exactly the delete has failed
        const message = ( lastError?.message || 'There was an error.' ) + ' Please refresh the page and try again.'
        // Tell the user how exactly the operation has failed:
        createErrorNotice( message, {
            type: 'snackbar',
        } );
      } 
  };

  const handleChange = async ( updatedStatus) => {
    try{
      await editEntityRecord( 'postType', 'page', page.id, { meta:{_fsd_page_status: updatedStatus}} )
    } catch(e) {
      const message = ( lastError?.message || 'There was an error.' ) + ' Please refresh the page and try again.'
      // Tell the user how exactly the operation has failed:
      createErrorNotice( message, {
          type: 'snackbar',
      } );
      return
    }
    handleSave();
  };

  return (
    <tr className={`status-code-${[page.meta._fsd_page_status]}`}>
      <td>{title}</td>
      <td>
        { isSaving ? (
            <>
                <Spinner/>
                Saving
            </>
        ) : (
        <SelectControl
            value={ page.meta._fsd_page_status }
            options={ [
                { label: 'Approved', value: 3 },
                { label: 'Ready For Review', value: 2 },
                { label: 'Working', value: 1 },
                { label: 'Not Tracked', value: 0 },
            ] }
            onChange={ ( newStatus ) => handleChange(newStatus) }
        />
        )}
      </td>
      <td><a target="_blank" href={`${localizedData.homeUrl}/wp-admin/post.php?post=${pageId}&action=edit`}>Edit in new tab</a></td>
    </tr>
  )

}