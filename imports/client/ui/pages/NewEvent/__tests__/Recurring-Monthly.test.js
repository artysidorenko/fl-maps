import React from 'react'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import Select from 'react-select'
import Monthly from '../FormWizard/DateTimeModule/Recurring/Monthly'

describe('<Monthly />', () => {
  const date = new Date('12/12/2012')
  const expectedOptions = [
    { label: 'Monthly on day 12', value: 'byDayInMonth' },
    { label: 'Monthly on the 2nd Wednesday', value: 'byPosition' }
  ]
  const mountRenderer = (props) =>
    mount(
      <Monthly
        form={{}}
        startingDate={date}
        {...props}
      />
    )

  const wrapper = mountRenderer()

  it('should render', () => {
    expect(wrapper.find(Monthly).exists()).toBe(true)
  })

  it('should render a select input with 2 options based on the "startingDate" value', () => {
    const select = wrapper.find(Select)

    expect(select.props().options).toEqual(expectedOptions)
  })

  it('changing the select input value should update the form with the right value', () => {
    const spy = sinon.spy()
    const wrapper_ = shallow(
      <Monthly
        form={{ change: spy }}
        startingDate={date}
      />
    )

    // TODO: why is input value sometimes a string and sometimes an int?
    wrapper_.find(Select).simulate('change', expectedOptions[0])
    sinon.assert.calledOnce(spy)
    sinon.assert.calledWith(spy, 'when.recurring.monthly', { type: 'byDayInMonth', value: 12 })

    wrapper_.find(Select).simulate('change', expectedOptions[1])
    sinon.assert.calledTwice(spy)
    sinon.assert.calledWith(spy.secondCall, 'when.recurring.monthly', { type: 'byPosition', value: "2" })
  })

  it('has an instance method getOptionsFromDate that presents correct options from date given', () => {
    const f = wrapper.instance().getOptionsFromDate

    expect(f(new Date('08/10/2018'))).toEqual([
      { value: 'byDayInMonth', label: 'Monthly on day 10' },
      { value: 'byPosition', label: 'Monthly on the 2nd Friday' }
    ])

    expect(f(new Date('12/31/2018'))).toEqual([
      { value: 'byDayInMonth', label: 'Monthly on day 31' },
      { value: 'byPosition', label: 'Monthly on the 4th Monday' }
    ])
  })

})
