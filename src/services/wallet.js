import Web3 from 'web3';
import { web3 } from '../contractHandler/contractHandler';
import { store } from '../reducers';
import { signIn, signOut } from '../reducers/profile';
import { updateInfosProfileService } from './profile';

export const connectProvider = async () => {
  const provider = Web3.givenProvider;
  provider.on('accountsChanged', async(acc) => {
    store.dispatch(signOut());
    // window.location.reload();
  });
  provider.on('disconnect', () => {
    store.dispatch(signOut());
    window.location.reload();
  });
  provider.on('chainChanged', () => {
    window.location.reload();
  });

  web3.setProvider(provider);
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
