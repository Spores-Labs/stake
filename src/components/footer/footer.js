import React from 'react';
import './footer.css';
import { AppBar, Container, Toolbar } from '@mui/material';
function Footer() {
  return (
    <AppBar component='footer' position='static' style={{ background: '#000' }}>
      <Toolbar component={Container} className='flex text-tiny md:text-sm justify-between custom-container'>
        <img src='/assets/images/logo-header.png' alt='logo' className='h-3.5 md:h-7' />
        <div>© 2021 CROS-All Rights Reserved</div>
      </Toolbar>
    </AppBar>
  );
}
export default Footer;
