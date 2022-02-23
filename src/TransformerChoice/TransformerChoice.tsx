import {
  useCallback, VFC,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  Dialog, DialogContent,
} from '@rmwc/dialog';
import { toast } from 'react-toastify';

import { tableData } from 'store';
import { transformerChoiceState } from './transformerChoiceState';

import styles from './TransformerChoice.module.scss';
import { TransformerChoiceItem } from './TransformerChoiceItem';

export const TransformerChoice: VFC<{}> = observer(() => {
  const {
    transformerIds, isVisible,
  } = transformerChoiceState;

  const handleClose = useCallback(() => {
    transformerChoiceState.hide();
  }, []);

  return (
    <Dialog
      open={isVisible}
      onClose={handleClose}
    >
      <DialogContent>
        <table className={styles.table}>
          <tbody>
            {transformerIds.map((transformerId) => {
              const transformer = tableData.transformers.find(({ id }) => id === transformerId);
              if (transformer) {
                return (
                  <TransformerChoiceItem transformer={transformer} key={transformerId} />
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
});
