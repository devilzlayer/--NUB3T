import React, { useEffect, useState  ,useContext } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-scroll";

import { useWindowDimensions } from "../../util";
import { User } from "../../service/";


import "../assets/scss/ContentSA.scss";
import { head } from "../assets/scss/variables.scss";

const ContentSAItems = [
  [
    {
      id: 1206,
      title: "体育博彩",
      title2: "BTI体育",
      name: "BTI体育",
      category: "Sports Betting",
      color: "red",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labor",
      image: "https://m.ubet8866.com/static/media/BTI_bg.25c010bf.svg",
    },
    {
      id: 1201,
      title: "体育博彩",
      title2: "IM体育",
      name: "IM体育",
      category: "Sports Betting",
      color: "blue",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labor",
      image: "https://m.ubet8866.com/static/media/IM-sports_bg.64e96025.svg",
    },
    {
      id: 1211,
      title: "体育博彩",
      title2: "沙巴体育",
      name: "沙巴体育",
      category: "Sports Betting",
      color: "red",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labor",
      image: "https://m.ubet8866.com/static/media/sports_bg.4ca11c53.svg",
    },
  ],
  [
    {
      id: 1204,
      title: "真人娱乐场",
      title2: "AG真人",
      name: "AG真人",
      category: "live Casino",
      color: "green",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labor",
      image: "https://m.ubet8866.com/static/media/AG_bg.110d51c3.svg",
    },
    {
      id: 1209,
      title: "真人娱乐场",
      title2: "EB真人",
      name: "EB真人",
      category: "live Casino",
      color: "blue",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labor",
      image: "https://m.ubet8866.com/static/media/EB_bg.34a1d2b0.svg",
    },
  ],
  [
    {
      id: 1208,
      title: "电子竞技博彩",
      title2: "IM电竞",
      name: "IM电竞",
      category: "E-Sports Betting",
      color: "red",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labor",
      image: "https://m.ubet8866.com/static/media/IM-esports_bg.953ec0c5.svg",
    },
  ],
  [
    {
      id: 1205,
      title: "象棋游戏",
      title2: "开元棋牌",
      name: "开元棋牌",
      category: "Chess Games",
      color: "red",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labor",
      image: "https://m.ubet8866.com/static/media/poker_bg.6269af16.svg",
    },
  ],
  [
    {
      id: 1207,
      title: "老虎机游戏",
      title2: "CQ电子",
      name: "CQ电子",
      category: "Slots Game",
      color: "green",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labor",
      image: "https://m.ubet8866.com/static/media/CQ_bg.9c44ff3d.svg",
    },
    {
      id: 1202,
      title: "老虎机游戏",
      title2: "PT电子",
      name: "PT电子",
      category: "Slots Game",
      color: "red",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labor",
      image: "https://m.ubet8866.com/static/media/PT_bg.3243a900.svg",
    },
    {
      id: 1203,
      title: "老虎机游戏",
      title2: "MG电子",
      name: "MG电子",
      category: "Slots Game",
      color: "blue",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labor",
      image: "https://m.ubet8866.com/static/media/MG_bg.2b8bb41a.svg",
    },
  ],
];

function ContentSA() {
  const history = useHistory();
  const { setUserAuthFN, userAuth } = useContext(User.Context);

  const wd = useWindowDimensions();

  const [tab, setTab] = useState(0);

  const [tsState, setTsState] = useState({
    width: 0,
    offset: 0,
  });

  
  

  useEffect(() => {

    try {
      const _tab = document.querySelector(`a.tab-n${tab}`);
      if (!_tab) {
        return () => {};
      }

      setTab(0);
      const { offsetWidth, offsetLeft } = _tab;

      setTsState({
        width: offsetWidth,
        offset: offsetLeft,
      });
    } catch (e) {
      console.warn(e);
    }

    // eslint-disable-next-line
  }, [wd.width]);

  function _setTab(t, e) {
    const { offsetWidth, offsetLeft } = e.target;

    setTsState({
      width: offsetWidth,
      offset: offsetLeft,
    });
  }

  function handleSetActive(id) {
    // const { offsetWidth, offsetLeft } = id.target;

    // // console.log(e.target.id)
    // setTab(Number(id.target.id));

    // setTsState({
    //   width: offsetWidth,
    //   offset: offsetLeft,
    // });

    const tab = id.split("group-n")[1];
    const link = document.querySelectorAll(".tab")[tab];

    // console.log(tab , link)
    setTab(tab);

    _setTab(tab, {
      target: link,
    });

  }


  function setGame(e, { id, name }) {
    if(!userAuth.data){
      e.preventDefault()
      setUserAuthFN(userAuth.status , userAuth.data , true)
      return false
    }
    history.push({
      pathname: `/game/${id}/${name}`,
      search: "?from_home=1",
    });
  }

  if (wd.width >= 620) {
    return (
      <div className="content-sa">
        <div className="content-sa-items">
          {ContentSAItems.map((group, i) => (
            <React.Fragment key={i}>
              {group.map((item, i2) => (
                <div
                  key={i2}
                  onClick={(e) => setGame(e, item)}
                  className="sa-group--item"
                >
                  <img src={item.image} alt={item.name} />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  // console.log(userAuth)

  return (
    <div className="content-sa">
      <div className={`content-sa-tabs ${!userAuth.data ? 'not':''}`}>
        <div className={`tabs2 tab-n${tab}`}>
          {/* className={`tab${tab === i ? ' active' : ''}`} onClick={e => _setTab(i, e)} */}
          {["体育", "真人", "电竞", "棋牌", "电子"].map((t, i) => (
            <Link
              key={i}
              activeClass=" "
              to={`group-n${i}`}
              className={`tab tab-n${i} ${ Number(tab) === i ? 'active': ''}`}
              spy={true}
              smooth={true}
              duration={200}
              id={i}
              offset={-(+head + 76)}
              // onSetActive={(e) => console.log(e)}
              onSetActive={handleSetActive}
            >
              {t}
            </Link>
          ))}
          <div
            className="tab--switch"
            style={{
              transform: `translateX(${tsState.offset + 3}px)`,
              width: `${tsState.width}px`,
            }}
          ></div>
        </div>
      </div>
      <div className={`content-sa-items ${!userAuth.data ? 'not':''}`}>
        {ContentSAItems.map((group, i) => (
          <div className="content-sa-group" id={`group-n${i}`} key={i}>
            {group.map((item, i2) => (
              <div
                key={i2}
                onClick={(e) => setGame(e, item)}
                className="sa-group--item"
              >
                {/* <Reveal animation="fade" direction={"bottom"} triggerOnce> */}
                <img src={item.image} alt={item.name} />
                {/* </Reveal> */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContentSA;
