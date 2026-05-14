import { ConfigPlugin, createRunOncePlugin } from '@expo/config-plugins';
import { withHealthKit } from './withHealthKit';

const pkg = require('../../package.json');

export interface HealthKitPluginProps {
  /** Custom message for reading health data permission */
  healthSharePermission?: string;
  /** Custom message for writing health data permission */
  healthUpdatePermission?: string;
  /** Enable clinical records access (requires Apple approval) */
  isClinicalDataEnabled?: boolean;
  /** Enable background delivery for health data updates */
  backgroundDelivery?: boolean;
  /** Whether HealthKit is required for the app to function. Defaults to `true`. */
  healthKitRequired?: boolean;
}

const withHealthKitPlugin: ConfigPlugin<HealthKitPluginProps | void> = (config, props) => {
  return withHealthKit(config, props ?? {});
};

export default createRunOncePlugin(withHealthKitPlugin, pkg.name, pkg.version);
