import React from "react";

const ToDoItem = (props) => {
    const { task, auth_id, checkTask, deleteTask } = props;
    let checkButton = "";
    let className = 'list-group-item-light';
    let deleteButton = "";
    //console.log(task.user_id + ' ' + auth_id);
    if ( parseInt(task.user_id) === parseInt(auth_id) ) {
        if ( !task.completed ) {
            checkButton = (
                <button className={'btn btn-warning btn-sm'} onClick={event => checkTask(task.id)}>ОТМЕТИТЬ</button>
            );
        } else {
            className = 'list-group-item-success';
        }

    }
    if ( parseInt(task.author_id) === parseInt(auth_id) ) {
        deleteButton = (
            <button className={'btn btn-danger btn-sm'} onClick={event => deleteTask(task.id)}>УДАЛИТЬ</button>
        );
    }
    return (
        <li className={'list-group-item ' + className }>
            <div className={'row'}>
                <div className={'col-md-3 d-flex align-items-center'}>
                    <span className={'fw-bold'}>{task.title}</span>
                </div>
                <div className={'col-md-6 d-flex align-items-center'}>
                    {task.description.substring(0, 100)}
                </div>
                <div className={'col-md-3'}>
                    <div className="d-flex flex-row gap-2 justify-content-end align-items-center">
                        {checkButton}
                        {deleteButton}
                    </div>
                </div>
            </div>
        </li>
    );
};

export default ToDoItem;
