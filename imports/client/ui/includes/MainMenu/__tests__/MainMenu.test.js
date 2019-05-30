import React from 'react'
import { shallow, mount, render } from 'enzyme'
import sinon from 'sinon'
import { NavLink as RouterNavLink, MemoryRouter as Router } from 'react-router-dom'
import { Button } from 'reactstrap'
import { MainMenu } from '../index'
import Sidebar from '../Sidebar'
import Logo from '../Logo'
import i18n from '/imports/both/i18n/en'

describe('<MainMenu />', () => {
  const mainMenuRender = (props) => mount(
    <Router>
      <MainMenu />
    </Router>
  )

  const wrapper = mainMenuRender()

  it('should render a menu wrapper', () => {
    expect(wrapper.find(MainMenu).exists()).toBe(true)
  })

  it('should render an add-event button from i18n file', () => {
    const addEventButton = wrapper.find('#add-event').hostNodes()
    expect(addEventButton).toHaveLength(1)
    expect(addEventButton.find(RouterNavLink).props().to).toEqual('?new=1')
    expect(addEventButton.find(Button).children().text()).toEqual(i18n.MainMenu.addEvent)
  })

  it('should render an additional sidebar upon user toggling', () => {
    const toggle = wrapper.find(MainMenu).instance().toggleSidebar

    expect(wrapper.find(Sidebar).props()).toEqual({
      isOpen: false,
      i18nFile: i18n.MainMenu,
      toggle,
      user: undefined
    })
  })

  it('should initialize with state "sidebarOpen" set to false', () => {
    expect(wrapper.find(MainMenu).state().sidebarOpen).toEqual(false)
  })

  it('renders a burger icon that toggles "sidebarOpen" state', () => {
    const toggleButton = wrapper.find('#sidebar-toggle').first()
    toggleButton.simulate('click')
    expect(wrapper.find(MainMenu).state().sidebarOpen).toEqual(true)
  })

  it('sets sidebar prop isOpen to true upon state change', () => {
    const sidebar = wrapper.find('Sidebar')
    expect(sidebar.props().isOpen).toEqual(true)
  })

  it('renders burger icon that toggles sidebar (same as two previous tests combined)', () => {
    const wrapper_ = mainMenuRender()
    const toggleButton = wrapper_.find('#sidebar-toggle').first()
    toggleButton.simulate('click')
    expect(wrapper_.find('Sidebar').props().isOpen).toEqual(true)
  })

  it('should render a logo component', () => {
    expect(wrapper.find(Logo).exists()).toBe(true)
  })
})
