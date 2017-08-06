import React from 'react'
import Link from 'gatsby-link'

import styles from './NavMenu.module.scss'

const NavMenu = () => (
  <div className={styles.navMenu}>
    <Link to="/">Index</Link>
    <Link to="/page-2/">Page 2</Link>
    <Link to="/page-3/">Page 3</Link>
    <Link to="/page-4/">Page 4</Link>
  </div>
)

export default NavMenu
