import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Blog from "./Components/Blog";
import FullBlogPost from "./Components/FullBlogPost";
import Users from "./Components/Users";
import CreateBlogPost from "./Components/CreateBlogPost";
import Settings from "./Components/Settings";
import Auth from "./Components/Auth";
import Friends from "./Components/Friends";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectSearchValue } from "./features/appSlice";
import { selectUser } from "./features/userSlice";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { onSnapshot, doc } from "firebase/firestore";
import { setUser, setUserInfo } from "./features/userSlice";

function App() {
  const [showUsers, setShowUsers] = useState(false);
  const inputValue = useSelector(selectSearchValue);
  const user = JSON.parse(useSelector(selectUser));
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    if (inputValue.length === 0) {
      setShowUsers(false);
    } else {
      setShowUsers(true);
    }
  }, [inputValue])

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(JSON.stringify(user)))
        onSnapshot(doc(db, "users", user?.uid), snapshot => {
          dispatch(setUserInfo(JSON.stringify(snapshot.data())))
        })
        setIsLoading(false);
      } else {
        dispatch(setUser(null))
        setIsLoading(false);
      }
    })
  }, [])

  return (
    <div className="app">
      { !isLoading && (
        <>


          {
            !user ? (
              <Auth />
            ) : (
              <Router>
                <Switch>
                  <Route path="/friends">
                    <Friends />
                  </Route>
                  <Route path="/settings">
                    <Settings />
                  </Route>
                  <Route path="/createBlogPost">
                    <CreateBlogPost />
                  </Route>
                  <Route path="/blog/:userId/blogPost/:number"> 
                    <FullBlogPost />
                  </Route>
                  <Route path="/blogPost/:id">
                    <FullBlogPost isMe={true} />
                  </Route>
                  <Route path="/blog/:userId">
                    <Blog />
                  </Route>
                  <Route path="/blog">
                    <Blog isMe={true}/>
                  </Route>
                  <Route path="/user/:id">
                    <Navbar />
                    {
                      showUsers ? <Users /> : <Home isMe={false} /> 
                    }
                  </Route>
                  <Route path="/">
                    <Navbar />
                    {
                      showUsers ? <Users /> : <Home isMe={true} /> 
                    }
                  </Route>
                </Switch>
              </Router>
            )  
          }
        </>
        ) 
      }
    </div>
  );
}

export default App;
