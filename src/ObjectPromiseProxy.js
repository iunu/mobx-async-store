function ObjectPromiseProxy (promise, target) {
  target.isInFlight = true
  const result = promise.then(
    function (v) {
      const json = JSON.parse(v.body)
      // Update target model
      const { attributes } = json.data
      Object.keys(attributes).forEach(key => {
        target[key] = attributes[key]
      })
      // Update target isInFlight
      target.isInFlight = false
      return target
    },
    function (e) {
      // TODO: Handle error states correctly
      target.isInFlight = false
      target.errors = e
      throw e
    }
  )
  // Define proxied attributes
  const attributeNames = Object.keys(target.attributeNames)
  const tempProperties = attributeNames.reduce((attrs, key) => {
    attrs[key] = {
      value: target[key],
      writable: false
    }
    return attrs
  }, {})

  Object.defineProperties(result, {
    isInFlight: { value: target.isInFlight },
    ...tempProperties
  })

  // Return promise
  return result
}

export default ObjectPromiseProxy
