export default {
  type: "object",
  properties: {
    numberOfBatch: { type: 'number' },
    delaySeconds: { type: 'number' }
  },
  required: ['numberOfBatch']
} as const;
