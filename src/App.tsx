import { ToastContainer } from 'react-toastify';
import { CategoryDialog } from './CategoryDialog';
import { TransactionsTable } from './TransactionsTable/TransactionsTable';

import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <TransactionsTable />
      <CategoryDialog />
      <ToastContainer
        pauseOnFocusLoss={false}
      />
    </>
  );
};

export default App;
