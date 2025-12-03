import React from "react"
import Approuter from "./pagesrouter/Approuter"
import { store } from "./redux/Store";
import { Provider } from "react-redux";
function App() {

  return (
    <>


    <Provider store={store}>

    <Approuter/>
    </Provider>

    </>
  )
}

export default App
