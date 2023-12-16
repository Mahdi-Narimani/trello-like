import React from 'react';
import './AppBar.css';

const AppBar = () =>
{
  return (
    <>
      <nav className="navbar-app">
        <div className='logo'>
          <img src='/assets/images/Logo.gif' width={80} alt='trello logo' />
        </div>

        <div className='account'>
          <button className='btn-account'>MN</button>
        </div>
      </nav>
    </>
  )
}

export default AppBar