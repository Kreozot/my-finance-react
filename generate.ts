import {
  rand,
  randNumber,
  randBetweenDate,
  randCatchPhrase,
  randGitCommitSha,
} from '@ngneat/falso';
import fsExtra from 'fs-extra';

const TRANSACTIONS_FILE_PATH = 'src/data/allTransactions.json';

if (!fsExtra.existsSync(TRANSACTIONS_FILE_PATH)) {
  const SPEND_CATEGORIES = [
    'Food',
    'Groceries',
    'Clothes',
    'Health',
    'House',
    'Travel',
    'Education',
    'Entertainment',
    'Charity',
  ];
  const INCOME_CATEGORIES = [
    'Salary',
    'Investments',
    'Tenancy',
  ];
  const BANKS = [
    'alfabank',
    'sberbank',
    'tinkoff',
  ];
  const CURRENCY = 'EUR';

  const SPENT_ELEMENTS_COUNT = randNumber({ min: 500, max: 1000 });
  const INCOME_ELEMENTS_COUNT = randNumber({ min: 10, max: 50 });

  const spentElements = (new Array(SPENT_ELEMENTS_COUNT))
    .fill(null)
    .map(() => {
      const date = randBetweenDate({ from: new Date('10/07/2020'), to: new Date() });
      const item = {
        date,
        dateKey: `${date.getFullYear()}-${date.getMonth()}`,
        amount: randNumber({ min: -1, max: -100 }),
        currency: CURRENCY,
        category: rand(SPEND_CATEGORIES),
        name: randCatchPhrase(),
        bank: rand(BANKS),
        hash: randGitCommitSha(),
      };
      return item;
    });
  const incomeElements = (new Array(INCOME_ELEMENTS_COUNT))
    .fill(null)
    .map(() => {
      const date = randBetweenDate({ from: new Date('10/07/2020'), to: new Date() });
      const item = {
        date,
        dateKey: `${date.getFullYear()}-${date.getMonth()}`,
        amount: randNumber({ min: 1000, max: 5000 }),
        currency: CURRENCY,
        category: rand(INCOME_CATEGORIES),
        name: randCatchPhrase(),
        bank: rand(BANKS),
        hash: randGitCommitSha(),
      };
      return item;
    });
  fsExtra.writeFileSync(TRANSACTIONS_FILE_PATH, JSON.stringify([...spentElements, ...incomeElements], null, 2));
}
