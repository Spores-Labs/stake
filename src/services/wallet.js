import Web3 from 'web3';
import { web3 } from '../artifacts/contracts';
import { store } from '../reducers';
import { signIn, signOut } from '../reducers/profile';
import { updateInfosProfileService } from './profile';

export const connectProvider = async () => {
  const provider = Web3.givenProvider;
  provider.on('accountsChanged', () => {
    store.dispatch(signOut());
    window.location.reload();
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

    store.dispatch(signIn({ address }));
    updateInfosProfileService(address);
  } catch (error) {
    console.log(error);
  }
};
