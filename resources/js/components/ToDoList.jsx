import React, { Component } from "react";
import axios from "axios";
import ToDoItem from "./ToDoItem";
import {Link, Navigate} from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default class ToDoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: "all",
            tasks: [],
            info: {
                "type":"",
                "message":""
            }
        };
        this.onCheckTask = this.onCheckTask.bind(this);
        this.onDeleteTask = this.onDeleteTask.bind(this);
    }
    componentDidMount() {
        this.getTasks();
    }
    changeView = view => {
        this.setState(
            {
                view: view,
            },
            () => this.getTasks()
        );
    }
    updateTask = id => {
        let token = sessionStorage.getItem('token');
        const headers = {
            accept: 'application/json',
            Authorization: 'Bearer ' + token
        }
        axios.put('/api/user/todos/' + id, id, {headers: headers})
            .then(result => {
                let status = result.data.status;
                let message = result.data.message;
                if ( status === 'success' ) {
                    if( this.state.tasks.length ) {
                        const tasks = this.state.tasks.map((task) => {
                            if ( task.id === id ) {
                                return {...task, completed: 1};
                            }
                            return task;
                        });
                        this.setState({
                            tasks: tasks,
                            info: {
                                "type": "success",
                                "message": message
                            }
                        });
                        setTimeout(() => {
                            this.setState({
                                info: {
                                    "type": "",
                                    "message": ""
                                }
                            });
                        }, 2500);
                    }
                }
            });
    }
    deleteTask = id => {
        let token = sessionStorage.getItem('token');
        const headers = {
            accept: 'application/json',
            Authorization: 'Bearer ' + token
        }
        axios.delete('/api/user/todos/' + id, {headers: headers})
            .then(result => {
                let status = result.data.status;
                let message = result.data.message;
                if ( status === 'success' ) {
                    this.setState({
                        info: {
                            "type": "success",
                            "message": message
                        }
                    });
                    setTimeout(() => {
                        this.setState({
                            info: {
                                "type": "",
                                "message": ""
                            }
                        });
                        this.getTasks();
                    }, 2500);

                }
            });
    }
    onCheckTask = id => {
        confirmAlert({
            //title: 'Отметить как выполненное',
            message: 'Вы уверены, что хотите отметить задание как выполненное?',
            buttons: [
                {
                    label: 'Да',
                    onClick: () => this.updateTask(id)
                },
                {
                    label: 'Нет'
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
        });

    };
    onDeleteTask = id => {
        confirmAlert({
            //title: 'Отметить как выполненное',
            message: 'Вы уверены, что хотите удалить задание?',
            buttons: [
                {
                    label: 'Да',
                    onClick: () => this.deleteTask(id)
                },
                {
                    label: 'Нет'
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
        });
    };
    getTasks() {
        let token = sessionStorage.getItem('token');
        const headers = {
            accept: 'application/json',
            Authorization: 'Bearer ' + token
        }
        axios.get("/api/user/todos/" + this.state.view, {headers: headers})
            .then(result => {
                if (result.data.status === "success") {
                    this.setState({
                        tasks: result.data.todos,
                    });
                }
            })
            .catch((error) => console.log("error", error));
    }
    render() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const authId = sessionStorage.getItem('authId');
        if(!isLoggedIn) {
            return <Navigate to="/login" />;
        }
        let tasks = [];
        if( this.state.tasks.length ) {
            tasks = this.state.tasks.map((task) => {
                return (
                    <ToDoItem deleteTask={this.onDeleteTask} checkTask={this.onCheckTask} key={task.id} task={task} auth_id={authId} />
                )
            });
        } else {
            tasks = (
                <li className="list-group-item d-flex justify-content-center my-2">
                    <b style={{ marginRight: "100px" }}>Список задач пуст</b>
                </li>
            );
        }
        let infoMsg = "";
        if( this.state.info.message.length ) {
            infoMsg = (
                <div className={ 'alert alert-' + this.state.info.type }>
                    {this.state.info.message}
                </div>
            );
        }
        return (
            <div className={'container'}>
                <div className={'d-flex justify-content-between align-items-center mt-5'}>
                    <h3 className="text-capitalize">Список задач</h3>
                    <div className={'d-flex flex-row gap-2'}>
                        <div className={'btn-group'}>
                            <button className={'btn btn-sm ' + (this.state.view === 'all' ? 'btn-warning' : 'btn-info')} onClick={ () => this.changeView('all') }>Все</button>
                            <button className={'btn btn-sm ' + (this.state.view === 'from' ? 'btn-warning' : 'btn-info')} onClick={ () => this.changeView('from') }>От меня</button>
                            <button className={'btn btn-sm ' + (this.state.view === 'for' ? 'btn-warning' : 'btn-info')} onClick={ () => this.changeView('for') }>Для меня</button>
                        </div>
                        <Link className={'btn btn-sm btn-success'} to={'/create'}>Создать</Link>
                    </div>
                </div>
                {infoMsg}
                <ul className="list-group mt-3">
                    <ul className={'list-group'}>
                        {tasks}
                    </ul>
                </ul>
            </div>
        );
    }
}
