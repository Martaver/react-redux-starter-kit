import React from 'react'
import { IndexLink, Link } from 'react-router'
import styles from './Header.scss'

export const Header = () => (
  <div>
    <h1>React Redux Starter Kit</h1>
    <IndexLink to='/' activeClassName={styles.routeActive}>
      Home
    </IndexLink>
    {' · '}
    <Link to='/counter' activeClassName={styles.routeActive}>
      Counter
    </Link>
  </div>
)

export default Header
