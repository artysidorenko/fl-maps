/**
 * @author: Arty S
 * 
 * A basic mock of the meteor package mdg:validatedmethod.
 * Purpose is to test the class is being used correctly
 * Hence we don't need to include any real functionality
 * Only to assign to 'this' the class properties passed into the constructor
 * 
 */

export class ValidatedMethod {
  constructor(options) {
    this.name = options.name
    this.mixins = options.mixins
    this.validate = options.validate
    this.run = options.run
  }
}