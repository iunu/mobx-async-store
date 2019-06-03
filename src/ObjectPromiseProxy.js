import { transaction } from 'mobx'

function ObjectPromiseProxy (promise, target) {
  target.isInFlight = true
  const result = promise.then(
    async function (response) {
      if (response.status === 200 || response.status === 201) {
        const json = await response.json()
        // Update target model
        const { attributes, relationships } = json.data
        transaction(() => {
          Object.keys(attributes).forEach(key => {
            target[key] = attributes[key]
          })
          if (relationships) {
            Object.keys(relationships).forEach(key => {
              if (!relationships[key].hasOwnProperty('meta')) {
                target.relationships[key] = relationships[key]
              }
            })
          }
          if (json.included) {
            target.store.createModelsFromData(json.included)
          }
          // Update target isInFlight
          target.isInFlight = false
        })
        return target
      } else {
        target.errors = { status: response.status }
        return target
      }
    },
    function (error) {
      // TODO: Handle error states correctly
      target.isInFlight = false
      target.errors = error
      throw error
      // return target
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
