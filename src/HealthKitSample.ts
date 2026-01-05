import type {
  QuantityTypeIdentifier,
  CategoryTypeIdentifier,
  WorkoutActivityType,
  DeviceInfo,
} from "./AppleHealth.types";

/** Sample type discriminator */
export type SampleTypename = 'QuantitySample' | 'CategorySample' | 'WorkoutSample';

/**
 * Native shared object interface for samples
 */
interface NativeHealthKitSample {
  readonly uuid: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly sourceName: string;
  readonly sourceId: string;
  readonly metadata: Record<string, unknown> | null;
  delete(): Promise<boolean>;
  toJSON(): Record<string, unknown>;
}

interface NativeQuantitySample extends NativeHealthKitSample {
  readonly quantityType: string;
  readonly value: number;
  readonly unit: string;
  readonly device: DeviceInfo | null;
}

interface NativeCategorySample extends NativeHealthKitSample {
  readonly categoryType: string;
  readonly value: number;
}

interface NativeWorkoutSample extends NativeHealthKitSample {
  readonly workoutActivityType: string;
  readonly duration: number;
  readonly totalEnergyBurned: number | null;
  readonly totalDistance: number | null;
}

/**
 * Base class for HealthKit samples with common functionality.
 * Holds a reference to the native HKSample for operations like delete.
 */
export abstract class HealthKitSampleBase {
  protected native: NativeHealthKitSample;

  /** Type discriminator for sample type checking */
  abstract readonly __typename: SampleTypename;

  constructor(native: NativeHealthKitSample) {
    this.native = native;
  }

  /** Unique identifier for this sample */
  get uuid(): string {
    return this.native.uuid;
  }

  /** Start date of the sample (ISO8601 string) */
  get startDate(): string {
    return this.native.startDate;
  }

  /** End date of the sample (ISO8601 string) */
  get endDate(): string {
    return this.native.endDate;
  }

  /** Name of the source app that created this sample */
  get sourceName(): string {
    return this.native.sourceName;
  }

  /** Bundle identifier of the source app */
  get sourceId(): string {
    return this.native.sourceId;
  }

  /** Optional metadata associated with this sample */
  get metadata(): Record<string, unknown> | null {
    return this.native.metadata;
  }

  /**
   * Delete this sample from HealthKit.
   * Requires write authorization for this sample type.
   *
   * @returns true if deletion was successful
   * @throws Error if deletion fails or sample was created by another app
   */
  async delete(): Promise<boolean> {
    return this.native.delete();
  }

  /**
   * Convert to a plain object for serialization.
   */
  toJSON(): Record<string, unknown> {
    return this.native.toJSON();
  }
}

/**
 * A quantity sample from HealthKit (steps, heart rate, distance, etc.)
 *
 * @example
 * ```ts
 * const samples = await query.execute();
 * for (const sample of samples) {
 *   if (sample.__typename === 'QuantitySample') {
 *     console.log(`${sample.value} ${sample.unit}`);
 *   }
 * }
 * ```
 */
export class QuantitySample extends HealthKitSampleBase {
  readonly __typename = 'QuantitySample' as const;

  constructor(native: NativeQuantitySample) {
    super(native);
  }

  private get _native(): NativeQuantitySample {
    return this.native as NativeQuantitySample;
  }

  /** The quantity type identifier (e.g., 'stepCount', 'heartRate') */
  get quantityType(): QuantityTypeIdentifier {
    return this._native.quantityType as QuantityTypeIdentifier;
  }

  /** The numeric value of this sample */
  get value(): number {
    return this._native.value;
  }

  /** The unit of measurement (e.g., 'count', 'count/min') */
  get unit(): string {
    return this._native.unit;
  }

  /** Device information if available */
  get device(): DeviceInfo | null {
    return this._native.device;
  }
}

/**
 * A category sample from HealthKit (sleep, symptoms, etc.)
 *
 * @example
 * ```ts
 * const samples = await query.execute();
 * for (const sample of samples) {
 *   if (sample.__typename === 'CategorySample') {
 *     // Sleep values: 0 = inBed, 1 = asleepUnspecified, 2 = awake, etc.
 *     console.log(`Sleep state: ${sample.value}`);
 *   }
 * }
 * ```
 */
export class CategorySample extends HealthKitSampleBase {
  readonly __typename = 'CategorySample' as const;

  constructor(native: NativeCategorySample) {
    super(native);
  }

  private get _native(): NativeCategorySample {
    return this.native as NativeCategorySample;
  }

  /** The category type identifier (e.g., 'sleepAnalysis') */
  get categoryType(): CategoryTypeIdentifier {
    return this._native.categoryType as CategoryTypeIdentifier;
  }

  /** The category value (enum-specific integer) */
  get value(): number {
    return this._native.value;
  }
}

/**
 * A workout sample from HealthKit
 *
 * @example
 * ```ts
 * const samples = await query.execute();
 * for (const sample of samples) {
 *   if (sample.__typename === 'WorkoutSample') {
 *     console.log(`${sample.workoutActivityType}: ${sample.duration}s`);
 *     if (sample.totalEnergyBurned) {
 *       console.log(`Burned ${sample.totalEnergyBurned} kcal`);
 *     }
 *   }
 * }
 * ```
 */
export class WorkoutSample extends HealthKitSampleBase {
  readonly __typename = 'WorkoutSample' as const;

  constructor(native: NativeWorkoutSample) {
    super(native);
  }

  private get _native(): NativeWorkoutSample {
    return this.native as NativeWorkoutSample;
  }

  /** The workout activity type (e.g., 'running', 'cycling') */
  get workoutActivityType(): WorkoutActivityType {
    return this._native.workoutActivityType as WorkoutActivityType;
  }

  /** Duration in seconds */
  get duration(): number {
    return this._native.duration;
  }

  /** Total energy burned in kilocalories, if available */
  get totalEnergyBurned(): number | null {
    return this._native.totalEnergyBurned;
  }

  /** Total distance in meters, if available */
  get totalDistance(): number | null {
    return this._native.totalDistance;
  }
}

/**
 * Union type for all sample types
 */
export type HealthKitSample = QuantitySample | CategorySample | WorkoutSample;

/**
 * Wraps a native sample object in the appropriate TypeScript class
 * @internal
 */
export function wrapNativeSample(native: unknown): HealthKitSample {
  const sample = native as NativeHealthKitSample & {
    __typename?: SampleTypename;
    quantityType?: string;
    categoryType?: string;
    workoutActivityType?: string;
  };

  // Use __typename discriminator if available
  if (sample.__typename) {
    switch (sample.__typename) {
      case 'QuantitySample':
        return new QuantitySample(sample as NativeQuantitySample);
      case 'CategorySample':
        return new CategorySample(sample as NativeCategorySample);
      case 'WorkoutSample':
        return new WorkoutSample(sample as NativeWorkoutSample);
    }
  }

  // Fallback to property-based detection
  // Note: Native shared object properties aren't enumerable, so we check
  // by accessing the property directly instead of using the 'in' operator
  try {
    if (sample.quantityType) {
      return new QuantitySample(sample as NativeQuantitySample);
    }
  } catch {}

  try {
    if (sample.categoryType) {
      return new CategorySample(sample as NativeCategorySample);
    }
  } catch {}

  try {
    if (sample.workoutActivityType) {
      return new WorkoutSample(sample as NativeWorkoutSample);
    }
  } catch {}

  throw new Error("Unknown sample type");
}

/**
 * Wraps an array of native samples
 * @internal
 */
export function wrapNativeSamples(natives: unknown[]): HealthKitSample[] {
  return natives.map(wrapNativeSample);
}
