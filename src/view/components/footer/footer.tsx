import React from 'react';
import './footer.css';
import { useEffect } from 'react';

const Footer = () => {
  const PATH_GAMES = ['audiocall', 'sprint'];
  const path = window.location.href.split('/');
  const renderFooter = (): boolean => {
    return PATH_GAMES.includes(path[path.length - 1]);
  };

  useEffect(() => {
    renderFooter();
  });

  return (
    <>
      {renderFooter() === true ? (
        <div></div>
      ) : (
        <footer className="footer">
          <div className="footer-container">
            <div className="footer__column">
              <a href="https://github.com/StraightToJaneStreet" target="_blank">
                <div className="footer__github-wrap">
                  <div className="footer__github"></div>StraightToJaneStreet
                </div>
              </a>
              <a href="https://github.com/laiker" target="_blank">
                <div className="footer__github-wrap">
                  <div className="footer__github"></div>laiker
                </div>
              </a>
              <a href="https://github.com/AlexeiKozovski" target="_blank">
                <div className="footer__github-wrap">
                  <div className="footer__github"></div>AlexeiKozovski
                </div>
              </a>
            </div>
            <p className="footer__copyright">&copy;2022</p>
            <div className="footer__column">
              <a href="https://rs.school/js/" target="_blank">
                <div className="footer__rss"></div>
              </a>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
