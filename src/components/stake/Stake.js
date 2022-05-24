import React, { useState } from "react";
import "./Stake.css";
import BigNumber from "bignumber.js";
import MessageBoard from "../overlayMessageBoard/messageBoard";
import withWallet from "../HOC/hoc";
import EarlyRewardCalculator from "../rewardCalculator/earlyRewardCalculator";
import MaturityReward from "../rewardCalculator/maturityRewardCalculator";

function Stake(props) {
  // Call from HOC - Reuse functions/code fro Higher Order Component
  props.onAccountChange();

  // Stake & Unstake
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  // show/hide message - form

  const [messageVisibility, setMessageVisibility] = useState(false);
  const [message, setMessage] = useState("");
  const [clsBtnVis, setClsBtnVis] = useState(false);

  async function stakeToken() {
    let amount = await document.querySelector(".amount").value;
    // Balance
    const balance = await props.tokenNPO.methods
      .balanceOf(props.account)
      .call();

    // Step 1: Call the NPO token contract & approve the amount contract (to Set Allowance)
    if (props.stakingEnds * 1000 < Date.now()) {
      alert("Contribution was CLOSED, please choose another pool!");
    } else if (amount === "" || amount <= 0) {
      alert("Please input a positive amount"); // user has to input amount before click on stake button
      setMessageVisibility(false);
    } else if (Date.now() < props.stakingStart * 1000) {
      alert(
        `Could not stake, staking starts at ${new Date(
          props.stakingStart * 1000
        ).toLocaleString()}`
      );
    } else if (amount > balance / 1e18) {
      alert("Not enough Cake-LP balance"); // check wallet balance
    } else if (props.stakingCap === props.stakedBalance) {
      alert("Pool was fulfilled, please stake into another pool!"); // check if pool was fulfilled
    } else {
      setMessageVisibility(true);
      setMessage(
        "Waiting for ALLOWANCE confirmation, please confirm it on your Metamask extension!"
      );

      // handle amount (number bigint)
      amount = BigNumber(amount * 1e18).toFixed(0);

      await props.tokenNPO.methods
        .approve(props.stakingContractAddr, amount)
        .send({ from: props.account })
        .on("transactionHash", function (hash) {
          setMessage("Setting ALLOWANCE, please wait...!");
        })
        .on("receipt", function (receipt) {
          setMessage(
            "Waiting for STAKING confirmation, please confirm it on your Metamask extension"
          );
          props.stakingContract.methods
            .stake(amount)
            .send({ from: props.account })
            .on("transactionHash", function (hash) {
              setMessage("Confirming, please wait...!");
            })
            .on("receipt", function (receipt) {
              setMessage("Stake successfully");
              setTxHash(`txHash: ${receipt.transactionHash}`);
              setClsBtnVis(true);
            })
            .on("error", function (receipt) {
              // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
              setClsBtnVis(true);
              setMessage("Stake Failed");
            });
        })
        .on("error", function () {
          // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
          setClsBtnVis(true);
          setMessage("Set allowance failed");
        });
    }
  }

  async function unStakeToken() {
    let amount = await document.querySelector(".amount").value;

    if (Date.now() < props.earlyWithdraw * 1000) {
      alert(
        `Could not withdraw, you can withdraw from  ${new Date(
          props.earlyWithdraw * 1000
        ).toLocaleString()}`
      );
    } else if (parseFloat(amount) > parseFloat(props.yourStakedBalance)) {
      alert("You could not withdraw more than what you staked");
    } else if (amount === "" || amount <= 0) {
      alert("Please input a positive amount"); // user has to input amount before click on stake button
      setMessageVisibility(false);
    } else {
      // handle amount (number bigint)
      amount = BigNumber(amount * 1e18).toFixed(0);
      console.log(
        props.maturityAt,
        props.stakingEnds,
        props.stakedBalance,
        Date.now() / 1000,
        props.rewardState.earlyWithdrawReward,
        amount
      );
      if (
        Date.now() > props.earlyWithdraw * 1000 &&
        Date.now() < props.maturityAt * 1000
      ) {
        setMessageVisibility(true);
        setMessage(
          `You are doing early withdraw, you will get ~${EarlyRewardCalculator(
            props.maturityAt,
            props.stakingEnds,
            props.stakedTotal,
            Date.now() / 1000,
            props.rewardState.earlyWithdrawReward,
            amount
          )} SPO as the reward.
            You could get ~${MaturityReward(
              props.rewardState.rewardBalance,
              amount,
              props.stakedTotal
            )} SPO, if you withdraw after ${new Date(
            props.maturityAt * 1000
          ).toLocaleString()}. 

          If you still want to do the early withdraw, please confirm it on your Metamask extension`
        );
      } else if (Date.now() > props.maturityAt * 1000) {
        setMessageVisibility(true);
        setMessage(`
          You will get ~${MaturityReward(
            props.rewardState.rewardBalance,
            amount,
            props.stakedTotal
          )} SPO as the reward.
          Stay with Spores and earn more. Thank you!
        `);
      }

      await props.stakingContract.methods
        .withdraw(amount)
        .send({ from: props.account })
        .on("transactionHash", function (txHash) {
          setMessage("Processing, please wait...!");
        })
        .on("receipt", async function (receipt) {
          setMessage("Unstake successfully");
          setTxHash(`txHash: ${receipt.transactionHash}`);
          setClsBtnVis(true);
        })
        .on("error", function (error, receipt) {
          setTxHash(`txHash: ${receipt.transactionHash}`);
          setMessage("Unstake failed");
          setError(error.toString());
          setClsBtnVis(true);
        });
    }
  }
  return (
    <div className="content">
      {messageVisibility && (
        <MessageBoard
          message={message}
          txHash={txHash}
          error={error}
          clsBtnVis={clsBtnVis}
        />
      )}
      <div className="stakeBox">
        <p>
          <span className="boldText">{props.poolName}</span>
        </p>
        <p>{props.chain}</p>
        <p>
          <span className="boldText">YOUR ADDRESS</span>
        </p>
        <p>{props.account}</p>
        <p>
          {props.formVisibility && (
            <span className="boldText">CONTRACT ADDRESS </span>
          )}
          <br />
          NEVER SEND tokens to the contract
          <br />
          Please, USE THIS APP for staking instead
        </p>
        {props.formVisibility && <p>{props.stakingContractAddr}</p>}
        {props.formVisibility && (
          <input
            className="amount"
            placeholder="Please input the amount..."
            type="number"
            min={0}
            required
          />
        )}
        {props.formVisibility && (
          <div className="btns">
            <a href="#" className="btn" onClick={stakeToken}>
              Stake
            </a>
            <a href="#" className="btn" onClick={unStakeToken}>
              UnStake
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
export default withWallet(Stake);
