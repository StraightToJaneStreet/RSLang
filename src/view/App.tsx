import React from 'react';
import { Provider } from 'react-redux';
import { Routes, Route, HashRouter } from 'react-router-dom';

import store from '../model/store';

import Main from './pages/Main';
import Games from './pages/Games';
import Dictionary from './pages/Dictionary';
import Sprint from './pages/Sprint';
import AudioChallenge from './pages/AudioChallenge';
import Footer from './components/footer/footer';
import Header from './components/header/Header';
import Team from './pages/Team';
import Statistics from './pages/Statistics';
import HardWords from './pages/Dictionary/HardWords';

export default function WrappedMain() {
  return (
    <Provider store={store}>
      <HashRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="dictionary" element={<Dictionary />} />
          <Route path="games" element={<Games />} />

          <Route path="games/sprint/" element={<Sprint />} />
          <Route path="games/sprint/:group/:page" element={<Sprint />} />

          <Route path="games/audiocall/" element={<AudioChallenge />} />
          <Route path="games/audiocall/:group/:page" element={<AudioChallenge />} />

          <Route path="stats" element={<Statistics />} />
          <Route path="team" element={<Team />} />
          <Route path="dictionary/hardwords" element={<HardWords />} />
        </Routes>
        <Footer />
      </HashRouter>
    </Provider>
  );
}
