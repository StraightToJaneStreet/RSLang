import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

export interface GameCardProps {
  title: string;
  classname: string;
  url: string;
  children: React.ReactNode;
  imgSrc: string;
}

export const GameCard: FC<GameCardProps> = ({ title, classname, url, children, imgSrc }) => {
  return (
    <div className={'game-card games__' + classname}>
      <h2>{title}</h2>
      <img src={imgSrc} alt={url} />
      <div className="description">{children}</div>
      <Button component={Link} to={'/games/' + url} variant="outlined">
        Начать игру
      </Button>
    </div>
  );
};
