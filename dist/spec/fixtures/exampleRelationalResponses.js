"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleRelatedToOneUnmatchedTypeResponse = exports.exampleRelatedToOneIncludedResponse = exports.exampleRelatedToManyIncludedWithNoiseResponse = exports.exampleRelatedToManyIncludedResponse = exports.exampleRelatedToManyWithNoiseResponse = exports.exampleRelatedToManyResponse = void 0;
exports.exampleRelatedToManyResponse = JSON.stringify({
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
    }
});
exports.exampleRelatedToManyWithNoiseResponse = JSON.stringify({
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
});
exports.exampleRelatedToManyIncludedResponse = JSON.stringify({
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
});
exports.exampleRelatedToManyIncludedWithNoiseResponse = JSON.stringify({
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
});
exports.exampleRelatedToOneIncludedResponse = JSON.stringify({
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
});
exports.exampleRelatedToOneUnmatchedTypeResponse = JSON.stringify({
    data: {
        id: '1',
        type: 'organizations',
        attributes: {
            id: 1,
            name: 'Do laundry'
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
});
//# sourceMappingURL=exampleRelationalResponses.js.map