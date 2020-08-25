import React, { useState, useEffect , useContext } from "react";
import Ticker from "react-ticker";

import { Promotions } from "../../service";
import { withAuth } from "../util/";
import {
  SliderSA,
  ContentSA,
  UserSA,
  PromoOverSA,
  TickerOverSA,
} from "../component/";
import { User } from '../../service/';


const Home = ({ location, history }) => {
  const { state } = location;
  const { userAuth } = useContext(User.Context);
  const [promoOver, setPromoOver] = useState(false);
  const [tickerOver, setTickerOver] = useState(false);

  const [ticker, setTicker] = useState({
    text: "",
    news: [],
  });

  useEffect(() => {
    const q = Promotions.getAnnouncements({ num: 1 });

    q.promise.then( (r) => {
        // console.log(r)
        setTicker((t) => ({
          ...t,
          text: r.info.map((n) => n.content).join(" "),
          news: r.info.map((n) => ({ title: n.content, text: n.edit_time })),
        }));
      },
      (e) => {
        if (!e.is_aborted) {
          console.warn(e);
        }
      }
    );

    return () => q.cancel();
  }, []);

  useEffect(() => {
    if (state?.from_login) {
      // setPromoOver(true);
      history.replace();
    }
  }, [history, state]);

  useEffect(() => {

    window.scrollTo(0, 0);
    document.body.classList.add("pwa-home-page");
    return () => document.body.classList.remove("pwa-home-page");

  }, []);


  const onSetTick = () =>{
    if(!userAuth.data){
      history.push('login')
      return false
    }
    setTickerOver(true)

  }


  // console.log(ticker)
  return (
    <>
      <div className="app-sa-head">
        <SliderSA />
        <div className="app-sa-ticker" onClick={onSetTick}>
          {ticker.text ? (
            <Ticker speed={3}>{() => <p>{ticker.text}</p>}</Ticker>
          ) : null}
        </div>
        <UserSA />
      </div>
      <ContentSA />
      {promoOver ? <PromoOverSA onClose={() => setPromoOver(false)} /> : null}
      {tickerOver ? (
        <TickerOverSA onClose={() => setTickerOver(false)} news={ticker.news} />
      ) : null}
    </>
  );
};

// export default Home
export default withAuth(Home,0 );
