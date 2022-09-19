import * as React from 'react';

import store from '../../model/store';
import { slice as registrationFormSlice } from '../../model/feature/forms/registration';
import { slice as loginFormSlice } from '../../model/feature/forms/login';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Tab, Tabs } from '@mui/material';

import Auth from './Auth';
import Register from './Register';

interface ITabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const TabPanel = (props: ITabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tab-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const AuthModal = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    store.dispatch(loginFormSlice.actions.reset());
    store.dispatch(registrationFormSlice.actions.reset());
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function tabProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <div className="auth-link">
      <Button
        onClick={handleOpen}
        sx={{
          color: 'white',
        }}
      >
        Авторизация / Регистрация
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="auth tabs">
              <Tab label="Авторизация" {...tabProps(0)} />
              <Tab label="Регистрация" {...tabProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Auth />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Register />
          </TabPanel>
        </Box>
      </Modal>
    </div>
  );
};

export default AuthModal;
