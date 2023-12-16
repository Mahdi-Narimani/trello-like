import React from 'react'
import './Task.css'

const Task = ({ task }) =>
{
    return (
        <div className='task-item'>
            {
                task.image && <img className='task-cover'
                    src={task.image}
                    alt="board image"
                    onMouseDown={e => e.preventDefault()}
                />
            }
            {task.title}
        </div>
    )
}

export default Task