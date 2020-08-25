import React, { useContext} from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../assets/scss/SliderSA.scss";
import { User } from '../../service/';

function SliderSA() {
  const { setUserAuthFN ,userAuth } = useContext(User.Context);
  const onClick = (e) =>{
    if(!userAuth.data){
      e.preventDefault()
      setUserAuthFN(userAuth.status , userAuth.data , true)
    }
  }


  return (
    <div className="slider-sa">
      <Slider draggable={false} arrows={false} autoplay={true} dots={true}>
        <Link to="/about" className="slider--item" onClick={onClick}>
          <img
            src={require("../assets/img/slider/item/banner-image1.png")}
            alt=""
          />
        </Link>
        <Link to="/about" className="slider--item" onClick={onClick}>
          <img
            src={require("../assets/img/slider/item/banner-image2.png")}
            alt=""
          />
        </Link>
        <Link to="/about" className="slider--item" onClick={onClick}>
          <img
            src={require("../assets/img/slider/item/banner-image3.png")}
            alt=""
          />
        </Link>
      </Slider>
    </div>
  );
}

export default SliderSA;
