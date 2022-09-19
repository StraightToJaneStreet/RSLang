import React from 'react';
import ReactDOM from 'react-dom/client';
import { injectable } from 'inversify';

import IApp from './IApp';

import AppView from './view/App';
import DIContainer from './DI/DIContainer';
import IAuthService from './services/interfaces/IAuthService';
import DI_TYPES from './DI/DITypes';
import IDictionaryService from './services/interfaces/IDictionaryService';

@injectable()
export default class App implements IApp {
  private reactRoot: ReactDOM.Root | null = null;

  run(root: HTMLDivElement) {
    this.reactRoot = ReactDOM.createRoot(root);
    DIContainer.get<IAuthService>(DI_TYPES.AuthService).start();
    DIContainer.get<IDictionaryService>(DI_TYPES.DictionaryService).start();
    this.render();
  }

  private render() {
    this.reactRoot?.render(React.createElement(AppView, {}, null));
  }
}
