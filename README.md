# apple-health

An Expo module for interacting with Apple HealthKit on iOS devices. Read and write health data, subscribe to real-time updates, display activity rings, and more.

## Features

- **70+ quantity types** - Steps, heart rate, calories, distance, sleep, nutrition, and more
- **40+ category types** - Sleep analysis, symptoms, mindfulness, reproductive health
- **80+ workout types** - Running, cycling, swimming, yoga, and more
- **React hooks** - `usePermissions`, `useHealthKitQuery`, `useHealthKitStatistics`, `useHealthKitSubscription`, `useHealthKitAnchor`
- **Fluent builders** - `HealthKitQuery` and `HealthKitSampleBuilder` for imperative use
- **Real-time subscriptions** - Get notified when health data changes
- **Background delivery** - Process health updates when your app is in the background
- **Activity rings** - Native Apple Watch-style activity ring visualization
- **Full TypeScript support** - Complete typings for all APIs

## Installation

```bash
npx expo install apple-health
```

## Configuration

Add the config plugin to your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      [
        "apple-health",
        {
          "healthSharePermission": "Allow $(PRODUCT_NAME) to read your health data",
          "healthUpdatePermission": "Allow $(PRODUCT_NAME) to write your health data",
          "backgroundDelivery": true
        }
      ]
    ]
  }
}
```

### Plugin Options

| Option                   | Type      | Description                                              |
| ------------------------ | --------- | -------------------------------------------------------- |
| `healthSharePermission`  | `string`  | Custom message for read permission prompt                |
| `healthUpdatePermission` | `string`  | Custom message for write permission prompt               |
| `backgroundDelivery`     | `boolean` | Enable background delivery for health updates            |
| `isClinicalDataEnabled`  | `boolean` | Enable clinical records access (requires Apple approval) |

## Quick Start

```tsx
import {
  usePermissions,
  useHealthKitQuery,
  useHealthKitStatistics,
  PermissionStatus,
} from "apple-health/hooks";

export default function App() {
  // Request authorization with Expo-style hook
  const [status, requestPermission] = usePermissions({
    read: ["stepCount", "heartRate", "sleepAnalysis"],
    write: ["stepCount"],
  });

  // Query samples with a hook
  const { data: heartRates } = useHealthKitQuery({
    type: "heartRate",
    kind: "quantity",
    limit: 10,
    skip: status?.status !== PermissionStatus.GRANTED,
  });

  // Get aggregated statistics
  const { data: steps } = useHealthKitStatistics({
    type: "stepCount",
    aggregations: ["cumulativeSum"],
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    skip: status?.status !== PermissionStatus.GRANTED,
  });

  return (
    <View>
      <Button title="Authorize" onPress={requestPermission} />
      <Text>Status: {status?.status}</Text>
      <Text>Today's steps: {steps?.sumQuantity ?? 0}</Text>
    </View>
  );
}
```

## Authorization

### usePermissions Hook (Recommended)

The `usePermissions` hook follows Expo's permission pattern with automatic status fetching:

```tsx
import { usePermissions, PermissionStatus } from "apple-health/hooks";

function App() {
  const [status, requestPermission, getPermission] = usePermissions({
    read: ["stepCount", "heartRate", "sleepAnalysis"],
    write: ["stepCount"],
  });

  if (status?.status === PermissionStatus.GRANTED) {
    return <Text>Access granted!</Text>;
  }

  return <Button title="Grant Access" onPress={requestPermission} />;
}
```

**Hook options:**

| Option    | Type       | Description                              |
| --------- | ---------- | ---------------------------------------- |
| `read`    | `string[]` | Data types to request read access for    |
| `write`   | `string[]` | Data types to request write access for   |
| `get`     | `boolean`  | Auto-fetch status on mount (default: true) |
| `request` | `boolean`  | Auto-request on mount (default: false)   |

**Return value:** `[status, requestPermission, getPermission]`

- `status` - Current permission status (`HealthKitPermissionResponse | null`)
- `requestPermission` - Function to request permissions
- `getPermission` - Function to refresh current status

**Status properties:**

| Property      | Type                | Description                          |
| ------------- | ------------------- | ------------------------------------ |
| `status`      | `PermissionStatus`  | `'granted'`, `'denied'`, or `'undetermined'` |
| `granted`     | `boolean`           | Whether all permissions are granted  |
| `canAskAgain` | `boolean`           | Whether the user can be prompted     |
| `expires`     | `'never'`           | Permissions don't expire             |
| `permissions` | `object`            | Detailed per-type authorization status |

### Imperative API

For non-React contexts, use the module directly:

```tsx
import AppleHealth from "apple-health";

const result = await AppleHealth.requestAuthorization({
  read: ["stepCount", "heartRate", "sleepAnalysis"],
  write: ["stepCount"],
});

console.log(result.status); // 'notDetermined' | 'sharingDenied' | 'sharingAuthorized'
```

Or use the standalone async functions:

```tsx
import { getPermissionsAsync, requestPermissionsAsync } from "apple-health/hooks";

// Check current status
const status = await getPermissionsAsync({
  read: ["stepCount"],
  write: ["stepCount"],
});

// Request permissions
const result = await requestPermissionsAsync({
  read: ["stepCount", "heartRate"],
  write: ["stepCount"],
});
```

> **Important**: HealthKit intentionally hides read authorization status for privacy. The `granted` and `status` properties only reflect **write** permissions. For read-only access, the status will always be `undetermined`. To verify read access, try querying data directly.

## React Hooks

### usePermissions

Request and check HealthKit authorization using Expo's permission pattern:

```tsx
import { usePermissions, PermissionStatus } from "apple-health/hooks";

const [status, requestPermission, getPermission] = usePermissions({
  read: ["stepCount", "heartRate"],
  write: ["stepCount"],
  // get: true,    // Auto-fetch on mount (default)
  // request: false, // Auto-request on mount
});

// Check status (reflects write permissions only)
if (status?.granted) {
  // Write permissions granted
}

// Request permissions
await requestPermission();

// Refresh status
await getPermission();
```

> **Note**: HealthKit hides read permission status for privacy. The `granted` property only reflects write permissions. For read-only apps, query data directly to verify access.

### useHealthKitQuery

Fetch health samples with automatic lifecycle management:

```tsx
import { useHealthKitQuery } from "apple-health/hooks";

const {
  data, // HealthKitSample[] | null
  isLoading,
  error,
  refetch,
  deleteSample,
} = useHealthKitQuery({
  type: "heartRate",
  kind: "quantity", // 'quantity' | 'category' | 'workout'
  limit: 10,
  ascending: false,
  startDate: new Date("2024-01-01"),
  endDate: new Date(),
  skip: !authorized, // Skip query until authorized
});

// Samples have a delete() method
const handleDelete = async (sample) => {
  await deleteSample(sample);
};
```

### useHealthKitStatistics

Get aggregated statistics for quantity types:

```tsx
import { useHealthKitStatistics } from "apple-health/hooks";

// Single aggregated result
const { data: todaySteps } = useHealthKitStatistics({
  type: "stepCount",
  aggregations: ["cumulativeSum"],
  startDate: todayStart,
  endDate: new Date(),
});
// data.sumQuantity = 8500

// Time-bucketed results (returns array)
const { data: weeklySteps } = useHealthKitStatistics({
  type: "stepCount",
  aggregations: ["cumulativeSum"],
  interval: "day", // 'hour' | 'day' | 'week' | 'month' | 'year'
  startDate: weekAgo,
  endDate: new Date(),
});
// data = [{ startDate, endDate, sumQuantity }, ...]
```

**Aggregation types:**

- `cumulativeSum` - Total sum (steps, calories, distance)
- `discreteAverage` - Average value (heart rate, temperature)
- `discreteMin` - Minimum value
- `discreteMax` - Maximum value
- `mostRecent` - Most recent value

### useHealthKitSubscription

Get notified when HealthKit data changes:

```tsx
import { useHealthKitSubscription } from "apple-health/hooks";

const { isActive, lastUpdate, start, pause, resume, unsubscribe } =
  useHealthKitSubscription({
    type: "stepCount",
    onUpdate: () => {
      // Data changed - refetch your queries
      refetchSteps();
    },
    autoStart: true,
  });
```

### useHealthKitAnchor

Paginated incremental sync for large datasets:

```tsx
import { useHealthKitAnchor } from "apple-health/hooks";

const {
  samples, // All fetched samples
  deletedObjects, // Tracked deletions for sync
  hasMore,
  isLoading,
  fetchMore,
  reset,
  getAnchorState, // Serialize for persistence
} = useHealthKitAnchor({
  type: "stepCount",
  kind: "quantity",
  limit: 50, // Fetch 50 at a time
  persistenceKey: "stepCount-anchor", // Auto-persist anchor state
});

// Load more samples
<Button
  title={`Load More (${samples.length} loaded)`}
  onPress={fetchMore}
  disabled={!hasMore}
/>;
```

## Imperative API

### HealthKitQuery

Fluent query builder for one-off queries:

```tsx
import { HealthKitQuery } from "apple-health";

const samples = await new HealthKitQuery()
  .type("sleepAnalysis", "category")
  .dateRange(yesterday, today)
  .limit(10)
  .ascending(false)
  .execute();

// Get statistics
const stats = await new HealthKitQuery()
  .type("stepCount", "quantity")
  .dateRange(weekAgo, today)
  .aggregations(["cumulativeSum", "discreteAverage"])
  .executeStatistics();

// Time-bucketed statistics
const dailyStats = await new HealthKitQuery()
  .type("heartRate", "quantity")
  .dateRange(weekAgo, today)
  .interval("day")
  .aggregations(["discreteAverage", "discreteMin", "discreteMax"])
  .executeStatistics();
```

### HealthKitSampleBuilder

Create and save health samples:

```tsx
import { HealthKitSampleBuilder } from "apple-health";

// Save a quantity sample
const stepsSample = await new HealthKitSampleBuilder()
  .quantityType("stepCount")
  .value(1000)
  .unit("count")
  .startDate(hourAgo)
  .endDate(new Date())
  .save();

// Save a category sample
const sleepSample = await new HealthKitSampleBuilder()
  .categoryType("sleepAnalysis")
  .categoryValue(4) // 4 = deep sleep
  .startDate(lastNight)
  .endDate(thisMonring)
  .save();

// Save a workout
const workoutSample = await new HealthKitSampleBuilder()
  .workoutType("running")
  .startDate(thirtyMinutesAgo)
  .endDate(new Date())
  .totalEnergyBurned(250) // kcal
  .totalDistance(5000) // meters
  .metadata({ HKIndoorWorkout: false })
  .save();
```

## Subscriptions & Anchors

### HealthKitSubscription

Low-level subscription for real-time updates:

```tsx
import { HealthKitSubscription } from "apple-health";

const subscription = new HealthKitSubscription("stepCount");

subscription.onUpdate = () => {
  console.log("Step count changed!");
};

subscription.start();
// ... later
subscription.unsubscribe();
```

### HealthKitAnchor

Paginated sync with deletion tracking:

```tsx
import { HealthKitAnchor } from "apple-health";

const anchor = new HealthKitAnchor("stepCount", "quantity");

// Restore previous anchor state
const savedState = await AsyncStorage.getItem("anchor-state");
if (savedState) anchor.restore(savedState);

// Fetch samples
const { samples, deletedObjects, hasMore } = await anchor.fetchNext(50);

// Process deletions for sync
for (const deleted of deletedObjects) {
  await localDB.delete(deleted.uuid);
}

// Save anchor state for next session
await AsyncStorage.setItem("anchor-state", anchor.serialize());
```

## Background Delivery

Receive health updates when your app is in the background:

```tsx
import AppleHealth from "apple-health";
import { useEvent } from "expo";

// Enable background delivery (once per type)
await AppleHealth.enableBackgroundDelivery("stepCount", "hourly");
// frequency: 'immediate' | 'hourly' | 'daily'

// Listen for background updates
const event = useEvent(AppleHealth, "onBackgroundDelivery");
useEffect(() => {
  if (event) {
    console.log("Background update:", event.typeIdentifier);
  }
}, [event]);

// Disable when no longer needed
await AppleHealth.disableBackgroundDelivery("stepCount");
await AppleHealth.disableAllBackgroundDelivery();
```

## Activity Rings

Display Apple Watch-style activity rings:

```tsx
import { ActivityRingView } from "apple-health";
import AppleHealth from "apple-health";

// Fetch today's activity summary
const summaries = await AppleHealth.queryActivitySummary(
  today.toISOString(),
  today.toISOString()
);

<ActivityRingView
  summary={{
    activeEnergyBurned: 420,
    activeEnergyBurnedGoal: 500,
    appleExerciseTime: 25,
    appleExerciseTimeGoal: 30,
    appleStandHours: 10,
    appleStandHoursGoal: 12,
  }}
  style={{ width: 150, height: 150 }}
/>;
```

## User Characteristics

Read user profile data (requires authorization):

```tsx
import AppleHealth from "apple-health";

const dateOfBirth = await AppleHealth.getDateOfBirth();
const biologicalSex = await AppleHealth.getBiologicalSex();
const bloodType = await AppleHealth.getBloodType();
const skinType = await AppleHealth.getFitzpatrickSkinType();
const wheelchairUse = await AppleHealth.getWheelchairUse();
```

## Deleting Samples

Delete samples you've written:

```tsx
// Delete via sample object
await sample.delete();

// Delete via hook
const { deleteSample } = useHealthKitQuery({
  type: "stepCount",
  kind: "quantity",
});
await deleteSample(sample);

// Delete by date range
await AppleHealth.deleteSamples(
  "stepCount",
  startDate.toISOString(),
  endDate.toISOString()
);
```

## Data Types

### Quantity Types

| Category  | Types                                                                                                                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Body      | `bodyMass`, `height`, `bodyFatPercentage`, `bodyMassIndex`, `leanBodyMass`, `waistCircumference`                                                                                                    |
| Fitness   | `stepCount`, `distanceWalkingRunning`, `distanceCycling`, `activeEnergyBurned`, `basalEnergyBurned`, `flightsClimbed`, `appleExerciseTime`, `vo2Max`                                                |
| Vitals    | `heartRate`, `restingHeartRate`, `walkingHeartRateAverage`, `heartRateVariabilitySDNN`, `bloodPressureSystolic`, `bloodPressureDiastolic`, `oxygenSaturation`, `respiratoryRate`, `bodyTemperature` |
| Nutrition | `dietaryEnergyConsumed`, `dietaryProtein`, `dietaryCarbohydrates`, `dietaryFatTotal`, `dietaryCaffeine`, `dietaryWater`                                                                             |

### Category Types

| Category            | Types                                                                        |
| ------------------- | ---------------------------------------------------------------------------- |
| Sleep               | `sleepAnalysis`                                                              |
| Activity            | `appleStandHour`, `lowCardioFitnessEvent`                                    |
| Heart               | `highHeartRateEvent`, `lowHeartRateEvent`, `irregularHeartRhythmEvent`       |
| Symptoms            | `headache`, `fatigue`, `fever`, `nausea`, `dizziness`, `shortnessOfBreath`   |
| Mindfulness         | `mindfulSession`                                                             |
| Reproductive Health | `menstrualFlow`\*, `cervicalMucusQuality`, `ovulationTestResult`, `sexualActivity` |

\* `menstrualFlow` requires the `HKMenstrualCycleStart` metadata key (boolean). See [Required Metadata](#required-metadata).

### Sleep Values

| Value | Meaning            |
| ----- | ------------------ |
| 0     | In Bed             |
| 2     | Awake              |
| 3     | Core Sleep (light) |
| 4     | Deep Sleep         |
| 5     | REM Sleep          |

### Symptom Values

| Value | Meaning     |
| ----- | ----------- |
| 0     | Not Present |
| 1     | Mild        |
| 2     | Moderate    |
| 3     | Severe      |

### Required Metadata

Some category types require specific metadata keys to be set. If metadata is missing, HealthKit will reject the sample with a validation error.

| Type           | Required Metadata Key   | Type    | Description                                        |
| -------------- | ----------------------- | ------- | -------------------------------------------------- |
| `menstrualFlow` | `HKMenstrualCycleStart` | boolean | `true` if this sample starts a new menstrual cycle |

**Example:**

```tsx
await new HealthKitSampleBuilder()
  .categoryType("menstrualFlow")
  .categoryValue(2) // light flow
  .startDate(startOfDay)
  .endDate(endOfDay)
  .metadata({ HKMenstrualCycleStart: true }) // Required!
  .save();
```

## TypeScript Types

```tsx
import type {
  // Data type identifiers
  QuantityTypeIdentifier,
  CategoryTypeIdentifier,
  CharacteristicTypeIdentifier,
  WorkoutActivityType,
  HealthKitDataType,

  // Sample types
  QuantitySample,
  CategorySample,
  WorkoutSample,
  HealthKitSample,

  // Query/statistics
  StatisticsResult,
  StatisticsAggregation,
  ActivitySummary,

  // Authorization
  HealthKitPermissions,
  AuthorizationResult,
  AuthorizationStatus,

  // Permissions (Expo-style)
  HealthKitPermissionOptions,
  HealthKitPermissionResponse,
} from "apple-health";

// PermissionStatus enum
import { PermissionStatus } from "apple-health";
// PermissionStatus.GRANTED | PermissionStatus.DENIED | PermissionStatus.UNDETERMINED
```

---

## CLI & DevTools

This package includes a CLI for querying and writing HealthKit data during development.

### Quick Start

1. Enable devtools in your app:

   ```tsx
   import { useHealthKitDevTools } from "apple-health/dev-tools";

   export default function App() {
     useHealthKitDevTools();
     return <YourApp />;
   }
   ```

2. Run CLI commands:

   ```bash
   # Check connection
   bunx apple-health status

   # Write data with natural date formats
   bunx apple-health write quantity heartRate 72 --start "today 8am"
   bunx apple-health write quantity stepCount 8000 --start "yesterday" --duration "1d"

   # Query data
   bunx apple-health query quantity heartRate --limit 10

   # Get statistics
   bunx apple-health stats stepCount --interval day --start "-7d"

   # Interactive mode
   bunx apple-health repl
   ```

### Documentation

- **[CLI Reference](docs/cli.md)** - Complete command reference, date formats, batch mode
- **[Seeding Data Guide](docs/seeding-data.md)** - Using Claude Code to generate test data

---

## Notes

- **iOS only** - HealthKit is not available on Android
- **Simulator limitations** - The iOS Simulator has limited HealthKit data; use a real device for full testing
- **Privacy** - HealthKit hides read authorization status; query data to verify access
- **iOS 16+ types** - Some types (e.g., `runningPower`, `underwaterDepth`) require iOS 16+

## Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide](https://github.com/expo/expo#contributing).
