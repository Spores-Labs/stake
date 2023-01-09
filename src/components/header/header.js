import React from 'react';
import './header.css';
import { Close, Menu as MenuIcon, AccountBalanceWallet, ExpandMore, ArrowDropDown } from '@mui/icons-material';
import {
  AppBar,
  Button,
  Container,
  IconButton,
  ListItemButton,
  Menu,
  MenuItem,
  MenuList,
  Modal,
  Toolbar,
  Link as MuiLink,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { shorten } from '../../utils/common';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import useAnchor from '../../hooks/useAnchor';
import { connectWallet } from '../../services/wallet';
import { profileSelector, signOut } from '../../reducers/profile';
import { Link } from 'react-router-dom';
import { publicRoute } from '../../routes';

const HeaderItem = ({ url, href, state, ...props }) => {
  return url ? (
    <Link to={url}>
      <ListItemButton
        className='flex justify-center font-bold text-2xl md:text-lg text-color-primary rounded'
        {...props}
      />
    </Link>
  ) : href ? (
    <MuiLink href={href} target='_blank' underline='none'>
      <ListItemButton
        className='flex justify-center font-bold text-2xl md:text-lg text-color-primary rounded'
        {...props}
      />
    </MuiLink>
  ) : (
    <ListItemButton
      className='flex justify-center font-bold text-2xl md:text-lg text-color-primary rounded'
      {...props}
    />
  );
};

const DropdownItem = ({ text }) => <div className='font-avenir font-black text-white py-1'>{text}</div>;

const Header = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, address } = useSelector(profileSelector);
  const { isMobile } = useWindowDimensions();
  const [anchorEl, open, onOpen, onClose] = useAnchor();
  const [anchorElStaking, openStaking, onOpenStaking, onCloseStaking] = useAnchor();
  const [anchorElGetOKG, openGetOKG, onOpenGetOKG, onCloseGetOKG] = useAnchor();
  const [openPopup, setOpenPopup] = useState(false);

  const handleClosePopop = () => {
    setOpenPopup(false);
  };

  return (
    <AppBar style={{ background: '#3C2C19CC', borderBottom: '1px solid #6C6C6C', backdropFilter: 'blur(8px)' }}>
      <Toolbar component={Container} className='custom-container'>
        <MuiLink href='https://ookeenga.io/' underline='none'>
          <img src='/assets/images/logo-header.png' alt='logo' className='h-8 md:h-12' />
        </MuiLink>
        {isMobile ? (
          <>
            <div className='flex-1' />
            <IconButton onClick={() => setOpenPopup(true)}>
              <MenuIcon className='text-color-secondary' />
            </IconButton>

            <Modal open={openPopup} onClose={handleClosePopop} style={{ background: '#170A02E5' }}>
              <>
                <div className='flex justify-end mb-1'>
                  <IconButton onClick={handleClosePopop}>
                    <Close className='text-color-secondary' />
                  </IconButton>
                </div>
                <div className='flex items-center justify-center h-full'>
                  <MenuList className='flex flex-col gap-10'>
                    <Accordion className='text-2xl font-black bg-none bg-transparent shadow-none'>
                      <AccordionSummary
                        className='bg-none bg-transparent w-fit text-color-primary mx-auto'
                        expandIcon={<ExpandMore className='ml-2 text-color-primary' />}
                      >
                        Staking
                      </AccordionSummary>
                      <AccordionDetails className='bg-none bg-transparent'>
                        <HeaderItem href='https://staking.ookeenga.io/stake' onClick={handleClosePopop}>
                          Staking Pool 1
                        </HeaderItem>
                        <HeaderItem url={publicRoute.stakeView.path} onClick={handleClosePopop}>
                          Staking Pool 2
                        </HeaderItem>
                      </AccordionDetails>
                    </Accordion>
                    <HeaderItem href='https://marketplace.ookeenga.io/' onClick={handleClosePopop}>
                      Marketplace
                    </HeaderItem>
                    <Accordion className='text-2xl font-black bg-none bg-transparent shadow-none'>
                      <AccordionSummary
                        className='bg-none bg-transparent w-fit text-color-primary mx-auto'
                        expandIcon={<ExpandMore className='ml-2 text-color-primary' />}
                      >
                        Get OKG
                      </AccordionSummary>
                      <AccordionDetails className='bg-none bg-transparent'>
                        <HeaderItem
                          href='https://pancakeswap.finance/swap?inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0x7758a52c1Bb823d02878B67aD87B6bA37a0CDbF5'
                          onClick={handleClosePopop}
                        >
                          Pancake
                        </HeaderItem>
                        <HeaderItem href='https://www.bybit.com/en-US/trade/spot/OKG/USDT' onClick={handleClosePopop}>
                          Bybit
                        </HeaderItem>
                      </AccordionDetails>
                    </Accordion>
                    {/* <HeaderItem url={publicRoute.leaderBoard.path} onClick={handleClosePopop}>
                      Leaderboard
                    </HeaderItem> */}
                    {isLoggedIn ? (
                      <HeaderItem
                        onClick={() => {
                          dispatch(signOut());
                          handleClosePopop();
                        }}
                      >
                        Disconnect
                      </HeaderItem>
                    ) : (
                      <HeaderItem
                        onClick={async () => {
                          await connectWallet();
                          handleClosePopop();
                        }}
                      >
                        Connect Wallet
                      </HeaderItem>
                    )}
                  </MenuList>
                </div>
              </>
            </Modal>
          </>
        ) : (
          <>
            <MenuList className='flex flex-row gap-3 ml-6'>
              <HeaderItem onClick={onOpenStaking}>
                Staking <ArrowDropDown />
              </HeaderItem>
              <Menu
                anchorEl={anchorElStaking}
                PaperProps={{
                  sx: {
                    overflow: 'visible',
                    backgroundColor: '#423429',
                    border: '1px solid #B7A284',
                    marginTop: 0,
                    width: 153,
                    '&:before': {
                      display: 'none',
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                open={openStaking}
                onClose={onCloseStaking}
                onClick={onCloseStaking}
              >
                <MenuItem
                  onClick={() => {
                    window.open('https://staking.ookeenga.io/stake', '_blank');
                  }}
                >
                  <DropdownItem text='Staking Pool 1' />
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  <DropdownItem text='Staking Pool 2' />
                </MenuItem>
              </Menu>
              <HeaderItem href='https://marketplace.ookeenga.io/'>Marketplace</HeaderItem>
              <HeaderItem onClick={onOpenGetOKG}>
                Get OKG <ArrowDropDown />
              </HeaderItem>
              <Menu
                anchorEl={anchorElGetOKG}
                PaperProps={{
                  sx: {
                    overflow: 'visible',
                    backgroundColor: '#423429',
                    border: '1px solid #B7A284',
                    marginTop: 0,
                    width: 153,
                    '&:before': {
                      display: 'none',
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                open={openGetOKG}
                onClose={onCloseGetOKG}
                onClick={onCloseGetOKG}
              >
                <MenuItem
                  onClick={() => {
                    window.open(
                      'https://pancakeswap.finance/swap?inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0x7758a52c1Bb823d02878B67aD87B6bA37a0CDbF5',
                      '_blank',
                    );
                  }}
                >
                  <DropdownItem text='Pancake' />
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    window.open('https://www.bybit.com/en-US/trade/spot/OKG/USDT', '_blank');
                  }}
                >
                  <DropdownItem text='Bybit' />
                </MenuItem>
              </Menu>
              {/* <HeaderItem url={publicRoute.leaderBoard.path}>Leaderboard</HeaderItem> */}
            </MenuList>
            <div className='flex-1' />

            {isLoggedIn ? (
              <>
                <Button
                  variant='outlined'
                  className='flex justify-between bg-color-brown text-color-secondary text-lg w-64 h-10 px-5'
                  onClick={onOpen}
                  style={{ border: '1px solid #966740' }}
                >
                  {shorten(address)}
                  <AccountBalanceWallet />
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  PaperProps={{
                    sx: {
                      overflow: 'visible',
                      backgroundColor: '#463024',
                      border: '1px solid #966740',
                      marginTop: 1.5,
                      width: 256,
                      '&:before': {
                        ...{ content: '""', display: 'block', zIndex: 0 },
                        ...{ position: 'absolute', top: 0, right: 14, width: 10, height: 10 },
                        ...{ borderWidth: 1, borderColor: '#966740', borderBottom: 0, borderRight: 0 },
                        backgroundColor: '#5c493e',
                        transform: 'translateY(-50%) rotate(45deg)',
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  open={open}
                  onClose={onClose}
                  onClick={onClose}
                >
                  <MenuItem className='text-color-primary' onClick={() => dispatch(signOut())}>
                    Disconnect
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  variant='outlined'
                  className='bg-color-brown text-color-caption w-48 h-10'
                  onClick={() => connectWallet()}
                  style={{ border: '1px solid #966740' }}
                >
                  Connect Wallet
                </Button>
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
