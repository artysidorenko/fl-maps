import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import AttendingButton from '../AttendingButton'

describe('<AttendingButton />', () => {
  const shallowRenerer = (props) => shallow(
    <AttendingButton
      _id='test'
      history={{
        push: jest.fn()
      }}
      isLoggedIn={false}
      user={null}
      {...props}
    />
  )

  it('should redirect to login when user is not logged in', () => {
    const wrapper_ = shallowRenerer()
    const spy = sinon.spy(wrapper_.instance().props.history, 'push')

    console.log(sessionStorage)
    wrapper_.instance().redirectToLogin()

    console.log(spy.args)
    console.log(sessionStorage)
    expect(sessionStorage.setItem).toHaveBeenLastCalledWith('redirect', '/page/test');
    expect(sessionStorage.__STORE__['redirect']).toBe('/page/test');
    expect(spy.args[0][0]).toEqual('/sign-in')
  })
})
