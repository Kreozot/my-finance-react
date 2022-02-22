import {
  useCallback, useEffect, useMemo, useState, VFC,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  Dialog, DialogActions, DialogContent, DialogButton,
} from '@rmwc/dialog';
import { toast } from 'react-toastify';

import { tableData } from 'store';
import { categoryDialogState } from 'CategoryDialog';
import { transformerChoiceState } from './transformerChoiceState';

import styles from './TransformerChoice.module.scss';
import { TransformerChoiceItem } from './TransformerChoiceItem';

export const TransformerChoice: VFC<{}> = observer(() => {
  const {
    transformerIds, isVisible,
  } = transformerChoiceState;

  return (
    <Dialog
      open={isVisible}
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
              toast.error(`Не найдена трансформация с id=${transformerId}`);
              return null;
            })}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
});
