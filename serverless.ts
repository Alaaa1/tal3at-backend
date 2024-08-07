import serverless from './src/libs/baseServerless';

import f from './functions';
import r from './resources';

module.exports = serverless({
  service: 'tal3at-backend',
  provider: {
    architecture: 'x86_64',
    timeout: 29,
    apiGateway: {
      metrics: true,
      shouldStartNameWithService: true
    },
    logRetentionInDays: 90,
    tracing: {
      lambda: true,
      apiGateway: true
    },
    logs: {
      restApi: true
    }
  },
  custom: {},
  functions: f,
  resources: r
});