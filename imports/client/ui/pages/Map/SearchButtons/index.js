import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'
import './styles.scss'

class SearchButtons extends Component {
  render () {
    return (
      <div className='buttons'>
        <Button
          className='filterToggle'
          onClick={this.props.toggleFilters}
        >
          <i className='fa fa-filter' />
          Filter
        </Button>
        <Button
          className='pastToggle'
          onClick={this.props.togglePastEvents}
        >
          {this.props.showPastEvents ? 'Hide Past' : 'Show Past'}
        </Button>
      </div>
    )
  }
}

SearchButtons.propTypes = {
  toggleFilters: PropTypes.func.isRequired,
  togglePastEvents: PropTypes.func.isRequired
}

export default SearchButtons
