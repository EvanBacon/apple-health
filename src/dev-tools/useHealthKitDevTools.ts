import { useEffect } from "react";
import { useDevToolsPluginClient } from "expo/devtools";
import AppleHealth from "../AppleHealthModule";
import { HealthKitQuery } from "../HealthKitQuery";
import { HealthKitSampleBuilder } from "../HealthKitSampleBuilder";
import type {
  QuantityTypeIdentifier,
  CategoryTypeIdentifier,
  WorkoutActivityType,
  QueryOptions,
  StatisticsOptions,
  StatisticsAggregation,
  HealthKitDataType,
} from "../AppleHealth.types";

interface PluginMessage {
  id: string;
  type: string;
  payload: Record<string, unknown>;
}

function useHealthKitDevToolsDev() {
  const client = useDevToolsPluginClient("healthkit");

  useEffect(() => {
    if (!client) return;

    const handleMessage = (data: PluginMessage) => {
      const { id, type, payload } = data;

      const sendResult = (result: unknown) => {
        client.sendMessage("result", { id, type: "result", data: result });
      };

      const sendError = (error: Error) => {
        client.sendMessage("error", {
          id,
          type: "error",
          error: error.message,
        });
      };

      (async () => {
        try {
          switch (type) {
            // Query handlers
            case "queryQuantitySamples": {
              const options = payload.options as QueryOptions | undefined;
              const query = new HealthKitQuery()
                .type(payload.type as QuantityTypeIdentifier, "quantity")
                .dateRange(options?.startDate, options?.endDate);
              if (options?.limit) query.limit(options.limit);
              if (options?.ascending !== undefined)
                query.ascending(options.ascending);
              const samples = await query.execute();
              sendResult(samples.map((s) => s.toJSON()));
              break;
            }

            case "queryCategorySamples": {
              const options = payload.options as QueryOptions | undefined;
              const query = new HealthKitQuery()
                .type(payload.type as CategoryTypeIdentifier, "category")
                .dateRange(options?.startDate, options?.endDate);
              if (options?.limit) query.limit(options.limit);
              if (options?.ascending !== undefined)
                query.ascending(options.ascending);
              const samples = await query.execute();
              sendResult(samples.map((s) => s.toJSON()));
              break;
            }

            case "queryWorkouts": {
              const options = payload.options as QueryOptions | undefined;
              const query = new HealthKitQuery()
                .type("workout", "workout")
                .dateRange(options?.startDate, options?.endDate);
              if (options?.limit) query.limit(options.limit);
              if (options?.ascending !== undefined)
                query.ascending(options.ascending);
              const samples = await query.execute();
              sendResult(samples.map((s) => s.toJSON()));
              break;
            }

            case "queryStatistics": {
              const options = payload.options as QueryOptions | undefined;
              const query = new HealthKitQuery()
                .type(payload.type as QuantityTypeIdentifier, "statistics")
                .dateRange(options?.startDate, options?.endDate)
                .aggregations(payload.aggregations as StatisticsAggregation[]);
              const result = await query.executeStatistics();
              sendResult(result);
              break;
            }

            case "queryStatisticsCollection": {
              const options = payload.options as StatisticsOptions;
              const query = new HealthKitQuery()
                .type(payload.type as QuantityTypeIdentifier, "statistics")
                .dateRange(options?.startDate, options?.endDate)
                .aggregations(payload.aggregations as StatisticsAggregation[])
                .interval(options.interval);
              const result = await query.executeStatistics();
              sendResult(result);
              break;
            }

            case "queryActivitySummary": {
              const result = await AppleHealth.queryActivitySummary(
                payload.startDate as string,
                payload.endDate as string
              );
              sendResult(result);
              break;
            }

            // Write handlers
            case "saveQuantitySample": {
              const builder = new HealthKitSampleBuilder()
                .quantityType(payload.type as QuantityTypeIdentifier)
                .value(payload.value as number)
                .unit(payload.unit as string)
                .startDate(payload.startDate as string)
                .endDate(payload.endDate as string);
              if (payload.metadata)
                builder.metadata(payload.metadata as Record<string, unknown>);
              const sample = await builder.save();
              sendResult({ success: true, sample });
              break;
            }

            case "saveCategorySample": {
              const builder = new HealthKitSampleBuilder()
                .categoryType(payload.type as CategoryTypeIdentifier)
                .categoryValue(payload.value as number)
                .startDate(payload.startDate as string)
                .endDate(payload.endDate as string);
              if (payload.metadata)
                builder.metadata(payload.metadata as Record<string, unknown>);
              const sample = await builder.save();
              sendResult({ success: true, sample });
              break;
            }

            case "saveWorkout": {
              const builder = new HealthKitSampleBuilder()
                .workoutType(payload.activityType as WorkoutActivityType)
                .startDate(payload.startDate as string)
                .endDate(payload.endDate as string);
              if (payload.energy)
                builder.totalEnergyBurned(payload.energy as number);
              if (payload.distance)
                builder.totalDistance(payload.distance as number);
              if (payload.metadata)
                builder.metadata(payload.metadata as Record<string, unknown>);
              const sample = await builder.save();
              sendResult({ success: true, sample });
              break;
            }

            case "deleteSamples": {
              const success = await AppleHealth.deleteSamples(
                payload.type as QuantityTypeIdentifier | CategoryTypeIdentifier,
                payload.startDate as string,
                payload.endDate as string
              );
              sendResult({ success });
              break;
            }

            // Authorization handlers
            case "getAuthorizationStatus": {
              const status = await AppleHealth.getAuthorizationStatus(
                payload.types as string[]
              );
              sendResult(status);
              break;
            }

            case "requestAuthorization": {
              const result = await AppleHealth.requestAuthorization({
                read: payload.read as HealthKitDataType[],
                write: payload.write as HealthKitDataType[],
              });
              sendResult(result);
              break;
            }

            // Characteristics
            case "getCharacteristics": {
              const [
                dateOfBirth,
                biologicalSex,
                bloodType,
                fitzpatrickSkinType,
                wheelchairUse,
              ] = await Promise.all([
                AppleHealth.getDateOfBirth().catch(() => null),
                AppleHealth.getBiologicalSex().catch(() => null),
                AppleHealth.getBloodType().catch(() => null),
                AppleHealth.getFitzpatrickSkinType().catch(() => null),
                AppleHealth.getWheelchairUse().catch(() => null),
              ]);
              sendResult({
                dateOfBirth,
                biologicalSex,
                bloodType,
                fitzpatrickSkinType,
                wheelchairUse,
              });
              break;
            }

            // Status
            case "getStatus": {
              const isAvailable = AppleHealth.isAvailable();
              sendResult({ isAvailable });
              break;
            }

            // Subscriptions
            case "subscribeToChanges": {
              const subscriptionId = await AppleHealth.subscribeToChanges(
                payload.type as QuantityTypeIdentifier | CategoryTypeIdentifier
              );
              sendResult({ subscriptionId });
              break;
            }

            case "unsubscribe": {
              await AppleHealth.unsubscribe(payload.subscriptionId as string);
              sendResult({ success: true });
              break;
            }

            default:
              sendError(new Error(`Unknown message type: ${type}`));
          }
        } catch (error) {
          sendError(error as Error);
        }
      })();
    };

    // Listen for messages from the CLI
    const subscription = client.addMessageListener(
      "message",
      (msg: unknown) => {
        handleMessage(msg as PluginMessage);
      }
    );

    return () => {
      subscription?.remove?.();
    };
  }, [client]);
}

export const useHealthKitDevTools = __DEV__
  ? useHealthKitDevToolsDev
  : () => {};
