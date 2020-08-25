import React from 'react';
import { useHistory } from 'react-router-dom';
import { Link} from 'react-router-dom';

import { Wrap } from '../view/profile/';

import '../assets/scss/TransactionRecord.scss';

import { withAuth } from "../util/";

const TransactionItems = (props) =>{
	const { to , name , className} = props
	return 	<Link className={className} to={to}>
				<i />
				<p>{name}</p>
				<span/>
			</Link>
}

const TransactionRecord = () => {

	const history = useHistory();

	return (
		<Wrap
			className="transaction-record-wrap"
			centerName="交易记录"
			faq={false}
			sublevel={[ true, () => history.goBack() ]}>
			<div className="transaction-record-wrap-inner">
				<div className="transaction-record-list">
					<TransactionItems to={'/deposit-history'} className="transaction-record-items deposit-record" name={'存款记录'} />
					<TransactionItems to={'/withdrawal-history'} className="transaction-record-items withdrawal" name={'提款记录'} />
					<TransactionItems to={'/transfer-record'} className="transaction-record-items transfer" name={'转账记录'} />
					<TransactionItems to={'/promo-history'} className="transaction-record-items preferential " name={'优惠记录'} />
					<TransactionItems to={'/rebate-history'} className="transaction-record-items backwater" name={'反水记录'} />
				</div>
			</div>
		</Wrap>
	);

}

export default withAuth(TransactionRecord, 1);
