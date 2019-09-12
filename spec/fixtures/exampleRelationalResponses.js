export const exampleRelatedToManyResponse = JSON.stringify({
  data: {
    id: '1',
    type: 'todos',
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
  }
})

export const exampleRelatedToManyIncludedResponse = JSON.stringify({
  data: {
    id: '1',
    type: 'todos',
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
      type: 'todos',
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
