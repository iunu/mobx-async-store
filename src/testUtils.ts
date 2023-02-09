import { IDOptionalJSONAPIDataObject, JSONAPIDataObject, JSONAPIDocument, ModelClass } from "interfaces/global"
import { StoreClass } from "Model"

/**
 * JSONAPI uses `included` only at the top level. To recursively add models to this array,
 * we preserve the top-level object and pass it in to the next round
 * Because objects can have multiple relationships, we do a check of the array to make sure
 * it's not already there.
 *
 * @param {object} store the data store
 * @param {object} encodedModel the the model
 * @param {Array} included data
 * @param {Array} allEncoded the previously encoded models
 */
const addIncluded = (store: StoreClass, encodedModel: JSONAPIDataObject, included: JSONAPIDataObject[], allEncoded: JSONAPIDataObject[] = []) => {
  const relationships = encodedModel.relationships || {}

  if (allEncoded.length === 0) {
    allEncoded = [encodedModel]
  }

  Object.values(relationships).forEach((reference) => {
    const data = reference?.data

    if (Array.isArray(data)) {
      const notAlreadyIncluded = data.filter(
        ({ id, type }) => !allEncoded.some((encodedModel) => encodedModel.type === type && encodedModel.id === id)
      )
  
      notAlreadyIncluded.forEach((relationship) => {
        const relatedModel = store.getOne(relationship.type, relationship.id)
        if (relatedModel) {
          const encodedRelatedModel = toFullJsonapi(relatedModel) as JSONAPIDataObject
          included.push(encodedRelatedModel)
          addIncluded(store, encodedRelatedModel, included, [...allEncoded, ...included, encodedModel])
        }
      })
    } else if (data?.type && data?.id) {
      const notAlreadyIncluded = !allEncoded.some((singleEncoded) => singleEncoded.type === data.type && singleEncoded.id === data.id)

      if (notAlreadyIncluded) {
        const relatedModel = store.getOne(data.type, data.id)
        if (relatedModel) {
          const encodedRelatedModel = toFullJsonapi(relatedModel) as JSONAPIDataObject
          included.push(encodedRelatedModel)
          addIncluded(store, encodedRelatedModel, included, [...allEncoded, ...included, encodedModel])
        }
      }
    }
  })
}

/**
 * Encodes models into full compliant JSONAPI payload, as if it were being sent with all
 * relevant relationships and inclusions. The resulting payload will look like
 * {
 *   data: {
 *     id: '1',
 *     type: 'zones',
 *     attributes: {},
 *     relationships: {},
 *   },
 *   included: []
 * }
 *
 * @param {object|Array} modelOrArray the data being encoded
 * @returns {string} JSON encoded data
 */

export const serverResponse = function (modelOrArray: ModelClass | ModelClass[] | void): string {
  if (modelOrArray == null) {
    throw new Error('Cannot encode a null reference')
  } else if (!Array.isArray(modelOrArray) && modelOrArray.store && modelOrArray.id) {
    const encodedData: { data: JSONAPIDocument, included: JSONAPIDocument[] } = {
      data: toFullJsonapi(modelOrArray) as JSONAPIDataObject,
      included: []
    }

    addIncluded(modelOrArray.store, encodedData.data, encodedData.included)
    return JSON.stringify(encodedData)
  } else if (Array.isArray(modelOrArray) && modelOrArray[0]?.store) {
    const encodedData = {
      data: modelOrArray.map(toFullJsonapi) as JSONAPIDataObject[],
      included: []
    }
    encodedData.data.forEach((encodedModel: JSONAPIDocument) => {
      addIncluded(modelOrArray[0].store as StoreClass, encodedModel, encodedData.included, [...encodedData.data, ...encodedData.included])
    })
    return JSON.stringify(encodedData)

  }

  return JSON.stringify({ data: [] })
}

/**
 * Encodes a model to a jsonapi document with all relationships
 *
 * @param {object} model the model to convert
 * @returns {object} the jsonapi encoded document
 */
const toFullJsonapi = (model: ModelClass): IDOptionalJSONAPIDataObject => {
  return model.jsonapi({ relationships: Object.keys(model.relationships) })
}
