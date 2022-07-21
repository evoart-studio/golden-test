import React, { Component } from 'react';
import axios from "axios";
import {Link, Navigate} from "react-router-dom";

export default class Registration extends Component {
    state = {
        signupData: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            password_confirmation: "",
        },
        errMsgFirstName: "",
        errMsgLastName: "",
        errMsgEmail: "",
        errMsgPassword: "",
        errMsgPasswordConfirmation: "",
        successMsg: "",
        error: false,
    };
    onChangeHandler = (e, key) => {
        const { signupData } = this.state;
        signupData[e.target.name] = e.target.value;
        this.setState({ signupData });
    };
    onSubmitHandler = (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append("first_name", this.state.signupData.first_name);
        formdata.append("last_name", this.state.signupData.last_name);
        formdata.append("email", this.state.signupData.email);
        formdata.append("password", this.state.signupData.password);
        formdata.append("password_confirmation", this.state.signupData.password_confirmation);
        axios.post('/api/user/register', formdata)
            .then(result => {
                if (result.data.status === "success") {
                    this.setState({
                        signupData: {
                            first_name: "",
                            last_name: "",
                            password: "",
                            password_confirmation: "",
                            email: ""
                        },
                        errMsgFirstName: "",
                        errMsgLastName: "",
                        errMsgEmail: "",
                        errMsgPassword: "",
                        errMsgPasswordConfirmation: "",
                        error: false,
                    });
                }
                setTimeout(() => {
                    this.setState({ successMsg: result.data.message });
                }, 1000);
                if ( result.data.status === 'error' ) {
                    this.setState({
                        error: true
                    });
                    if (result.data.validation_errors.first_name) {
                        this.setState({
                            errMsgFirstName: result.data.validation_errors.first_name[0],
                        });
                    }
                    if (result.data.validation_errors.last_name) {
                        this.setState({
                            errMsgLastName: result.data.validation_errors.last_name[0],
                        });
                    }
                    if (result.data.validation_errors.email) {
                        this.setState({
                            errMsgEmail: result.data.validation_errors.email[0],
                        });
                    }
                    if (result.data.validation_errors.password) {
                        this.setState({
                            errMsgPassword: result.data.validation_errors.password[0],
                        });
                    }
                    if (result.data.validation_errors.password_confirmation) {
                        this.setState({
                            errMsgPasswordConfirmation: result.data.validation_errors.password_confirmation[0],
                        });
                    }
                }
            });
    };
    render() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if(isLoggedIn) {
            return <Navigate to="/" />;
        }
        if( this.state.successMsg.length > 0 ) {
            return (
                <div className={'container mt-5'}>
                    <div className={'row g-3 needs-validation'}>
                        <div className={'col-12 text-success fw-bold text-center'}>
                            {this.state.successMsg}
                        </div>
                        <div className={'col-12 text-info fw-bold text-center'}>
                            <Link className={'text-decoration-none text-info'} to={'/'}>На главную</Link>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={'container mt-5'}>
                    <div className={'row g-3 needs-validation'}>
                        <div className={'col-12 d-flex justify-content-center'}>
                            <p className={'fw-bold text-info'}>
                                Уже есть аккаунт? <Link className={'text-decoration-none text-info'} to={'/login'}>Войдите</Link>
                            </p>
                        </div>
                        <div className={'col-md-6'}>
                            <div className={'form-group'}>
                                <label htmlFor="first_name" className={"form-label"}>Имя</label>
                                <input name="first_name" type="text" className={"form-control" + ( this.state.errMsgFirstName.length > 0 ? ' is-invalid' : '' ) } id="first_name" onChange={this.onChangeHandler} value={this.state.signupData.first_name} required />
                                <div className={'invalid-feedback'}>{this.state.errMsgFirstName}</div>
                            </div>
                        </div>
                        <div className={'col-md-6'}>
                            <div className={'form-group'}>
                                <label htmlFor="last_name" className={"form-label"}>Фамилия</label>
                                <input name="last_name" type="text" className={"form-control" + ( this.state.errMsgLastName.length > 0 ? ' is-invalid' : '' ) } id="last_name" onChange={this.onChangeHandler} value={this.state.signupData.last_name} required />
                                <div className={'invalid-feedback'}>{this.state.errMsgLastName }</div>
                            </div>
                        </div>
                        <div className={'col-12'}>
                            <div className={'form-group'}>
                                <label htmlFor="email" className={"form-label"}>Email</label>
                                <input name="email" type="text" className={"form-control" + ( this.state.errMsgEmail.length > 0 ? ' is-invalid' : '' ) } id="email" onChange={this.onChangeHandler} value={this.state.signupData.email} required />
                                <div className={'invalid-feedback'}>{this.state.errMsgEmail }</div>
                            </div>
                        </div>
                        <div className={'col-md-6'}>
                            <div className={'form-group'}>
                                <label htmlFor="password" className={"form-label"}>Пароль</label>
                                <input name="password" type="password" className={"form-control" + ( this.state.errMsgPassword.length > 0 ? ' is-invalid' : '' ) } id="password" onChange={this.onChangeHandler} value={this.state.signupData.password} required />
                                <div className={'invalid-feedback'}>{this.state.errMsgPassword }</div>
                            </div>
                        </div>
                        <div className={'col-md-6'}>
                            <div className={'form-group'}>
                                <label htmlFor="password_confirmation" className={"form-label"}>Подтверждение</label>
                                <input name="password_confirmation" type="password" className={"form-control" + ( this.state.errMsgPasswordConfirmation.length > 0 ? ' is-invalid' : '' ) } id="password_confirmation" onChange={this.onChangeHandler} value={this.state.signupData.password_confirmation} required />
                                <div className={'invalid-feedback'}>{this.state.errMsgPasswordConfirmation }</div>
                            </div>
                        </div>
                        <div className={'col-12 d-flex justify-content-center'}>
                            <button onClick={this.onSubmitHandler} className={'btn btn-success'}>
                                Регистрация
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
