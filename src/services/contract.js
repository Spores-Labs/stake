import { stakingContract } from '../artifacts/contracts/contractHandler';
import { store } from '../reducers';
import { updateContractInfos } from '../reducers/contractInfos';

export const getContractInfos = async () => {
  const [
    poolName,
    stakingCap,
    stakedBalance,
    stakedTotal,
    earlyWithdraw,
    stakingStart,
    stakingEnds,
    maturityAt,
    rewardState,
  ] = await Promise.all([
    new Promise(function (resolve, reject) {
      stakingContract.methods.name().call((error, result) => {
        resolve(result);
      });
    }),
    new Promise(function (resolve, reject) {
      stakingContract.methods.stakingCap().call((error, result) => {
        resolve(result / 1e18);
      });
    }),
    new Promise(function (resolve, reject) {
      stakingContract.methods.stakedBalance().call((error, result) => {
        resolve(result);
      });
    }),
    new Promise(function (resolve, reject) {
      stakingContract.methods.stakedTotal().call((error, result) => {
        resolve(result);
      });
    }),
    new Promise(function (resolve, reject) {
      stakingContract.methods.withdrawStarts().call((error, result) => {
        // setEarlyWithdraw(new Date(result * 1000).toLocaleString())
        resolve(result);
      });
    }),
    new Promise(function (resolve, reject) {
      stakingContract.methods.stakingStarts().call((error, result) => {
        resolve(result);
      });
    }),
    new Promise(function (resolve, reject) {
      stakingContract.methods.stakingEnds().call((error, result) => {
        resolve(result);
      });
    }),
    new Promise(function (resolve, reject) {
      stakingContract.methods.withdrawEnds().call((error, result) => {
        resolve(result);
      });
    }),
    new Promise(function (resolve, reject) {
      stakingContract.methods.rewardState().call((error, result) => {
        resolve(result);
      });
    }),
  ]);
  store.dispatch(
    updateContractInfos({
      poolName,
      stakingCap,
      stakedBalance,
      stakedTotal,
      earlyWithdraw,
      stakingStart,
      stakingEnds,
      maturityAt,
      rewardState,
    }),
  );
};
