import {
  useCallback, useMemo, VFC,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  Dialog, DialogContent,
} from '@rmwc/dialog';

import { tableData, Transformer } from 'store';
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

  const transformers = transformerIds
    .map((transformerId) => tableData.transformers.find(({ id }) => id === transformerId))
    .filter((transformer) => Boolean(transformer)) as Transformer[];

  return (
    <Dialog
      open={isVisible}
      onClose={handleClose}
    >
      <DialogContent>
        <table className={styles.table}>
          <tbody>
            {transformers.map((transformer, index) => (
              <TransformerChoiceItem
                transformer={transformer}
                key={transformer.id}
                isFirst={index === 0}
                rowsCount={transformers.length}
              />
            ))}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
});
TransformerChoice.displayName = 'TransformerChoice';
