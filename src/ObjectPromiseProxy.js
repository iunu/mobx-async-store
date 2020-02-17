import { transaction, set } from 'mobx'

function ObjectPromiseProxy (promise, target) {
  target.isInFlight = true
  const tmpId = target.id
  const result = promise.then(
    async function (response) {
      const { status } = response
      if (status === 200 || status === 201) {
        const json = await response.json()
        // Update target model
        const { id, attributes, relationships } = json.data
        transaction(() => {
          set(target, 'id', id)

          Object.keys(attributes).forEach(key => {
            set(target, key, attributes[key])
          })
          if (relationships) {
            Object.keys(relationships).forEach(key => {
              if (!relationships[key].hasOwnProperty('meta')) {
                // todo: throw error if relationship is not defined in model
                set(target.relationships, key, relationships[key])
              }
            })
          }
          if (json.included) {
            target.store.createModelsFromData(json.included)
          }
        })
        // Update target isInFlight
        target.isInFlight = false
        target.setPreviousSnapshot()
        transaction(() => {
          // NOTE: This resolves an issue where a record is persisted but the
          // index key is still a temp uuid. We can't simply remove the temp
          // key because there may be associated records that have the temp
          // uuid id as its only reference to the newly persisted record.
          // TODO: Figure out a way to update associated records to use the
          // newly persisted id.
          target.store.data[target.type].records[tmpId] = target
          target.store.data[target.type].records[target.id] = target
        })
        return target
      } else {
        target.isInFlight = false

        let message = target.store.genericErrorMessage
        try {
          const json = await response.json()
          message = parseApiErrors(json.errors, message)
        } catch (error) {
          // 500 doesn't return a parsable response
        }
        // TODO: add all errors from the API response to the target
        target.errors = {
          ...target.errors,
          status: status,
          base: [{ message: message }]
        }

        const errorString = JSON.stringify(target.errors)
        return Promise.reject(new Error(errorString))
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

function parseApiErrors (errors, defaultMessage) {
  return (errors[0].detail.length === 0) ? defaultMessage : errors[0].detail[0]
}

export default ObjectPromiseProxy
