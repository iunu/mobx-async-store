export const exampleRelatedToManyResponse = JSON.stringify({
  data: {
    id: '1',
    type: 'organizations',
    attributes: {
      id: 1,
      title: 'Do laundry'
    },
    relationships: {
      notes: {
        data: [
          {
            type: 'notes',
            id: '1'
          }
        ]
      }
    }
  },
  jsonapi: {
    version: '1.0'
  },
  ok: true,
  status: 200
})

export const exampleRelatedToManyIncludedResponse = JSON.stringify({
  ok: true,
  status: 200,
  data: {
    id: '1',
    type: 'organizations',
    attributes: {
      id: 1,
      title: 'Do laundry'
    },
    relationships: {
      notes: {
        data: [
          {
            type: 'notes',
            id: '1'
          }
        ]
      }
    }
  },
  included: [
    {
      id: '1',
      type: 'notes',
      attributes: {
        description: 'Use fabric softener'
      }
    }
  ],
  jsonapi: {
    version: '1.0'
  }
})

export const exampleRelatedToOneIncludedResponse = JSON.stringify({
  ok: true,
  status: 200,
  data: {
    id: '1',
    type: 'notes',
    attributes: {
      description: 'Use fabric softener'
    }
  },
  relationships: {
    todo: {
      data: [
        {
          type: 'notes',
          id: '1'
        }
      ]
    }
  },
  included: [
    {
      id: '1',
      type: 'organizations',
      attributes: {
        id: 1,
        title: 'Do laundry'
      }
    }
  ],
  jsonapi: {
    version: '1.0'
  }
})
