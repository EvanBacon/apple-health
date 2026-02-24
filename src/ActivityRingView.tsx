import { requireNativeView } from "expo";
import { ViewStyle, StyleProp } from "react-native";

import { ActivitySummary } from "./AppleHealth.types";

export interface ActivityRingViewProps {
  /**
   * The activity summary data to display in the rings.
   * Contains Move (activeEnergyBurned), Exercise (appleExerciseTime), and Stand (appleStandHours) data.
   */
  summary?: Omit<ActivitySummary, "dateComponents">;
  style?: StyleProp<ViewStyle>;
}

/**
 * Displays Apple Watch-style activity rings showing Move (red), Exercise (green), and Stand (blue) progress.
 *
 * @example
 * ```tsx
 * <ActivityRingView
 *   summary={{
 *     activeEnergyBurned: 350,
 *     activeEnergyBurnedGoal: 500,
 *     appleExerciseTime: 25,
 *     appleExerciseTimeGoal: 30,
 *     appleStandHours: 10,
 *     appleStandHoursGoal: 12,
 *   }}
 *   style={{ width: 200, height: 200 }}
 * />
 * ```
 */
export const ActivityRingView =
  requireNativeView<ActivityRingViewProps>("AppleHealth_ActivityRingView");
