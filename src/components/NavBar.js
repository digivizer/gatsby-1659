import React from 'react'

import Logo from './Logo'
import NavMenu from './NavMenu'

import styles from './NavBar.module.scss'

const NavBar = () => (
  <div className={styles.navBar}>
    <Logo />
    <NavMenu />
  </div>
)

export default NavBar
