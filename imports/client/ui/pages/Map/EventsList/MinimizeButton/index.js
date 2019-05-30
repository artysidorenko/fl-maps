import React from 'react'
import { Button } from 'reactstrap'
import './styles.scss'

export default class MinimizeButton extends React.Component {
  constructor() {
    super()
    this.state = {
      minimized: false
    }
  }

  toggleMinimize = () => {
    this.setState({ minimized: !this.state.minimized })
    const container = document.body.querySelector('#map-container')
    if (container) container.classList.toggle('minimized')
  }

  render() {
    const { minimized } = this.state
    return (
      <Button
        id='minimize'
        className={minimized ? 'minimized' : ''}
        onClick={this.toggleMinimize}
      >
        {minimized ? 'maximize' : 'minimize'}
      </Button>
    )
  }
}
