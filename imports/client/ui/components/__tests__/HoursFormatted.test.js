import React from 'react'
import { shallow } from 'enzyme'
import HoursFormatted from '../HoursFormatted'
import { formatDateWithWords } from '/imports/client/utils/format'
import { calcEffectiveEndDate } from '/imports/both/collections/events/helpers'
import { eventHoursData } from '/tests/unit-tests/helpers/eventHoursData'

// TODO: separately create a test for the drillDownToDateText function in the sharepanel
// TODO: write up documentation for this test, with main gotchas

let data, startingDate, endingDate, endingDate10Years, untilDate

describe('<HoursFormatted />', () => {

  beforeAll(() => {

    // some of the dates used in the tests
    // defining these here because we are about to overwrite the global Date constructor
    startingDate = new Date('2019-01-01T12:00:00')
    endingDate = new Date('2019-01-10T12:00:00')
    endingDate10Years = new Date('2029-01-10T12:00:00')
    untilDate = new Date('2019-10-10T12:00:00')

    // eventHoursData mocks the event data object that the component normally receives from the database
    // (this is so that all the required fields are initialised otherwise the component throws an error)
    data = new eventHoursData({
      startingDate: startingDate,     // <-- day of week = Tuesday
      endingDate: endingDate,         // <-- Thursday
      startingTime: '16:00',
      endingTime: '17:00'
    })

    /**
     * For the purposes of these tests we need a fake date object
     * to keep value of new Date() and Date.now() as constant
     * ONLY if no argument is passed (so that Date(2019-01-01) is not overwritten)
     */
    const fakeDate = new Date('2019-05-01T12:00:00')
    global.DateWithArgs = Date
    global.Date = class extends Date {
      constructor(...args) {
        super(...args)
        if (args[0] === undefined) return fakeDate
        else return new DateWithArgs(...args)
      }
    }
  })
  afterAll(() => {
    global.Date = Date
  })

  it('should render a wrapper class', () => {
    const wrapper = shallow(<HoursFormatted data={data} />)
    expect(wrapper.exists()).toBe(true)
  })

  describe('without a repetition flag', () => {
    
    beforeAll(() => {data.repeat = false})

    it('renders component with class "regular-date"', () => {
      const wrapper = shallow(<HoursFormatted data={data} />)
      const component = wrapper.find('.regular-date')
      expect(component.exists()).toBe(true)
    })

    it('displays correct starting date', () => {
      const wrapper = shallow(<HoursFormatted data={data} />)
      const component = wrapper.find('.regular-date')
      expect(component.text()).toMatch(/Tue/)
      expect(component.text()).toMatch(/2019\/01\/01/)
      expect(component.text()).toMatch(/16:00/)
    })

    it('displays correct ending date', () => {
      const wrapper = shallow(<HoursFormatted data={data} />)
      const component = wrapper.find('.regular-date')
      expect(component.text()).toMatch(/Thu/)
      expect(component.text()).toMatch(/2019\/01\/10/)
      expect(component.text()).toMatch(/17:00/)
    })

    it('displays events lasting 5+ years as ongoing "until further notice"', () => {
      data.endingDate = endingDate10Years
      const wrapper = shallow(<HoursFormatted data={data} />)
      const component = wrapper.find('.regular-date')
      expect(component.text()).toMatch(/until further notice/)
    })
  })

  describe('with repetition via "multiple days" flag', () => {

    beforeAll(() => {
      data.multipleDays = true
      data.days = [
        {
          day: 'Sunday',
          startingTime: '15:00',
          endingTime: '20:00'
        },
        {
          day: 'Friday',
          startingTime: '19:00',
          endingTime: '20:00'
        }
      ]
    })

    it('renders component with class "multiple-days"', () => {
      const wrapper = shallow(<HoursFormatted data={data} />)
      const component = wrapper.find('.multiple-days')
      expect(component.exists()).toBe(true)
    })

    it('displays both days correctly', () => {
      const wrapper = shallow(<HoursFormatted data={data} />)
      const component = wrapper.find('.multiple-days')
      expect(component.html()).toMatch(new RegExp('<div>Sun</div><span>15:00 - 20:00</span>'))
      expect(component.html()).toMatch(new RegExp('<div>Fri</div><span>19:00 - 20:00</span>'))
    })
  })

  describe('with daily recurrence', () => {

    describe('repeating daily forever', () => {

      beforeAll(() => {
        data.endingDate = startingDate
        data.multipleDays = false
        data.repeat = true
        data.recurring = {
          type: 'day',
          forever: true,
          every: 1
        }
      })

      it('renders component with class "repeat"', () => {
        const wrapper = shallow(<HoursFormatted data={data} />)
        const component = wrapper.find('.repeat')
        expect(component.exists()).toBe(true)
      })

      it('correctly displays the next occurence after today (today = Wed 2019/05/01)', () => {
        const wrapper = shallow(<HoursFormatted data={data} />)
        const component = wrapper.find('.repeat')
        expect(component.html()).toMatch(new RegExp(
          '<span>Next:<br/>Wed, 2019/05/01<br/>'
        ))
      })

      it('correctly displays the repetition schedule', () => {
        const wrapper = shallow(<HoursFormatted data={data} />)
        const component = wrapper.find('.repeat')
        expect(component.html()).toMatch(new RegExp('Repeating:'))
        expect(component.html()).toMatch(new RegExp('every  day, between'))
        expect(component.html()).toMatch(new RegExp(
          '<li><span>Repeating:<br/></span> every  day, between 16:00 - 17:00 </li>'
        ))
      })

    })

    describe('repeating every 3 days until Thu Oct 10', () => {

      beforeAll(() => {
        data.endingDate = startingDate
        data.multipleDays = false
        data.repeat = true
        data.recurring = {
          type: 'day',
          forever: false,
          every: 3,
          until: untilDate
        }
      })

      it('renders component with class "repeat"', () => {
        const wrapper = shallow(<HoursFormatted data={data} />)
        const component = wrapper.find('.repeat')
        expect(component.exists()).toBe(true)
      })
      
      it('correctly displays the next occurence (every 3 days from 1st Jan lands on 1st May coincidentally)', () => {
        const wrapper = shallow(<HoursFormatted data={data} />)
        const component = wrapper.find('.repeat')
        expect(component.html()).toMatch(new RegExp(
          '<span>Next:<br/>Wed, 2019/05/01<br/>'
        ))
      })
      
      it('correctly displays the repetition schedule', () => {
        const wrapper = shallow(<HoursFormatted data={data} />)
        const component = wrapper.find('.repeat')
        const subcomponent = wrapper.find('.not-forever')
        expect(component.html()).toMatch(new RegExp('Repeating:'))
        expect(component.html()).toMatch(new RegExp('every 3 days, between'))
        expect(component.html()).toMatch(new RegExp(
          '<li><span>Repeating:<br/></span> every 3 days, between 16:00 - 17:00 </li>'
        ))
        expect(subcomponent.html()).toMatch(new RegExp('until Thu, 2019/10/10'))
      })
      
    })


  })

  describe('with weekly recurrence', () => {

    describe('repeating every 2 weeks on Tuesdays for 26 recurrences', () => {

      beforeAll(() => {
        data.endingDate = startingDate
        data.multipleDays = false
        data.repeat = true
        data.recurring = {
          type: 'week',
          forever: false,
          every: 2,
          days: ['Tuesday'],
          occurences: 26,
          recurrenceEndDate: calcEffectiveEndDate(startingDate, 'week', 2, 26)
        }
      })

      it('renders component with class "repeat"', () => {
        const wrapper = shallow(<HoursFormatted data={data} />)
        const component = wrapper.find('.repeat')
        expect(component.exists()).toBe(true)
      })

      it('correctly displays the next occurence after today (should land on 7th May)', () => {
        const wrapper = shallow(<HoursFormatted data={data} />)
        const component = wrapper.find('.repeat')
        expect(component.html()).toMatch(new RegExp(
          '<span>Next:<br/>Tue, 2019/05/07<br/>'
        ))
      })

      it('correctly displays the repetition schedule', () => {
        const wrapper = shallow(<HoursFormatted data={data} />)
        const component = wrapper.find('.repeat')
        expect(component.html()).toMatch(new RegExp('Repeating:'))
        expect(component.html()).toMatch(new RegExp('every 2 weeks'))
        expect(component.html()).toMatch(new RegExp('on Tue, 16:00 - 17:00'))
      })

      it('correctly displays the final day (26 weeks X 2 = 1 Year) -> 31/12/19', () => {
        const wrapper = shallow(<HoursFormatted data={data} />)
        const component = wrapper.find('.not-forever')
        expect(component.html()).toMatch(new RegExp('until Tue, 2019/12/31'))
      })
    })
  })

  describe('with monthly recurrence', () => {

    describe('repeating every month on the 4th week for 5 recurrences', () => {

      beforeAll(() => {
        data.endingDate = startingDate // <-- a Tuesday
        data.multipleDays = false
        data.repeat = true
        data.recurring = {
          type: 'month',
          forever: false,
          every: 1,
          occurences: 5,
          recurrenceEndDate: calcEffectiveEndDate(startingDate, 'month', 1, 5),
          monthly: {
            type: 'byPosition',
            value: 4
          }
        }
      })

      it('renders component with class "repeat"', () => {
        const wrapper = shallow(<HoursFormatted data={data} />)
        const component = wrapper.find('.repeat')
        expect(component.exists()).toBe(true)
      })

      it('correctly displays the next occurence after today (should land on Mon 27th May)', () => {
        const wrapper = shallow(<HoursFormatted data={data} />)
        const component = wrapper.find('.repeat')
        expect(component.html()).toMatch(new RegExp(
          '<span>Next:<br/>Tue, 2019/05/28<br/>'
        ))
      })

      it('correctly displays the repetition schedule', () => {
        const wrapper = shallow(<HoursFormatted data={data} />)
        const component = wrapper.find('.repeat')
        expect(component.html()).toMatch(new RegExp('Repeating:'))
        expect(component.html()).toMatch(new RegExp('every  month'))
        expect(component.html()).toMatch(new RegExp('on the 4th Tuesday'))
      })

      it('correctly displays the final day (5 months after Jan) ->24/06/19', () => {
        const wrapper = shallow(<HoursFormatted data={data} />)
        const component = wrapper.find('.not-forever')
        expect(component.html()).toMatch(new RegExp('through June'))
      })

    })

    describe('repeating every 3 months on the 17th for 4 recurrences', () => {

      beforeAll(() => {
        data.endingDate = startingDate // <-- a Tuesday
        data.multipleDays = false
        data.repeat = true
        data.recurring = {
          type: 'month',
          forever: false,
          every: 3,
          occurences: 4,
          recurrenceEndDate: calcEffectiveEndDate(startingDate, 'month', 3, 4),
          monthly: {
            type: 'byDayInMonth',
            value: 17
          }
        }
      })

      it('renders component with class "repeat"', () => {
        const wrapper = shallow(<HoursFormatted data={data} />)
        const component = wrapper.find('.repeat')
        expect(component.exists()).toBe(true)
      })

      it('correctly displays the next occurence after today (should land on Wed 17th Jul)', () => {
        const wrapper = shallow(<HoursFormatted data={data} />)
        const component = wrapper.find('.repeat')
        expect(component.html()).toMatch(new RegExp(
          '<span>Next:<br/>Wed, 2019/07/17<br/>'
        ))
      })

      it('correctly displays the repetition schedule', () => {
        const wrapper = shallow(<HoursFormatted data={data} />)
        const component = wrapper.find('.repeat')
        expect(component.html()).toMatch(new RegExp('Repeating:'))
        expect(component.html()).toMatch(new RegExp('every 3 months'))
        expect(component.html()).toMatch(new RegExp('on the 17th'))
      })

      it('correctly displays the final day (4 X 3 months after Jan)->17/01/20', () => {
        const wrapper = shallow(<HoursFormatted data={data} />)
        const component = wrapper.find('.not-forever')
        expect(component.html()).toMatch(new RegExp('through Jan'))
      })
    })
  })

})