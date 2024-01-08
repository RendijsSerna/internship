import {Application} from 'express';
import express from 'express';
import moment from 'moment';

import cluster from 'cluster';
import os from 'os';
import nodemailer from 'nodemailer';
import fs from 'fs';
import * as _ from 'lodash';
import {RegisterRoutes} from './routers/routes';
import swaggerUi from 'swagger-ui-express';

// All APIs that need to be included must be imported in app.ts
import {ControllerDummy} from './controllers/ControllerDummy';
import {ControllerUsers} from './controllers/ControllerUsers';
import {ControllerHabits} from './controllers/ControllerHabits';

const PORT = 8000;
const IS_PRODUCTION = process.env.IS_PRODUCTION;

if (cluster.isPrimary && IS_PRODUCTION) {
  // fork process
  let cpu_count = os.cpus().length;
  for (let i = 0; i < cpu_count; i++) {
    cluster.fork();
  }
} else {
  const app: Application = express();

  app.use(express.json());
  app.use(express.static('public')); // from this directory you can load files directly

  RegisterRoutes(app);

  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: {
        url: '/swagger.json',
      },
    }),
  );

  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}/docs`);
  });
}
