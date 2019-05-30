export class eventHoursData {
  constructor(data) {
    this.startingDate = data.startingDate
    this.endingDate = data.endingDate
    this.startingTime = data.startingTime
    this.endingTime = data.endingTime
    this.multipleDays = data.multipleDays
    this.days = data.days
    this.repeat = data.repeat
    if (data.recurring) {
      this.recurring = {
        type: data.recurring.type,                            // <-- recur daily, weekly or monthly
        forever: data.recurring.forever,                      // <-- true/false
        every: data.recurring.every,                          // <-- indicates skipping, e.g. 2 means every other day/week/month
        days: data.recurring.days,                            // <-- which day of the week, when type = weekly 
        until: data.recurring.until,                          // <-- defines last date of event
        occurences: data.recurring.occurences,                // <-- defines number of recurrences (instead of 'until' field)
        recurrenceEndDate: data.recurring.recurrenceEndDate,  // <-- uses calcEffectiveEndDate to estimate last date of event from the above fields
        monthly: {}
      }
      if (data.recurring.monthly) {             
        this.recurring.monthly = {              // <-- for use when type = monthly
          type: data.recurring.monthly.type,    // <-- by day in month, or by number of week
          value: data.recurring.monthly.value   // <-- e.g. 3rd monday of the month, or 3rd calendar date of the month
        }
      }
    }
  }
}