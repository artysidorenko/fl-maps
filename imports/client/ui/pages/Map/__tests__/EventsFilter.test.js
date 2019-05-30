import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import EventsFilter from '../EventsFilter'
import { ListGroup, ListGroupItem, CustomInput } from 'reactstrap'
import categoryTree from '/imports/both/i18n/en/categories.json'
import i18n from '/imports/both/i18n/en'

// squash parents and children into 1 array of all possible categories
let categories = categoryTree.reduce((tot, elem) => {
  return tot.concat([elem.name].concat(elem.categories))
}, [])

describe('<EventsFilter />', () => {
  const shallowRender = (props) =>
    shallow(
      <EventsFilter
        show={false}
        events={[]}
        onFilter={() => {}}
        toggleFiltersList={() => {}}
        {...props}
      />
    )

  const component = shallowRender()

  it('should render', () => {
    expect(component.exists()).toBeTruthy()
  })

  it('should add a "show" class to container based on props', () => {
    expect(component.find('.show')).toHaveLength(0)

    const componentWithShow = shallowRender({ show: true })
    expect(componentWithShow.find('.show')).toHaveLength(1)
  })

  it('should render a <ListGroup />', () => {
    expect(component.find('#filters-list').find(ListGroup)).toHaveLength(1)
  })

  it('should display the first <ListGroupItem /> as a title', () => {
    expect(component.find(ListGroupItem).at(0).props().className).toEqual('title')
  })

  it('should render the title from i18n', () => {
    const title = component.find('.title').children().at(0)

    expect(title.find('div').at(0).text()).toEqual(i18n.Map.filtersTitle)
  })

  it('should render a "close" icon inside the title that calls toggleFiltersList on click', () => {
    const spy = sinon.spy()
    const component_ = shallowRender({ show: true, toggleFiltersList: spy })
    const close = component_.find('.title .close')

    expect(close).toHaveLength(1)
    close.simulate('click')
    expect(spy.calledOnce).toBe(true)
  })

  it('should leave all categories unchecked by default', () => {
    const checkedFilters = component.state().checkedFilters
    expect(checkedFilters.every(elem => elem.checked === false)).toEqual(true)
  })

  it('should toggle all filters to on upon ticking the first checkbox toggleAllFilters', () => {
    const component_ = shallowRender()
    const checkedFilters = component.state().checkedFilters
    const button = component_.find(CustomInput).first()
    button.simulate('change')
    expect(button.props().id).toEqual('toggle-all')
    expect(checkedFilters.every(elem => elem.checked === true)).toEqual(true)
  })

  it('should render a <ListGroupItem /> for each category', () => {
    const component_ = shallowRender()
    const categoryItems = component_.find('.categories-items')
    expect(categoryItems.find(ListGroupItem)).toHaveLength(categories.length)
  })

  it('should toggle a category filter state to true when its box is ticked', () => {
    const component_ = shallowRender()
    const checkedFilters = component.state().checkedFilters
    const checkbox = component_.find(CustomInput).last()
    expect(checkedFilters[checkedFilters.length-1].checked).toEqual(false)
    
    checkbox.simulate('change', { target: { id: checkbox.props().id } })
    expect(checkedFilters[checkedFilters.length - 1].checked).toEqual(true)

  })

})
