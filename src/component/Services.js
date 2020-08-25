import React from 'react';
import { Link } from "react-router-dom";

import '../assets/scss/Services.scss';

function Services () {

	return (
		<div className="services">
		<div className="services-inner">
			<div className="services-items">
				<div className="logo-wrap banner-1">
					<Link to="promotions" className="logo"></Link>
				</div>
				<div className="logo-wrap banner-2">
					<Link to="promotions" className="logo"></Link>
				</div>
				<div className="logo-wrap banner-3">
					<Link to="promotions" className="logo"></Link>
				</div>
			</div>
		</div>
		</div>
		// <div className="services">
		// 	<div className="services-inner">
		// 		<div className="services-items">
		// 			<div className="services-item item-n1">
		// 				<div className="logo-wrap">
		// 					<div className="logo"></div>
		// 				</div>
		// 				<div className="over-layer"></div>
		// 				<div className="main-layer"></div>
		// 				<div className="circle"></div>
		// 			</div>
		// 			<div className="services-item item-n2">
		// 				<div className="logo-wrap">
		// 					<div className="logo"></div>
		// 				</div>
		// 				<div className="over-layer"></div>
		// 				<div className="main-layer"></div>
		// 				<div className="circle"></div>
		// 			</div>
		// 			<div className="services-item item-n3">
		// 				<div className="logo-wrap">
		// 					<div className="logo"></div>
		// 				</div>
		// 				<div className="main-layer"></div>
		// 				<div className="circle"></div>
		// 			</div>
		// 			<div className="services-item item-n4">
		// 			<div className="logo-wrap">
		// 				<div className="logo"></div>
		// 			</div>
		// 			<div className="main-layer"></div>
		// 			<div className="circle"></div>
		// 		</div>
		// 		</div>
		// 	</div>
		// </div>
	);

}

export default Services;
