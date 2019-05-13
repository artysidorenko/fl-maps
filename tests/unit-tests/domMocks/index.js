// export default function createDom() {
//   // JSDOM to mock document object
//   // TODO: CHECK THAT THESE GLOBALS ARE NOT INTERFERING WITH OTHER DECLARED GLOBALS

//   const { JSDOM } = require('jsdom')

//   // We can use jsdom-global at some point if maintaining that list turns out to be a burden.
//   const KEYS = ['HTMLElement']


//   const dom = new JSDOM('')
//   global.document = dom.document
//   global.window = dom.window

//   Object.keys(dom.window).forEach(property => {
//     if (typeof global[property] === 'undefined') {
//       global[property] = dom.window[property];
//     }
//   })

//   KEYS.forEach(key => {
//     global[key] = window[key];
//   })

// }