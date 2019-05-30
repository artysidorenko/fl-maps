import { EventsSchema } from '../events'
import possibleCategories from '/imports/both/i18n/en/categories.json'
import { determinePosition } from '../events/helpers'

describe('Events schema', () => {
  // Always remember to update those tests if changing something in the schema.

  const validateTheWhenObject = obj => {
    const context = EventsSchema.newContext()

    // validate the "when" field only
    context.validate(context.clean({
      when: obj
    }), { keys: ['when'] })

    return context.validationErrors()
  }

  it('should fail validation of an empty form', () => {
    try {
      EventsSchema.validate({})
    } catch (ex) {
      expect(ex.error).toEqual('validation-error')
    }
  })
  
  it('should fail validation of form with one or more invalid categories', () => {
    try {
      EventsSchema.validate({
        categories: [{ name: 'unknown category', color: '#fff' }]
      })
    } catch (ex) {
      expect(ex.details[0].type).toEqual('notAllowed')
    }
  })
  
  it('should fail validation of invalid location type', () => {
    try {
      EventsSchema.validate({
        address: {
          location: {
            type: 'OnlyPointAllowed'
          }
        }
      })
    } catch (ex) {
      expect(ex.details[1].message).toEqual('OnlyPointAllowed is not an allowed value')
    }
  })
  
  it('should pass validation of minimum required "when" input for non-recurring event', () => {
    const errors = validateTheWhenObject({
      startingTime: '15:00',
      endingTime: '16:00',
      multipleDays: false,
      repeat: false
    })

    expect(errors).toHaveLength(0)
  })
  
  it('should pass "when" input validation for multipleDays=true and valid "days" input', () => {
    const errors = validateTheWhenObject({
      multipleDays: true,
      days: [
        {
          day: 'Sunday',
          startingTime: '15:00',
          endingTime: '16:00'
        }
      ]
    })

    expect(errors).toHaveLength(0)
  })
  
  it('should fail "when" input validation for multipleDays=true and empty "days" input', () => {
    const errors = validateTheWhenObject({
      multipleDays: true,
      days: [] // empty array should fail
    })

    expect(errors[0]).toEqual({ 'name': 'when.days', 'type': 'required', 'value': [] })
  })
  
  it('should fail "when" input validation for multipleDays=true and invalid "days" input', () => {
    const errors = validateTheWhenObject({
      multipleDays: true,
      days: [
        { day: 'InvalidDay', startingTime: '13:000', endingTime: '0' }
      ]
    })

    expect(errors).toHaveLength(3)
  })
  
  it('should pass for multipleDays=true with "days" including one valid combined with undefined days', () => {
    const errors = validateTheWhenObject({
      multipleDays: true,
      days: [undefined, {
        day: 'Sunday',
        startingTime: '15:00',
        endingTime: '16:00'
      }, undefined]
    })

    expect(errors).toHaveLength(0)
  })
  
  it('should enforce ending/starting time to be null cleaning with multipleDays=true', () => {
    const obj = EventsSchema.clean({
      when: {
        multipleDays: true,
        startingTime: new Date(),
        endingTime: new Date()
      }
    })

    expect(obj.when.startingTime).toEqual(null)
    expect(obj.when.endingTime).toEqual(null)
  })

  it('should pass validation of basic forever "recurring" input', () => {
    const errors = validateTheWhenObject({
      repeat: true,
      recurring: {
        type: 'day',
        every: 6,
        forever: true
      }
    })

    expect(errors).toHaveLength(0)
  })

  it('should enforce "when.recurring" to be null when cleaning with "repeat=false"', () => {
    const obj = EventsSchema.clean({
      when: {
        repeat: false,
        recurring: {
          type: 'day',
          every: 6,
          forever: true
        }
      }
    })

    expect(obj.when.recurring).toEqual(null)
  })

  it('should enforce recurring.days and recurring.monthly to null when cleaning with recurring.type=day', () => {
    const obj = EventsSchema.clean({
      when: {
        repeat: true,
        recurring: {
          type: 'day',
          days: [{}],
          monthly: {}
        }
      }
    })

    expect(obj.when.recurring.days).toEqual(null)
    expect(obj.when.recurring.monthly).toEqual(null)
  })

  it('should fail validating with recurring.type=week and invalid "days" array', () => {
    const errors = validateTheWhenObject({
      repeat: true,
      recurring: {
        type: 'week',
        days: ['InvalidDay'] // empty array should fail
      }
    })
    expect(errors.length).toBeGreaterThan(0)
  })

  it('should set monthly.type to "byDayInMonth" when cleaning with recurring.type=month', () => {
    const obj = EventsSchema.clean({
      when: {
        repeat: true,
        recurring: {
          type: 'month'
        }
      }
    })

    expect(obj.when.recurring.monthly.type).toEqual('byDayInMonth')
  })

  it('should resolve monthly.value to its default value when type=month monthly.value=undefined', () => {
    const dayInMonth = new Date().getDate()
    const baseObj = (type) => (
      {
        when: {
          repeat: true,
          recurring: {
            type: 'month',
            monthly: {
              type: type
            }
          }
        }
      }
    )

    const obj = EventsSchema.clean(baseObj('byDayInMonth'))
    const obj1 = EventsSchema.clean(baseObj('byPosition'))

    expect(obj.when.recurring.monthly.value).toEqual(dayInMonth)
    expect(obj1.when.recurring.monthly.value).toEqual(Number(determinePosition(dayInMonth)[0]))
  })

  it('should set limitations on monthly.value when cleaning with recurring.type=month', () => {
    const baseObj = (monthly) => (
      {
        name: 'test',
        when: {
          startingDate: new Date('2019-02-01T23:00:00.000Z'),
          repeat: true,
          recurring: {
            type: 'month',
            monthly
          }
        }
      }
    )

    const obj1 = baseObj({ type: 'byDayInMonth', value: 35 })
    const obj2 = baseObj({ type: 'byDayInMonth', value: 0 })
    const obj3 = baseObj({ type: 'byPosition', value: 10 })
    const obj4 = baseObj({ type: 'byPosition', value: 0 })

    expect(EventsSchema.clean(obj1).when.recurring.monthly.value).toEqual(28)
    expect(EventsSchema.clean(obj2).when.recurring.monthly.value).toEqual(1)
    expect(EventsSchema.clean(obj3).when.recurring.monthly.value).toEqual(4)
    expect(EventsSchema.clean(obj4).when.recurring.monthly.value).toEqual(1)
  })

  it('should enforce recurring.repeat to be null when cleaning with recurring.forever=true', () => {
    const obj = EventsSchema.clean({
      when: {
        repeat: true,
        recurring: {
          type: 'day',
          forever: true,
          occurences: 100
        }
      }
    })

    expect(obj.when.recurring.occurences).toEqual(null)
  })

  it('should successfully validate a full basic form', () => {
    let form = EventsSchema.clean({
      name: 'test form',
      address: {
        name: 'test location',
        location: {
          type: 'Point',
          coordinates: [70.0051, -43.0891]
        }
      },
      categories: [possibleCategories[0]],
      findHints: 'find hints',
      when: {
        startingDate: new Date(),
        endingDate: new Date(),
        startingTime: '15:00',
        endingTime: '20:00'
      },
      overview: 'test overview',
      description: 'test description'
    })

    const validationContext = EventsSchema.newContext()
    validationContext.validate(form)
    expect(validationContext.isValid()).toEqual(true)
  })

  it('match schema keys', () => {
    expect(EventsSchema._schemaKeys).toEqual(
      [
        'organiser',
        'organiser._id',
        'organiser.name',
        'categories',
        'categories.$',
        'categories.$.name',
        'categories.$.color',
        'categories.resourceType',
        'name',
        'address',
        'address.name',
        'address.location',
        'address.location.type',
        'address.location.coordinates',
        'address.location.coordinates.$',
        'findHints',
        'when',
        'when.startingDate',
        'when.endingDate',
        'when.startingTime',
        'when.endingTime',
        'when.multipleDays',
        'when.days',
        'when.days.$',
        'when.repeat',
        'when.recurring',
        'when.recurring.type',
        'when.recurring.days',
        'when.recurring.days.$',
        'when.recurring.monthly',
        'when.recurring.monthly.type',
        'when.recurring.monthly.value',
        'when.recurring.every',
        'when.recurring.forever',
        'when.recurring.occurences',
        'when.recurring.recurrenceEndDate',
        'when.recurring.until',
        'overview',
        'description',
        'engagement',
        'engagement.limit',
        'engagement.attendees',
        'engagement.attendees.$',
        'engagement.attendees.$.id',
        'engagement.attendees.$.name',
        'video',
        'video.link1',
        'video.link1.host',
        'video.link1.address',
        'video.link2',
        'video.link2.host',
        'video.link2.address',
        'video.link3',
        'video.link3.host',
        'video.link3.address',
        'createdAt'
      ]
    )
  })
})
