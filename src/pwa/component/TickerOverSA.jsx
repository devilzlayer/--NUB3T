import React from 'react';
import { Link } from "react-router-dom";
import { head} from 'lodash'
import { BlockHead, Icon } from '../../component/';

import '../assets/scss/TickerOverSA.scss';

const TickerOverSA = ({ news, onClose }) => {

	const __newsList = news.map((n, i) => (
		<div key={i} className="nt-list--item">
			<h4>{n.title}</h4>
			<p>{n.text}</p>
		</div>
	));

	const headTitle = head(news)
	return (
		<div className="ticker-over-sa shown">
			<div className="ticker-over-sa-cont">
				<div className="ticker-over-sa--header">
					<h3>最新公告</h3>
				</div>
				<div className="ticker-over-sa--body">
					<div className="ticker-text">
					{headTitle && headTitle.title}
					</div>
					<div className="ticker-button">
						<button className="btn ticker-close" onClick={onClose}>取消</button>
						<Link to="news" className="btn ticker-view">查看全部</Link>
					</div>
				</div>
			</div>
		</div>
	);

}

export default TickerOverSA;
