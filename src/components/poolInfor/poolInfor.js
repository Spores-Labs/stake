import React from "react";
import "./poolInfor.css";
import withWallet from "../HOC/hoc";

function formatUTC(time) { // seconds
  return new Date(time * 1000).toUTCString().split(',')[1].trim();
}

function PoolInfor(props) {
  // props.onAccountChange()

  return (
    props.formVisibility && (
      <div className="poolInfor">
        <ul>
          <li>
            Your staked balance{" "}
            <span className="boldText">
              {props.yourStakedBalance.toLocaleString("en-EN")} SPO{" "}
            </span>
          </li>
          <li>
            Staking cap <span className="boldText">{props.stakingCap} SPO</span>{" "}
          </li>
          <li>
            Pool's total balance{" "}
            <span className="boldText">
              {(props.stakedTotal / 1e18).toLocaleString("en-EN")} SPO
            </span>
          </li>
          <li>
            Maturity reward <span className="boldText">30% APR</span>
          </li>
          <li>
            Early reward <span className="boldText">8% APR</span>{" "}
          </li>
          <li>
            Staking starts at{" "}
      {props.stakingStarts}
            <span className="boldText">
              {formatUTC(props.stakingStart)}
            </span>
          </li>
          <li>
            Contribution close at{" "}
            <span className="boldText">
              {formatUTC(props.stakingEnds)}
            </span>
          </li>
          <li>
            Early withdraw open at{" "}
            <span className="boldText">
              {formatUTC(props.earlyWithdraw)}
            </span>
          </li>
          <li>
            Maturity at{" "}
            <span className="boldText">
              {formatUTC(props.maturityAt)}
            </span>
          </li>
        </ul>
      </div>
    )
  );
}
export default withWallet(PoolInfor);
