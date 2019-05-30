import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import SearchButtons from '../SearchButtons'
import { Button } from 'reactstrap'

describe('<SearchButtons />', () => {
  const shallowRender = (props) =>
    shallow(
      <SearchButtons
        {...props}
      />
    )

  const component = shallowRender({ toggleFilters: () => { }, togglePastEvents: () => { } })

  it('should render 2 buttons in total (filter + search)', () => {
    expect(component.find(Button)).toHaveLength(2)
    expect(component.find('.filterToggle')).toHaveLength(1)
    expect(component.find('.pastToggle')).toHaveLength(1)
  })

  it('should call toggleFilters on filters button click', () => {
    const spy = sinon.spy()
    const component_ = shallowRender({ toggleFilters: spy, togglePastEvents: () => { } })

    component_.find('.filterToggle').at(0).simulate('click')
    expect(spy.calledOnce).toBe(true)
  })

  it('should call togglePastEvents on past button click', () => {
    const spy = sinon.spy()
    const component_ = shallowRender({ toggleFilters: () => { }, togglePastEvents: spy })

    component_.find('.pastToggle').at(0).simulate('click')
    expect(spy.calledOnce).toBe(true)
  })
})
