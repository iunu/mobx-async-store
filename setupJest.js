const mockFetch = require('jest-fetch-mock')
const { configure } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')

configure({ adapter: new Adapter() })

global.fetch = mockFetch
