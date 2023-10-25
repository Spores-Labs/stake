import Web3 from 'web3';
import { web3 } from '../contractHandler/contractHandler';
import { store } from '../reducers';
import { signIn, signOut } from '../reducers/profile';
import { updateInfosProfileService } from './profile';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';

const connectProviderWithoutMetaMask = () => {
  const provider =
    process.env.REACT_APP_NETWORK_VERSION === '97'
      ? 'https://data-seed-prebsc-2-s2.binance.org:8545'
      : 'https://bscrpc.com/';
  web3.setProvider(provider);
}

const connectProviderWithMetaMask = async () => {
  try {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: { 97: 'https://data-seed-prebsc-2-s2.binance.org:8545', 56: 'https://bscrpc.com' },
        },
      },
    };
    const web3Modal = new Web3Modal({
      providerOptions,
      theme: 'dark',
      cacheProvider: false,
    });
    const provider = Web3.givenProvider || (await web3Modal.connect());
    provider.on('accountsChanged', async (acc) => {
      store.dispatch(signOut());
    });
    provider.on('disconnect', () => {
      store.dispatch(signOut());
      window.location.reload();
    });
    provider.on('chainChanged', () => {
      window.location.reload();
    });

    web3.setProvider(provider);
  } catch (e) {
    console.log(e);
    connectProviderWithoutMetaMask()
  }
}

export const connectProvider = async () => {
  if (window.ethereum?.isMetaMask) {
    await connectProviderWithMetaMask()
  }
  else {
    connectProviderWithoutMetaMask()
  }
};

export const connectWallet = async () => {
  try {
    await connectProvider();
    let address;
    try {
      [address] = await web3.eth.requestAccounts();
    } catch {
      [address] = await web3.eth.getAccounts();
    }
    address = web3.utils.toChecksumAddress(address);
    const message = `Welcome to OKG Staking!\n\nClick "Sign" to sign in. No password needed!\n\nWallet address:\n${address}`;
    await web3.eth.personal.sign(message, address, '');

    store.dispatch(signIn({ address }));
    updateInfosProfileService(address);
  } catch (error) {
    console.log(error);
  }
};
