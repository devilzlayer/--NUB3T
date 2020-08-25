import React,{ useState, useRef, useEffect  }from 'react';
import { useCountUp } from 'react-countup';
// import { map, toInteger } from 'lodash'
// import { BlockHead } from '../component/';

import '../assets/scss/Advantages.scss';

function Advantages () {
	const { 
		// innerWidth: width, 
		innerHeight: height , } = window;
	const [ roll, setRoll] = useState(false)
	// const [ counter , setCounter ] = useState(0)
	const offSet = useRef(null)

	const { countUp, start,  } = useCountUp({
		start: 0,
		end: 60,
		delay: 1000,
		duration: 3,
		useEasing: true
	});


	useEffect(() =>{
		start()
	},[roll])

	const checkScrollTop = () => {
		if(offSet.current){
			if (window.pageYOffset > (offSet.current.offsetTop - height)){
				setRoll(true)
			}
		}
	};

	window.addEventListener('scroll', checkScrollTop)
	
	return (
		<div className="advantages"  ref={offSet} >
			<div className="advantages-inner">
				<div className="advantages-head">
					<div className="app-d-head head-block">
						<div className="head-title">服务优势</div>
						<div className="head-sub">ADVANTAGE OF SERVICE</div>
						
					</div>
				</div>
				<div className="advantages-body">
					<div className="advantages--item n1">
		 				<div className="icon">
		 					<div className="circle speed">
								<span>存款速度</span>
								<span className="n1">DEPOSIT SPEED</span>
								<p>{countUp}</p>
		 					</div>
		 				</div>
		 				<h4>信誉资金托管</h4>
		 				<h5>MORE WAYS TO PROTECT</h5>
		 				<p>独立开发,128位加 密技术和严格的 安 全管理体系，让客 户资金得到最完善 的保障。</p>
		 			</div>
		 			<div className="advantages--item n2">
		 				<div className="icon">
		 					<div className="circle speed">
							 	<span>提现速度</span>
								<span className="n2">WITHDRAWAL SPEED</span>
								<p>{countUp}</p>
		 					</div>
		 				</div>
		 				<h4>60秒极速出款</h4>
		 				<h5>MORE WAYS TO WIN</h5>
		 				<p>最新技术自主研发 的财务处理系统，极速存、取、转。独家网络优化技 术，为您提供一流的游戏体验。</p>
		 			</div>
		 			<div className="advantages--item n3">
		 				<div className="icon">
		 					<div className="circle amount">
								<span>付款合作</span>
								<span className="n3">PAYMENT COOPERATION</span>
								<p>{countUp}</p>
		 					</div>
		 				</div>
		 				<h4>三端数据互通</h4>
		 				<h5>MORE DEVICES ACCOUNT</h5>
		 				<p>支持各种终端设备，完美兼容PC、 移 动端。原生态App让 您随时随地轻松投 注。</p>
		 			</div>
		 			<div className="advantages--item n4">
		 				<div className="icon">
		 					<div className="circle amount">
							 	<span>平台合作</span>
								<span className="n4">PLATFORM COOPERATION</span>
								<p>{countUp}</p>
		 					</div>
		 				</div>
		 				<h4>赛事覆盖全面</h4>
		 				<h5>MORE EVENTS TO PLAY</h5>
		 				<p>每天提供超过500 场不同类别的精彩 赛事，涵盖世界范 围内主要体育运 动 ，让客户拥有最完 美的游戏体验。</p>
		 			</div>
				</div>
			</div>
		</div>

		// <div className="advantages">
		// 	<div className="advantages-inner">
		// 		<div className="advantages-head">
		// 			<BlockHead name="服务优势" text="Advantage of service" />
		// 		</div>
		// 		<div className="advantages-body">
		// 			<div className="advantages--item n1">
		// 				<div className="icon">
		// 					<div className="circle">
		// 						<p>60</p>
		// 					</div>
		// 				</div>
		// 				<h4>信誉资金托管</h4>
		// 				<p>独立开发,128位加 密技术和严格的 安 全管理体系，让客 户资金得到最完善 的保障。</p>
		// 			</div>
		// 			<div className="advantages--item n2">
		// 				<div className="icon">
		// 					<div className="circle">
		// 						<p>60</p>
		// 					</div>
		// 				</div>
		// 				<h4>60秒极速出款</h4>
		// 				<p>最新技术自主研发 的财务处理系统，极速存、取、转。独家网络优化技 术，为您提供一流的游戏体验。</p>
		// 			</div>
		// 			<div className="advantages--item n3">
		// 				<div className="icon">
		// 					<div className="circle">
		// 						<p>60</p>
		// 					</div>
		// 				</div>
		// 				<h4>三端数据互通</h4>
		// 				<p>支持各种终端设备，完美兼容PC、 移 动端。原生态App让 您随时随地轻松投 注。</p>
		// 			</div>
		// 			<div className="advantages--item n4">
		// 				<div className="icon">
		// 					<div className="circle">
		// 						<p>60</p>
		// 					</div>
		// 				</div>
		// 				<h4>赛事覆盖全面</h4>
		// 				<p>每天提供超过500 场不同类别的精彩 赛事，涵盖世界范 围内主要体育运 动 ，让客户拥有最完 美的游戏体验。</p>
		// 			</div>
		// 		</div>
		// 	</div>
		// </div>
	);

}

export default Advantages;
