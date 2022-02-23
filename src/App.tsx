import { ToastContainer } from 'react-toastify';

import { TransformerChoice } from 'TransformerChoice';
import { ConfirmationDialog } from 'components/ConfirmationDialog';
import { CategoryDialog } from './CategoryDialog';
import { TransactionsTable } from './TransactionsTable/TransactionsTable';

import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <TransactionsTable />
      <TransformerChoice />
      <CategoryDialog />
      <ConfirmationDialog />
      <ToastContainer
        pauseOnFocusLoss={false}
      />
    </>
  );
};

export default App;
