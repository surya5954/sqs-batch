export default {
  type: "object",
  properties: {
    numberOfBatch: { type: 'number' },
    maxMessagesPerBatch: { type: 'number' },
    delaySeconds: { type: 'number' }
  },
  required: ['numberOfBatch', 'maxMessagesPerBatch']
} as const;
