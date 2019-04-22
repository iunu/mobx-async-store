const exampleRelationalResponse = JSON.stringify({
  "data": {
    "id": "1",
    "type": "todos",
    "attributes": {
      "id": 1,
      "title": "Do laundry",
    },
    "relationships": {
      "notes": {
        "data": [
          {
            "type": "notes",
            "id": "1"
          }
        ]
      }
    }
  },
  "included": [
    {
      "id": "1",
      "type": "type",
      "attributes": {
        "description": "Use fabric softener"
      }
    }
  ],
  "jsonapi": {
    "version": "1.0"
  }
})

export default exampleRelationalResponse
