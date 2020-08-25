import React from 'react';

import { BlockHead, Icon } from '../component';

import '../assets/scss/TickerOver.scss';

const TickerOver = ({ news, onClose }) => {


	const __newsList = news.map((n, i) => (
		<div key={i} className="nt-list--item">
			<i/>
			<h4>
				<span className="title">{n.content} </span>
				<span className="time">{n.edit_time} </span>
			</h4>
			<p>{n.content}</p>
		</div>
	));

	return (
		<div className="ticker-over-sa shown news">
			<div className="ticker-over-sa--sublayer">
				<div className="ticker-over-sa--layer">
					{/* <button className="close" onClick={onClose}>
						<Icon name="close-circle-sharp" />
					</button> */}
					<div className="nt-head">
						<h2>新闻</h2>
					</div>
					<div className="nt-body">
						<div className="nt-list">
							{__newsList}
						</div>
					</div>

					<button className="understood" onClick={onClose}>我已了解</button>
				</div>
			</div>
			<div className="ticker-overlaybg" onClick={onClose} />
		</div>
	);

}

export default TickerOver;
