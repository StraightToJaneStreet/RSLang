import * as React from 'react';

import { useSelector } from 'react-redux';
import { Logout } from '@mui/icons-material';
import Button from '@mui/material/Button';

import { selectState as selectAuth } from '../../model/feature/auth';
import DIContainer from '../../DI/DIContainer';
import IAuthService from '../../services/interfaces/IAuthService';
import DI_TYPES from '../../DI/DITypes';

const UserLink = () => {
  const authService = DIContainer.get<IAuthService>(DI_TYPES.AuthService);
  const { user } = useSelector(selectAuth);

  const handleClick = () => {
    authService.logout();
  };

  return (
    <div className="auth-link">
      {`${user?.name} `}
      <Button color="secondary" onClick={handleClick}>
        <Logout />
      </Button>
    </div>
  );
};

export default UserLink;
