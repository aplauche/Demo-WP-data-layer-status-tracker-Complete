import { render, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data'; // this acts as redux store we can save and select from
import { SearchControl, Spinner } from '@wordpress/components';
import PageRow from './components/PageRow';
import Notifications from './components/Notifications';

function StatusTrackerApp() {

  const [searchTerm, setSearchTerm] = useState( '' );

  // useSelect acts similar to a useEffect and can grab data out of redux store for us to use - also has familiar dependency array
  const {pages, hasResolved} = useSelect(
    select => {
      const query = {}
      if(searchTerm){
        query.search = searchTerm
      } 
       // select first takes the kind of query, then the name, then an object of query params for filtering
      const selectorArgs = ['postType', 'page', query]
      return {
        pages: select( coreDataStore ).getEntityRecords( ...selectorArgs ),
        // has resolved accepts selector name and EXACT arguments and returns true/false (kind of like removeEventListener)
        hasResolved: select( coreDataStore ).hasFinishedResolution( 'getEntityRecords', selectorArgs )
      }
    }, [searchTerm]
  );

  console.log(pages)

  return (
    <div>
      <div className='list-controls'>
        <SearchControl 
          onChange={ setSearchTerm }
          value={ searchTerm }
        />
      </div>
      {!pages?.length && !hasResolved ? (
        <Spinner />
      ) : (
        <table className="wp-list-table widefat fixed striped table-view-list">
          <thead>
              <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Actions</th>
              </tr>
          </thead>
          <tbody>
              { pages?.map( page => (
                <PageRow title={page.title.rendered} pageId={page.id}/>
              ) ) }
          </tbody>
        </table>
      )}
      <Notifications />
    </div>
  );
}



// Load in our react app to the DOM
window.addEventListener(
    'load',
    function () {
        render(
            <StatusTrackerApp />,
            document.querySelector( '#fsd-page-status-tracker' )
        );
    },
    false
);