import './styles/css/base.css';

import DIContainer from './DI/DIContainer';
import DI_TYPES from './DI/DITypes';
import IApp from './IApp';

const appRoot = document.createElement('div');
document.body.prepend(appRoot);

const app = DIContainer.get<IApp>(DI_TYPES.App);
app.run(appRoot);
