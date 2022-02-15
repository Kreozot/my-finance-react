import { NodePlopAPI } from 'plop';
import promptDirectory from 'inquirer-directory';

type DirectoryPromptQuestion = {
  basePath: string;
};

export default (plop: NodePlopAPI) => {
  plop.setPrompt('directory', promptDirectory);

  plop.setGenerator('component', {
    description: 'React-компонент',
    prompts: [
      {
        type: 'directory',
        name: 'folder',
        message: 'Путь к папке, внутри которой будет находиться компонент',
        basePath: './src',
      } as any,
      {
        type: 'input',
        name: 'name',
        message: 'Название компонента в PascalCase',
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: './src/{{folder}}',
        templateFiles: './.plop_templates/component/**/*',
        base: './.plop_templates/component/',
      },
    ],
  });
};
