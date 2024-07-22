# node-instant-llm
Quickly spin up a cloud compute instance and serve LLM predictions

## Installation

`npm install @neurodevs/node-instant-llm`

or 

`yarn add @neurodevs/node-instant-llm`

## Usage

The package and its interfaces are still being developed. It'll look something like this:

```typescript
import { InstantLlmImpl } from '@neurodevs/node-instant-llm'

const instance = InstantLlmImpl.Create({
    model: 'yourDesiredModel',
    provider: 'yourDesiredProvider',
    apiToken: 'yourApiTokenForCloudService'
    ...
})

await instance.run()
```
