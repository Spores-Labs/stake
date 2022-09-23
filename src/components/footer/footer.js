import React from 'react';
import './footer.css';
import { AppBar, Container, Toolbar } from '@mui/material';
function Footer() {
  return (
    <AppBar component='footer' position='static' style={{ background: '#000' }} className='footer'>
      <Toolbar component={Container} className='flex text-tiny md:text-sm justify-between custom-container'>
        <img src='/assets/images/logo-header.png' alt='logo' className='h-8 md:h-12' />
        <div>© 2021 CROS-All Rights Reserved</div>
      </Toolbar>
    </AppBar>
  );
}
export default Footer;
