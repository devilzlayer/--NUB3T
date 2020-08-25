import React, { useEffect } from 'react';

import { withAuth } from '../util/';
import { TopSlider, NewsTicker, Services, AppDownload, VenueBetting, Video, Advantages } from '../component/';

function Home (props) {

	const { onPop } = props

	useEffect(() => {

		window.scrollTo(0, 0);

	}, []);

	return (
		<>
			<TopSlider />
			<NewsTicker onPop={onPop} />
			<Services />
			<AppDownload />
			<VenueBetting />
			{/* <Video /> */}
			<Advantages />
		</>
	);

}

export default withAuth(Home, 0);
