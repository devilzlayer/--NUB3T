import React from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default () => (
  // toast('🦄 Wow so easy!', {
  //     position: "bottom-center",
  //     autoClose: 2000,
  //     hideProgressBar: true,
  //     closeOnClick: true,
  //     pauseOnHover: false,
  //     draggable: false,
  //     progress: undefined,
  //     });

  <ToastContainer
    position="bottom-center"
    autoClose={2000}
    hideProgressBar
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable={false}
    pauseOnHover={false}
    limit={2}
    closeButton={false}
    style={{ borderRadius: 10 }}
  />
);
