import React, { Component, PropTypes } from 'react'
import styles from  './Header.scss'

export default class Header extends Component {
  render() {
    return (
      <div>
        <div className={ styles.background } />
        <h1 className={ styles.header } >
          { this.props.title }
        </h1>
      </div>
    )
  }
}

Header.propTypes = {
  title: PropTypes.string.isRequired
}
