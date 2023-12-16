import { useEffect, useRef, useState } from 'react';
import Task from '../Task/Task';
import { mapOrder } from '../../utilities/sorts';
import { Container, Draggable } from 'react-smooth-dnd';
import { FaPlus } from "react-icons/fa6";

import { Dropdown } from 'react-bootstrap';
import ConfirmModal from '../UI/ConfirmModal';
import Form from 'react-bootstrap/Form';
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from '../../utilities/constant';
import { v4 as uuidv4 } from 'uuid'


import { IoMdClose } from 'react-icons/io';
import './Column.css';

const Column = ({ column, onTaskDrop, onUpdateColumn }) =>
{
  const tasks = mapOrder(column.tasks, column.taskOrder, 'id');

  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [titleColumn, setTitleColumn] = useState('');
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [valueTextArea, setValueTextArea] = useState('');
  const [isShowAddNewTask, setIsShowAddNewTask] = useState(false);

  const textAreaRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() =>
  {
    if (isShowAddNewTask && textAreaRef)
    {
      textAreaRef.current.focus();
    }
  }, [isShowAddNewTask])


  useEffect(() =>
  {
    if (column && column.title)
    {
      setTitleColumn(column.title);
    }
  }, [column, column.title])

  const toggleModal = () =>
  {
    setIsShowModalDelete(cur => !cur)

  }

  const onModalAction = (type) =>
  {
    if (type === MODAL_ACTION_CLOSE)
    {

    }
    if (type === MODAL_ACTION_CONFIRM)
    {
      const newColumn = {
        ...column,
        _destroy: true
      }
      onUpdateColumn(newColumn)
    }
  }

  const selectAllText = e =>
  {
    setIsFirstClick(false);
    if (isFirstClick)
    {
      // e.target.focus();
      e.target.select();
    } else
    {
      inputRef.current.setSelectionRange(titleColumn.length, titleColumn.length);
    }
  }

  const handleTitleChange = (e) =>
  {
    setTitleColumn(e.target.value);
  }

  const handleClickOutside = () =>
  {
    setIsFirstClick(true);
    const newColumn = {
      ...column,
      title: titleColumn,
      _destroy: false
    }
    onUpdateColumn(newColumn)
  }

  const handleAddNewTask = () =>
  {
    if (!valueTextArea)
    {
      textAreaRef.current.focus();
      return;
    }
    const newTask = {
      id: uuidv4(),
      boardId: column.boardId,
      columnId: column.id,
      title: valueTextArea,
      image: null
    }

    let newColumn = { ...column };
    newColumn.tasks = [...newColumn.tasks, newTask];
    newColumn.taskOrder = newColumn.tasks.map(task => task.id);

    onUpdateColumn(newColumn);
    setValueTextArea('');
    setIsShowAddNewTask(false);

  }

  return (
    <>
      <div className="column">
        <header className='column-drag-handle'>
          <div className="column-title">
            <Form.Control
              ref={inputRef}
              size='sm'
              type='text'
              value={titleColumn}
              className='customize-input-column'
              onClick={selectAllText}
              onChange={handleTitleChange}
              onBlur={handleClickOutside}
              onMouseDown={e => e.preventDefault()}
            />
          </div>

          <div className="column-dorpdown">
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic"
                variant=''
                size='sm'>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#">Add task...</Dropdown.Item>
                <Dropdown.Item onClick={toggleModal}>Remove this column...</Dropdown.Item>
                <Dropdown.Item href="#">Something else</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </header>

        <ul className='task-list'>
          <Container
            groupName="col"
            onDrop={(dropResult) => onTaskDrop(dropResult, column.id)}
            getChildPayload={index =>
              tasks[index]
            }
            dragClass="task-ghost"
            dropClass="task-ghost-drop"

            dropPlaceholder={{
              animationDuration: 150,
              showOnTop: true,
              className: 'task-drop-preview'
            }}
            dropPlaceholderAnimationDuration={200}
          >
            {tasks && tasks.map((task, index) =>
              <Draggable key={task.id}>
                <Task
                  key={task.id}
                  task={task}
                />
              </Draggable>
            )}
          </Container>

          {
            isShowAddNewTask && <div className="add-new-task">
              <textarea
                ref={textAreaRef}
                rows='2'
                value={valueTextArea}
                onChange={e => setValueTextArea(e.target.value)}
                className='form-control w-100'
                placeholder='Enter a title for this task...'
                autoFocus
              ></textarea>
              <div className='group-btn'>
                <button className="btn btn-primary"
                  onClick={handleAddNewTask}
                >
                  Add Task
                </button>
                <IoMdClose className='close-icon'
                  onClick={() => setIsShowAddNewTask(false)}
                />
              </div>
            </div>
          }

        </ul>

        {
          !isShowAddNewTask && <footer>
            <div className="footer-action" onClick={() => setIsShowAddNewTask(true)}>
              <FaPlus className='icon' />
              Add a task
            </div>
          </footer>
        }
      </div>

      <ConfirmModal
        show={isShowModalDelete}
        title='Remove a Column'
        content={`Are you sure to remove this column: <b>${column.title}</b>`}
        onAction={onModalAction}
      />
    </>


  )
}

export default Column