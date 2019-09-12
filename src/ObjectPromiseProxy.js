import { transaction, set } from 'mobx'

function ObjectPromiseProxy (promise, target) {
  const tmpId = target.id

  target.isInFlight = true

  const promiseProxy = promise.then(
    async function (response) {
      const { status } = response

      if (status === 200 || status === 201) {
        const json = await response.json()
        const { data: { attributes, relationships }, included } = json

        transaction(() => {
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

          if (included) {
            target.store.createModelsFromData(included)
          }
        })

        // Update target isInFlight and isDirty
        target.isInFlight = false
        target.isDirty = false
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
        // TODO: Handle unexpected status codes correctly
        target.isInFlight = false
        target.errors = { status: response.status }

        return target
      }
    },
    function (error) {
      target.isInFlight = false
      target.errors = error
      throw error
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

  Object.defineProperties(promiseProxy, {
    isInFlight: { value: target.isInFlight },
    ...tempProperties
  })

  return promiseProxy
}

export default ObjectPromiseProxy
