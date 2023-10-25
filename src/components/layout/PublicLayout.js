import { CircularProgress, Dialog, styled } from '@mui/material';
import { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { web3 } from '../../contractHandler/contractHandler';
import { store } from '../../reducers';
import { signIn } from '../../reducers/profile';
import { publicRoute } from '../../routes';
import { getContractInfos } from '../../services/contract';
import { updateInfosProfileService } from '../../services/profile';
import { connectProvider } from '../../services/wallet';
import DesignButton from '../common/DesignButton';
import Footer from '../footer/footer';
import Header from '../header/header';

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

const PublicLayout = () => {
  const [isReady, setIsReady] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

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
  }, []);

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
      <Header />
      <div className='container-app'>
        <Routes>
          {Object.values(publicRoute).map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path='*' element={<Navigate to={publicRoute.stakeView.path} />} />
        </Routes>
      </div>
      <Footer />
      <CustomDialog fullWidth maxWidth='xs' open={isWrongNetwork}>
        <div className='flex flex-col items-center py-8 font-black'>
          <CircularProgress style={{ color: 'rgb(150, 103, 64)' }} />
          <div className='mt-4 mb-2 text-xl '>Wrong Network</div>
          <div className='mb-6'>Please switch network to continue</div>
          <DesignButton onClick={handleConnectBinance} imageSize='small'>
            BNB Chain
          </DesignButton>
        </div>
      </CustomDialog>
    </div>
  );
};

export default PublicLayout;
