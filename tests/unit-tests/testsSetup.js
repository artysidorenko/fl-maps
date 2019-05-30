import './globalMocks'
import * as enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
// import { LocalStorageMock, SessionStorageMock } from './globalMocks/StorageMock'

enzyme.configure({ adapter: new Adapter() })

// silence warnings
global.console.warn = jest.fn()

// set up DOM
// const { JSDOM } = require('jsdom');
// const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
// const { window } = jsdom;
// function copyProps(src, target) {
//   Object.defineProperties(target, {
//     ...Object.getOwnPropertyDescriptors(src),
//     ...Object.getOwnPropertyDescriptors(target),
//   });
// }
// global.window = window
// global.document = window.document
// global.localStorage = new LocalStorageMock()
// global.sessionStorage = new SessionStorageMock()
// global.window.localStorage = new LocalStorageMock()
// global.window.sessionStorage = new SessionStorageMock()