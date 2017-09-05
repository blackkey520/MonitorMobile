import appModel from './app'
import pointModel from './point'
import router from './router'
import search from './search'
import target from './target'
import alarm from './alarm'
import monitordata from './monitordata'
export function registerModels(app) {
  app.model(appModel)
  app.model(pointModel)
  app.model(router)
  app.model(search)
  app.model(target)
  app.model(alarm)
  app.model(monitordata)
}
