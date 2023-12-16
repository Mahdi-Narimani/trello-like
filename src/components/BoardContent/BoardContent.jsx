import React, { useEffect, useRef, useState } from 'react';
import Column from '../Column/Column';
import { initData } from '../../data/initData';
import { cloneDeep, isEmpty } from 'lodash';
import { mapOrder } from '../../utilities/sorts';
import { applyDrag } from '../../utilities/dragDrop'
import { Container, Draggable } from 'react-smooth-dnd';
import { v4 as uuidv4 } from 'uuid'

import { FaPlus } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";


import './BoardContent.css';

const BoardContent = () =>
{

    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([]);
    const [isShowAddList, setIsShowAddList] = useState
        (false);

    const inputRef = useRef(null);


    useEffect(() =>
    {
        const boardInitData = initData.boards.find(item => item.id === 'b-1');
        if (boardInitData)
        {
            setBoard(boardInitData);

            setColumns(mapOrder(boardInitData.columns, boardInitData.columnOrder, 'id'))
        }

        return () => { }
    }, [])

    if (isEmpty(board))
    {
        return (
            <>
                <div className='not-found'>Board not found</div>
            </>
        )
    }

    const onColumnDrop = (dropResult) =>
    {
        let newColumns = [...columns];
        newColumns = applyDrag(newColumns, dropResult);

        let newBoard = { ...board };
        newBoard.columnOrder = newColumns.map(column => column.id);
        newBoard.columns = newColumns;

        setColumns(newColumns);
        setBoard(newBoard);
    }

    const onTaskDrop = (dropResult, columnId) =>
    {
        if (dropResult.removeIndex !== null || dropResult.addedIndex !== null)
        {

            let newColumns = [...columns];

            let currentColumn = newColumns.find(column => column.id === columnId);
            currentColumn.tasks = applyDrag(currentColumn.tasks, dropResult);
            currentColumn.taskOrder = currentColumn.tasks.map(task => task.id);

            setColumns(newColumns)

        }

    }

    const handlerAddList = () =>
    {
        const valueInput = inputRef.current.value;

        if (!valueInput) return;

        // TODO // update board column
        const _columns = cloneDeep(columns);
        _columns.push({
            id: uuidv4(),
            boardId: board.id,
            title: valueInput,
            tasks: []
        })

        setColumns(_columns);
        inputRef.current.value = null;
        inputRef.current.focus();

    }

    const onUpdateColumn = (newColumn) =>
    {
        const columnIdUpdate = newColumn.id;
        let newCols = [...columns];
        let index = newCols.findIndex(item => item.id === columnIdUpdate);
        if (newColumn._destroy)
        {
            newCols.splice(index, 1)
        }
        else
        {
            newCols[index] = newColumn;
        }
        setColumns(newCols);
    }

    return (
        <>
            <div className="board-columns">
                <Container
                    orientation='horizontal'
                    onDrop={onColumnDrop}
                    getChildPayload={index => columns[index]}
                    dragHandleSelector='.column-drag-handle'
                    // dragClass="column-ghost"
                    // dropClass="column-ghost-drop"
                    dropPlaceholder={{
                        animationDuration: 150,
                        showOnTop: true,
                        className: 'column-drop-preview'
                    }}
                >

                    {
                        columns.map((column, index) =>
                        {
                            return (
                                <Draggable key={column.id}>
                                    <Column

                                        column={column}
                                        onTaskDrop={onTaskDrop}
                                        onUpdateColumn={onUpdateColumn}
                                    />
                                </Draggable>
                            )
                        })
                    }

                </Container>

                {
                    !isShowAddList ?
                        <div className="add-new-column"
                            onClick={() => setIsShowAddList(true)}
                        >

                            <FaPlus className='icon' />
                            Add another Column
                        </div>
                        :
                        <div className="content-add-column">
                            <input
                                ref={inputRef}
                                type="text" className='form-control' placeholder='Enter list title...'
                                autoFocus
                            />
                            <div className='group-btn'>
                                <button className="btn btn-primary"
                                    onClick={handlerAddList}
                                >
                                    Add List
                                </button>
                                <IoMdClose className='close-icon'
                                    onClick={() => setIsShowAddList(false)}
                                />
                            </div>
                        </div>
                }

            </div>
        </>
    )
}

export default BoardContent