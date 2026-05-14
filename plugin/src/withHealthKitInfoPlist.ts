import { ConfigPlugin, withInfoPlist } from '@expo/config-plugins';
import { HealthKitPluginProps } from './index';

const DEFAULT_SHARE_PERMISSION = 'Allow $(PRODUCT_NAME) to access your health data.';
const DEFAULT_UPDATE_PERMISSION = 'Allow $(PRODUCT_NAME) to save health data.';

export const withHealthKitInfoPlist: ConfigPlugin<HealthKitPluginProps> = (
  config,
  { healthSharePermission, healthUpdatePermission, healthKitRequired = true }
) => {
  return withInfoPlist(config, (config) => {
    config.modResults['NSHealthShareUsageDescription'] =
      healthSharePermission ?? DEFAULT_SHARE_PERMISSION;
    config.modResults['NSHealthUpdateUsageDescription'] =
      healthUpdatePermission ?? DEFAULT_UPDATE_PERMISSION;

    if (healthKitRequired) {
      const capabilities = (config.modResults['UIRequiredDeviceCapabilities'] as string[]) ?? [];

      if (!capabilities.includes('healthkit')) capabilities.push('healthkit');

      config.modResults['UIRequiredDeviceCapabilities'] = capabilities;
    }

    return config;
  });
};
