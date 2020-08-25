import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { User } from '../../../service/';
import { getAuthKey } from '../../../util/';
import { withAuth } from "../../util";

import { Wrap } from "./";

const Deposit = () => {

	const auth = getAuthKey();
	const { account } = User.read();

	const history = useHistory();
	const { search } = useLocation();
	const [ noback ] = useState(search.includes('a=1'));

	useEffect(() => {

		if (noback) {
			history.replace({ search: '' });
		}

	}, [ history, noback ]);

	useEffect(() => {
		// https://u2daszapp.u2d8899.com/newpwa/deposit.php?account=test01&auth=a085ba7d8a04afa
		// https://sghsrthth9i9.u2d12345.com/newpwa/deposit.php?account=test01&auth=a085ba7d8a04
		if (noback) {
			// window.location.href = `https://u2daszapp.u2d8899.com/newpwa/deposit.php?account=${account}&auth=${auth}&type=mphone`;
			// window.location.href = `https://u2daszapp.u2d8899.com/newpwa/deposit.php?account=${account}&auth=${auth}`;
			window.location.href = `https://sghsrthth9i9.u2d12345.com/newpwa/deposit.php?account=${account}&auth=${auth}`;
		} else {
			history.goBack();
		}

	}, [ auth, account, noback, history ]);

    
	return  <Wrap className="profile-deposit" name="马上充值" isLoading={true}></Wrap>
	// return null;

	// return (
	// 	<div className="deposit-sa">
	// 		<div className="deposit-head">
	// 			<div className="deposit-back-wrap">
	// 				<Link to="/profile">
	// 					<Icon name="arrow-left" />
	// 					<p>交易记录</p>
	// 				</Link>
	// 				<button className="faq">
	// 					<Icon name="faq" />
	// 				</button>
	// 			</div>
	// 		</div>
	// 		<div className="deposit-content">
	// 			<iframe 
	// 				style={{ height: 800, overflow: 'auto' }}
	// 				title={`IFRAME-N${auth}`}
	// 				src={`https://u2daszapp.u2d8899.com/newpwa/deposit.php?account=${account}&auth=${auth}&type=mphone`}>
	// 			</iframe>
	// 		</div>
	// 	</div>
	// );

}

export default withAuth(Deposit, 1);
