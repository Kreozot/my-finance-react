import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import '@rmwc/data-table/styles';
import '@rmwc/button/styles';
import '@rmwc/formfield/styles';
import '@rmwc/dialog/styles';

import { TransformerChoice } from 'TransformerChoice';
import { ConfirmationDialog } from 'components/ConfirmationDialog';
import { CategoryDialog } from './CategoryDialog';
import { TransactionsTable } from './TransactionsTable/TransactionsTable';

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
