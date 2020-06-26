import { transaction, set } from 'mobx'

function ObjectPromiseProxy (promise, target) {
  const result = updateRecords(promise, target.store, target)

  // Define proxied attributes
  debugger
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

export function updateRecords (promise, store, records) {
  // records may be a single record, if so wrap it in an array to make
  // iteration simpler
  const recordsArray = Array.isArray(records) ? records : [records]
  recordsArray.forEach((record) => { record.isInFlight = true })

  return promise.then(
    async function(response) {
      const { status } = response
      if (status === 200 || status === 201) {
        const json = await response.json()
        const data = Array.isArray(json.data) ? json.data : [json.data]

        if (data.length !== recordsArray.length) throw new Error('Invariant violated: API response data and records to update do not match')

        data.forEach((targetData, index) => {
          applyResponseAttributesToTarget(targetData, recordsArray[index])
        })

        if (json.included) {
          store.createModelsFromData(json.included)
        }

        // on success, return the original record(s).
        // again - this may be a single record so preserve the structure
        return records
      } else {
        recordsArray.forEach(record => { record.isInFlight = false })

        let message = store.genericErrorMessage
        let json = {}
        try {
          json = await response.json()
          message = parseApiErrors(json.errors, message)
        } catch (error) {
          // 500 doesn't return a parsable response
        }
        // TODO: add all errors from the API response to the record
        // also TODO: split server errors by record once the info is available from the API
        recordsArray[0].errors = {
          ...recordsArray[0].errors,
          status: status,
          base: [{ message: message }],
          server: json.errors
        }

        const errorString = JSON.stringify(recordsArray[0].errors)
        return Promise.reject(new Error(errorString))
      }
    },
    function (error) {
      // TODO: Handle error states correctly, including handling errors for multiple targets
      recordsArray.forEach(record => { record.isInFlight = false })
      recordsArray[0].errors = error
      throw error
    }
  )
}

// TODO: can this be merged with createOrUpdateModel?
function applyResponseAttributesToTarget (data, target) {
  const tmpId = target.id
  const { id, attributes, relationships } = data
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
  })
  // Update target isInFlight
  target.isInFlight = false
  target._takeSnapshot({ persisted: true })

  transaction(() => {
    // NOTE: This resolves an issue where a record is persisted but the
    // index key is still a temp uuid. We can't simply remove the temp
    // key because there may be associated records that have the temp
    // uuid id as its only reference to the newly persisted record.
    // TODO: Figure out a way to update associated records to use the
    // newly persisted id.
    target.store.data[target.type].records.set(String(tmpId), target)
    target.store.data[target.type].records.set(String(target.id), target)
  })
}

function parseApiErrors (errors, defaultMessage) {
  return (errors[0].detail.length === 0) ? defaultMessage : errors[0].detail[0]
}

export default ObjectPromiseProxy
