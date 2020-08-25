import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import { useWindowDimensions } from "../util/";
import AppPWA from "../pwa/AppPWA";

import { Nav, Footer, LiveChat } from "../component/";
import * as Routes from "./";

import { User } from "../service/";

import "../assets/scss/App.scss";

function PageFrame(props) {
  const [popup, setPopup] = useState(false);
  const refOut = useRef(null);

  const Component = props.component;

  const popUpCSR = (event) => {
    setPopup(!popup);
  };

  return (
    <>
      <Nav />
      <Component onPop={popUpCSR} />
      <LiveChat popup={popup} onPop={popUpCSR} />
      <Footer />
    </>
  );
}

function App() {
  const [userAuth, setUserAuth] = useState({
    status: 0,
    data: {},
    modal: false,
  });

  const setUserAuthFN = (status, data, modal) =>
    setUserAuth({ status, data, modal });

  const windowDimensions = useWindowDimensions();
  return (
    <User.Context.Provider value={{ userAuth, setUserAuthFN }}>
      {windowDimensions.width > 1200 ? (
        <div className="app">
          <BrowserRouter>
            <Switch>
              <Redirect from="/inbox" to="/profile/inbox" />
              <Route
                exact
                path="/"
                render={() => <PageFrame component={Routes.Home} />}
              />
              <Route
                exact
                path="/about"
                render={() => <PageFrame component={Routes.About} />}
              />
              <Route
                exact
                path="/inbox"
                render={() => <PageFrame component={Routes.Inbox} />}
              />
              <Route
                exact
                path="/promotions"
                render={() => <PageFrame component={Routes.Promotions} />}
              />
              <Route
                exact
                path="/promotion/:id"
                render={() => <PageFrame component={Routes.Promotion} />}
              />
              <Route
                exact
                path="/applications"
                render={() => <PageFrame component={Routes.Applications} />}
              />
              <Route
                exact
                path="/game/:id/:name"
                render={() => <PageFrame component={Routes.Game} />}
              />
              <Route
                exact
                path="/dashboard/:tab"
                render={() => <PageFrame component={Routes.Dashboard} />}
              />

              <Route
                path="/profile"
                render={() => <PageFrame component={Routes.Profile} />}
              />

              <Route exact path="/vip" render={() => <PageFrame component={Routes.Vip} />} />



              <Route exact path="/login" component={Routes.Login} />
              <Route exact path="/restore" component={Routes.Restore} />

              <Redirect to="/" />
            </Switch>
          </BrowserRouter>
        </div>
      ) : (
        <AppPWA />
      )}
    </User.Context.Provider>
  );
}

export default App;
