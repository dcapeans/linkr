import { BrowserRouter, Route, Switch } from "react-router-dom";
import SignUp from "./components/sign-up/SignUp";
import LogIn from "./components/sign-up/LogIn";
import Timeline from "./components/timeline/Timeline";
import MyPosts from "./components/myPosts/MyPosts";
import UserPosts from "./components/userPosts/UserPosts";
import LikedPosts from "./components/likedPosts/LikedPosts";
import GlobalStyle from "./styles/GlobalStyles";
import UserContext from "./components/UserContext";
import { useState } from "react";
import Hashtag from "./components/hashtag/Hashtag";

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <GlobalStyle />

      <Switch>
        <UserContext.Provider value={{ user, setUser }}>
          <Route path="/" exact component={LogIn}></Route>
          <Route path="/sign-up" exact component={SignUp}></Route>
          <Route path="/timeline" exact component={Timeline}></Route>
          <Route path="/my-posts" exact component={MyPosts}></Route>
          <Route path="/my-likes" exact component={LikedPosts}></Route>
          <Route path="/hashtags/:hashtag" exact component={Hashtag}></Route>

          <Route path="/user/:id" exact component={UserPosts}></Route>
        </UserContext.Provider>
      </Switch>
    </BrowserRouter>
  );
}
