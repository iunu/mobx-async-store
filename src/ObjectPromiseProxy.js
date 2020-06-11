import { transaction, set } from 'mobx'

function ObjectPromiseProxy (promise, target) {
  const targets = Array.isArray(target) ? target : [target]
  const store = targets[0].store
  targets.forEach((t) => { t.isInFlight = true })
  const result = promise.then(
    async function (response) {
      const { status } = response
      if (status === 200 || status === 201) {
        const json = await response.json()
        const data = Array.isArray(json.data) ? json.data : [json.data]
        // Update target model(s)
        // TODO: zip json.data + targets, then iterate
        if (data.length !== targets.length) throw new Error('Invariant violated: ObjectPromiseProxy response data and targets are not the same length')

        data.forEach((targetData, index) => {
          applyResponseAttributesToTarget(targetData, targets[index])
        })

        if (json.included) {
          store.createModelsFromData(json.included)
        }

        return target
      } else {
        targets.forEach(t => { t.isInFlight = false })

        let message = store.genericErrorMessage
        let json = {}
        try {
          json = await response.json()
          message = parseApiErrors(json.errors, message)
        } catch (error) {
          // 500 doesn't return a parsable response
        }
        // TODO: add all errors from the API response to the target
        // also TODO: split server errors by target once the info is available from the API
        // maybe handle not just the first target lol
        targets[0].errors = {
          ...targets[0].errors,
          status: status,
          base: [{ message: message }],
          server: json.errors
        }

        const errorString = JSON.stringify(targets[0].errors)
        return Promise.reject(new Error(errorString))
      }
    },
    function (error) {
      // TODO: Handle error states correctly, including handling errors for multiple targets
      targets.forEach(t => { t.isInFlight = false })
      target.errors = error
      throw error
      // return target
    }
  )
  // Define proxied attributes
  const attributeNames = Object.keys(targets[0].attributeNames)
  const tempProperties = attributeNames.reduce((attrs, key) => {
    attrs[key] = {
      value: targets[0][key],
      writable: false
    }
    return attrs
  }, {})

  // TODO: how is isInFlight used? how should it be set for multiple targets?
  Object.defineProperties(result, {
    isInFlight: { value: targets[0].isInFlight },
    ...tempProperties
  })

  // Return promise
  return result
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
