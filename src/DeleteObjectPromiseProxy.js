import { buildDecoratedPromise } from './utils'

function DeleteObjectPromiseProxy (promise, target, options = {}) {
  target.errors = {}

  const result = promise.then(
    async function (response) {
      if (response.status === 202 || response.status === 204) {
        if (options.softDestroy) {
          try {
            const json = await response.json()
            const { data, included } = json

            if (data) {
              target.store._createOrUpdateOneRecordFromResponseData(data)
            }

            if (included) {
              target.store._createOrUpdateAllRecordsFromResponseData(included)
            }
          } catch (err) {
            console.log(err)
            // It is text, do you text handling here
          }
        } else {
          target.dispose()
          target.store.remove(target.type, target.id)
        }

        target.isInFlight = false

        return target
      } else {
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

  return buildDecoratedPromise(target, result)
}

export default DeleteObjectPromiseProxy
