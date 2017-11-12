import { TabNavigator, TabBarBottom } from 'react-navigation';
import PointList from './PointList';
import MonitorMap from './MonitorMap';
import Notification from './Notification';
import Mine from './Mine';

export default TabNavigator(
  {
    MonitorList: { screen: PointList },
    MonitorMap: { screen: MonitorMap },
    Notification: { screen: Notification },
    Mine: { screen: Mine }
  },
  {
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
    lazyLoad: true,
  }
);
