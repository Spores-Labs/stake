function MaturityReward(rewardBalance, amount, stakedBalance) {
  let reward = ((rewardBalance * amount) / stakedBalance / 1e18).toFixed(6);
  return reward;
}
export default MaturityReward;
