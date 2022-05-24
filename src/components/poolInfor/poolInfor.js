import React from "react";
import "./poolInfor.css";
import withWallet from "../HOC/hoc";

function PoolInfor(props) {
  // props.onAccountChange()

  return (
    props.formVisibility && (
      <div className="poolInfor">
        <ul>
          <li>
            Your staked balance{" "}
            <span className="boldText">
              {props.yourStakedBalance.toLocaleString("en-EN")} Cake-LP{" "}
            </span>
          </li>
          <li>
            Staking cap{" "}
            <span className="boldText">{props.stakingCap} Cake-LP</span>{" "}
          </li>
          <li>
            Pool's total balance{" "}
            <span className="boldText">
              {(props.stakedTotal / 1e18).toLocaleString("en-EN")} Cake-LP
            </span>
          </li>
          <li>
            Maturity reward <span className="boldText">50% APR</span>
          </li>
          <li>
            Early rewards <span className="boldText">15% APR</span>{" "}
          </li>
          <li>
            Staking starts at{" "}
            <span className="boldText">
              {new Date(props.stakingStart * 1000).toLocaleString()}
            </span>
          </li>
          <li>
            Contribution close at{" "}
            <span className="boldText">
              {new Date(props.stakingEnds * 1000).toLocaleString()}
            </span>
          </li>
          <li>
            Early withdraw open at{" "}
            <span className="boldText">
              {new Date(props.earlyWithdraw * 1000).toLocaleString()}
            </span>
          </li>
          <li>
            Maturity at{" "}
            <span className="boldText">
              {new Date(props.maturityAt * 1000).toLocaleString()}
            </span>
          </li>
        </ul>
      </div>
    )
  );
}
export default withWallet(PoolInfor);
