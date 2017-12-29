import { StackNavigator } from 'react-navigation';
import HomeNavigator from './Home/';
import MonitorPoint from './MonitorPoint';
import Search from './Search';
import CollectPointList from './CollectPointList';
import ContactList from './ContactList';
import QRCodeScreen from './QRCodeScreen';
import Target from './Target';
import AlarmDetail from './AlarmDetail';
import AlarmFeedback from './AlarmFeedback';
import FeedbackDetail from './FeedbackDetail';
import ChangePassword from './ChangePassword';
import HistoryData from './HistoryData';

export default StackNavigator(
  {
    HomeNavigator: { screen: HomeNavigator },
    MonitorPoint: { screen: MonitorPoint },
    Search: { screen: Search },
    CollectPointList: { screen: CollectPointList },
    ContactList: { screen: ContactList }, 
    QRCodeScreen: { screen: QRCodeScreen },
    Target: { screen: Target },
    AlarmDetail: { screen: AlarmDetail },
    AlarmFeedback: { screen: AlarmFeedback },
    FeedbackDetail: { screen: FeedbackDetail },
    ChangePassword: { screen: ChangePassword },
    HistoryData: { screen: HistoryData },
  }, {
    headerMode: 'float',
  }
);
