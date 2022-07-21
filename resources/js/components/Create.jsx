import React, { Component } from 'react';
import axios from "axios";
import {Link, Navigate} from "react-router-dom";

export default class Create extends Component {
    state = {
        createData: {
            title: "",
            description: "",
            user_id: ""
        },
        errMsgTitle: "",
        errMsgDescription: "",
        errMsgUserId: "",
        successMsg: "",
        error: false,
        users:"",
    };
    onChangeHandler = (e, key) => {
        const { createData } = this.state;
        createData[e.target.name] = e.target.value;
        this.setState({ createData });
    };
    onSubmitHandler = (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append("title", this.state.createData.title);
        formdata.append("description", this.state.createData.description);
        formdata.append("user_id", this.state.createData.user_id);
        let token = sessionStorage.getItem('token');
        const headers = {
            accept: 'application/json',
            Authorization: 'Bearer ' + token
        }
        axios.post('/api/user/todos', formdata, {headers: headers})
            .then(result => {
                if (result.data.status === "success") {
                    this.setState({
                        createData: {
                            title: "",
                            description: "",
                            user_id: "",
                        },
                        errMsgTitle: "",
                        errMsgDescription: "",
                        successMsg:result.data.message,
                        errMsgUserId: "",
                        error: false,
                    });
                }

                if ( result.data.status === 'error' ) {
                    this.setState({
                        error: true
                    });
                    if (result.data.validation_errors.title) {
                        this.setState({
                            errMsgTitle: result.data.validation_errors.title[0],
                        });
                    }
                    if (result.data.validation_errors.description) {
                        this.setState({
                            errMsgDescription: result.data.validation_errors.description[0],
                        });
                    }
                    if (result.data.validation_errors.user_id) {
                        this.setState({
                            errMsgUserId: result.data.validation_errors.user_id[0],
                        });
                    }
                }
            });
    };
    componentDidMount() {
        let token = sessionStorage.getItem('token');
        const headers = {
            accept: 'application/json',
            Authorization: 'Bearer ' + token
        }
        axios.get("/api/user/users", {headers: headers})
            .then(result => {
                if ( result.data.status === "success") {
                    this.setState({
                        users: result.data.users
                    });
                }
            })
            .catch((error) => console.log("error", error));
    }
    render() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if( isLoggedIn === null ) {
            return <Navigate to="/" />;
        }
        let optionTemplate = [];
        if( this.state.users.length > 0 ) {
            optionTemplate = this.state.users.map(user => (
                <option value={user.id}>{user.first_name + ' ' + user.last_name }</option>
            ));
        }
        if( this.state.successMsg.length > 0 ) {
            return (
                <div className={'container mt-5'}>
                    <div className={'row g-3'}>
                        <div className={'col-12 text-success fw-bold text-center'}>
                            {this.state.successMsg}
                        </div>
                        <div className={'col-6 text-end'}>
                            <Link className={'btn btn-info btn-sm'} to={'/'}>На главную</Link>
                        </div>
                        <div className={'col-6 text-start'}>
                           <button onClick={() =>  window.location.reload() } className={'btn btn-success btn-sm'}>
                               Добавить еще
                           </button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={'container mt-5'}>
                    <div className={'row g-3 needs-validation'}>
                        <div className={'col-md-8'}>
                            <div className={'form-group'}>
                                <label htmlFor="title" className={"form-label"}>Задание</label>
                                <input name="title" type="text" className={"form-control" + ( this.state.errMsgTitle.length > 0 ? ' is-invalid' : '' ) } id="title" onChange={this.onChangeHandler} value={this.state.createData.title} required />
                                <div className={'invalid-feedback'}>{this.state.errMsgTitle}</div>
                            </div>
                        </div>
                        <div className={'col-md-4'}>
                            <div className={'form-group'}>
                                <label htmlFor="user_id" className={"form-label"}>Пользователю</label>
                                <select value={this.state.createData.user_id} onChange={this.onChangeHandler} name="user_id" className={"form-control" + ( this.state.errMsgUserId.length > 0 ? ' is-invalid' : '' ) }>
                                    <option selected>Выберите</option>
                                    {optionTemplate}
                                </select>
                            </div>
                        </div>
                        <div className={'col-12'}>
                            <div className={'form-group'}>
                                <label htmlFor="description" className={"form-label"}>Описание</label>
                                <textarea rows="8" name="description" className={"form-control" + ( this.state.errMsgDescription.length > 0 ? ' is-invalid' : '' ) } id="description" onChange={this.onChangeHandler}>
                                    {this.state.createData.description}
                                </textarea>
                                <div className={'invalid-feedback'}>{this.state.errMsgDescription}</div>
                            </div>
                        </div>
                        <div className={'col-12 d-flex justify-content-center'}>
                            <button onClick={this.onSubmitHandler} className={'btn btn-success'}>
                                Добавить
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

    }
}
