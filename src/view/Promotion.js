import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { StickyProvider, Sticky } from 'react-stickup';

import { withAuth } from '../util/';
import { Promotions as Service } from '../service/';

import '../assets/scss/Promotions.scss';

function Promotion() {

	const container = useRef(null);
	const [promotion, setPromotion] = useState(null);

	const { id } = useParams();

	useEffect(() => {

		window.scrollTo(0, 0);

		document.body.classList.add('promotions-page');

		return () => document.body.classList.remove('promotions-page');

	}, []);

	useEffect(() => {

		const req = Service.read_current({
			id,
		});

		req.promise.then(r => {

			console.log(r);

			setPromotion(r.info);

		}, e => { });

		return () => req.cancel();

	}, [id]);

	return (
		<StickyProvider>
			<div className="promotions single" ref={container}>
				<div className="promotions-flex-wrap">
					<div className="promotions-inner">
						{promotion ? (
							<div className="banner-info">
								<p dangerouslySetInnerHTML={{ __html: promotion }}></p>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</StickyProvider>
	);

}

export default withAuth(Promotion, 0);
