import React, { Component } from "react";
import axios from "axios";
import {Link} from "react-router-dom";

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: null,
        };
    }
    checkLogged = () => {
        let isLoggedIn = sessionStorage.getItem("isLoggedIn");
        this.setState({ isLoggedIn: isLoggedIn });
    };
    logout = () => {
        let token = sessionStorage.getItem('token');
        const headers = {
            accept: 'application/json',
            Authorization: 'Bearer ' + token
        }
        axios.get("/api/user/logout", {headers: headers})
            .then(result => {
                if ( result.data.status === "success") {
                    window.location.reload();
                    sessionStorage.clear();
                    let temp = window.location.origin;
                    window.location.href = temp + "/login";
                }
            })
            .catch((error) => console.log("error", error));
    };
    componentDidMount() {
        this.checkLogged();
    }
    render() {
        const { isLoggedIn } = this.state;
        let profile = "";
        if (isLoggedIn === "true") {
            profile = (
                <button onClick={this.logout} className={'btn btn-sm btn-danger'}>
                    ВЫХОД
                </button>
            );
        } else {
            profile = (
                <Link className={'btn btn-sm btn-success'} to={'/login'}>ВХОД</Link>
            );
        }
        return (
            <nav className="navbar navbar-dark navbar-expand-lg sticky-top bg-warning">
                <div className="container d-flex justify-content-between">
                    <Link className={'navbar-brand fw-bold'} to={'/'}>GoldenTODO</Link>
                    {profile}
                </div>
            </nav>
        );
    }
}
