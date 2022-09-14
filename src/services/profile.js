import { stakingContract, tokenNPO } from '../artifacts/contracts/contractHandler';
import { store } from '../reducers';
import { updateInfosProfile } from '../reducers/profile';

export const updateInfosProfileService = async (address) => {
  const yourStakedBalance = await stakingContract.methods.stakeOf(address).call();
  const balance = await tokenNPO.methods.balanceOf(address).call();
  store.dispatch(updateInfosProfile({ yourStakedBalance: (yourStakedBalance ?? 0) / 1e18, balance }));
};
