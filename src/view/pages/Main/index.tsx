import React from 'react';

import Box from '@mui/material/Box';
import './main.css';
import { MainCard } from '../../components/maincard/MainCard';
import Button from '@mui/material/Button';

const Main = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <div className="container-inner">
        <div className="main__intro-block">
          <section className="main__intro">
            <h1 className="main-intro__title">RSLang</h1>
            <h2>Онлайн платформа по изучению английского языка</h2>
            <p className="main-intro__subtitle">
              Эффективный, увлекательный и абсолютно бесплатный способ выучить английский язык. Пополняй с нами свой
              словарный запас каждый день и открой для себя окно в мир новых удивительных возможностей.
            </p>
            <Button href="#main-features" variant="outlined">
              Подробнее
            </Button>
          </section>
          <div className="main__intro-picture">
            <img src="./assets/img/home-page_img.jpg" alt="home-page" />
          </div>
        </div>

        <section className="main__features main-features" id="main-features">
          <h2 className="main-features__title">Преимущества платформы</h2>
          <p className="main-features__subtitle">
            Уникальная интерактивная платформа позволит изучать язык в игровой форме, выбирать план обучения и
            отслеживать результаты
          </p>

          <div className="main-features__cards">
            <MainCard imgSrc="./assets/img/main-page/textbook.jpg" imgAlt="textbook" title="Учебник">
              <div>
                В нашем учебнике более 3500 слов, они поделены на 6 категорий сложности. Зарегистрировавшись, вы сможете
                хранить самые сложные слова в своём личном словаре. И они всегда будут под рукой.
              </div>
            </MainCard>

            <MainCard imgSrc="./assets/img/main-page/dictionary.jpg" imgAlt="dictionary" title="Словарь">
              <div>
                Можно помечать сложные слова, чтобы уделить им больше внимания при изучении. А также можно отмечать уже
                изученные слова, чтобы больше к ним не возвращаться.
              </div>
            </MainCard>

            <MainCard imgSrc="./assets/img/main-page/statistics.jpg" imgAlt="statistics" title="Статистика">
              <div>
                Удобная статистика будет показывать твой ежедневный прогресс, и поможет поддерживать твою мотивацию
                продолжать учёбу.
              </div>
            </MainCard>

            <MainCard imgSrc="./assets/img/main-page/games.jpg" imgAlt="games" title="Игры">
              <div>
                Изучение слов ещё никогда не было столь увлекательным! С помощью мини-игр “Спринт” и “Аудиовызов” мы
                сделали процесс обучения еще более интересным.
              </div>
            </MainCard>
          </div>
        </section>
      </div>
    </Box>
  );
};

export default Main;
