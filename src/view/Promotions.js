import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { StickyProvider, Sticky } from 'react-stickup';
import { map } from 'lodash'
import { withAuth } from '../util/';
import { Promotions as Service } from '../service/';

import '../assets/scss/Promotions.scss';


function Promotions() {

	const container = useRef(null);
	const nav = useRef(null);
	const [promotions, setPromotions] = useState([]);
	const [ active , setActive ] = useState(0)
	const [ position , setPosition ] = useState(0)
	useEffect(() => {

		window.scrollTo(0, 0);

		document.body.classList.add('promotions-page');

		return () => document.body.classList.remove('promotions-page');

	}, []);

	useEffect(() => {

		const req = Service.read_updated();

		req.promise.then(r => {

			console.log(r);

			setPromotions(r.info);

		}, e => { });

		return () => req.cancel();

	}, []);

	const buttonLabels = ["所有事件", "体育", "真人", "电竞", "棋牌", "电子"]

	const PromoButton = ({ label, active, onClick }) => (
		<div className={`button ${active ? "active" : null}`} onClick={onClick}>
			{console.warn(active)}
			{label}
		</div>
	)

	const onClick = async(i) =>{
		await setActive(i)
		const { children } = nav.current
		map(children , (obj ) =>{
			// console.log(obj.offsetLeft)
			if(obj.classList.contains('active')){
				setPosition(obj.offsetLeft)
			}
			
		})
		// var el = document.querySelector('.button.active');
		// console.log(el.offsetLeft, el.offsetTop);

	}

	return (
		<StickyProvider>
			<div className="promotions" ref={container}>
				<div className="promotions-flex-wrap">
					<div className="promotions-inner">
						<div className="promotions-buttons" ref={nav}>
							{buttonLabels.map((label, i) => <PromoButton label={label} key={i} active={active === i} onClick={() => onClick(i)}/>)}
							<div className={`switch active-${active}`} style={{left : position}}/>
						</div>
						<div className="promotions-banners">
							{promotions.map((promotion, i) => (
								<Link className="banner" to={`/promotion/${promotion.id}`} key={i}>
									<div className="banner-inner">
										<div className="banner-img">
											<img src={`https://${promotion.bannerurl}`} alt={promotion.title} />
										</div>
										<div className="banner-body">
											<p>离活动结束: {promotion.endTime}</p>
											<span className="arrow">更多内容</span>
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</StickyProvider>
	);

}

export default withAuth(Promotions, 0);
