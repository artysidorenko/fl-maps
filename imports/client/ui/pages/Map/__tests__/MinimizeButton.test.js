import React from 'react'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import MinimizeButton from '../EventsList/MinimizeButton'
import { Button } from 'reactstrap'

describe('<MinimizeButton />', () => {
  const shallowRender = (props) =>
    shallow(
      <MinimizeButton
        {...props}
      />
    )
  
  const fullRender = (props) =>
    mount(
      <MinimizeButton
        {...props}
      />
    )

  const component = shallowRender()

  it('should render a button with id "minimize"', () => {
    expect(component.find(Button)).toHaveLength(1)
    expect(component.props().id).toEqual('minimize')
  })

  it('should render with initial state with minimized = false', () => {
    expect(component.state()).toEqual({ minimized: false })
  })

  it('should change state to minimized = true on button click', () => {
    const component_ = fullRender()
    component_.simulate('click')
    expect(component_.state()).toEqual({ minimized: true })
  })
})
