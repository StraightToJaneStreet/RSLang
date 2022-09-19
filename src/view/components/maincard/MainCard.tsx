import React, { FC } from 'react';

export interface MainCardProps {
  imgSrc: string;
  imgAlt: string;
  title: string;
  children: React.ReactNode;
}

export const MainCard: FC<MainCardProps> = ({ imgSrc, imgAlt, title, children }) => {
  return (
    <div className="main-card">
      <img src={imgSrc} alt={imgAlt} />
      <h2>{title}</h2>
      <div className="description">{children}</div>
    </div>
  );
};
