import React  ,{ useEffect, useState }from "react";

import Wrap from './Wrap'

import "../../assets/scss/profile/Empty.scss";

const Empty = () => {
  return  <Wrap className="profile-emptty" title={""}>
            <div className="profile-section section-box">

            </div>
          </Wrap>
}

export default Empty;
