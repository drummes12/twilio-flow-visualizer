// Datos de ejemplo para flujos de Twilio Studio
export const sampleFlows = {
  'ejemplo-basico': {
    description: 'Flujo de ejemplo básico',
    states: [
      {
        name: 'Trigger',
        type: 'trigger',
        transitions: [
          {
            event: 'incomingMessage',
            next: 'send_message_1'
          }
        ],
        properties: {
          offset: {
            x: 0,
            y: 0
          }
        }
      },
      {
        name: 'send_message_1',
        type: 'send-message',
        transitions: [
          {
            event: 'sent',
            next: 'gather_input_1'
          }
        ],
        properties: {
          offset: {
            x: 200,
            y: 100
          },
          body: 'Hola, bienvenido a nuestro servicio. ¿En qué podemos ayudarte?',
          service: 'default'
        }
      },
      {
        name: 'gather_input_1',
        type: 'gather-input-on-call',
        transitions: [
          {
            event: 'keypress',
            next: 'split_based_on_1'
          },
          {
            event: 'timeout',
            next: 'send_message_2'
          }
        ],
        properties: {
          offset: {
            x: 400,
            y: 100
          },
          voice: 'Presiona 1 para ventas, 2 para soporte técnico',
          number_of_digits: 1,
          timeout: 5
        }
      },
      {
        name: 'split_based_on_1',
        type: 'split-based-on',
        transitions: [
          {
            event: 'noMatch',
            next: 'send_message_2'
          },
          {
            event: 'match',
            next: 'send_message_3',
            conditions: [
              {
                friendly_name: 'If value equal_to 1',
                arguments: ['{{widgets.gather_input_1.Digits}}'],
                type: 'equal_to',
                value: '1'
              }
            ]
          },
          {
            event: 'match',
            next: 'send_message_4',
            conditions: [
              {
                friendly_name: 'If value equal_to 2',
                arguments: ['{{widgets.gather_input_1.Digits}}'],
                type: 'equal_to',
                value: '2'
              }
            ]
          }
        ],
        properties: {
          offset: {
            x: 600,
            y: 100
          },
          input: '{{widgets.gather_input_1.Digits}}'
        }
      },
      {
        name: 'send_message_2',
        type: 'send-message',
        transitions: [],
        properties: {
          offset: {
            x: 800,
            y: 200
          },
          body: 'Gracias por contactarnos. Que tengas un buen día.',
          service: 'default'
        }
      },
      {
        name: 'send_message_3',
        type: 'send-message',
        transitions: [],
        properties: {
          offset: {
            x: 800,
            y: 50
          },
          body: 'Te conectamos con el equipo de ventas.',
          service: 'default'
        }
      },
      {
        name: 'send_message_4',
        type: 'send-message',
        transitions: [],
        properties: {
          offset: {
            x: 800,
            y: 150
          },
          body: 'Te conectamos con soporte técnico.',
          service: 'default'
        }
      }
    ],
    initial_state: 'Trigger',
    flags: {
      allow_concurrent_calls: true
    }
  }
}

export const getFlowList = () => {
  return Object.keys(sampleFlows).map((key) => ({
    id: key,
    name: key.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    description: sampleFlows[key].description
  }))
}

export const getFlowData = (flowId) => {
  return sampleFlows[flowId] || null
}
