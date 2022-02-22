import { ToastContainer } from 'react-toastify';

import { TransformerChoice } from 'TransformerChoice';
import { CategoryDialog } from './CategoryDialog';
import { TransactionsTable } from './TransactionsTable/TransactionsTable';

import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <TransactionsTable />
      <CategoryDialog />
      <TransformerChoice />
      <ToastContainer
        pauseOnFocusLoss={false}
      />
    </>
  );
};

export default App;
