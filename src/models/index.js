import appModel from './app';
import pointModel from './point';
import router from './router';
import search from './search';
import target from './target';
import alarm from './alarm';
import monitordata from './monitordata';
import warn from './warn';
import verified from './verified';
import feedback from './feedback';

export function registerModels(app) {
  app.model(appModel);
  app.model(pointModel);
  app.model(router);
  app.model(search);
  app.model(target);
  app.model(alarm);
  app.model(monitordata);
  app.model(warn);
  app.model(verified);
  app.model(feedback);
}
