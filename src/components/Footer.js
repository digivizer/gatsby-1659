import React from 'react'

import Logo from './Logo'

import styles from './NavBar.module.scss'

const Footer = () => (
  <div className={styles.footer}>
    <Logo />
    <ul>
      <li>One</li>
      <li>Two</li>
      <li>Three</li>
    </ul>
  </div>
)

export default Footer
