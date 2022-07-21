import React, { Component } from "react";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";

export default class Login extends Component {
    state = {
        loginData:{
            email: "",
            password: "",
        },
        errMsgEmail:'',
        errMsgPassword:'',
        redirect:false,
        errMsg:'',
        accessToken: "",
        error:false
    };
    onChangeHandler = (e) => {
        const {loginData} = this.state;
        loginData[e.target.name] = e.target.value;
        this.setState({loginData});
    }
    onSubmitHandler = () => {
        const formdata = new FormData();
        formdata.append("email", this.state.loginData.email);
        formdata.append("password", this.state.loginData.password);

        axios.post('/api/user/login', formdata)
            .then(result => {
                if(result.data.status === 'success'){
                    this.setState({
                        accessToken:result.data.token
                    });
                    sessionStorage.setItem('token', this.state.accessToken);
                    sessionStorage.setItem('authId', result.data.user_id);
                    sessionStorage.setItem('isLoggedIn', true);
                }
                if(result.data.status === 'failed'){
                    this.setState({
                        errMsg:result.data.message
                    })
                }
                if(result.data.status === "error" && result.data.validation_errors.email){
                    this.setState({
                        error:true,
                        errMsgEmail:result.data.validation_errors.email[0],
                    })
                }
                if(result.data.status === "error" && result.data.validation_errors.password){
                    this.setState({
                        error:true,
                        errMsgPassword:result.data.validation_errors.password[0]
                    })
                }
                if(result.data.error === false){
                    this.setState({ redirect:true });
                    window.location.reload();
                }
            })
            .catch((error) => console.log("error", error));
    };

    render() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (this.state.redirect ) {
            return <Navigate to="/" />;
        }
        if(isLoggedIn) {
            return <Navigate to="/" />;
        }
        let message = "";
        if( this.state.errMsg.length > 0 ) {
            message = (
                <div className={'alert alert-danger'}>
                    {this.state.errMsg}
                </div>
            )
        }

        return (
            <div className={'container mt-5'}>
                {message}
                <div className={'row g-3 needs-validation '}>
                    <div className={'col-12 d-flex justify-content-center'}>
                        <p className={'fw-bold text-info'}>
                            Еще нет аккаунта? <Link className={'text-decoration-none text-info'} to={'/register'}>Зарегистрируйтесь</Link>
                        </p>
                    </div>
                    <div className={'col-12'}>
                        <div className={'form-group'}>
                            <label htmlFor="email" className={"form-label"}>Email</label>
                            <input name="email" type="text" className={"form-control" + ( this.state.errMsgEmail.length > 0 ? ' is-invalid' : '' ) } id="email" onChange={this.onChangeHandler} value={this.state.loginData.email} required />
                            <div className={'invalid-feedback'}>{this.state.errMsgEmail }</div>
                        </div>
                    </div>
                    <div className={'col-12'}>
                        <div className={'form-group'}>
                            <label htmlFor="password" className={"form-label"}>Пароль</label>
                            <input name="password" type="password" className={"form-control" + ( this.state.errMsgPassword.length > 0 ? ' is-invalid' : '' ) } id="password" onChange={this.onChangeHandler} value={this.state.loginData.password} required />
                            <div className={'invalid-feedback'}>{this.state.errMsgPassword }</div>
                        </div>
                    </div>

                    <div className={'col-12 d-flex justify-content-center'}>
                        <button onClick={this.onSubmitHandler} className={'btn btn-success'}>
                            Вход
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
