import React from 'react';
import { useHistory } from 'react-router-dom';
import { Link} from 'react-router-dom';

import { Wrap } from '../view/profile/';
import { withAuth } from "../util/";

import '../assets/scss/DepositMethod.scss';

const CardItem = (props) =>{
	const { label , className , hot , to} = props
	return	<Link to={to} className={`deposit-method-head-card ${className}`}>
				<i />
				<p>{label} {hot && <span>HOT!</span>}</p>
				<span/>
			</Link>
}

const DepositMethod = () => {

	const history = useHistory();

	return (
		<div className="deposit-method-wrap">
			<div className="deposit-method-wrap-inner">
				<div className="deposit-method-header">
					<div className="deposit-method-head-caption">Choose deposit method</div>
				</div>
				<div className="deposit-method-body">
					<CardItem to="" label="网银在线支付" className="online-banking" hot={true} />
					<CardItem to="" label="支付宝在线支付" className="online-payment" />
					<CardItem to="" label="银联扫码" className="scan-code" />
					<CardItem to="" label="支付宝/网银转账" className="banking-transfer" />
				</div>
			</div>
		</div>
	);

}

export default withAuth(DepositMethod, 1);
