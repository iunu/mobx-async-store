function ProxyPromise(promise, target) {
  const result = promise.then(
    function(v) {
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
    function(e) {
      // TODO: Handle error states correctly
      target.isInFlight = false
      target.errors = errors
      throw e
    }
  )
  // Define proxied attributes
  const attributeNames = Object.keys(target.constructor.attributes)
  const tempProperties = attributeNames.reduce((attrs, key) => {
    attrs[key] = {
      value: target[key],
      writable: false
    }
    return attrs
  }, {})

  Object.defineProperties(result, {
    isInFlight: { value: true },
    ...tempProperties
  })
  // Return promise
  return result
}

export default ProxyPromise
