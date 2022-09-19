import React, { FC } from 'react';

interface TeamCardProps {
  imgSrc: string;
  name: string;
  role: string;
  description: string;
  git: string;
}

const githubUrl = 'https://github.com/';

export const TeamCard: FC<TeamCardProps> = ({ imgSrc, name, role, description, git }) => {
  return (
    <div className="team-card">
      <img src={imgSrc} alt={name} />
      <h2>{name}</h2>
      <p>{role}</p>
      <p>{description}</p>
      <a href={githubUrl + git} target="_blank">
        <div className="team-card__github-wrap">
          <div className="team-card__github"></div>
          {git}
        </div>
      </a>
    </div>
  );
};
