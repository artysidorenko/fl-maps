// export class LocalStorageMock {
//   constructor () {
//     this.store = {}
//   }

//   clear () {
//     this.store = {}
//   }

//   getItem (key) {
//     return this.store[key] || null
//   }

//   setItem (key, value) {
//     this.store[key] = value.toString()
//   }

//   removeItem (key) {
//     delete this.store[key]
//   }
// };

// export class SessionStorageMock {
//   constructor () {
//     this.store = {}
//   }

//   clear () {
//     this.store = {}
//   }

//   getItem (key) {
//     return this.store[key] || null
//   }

//   setItem (key, value) {
//     this.store[key] = value.toString()
//   }

//   removeItem (key) {
//     delete this.store[key]
//   }
// };

// TODO: check storackmock refactor didn't break other parts of the testing suites
// global.localStorage = new LocalStorageMock()
// global.sessionStorage = new SessionStorageMock()
// global.window.localStorage = new LocalStorageMock()
// global.window.sessionStorage = new SessionStorageMock()
