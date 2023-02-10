import BigNumber from 'bignumber.js';
import { stakingContract, tokenNPO } from '../contractHandler/contractHandler';
import { store } from '../reducers';
import { updateInfosProfile } from '../reducers/profile';

export const updateInfosProfileService = async (address) => {
  const yourStakedBalance = await stakingContract.methods.stakeOf(address).call();
  const balance = await tokenNPO.methods.balanceOf(address).call();
  store.dispatch(
    updateInfosProfile({
      yourStakedBalance: BigNumber(yourStakedBalance ?? 0)
        .div(BigNumber(10).pow(18))
        .toNumber(),
      balance,
      isCalled: true,
    }),
  );
};
