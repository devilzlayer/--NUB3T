import React from 'react';
import { useHistory } from 'react-router-dom';

import { Wrap } from '../view/profile/';

import '../assets/scss/Empty.scss';


const Empty = () => {

	const history = useHistory();

	return (
		<Wrap
			className="referral-wrap"
			centerName="意见反馈"
			faq={false}
			sublevel={[ true, () => history.goBack() ]}>
			<div className="referral-wrap-inner">
				
			</div>
		</Wrap>
	);

}

export default Empty;
