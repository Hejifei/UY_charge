import { combineReducers } from '../../weapp-redux/index';

import { numHandle } from './numHandle';
import {protocolInfo} from './protocolInfo'

export default combineReducers({
  numHandle,
  protocolInfo,
})