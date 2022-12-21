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

export const exampleRelatedToManyWithNoiseResponse = JSON.stringify({
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
          },
          {
            type: 'unexpected_noise',
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

export const exampleRelatedToManyIncludedWithNoiseResponse = JSON.stringify({
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
          },
          {
            type: 'unexpected_noise',
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
    },
    {
      id: '1',
      type: 'unexpected_noise',
      attributes: {
        description: 'The store does not know about this type'
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

export const exampleRelatedToOneNoRelatedRecords = JSON.stringify({
  data: {
    id: '1',
    type: 'todos',
    attributes: {
      id: 1,
      title: 'Do laundry'
    },
    relationships: {
      meeting_notes: {
        meta: {
          included: false
        }
      },
      awesome_notes: {
        meta: {
          included: false
        }
      }
    }
  },
  jsonapi: {
    version: '1.0'
  }
})
