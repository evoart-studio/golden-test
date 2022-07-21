import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import 'bootstrap';

import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom";

import Header from "./components/Header";
import Login from "./components/Login";
import Registration from "./components/Registration";
import ToDoList from "./components/ToDoList";
import Create from "./components/Create";

export default class App extends Component {
    render() {
        return (
            <Router>
                <Header />
                <Routes>
                    <Route path='/' element={ <ToDoList /> } />
                    <Route path='/register' element={ <Registration /> } />
                    <Route path='/login' element={ <Login /> } />
                    <Route path='/create' element={ <Create /> } />
                </Routes>

            </Router>
        );
    }
}

ReactDOM.render(
    <App />, document.getElementById("root")
);
