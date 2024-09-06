import React from 'react'
import 
 { BsJustify}
 from 'react-icons/bs'

function Header({OpenSidebar}) {
  return (
    <header className='header'>
        <div className='menu-icon'>
            <BsJustify className='icon' onClick={OpenSidebar}/>
        </div>
        <div className='header-center'>
            GESTION DES INDEMNITES DES PERSONNELS
        </div>
    </header>
  )
}

export default Header