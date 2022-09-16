import { CircularProgress, Dialog, styled, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { web3 } from '../../contractHandler/contractHandler';
import { store } from '../../reducers';
import { profileSelector, signIn, updateInfosProfile } from '../../reducers/profile';
import { getContractInfos } from '../../services/contract';
import { updateInfosProfileService } from '../../services/profile';
import { connectProvider } from '../../services/wallet';
import CloseButton from '../common/CloseButton';
import DesignButton from '../common/DesignButton';

const CustomDialog = styled(Dialog)`
  & .MuiDialog-paper {
    background: url('assets/images/background-dialog.png');
    background-size: 100% 100%;
    color: #f1e9dc;
  }
`;

const APP_NETWORK =
  Number(process.env.REACT_APP_NETWORK_VERSION) === 97
    ? {
        chainName: 'BSC Testnet',
        chainId: '0x61',
        rpcUrls: ['https://data-seed-prebsc-2-s2.binance.org:8545'],
        blockExplorerUrls: ['https://testnet.bscscan.com/'],
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
      }
    : {
        chainName: 'Binance Smart Chain',
        chainId: '0x38',
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
      };

const PublicLayout = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const { isInstalled } = useSelector(profileSelector);

  const getNetwork = async () => {
    const netId = await web3.eth.net.getId();
    const isRightNet = netId === Number(process.env.REACT_APP_NETWORK_VERSION);
    setIsReady(isRightNet);
    setIsWrongNetwork(!isRightNet);
  };

  const firstLoad = useCallback(async () => {
    await connectProvider();
    await getNetwork();
  }, []);

  const secondLoad = useCallback(async () => {
    if (isReady) {
      await getContractInfos();
    }
  }, [isReady]);

  useEffect(() => {
    firstLoad();
  }, [firstLoad]);

  useEffect(() => {
    secondLoad();
  }, [secondLoad]);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    if (!!profile) {
      store.dispatch(signIn(profile));
      updateInfosProfileService(profile.address);
    }
  }, []);

  const handleConnectBinance = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${Number(process.env.REACT_APP_NETWORK_VERSION).toString(16)}` }],
      });
    } catch (error) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [APP_NETWORK],
        });
      }
    }
  };

  return (
    <div className='wrapper'>
      {children}
      <CustomDialog fullWidth maxWidth='xs' open={isWrongNetwork}>
        <div className='flex flex-col items-center py-8'>
          <CircularProgress style={{ color: 'rgb(150, 103, 64)' }} />
          <Typography variant='h3' className='mt-4 mb-2'>
            Wrong Network
          </Typography>
          <Typography className='mb-6'>Please switch network to continue</Typography>
          <DesignButton onClick={handleConnectBinance} imageSize='small'>
            BNB Chain
          </DesignButton>
        </div>
      </CustomDialog>
      <CustomDialog fullWidth open={!isInstalled}>
        <div className='text-color-primary font-bold text-xl md:text-huge text-center p-10'>
          No metamask detect, please install metamask!
        </div>
        <CloseButton onClick={() => store.dispatch(updateInfosProfile({ isInstalled: true }))} />
      </CustomDialog>
    </div>
  );
};

export default PublicLayout;
