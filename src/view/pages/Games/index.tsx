import React from 'react';
import { GameCard } from '../../components/gamecard/GameCard';
import './games.styles.css';

const Games = () => {
  return (
    <div className="games-page">
      <div className="games">
        <h1>Выберите игру</h1>
        <div className="games__container">
          <GameCard title="Аудиовызов" classname="audiocall" url="audiocall" imgSrc="./assets/img/audiocall_img.jpg">
            <p>«Аудиовызов» - тренировка, которая улучшает восприятие речи на слух.</p>
          </GameCard>
          <GameCard title="Спринт" classname="sprint" url="sprint" imgSrc="./assets/img/sprint_img.jpg">
            <p>
              «Спринт» - тренировка для повторения слов из вашего словаря. Угадай как можно больше слов за 60 секунд
            </p>
          </GameCard>
        </div>
      </div>
    </div>
  );
};

export default Games;
