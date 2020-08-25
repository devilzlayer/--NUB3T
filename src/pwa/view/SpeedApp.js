import React from 'react';
import { useHistory } from 'react-router-dom';

import { Wrap } from '../view/profile/';

import '../assets/scss/SpeedApp.scss';


const SpeedApp = () => {

	const history = useHistory();

	return (
		<Wrap
			className="speedapp-wrap"
			centerName="极速APP"
			faq={false}
			sublevel={[ true, () => history.goBack() ]}>
			<div className="speedapp-wrap-inner">
				<div className="speedapp-wrap-items">
					<div className="speedapp-wrap-caption">1.点击"safari浏览器"进入网站</div>
					<div className="speedapp-wrap-thumbnail app1"></div>
				</div>
				<div className="speedapp-wrap-items">
					<div className="speedapp-wrap-caption">2.点击底部"    分享按钮"</div>
					<div className="speedapp-wrap-thumbnail app2"></div>
				</div>
				<div className="speedapp-wrap-items">
					<div className="speedapp-wrap-caption">3.在弹窗里点击"添加到主屏幕"</div>
					<div className="speedapp-wrap-thumbnail app3"></div>
				</div>
				<div className="speedapp-wrap-items">
					<div className="speedapp-wrap-caption">4.点击"添加"</div>
					<div className="speedapp-wrap-thumbnail app4"></div>
				</div>
				<div className="speedapp-wrap-items">
					<div className="speedapp-wrap-caption">5.恭喜您安装成功</div>
					<div className="speedapp-wrap-thumbnail app5"></div>
				</div>
			</div>
		</Wrap>
	);

}

export default SpeedApp;
