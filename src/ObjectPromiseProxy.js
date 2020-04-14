import { transaction, set } from 'mobx'

function ObjectPromiseProxy (promise, target) {
  target.isInFlight = true
  const tmpId = target.id
  const result = promise.then(
    async function (response) {
      const { status } = response

      if (status === 200 || status === 201) {
        const json = await response.json()

        transaction(() => {
          // Update target record's current id
          set(target, 'id', json.data.id)

          // NOTE: This resolves an issue where a record is persisted but the
          // index key is still a temp uuid. We can't simply remove the temp
          // key because there may be associated records that have the temp
          // uuid id as its only reference to the newly persisted record.
          // TODO: Figure out a way to update associated records to use the
          // newly persisted id.
          target.store.data[target.type].records[tmpId] = target
          target.store.data[target.type].records[target.id] = target

          // Update the existing record in the store.
          target.store._createOrUpdateOneRecordFromResponseData(json.data)

          // Create or update the related (included) records.
          if (json.included) {
            target.store._createOrUpdateAllRecordsFromResponseData(json.included)
          }
        })

        // End the "loading" state by setting target isInFlight to false
        target.isInFlight = false
        target._takeSnapshot({ persisted: true })

        return target
      } else {
        let message = target.store.genericErrorMessage
        let json = {}

        try {
          json = await response.json()
          message = parseApiErrors(json.errors, message)
        } catch (error) {
          // 500 doesn't return a parsable response
        }
        // TODO: add all errors from the API response to the target
        target.errors = {
          ...target.errors,
          status: status,
          base: [{ message: message }],
          server: json.errors
        }

        const errorString = JSON.stringify(target.errors)

        target.isInFlight = false

        return Promise.reject(new Error(errorString))
      }
    },
    function (error) {
      // TODO: Handle error states correctly
      target.isInFlight = false
      target.errors = error
      throw error
    }
  )

  return buildDecoratedPromise(target, result)
}

function buildDecoratedPromise (target, result) {
  // Define proxied attributes
  const attributeNames = Object.keys(target.attributeNames)

  attributeNames.push('isInFlight')

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

  return result
}

function parseApiErrors (errors, defaultMessage) {
  return (errors[0].detail.length === 0) ? defaultMessage : errors[0].detail[0]
}

export default ObjectPromiseProxy
