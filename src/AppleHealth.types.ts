// ─────────────────────────────────────────────────────────────────────────────
// Quantity Type Identifiers (70+ types)
// ─────────────────────────────────────────────────────────────────────────────

export type QuantityTypeIdentifier =
  // Body Measurements
  | 'bodyMassIndex'
  | 'bodyFatPercentage'
  | 'height'
  | 'bodyMass'
  | 'leanBodyMass'
  | 'waistCircumference'
  // Fitness
  | 'stepCount'
  | 'distanceWalkingRunning'
  | 'distanceCycling'
  | 'distanceWheelchair'
  | 'distanceSwimming'
  | 'distanceDownhillSnowSports'
  | 'basalEnergyBurned'
  | 'activeEnergyBurned'
  | 'flightsClimbed'
  | 'appleExerciseTime'
  | 'appleMoveTime'
  | 'appleStandTime'
  | 'vo2Max'
  | 'walkingSpeed'
  | 'walkingDoubleSupportPercentage'
  | 'walkingAsymmetryPercentage'
  | 'walkingStepLength'
  | 'sixMinuteWalkTestDistance'
  | 'stairAscentSpeed'
  | 'stairDescentSpeed'
  | 'runningStrideLength'
  | 'runningVerticalOscillation'
  | 'runningGroundContactTime'
  | 'runningPower'
  | 'runningSpeed'
  | 'physicalEffort'
  // Vitals
  | 'heartRate'
  | 'bodyTemperature'
  | 'basalBodyTemperature'
  | 'bloodPressureSystolic'
  | 'bloodPressureDiastolic'
  | 'respiratoryRate'
  | 'restingHeartRate'
  | 'walkingHeartRateAverage'
  | 'heartRateVariabilitySDNN'
  | 'heartRateRecoveryOneMinute'
  | 'oxygenSaturation'
  | 'peripheralPerfusionIndex'
  // Results
  | 'bloodGlucose'
  | 'electrodermalActivity'
  | 'forcedExpiratoryVolume1'
  | 'forcedVitalCapacity'
  | 'inhalerUsage'
  | 'insulinDelivery'
  | 'numberOfTimesFallen'
  | 'peakExpiratoryFlowRate'
  | 'bloodAlcoholContent'
  // Nutrition
  | 'dietaryFatTotal'
  | 'dietaryFatPolyunsaturated'
  | 'dietaryFatMonounsaturated'
  | 'dietaryFatSaturated'
  | 'dietaryCholesterol'
  | 'dietarySodium'
  | 'dietaryCarbohydrates'
  | 'dietaryFiber'
  | 'dietarySugar'
  | 'dietaryEnergyConsumed'
  | 'dietaryProtein'
  | 'dietaryVitaminA'
  | 'dietaryVitaminB6'
  | 'dietaryVitaminB12'
  | 'dietaryVitaminC'
  | 'dietaryVitaminD'
  | 'dietaryVitaminE'
  | 'dietaryVitaminK'
  | 'dietaryCalcium'
  | 'dietaryIron'
  | 'dietaryThiamin'
  | 'dietaryRiboflavin'
  | 'dietaryNiacin'
  | 'dietaryFolate'
  | 'dietaryBiotin'
  | 'dietaryPantothenicAcid'
  | 'dietaryPhosphorus'
  | 'dietaryIodine'
  | 'dietaryMagnesium'
  | 'dietaryZinc'
  | 'dietarySelenium'
  | 'dietaryCopper'
  | 'dietaryManganese'
  | 'dietaryChromium'
  | 'dietaryMolybdenum'
  | 'dietaryChloride'
  | 'dietaryPotassium'
  | 'dietaryCaffeine'
  | 'dietaryWater'
  // Other
  | 'uvExposure'
  | 'environmentalAudioExposure'
  | 'headphoneAudioExposure'
  | 'numberOfAlcoholicBeverages'
  | 'atrialFibrillationBurden'
  | 'underwaterDepth'
  | 'waterTemperature'
  | 'appleSleepingWristTemperature'
  | 'timeInDaylight';

// ─────────────────────────────────────────────────────────────────────────────
// Category Type Identifiers (40+ types)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * HealthKit category type identifiers.
 *
 * **Required Metadata:**
 * - `menstrualFlow` requires `{ HKMenstrualCycleStart: boolean }` metadata
 *   indicating whether the sample starts a new menstrual cycle.
 */
export type CategoryTypeIdentifier =
  // Sleep
  | 'sleepAnalysis'
  // Activity
  | 'appleStandHour'
  | 'lowCardioFitnessEvent'
  // Reproductive Health (menstrualFlow requires HKMenstrualCycleStart metadata)
  | 'menstrualFlow'
  | 'intermenstrualBleeding'
  | 'infrequentMenstrualCycles'
  | 'irregularMenstrualCycles'
  | 'persistentIntermenstrualBleeding'
  | 'prolongedMenstrualPeriods'
  | 'cervicalMucusQuality'
  | 'ovulationTestResult'
  | 'pregnancy'
  | 'pregnancyTestResult'
  | 'lactation'
  | 'contraceptive'
  | 'sexualActivity'
  // Mindfulness
  | 'mindfulSession'
  // Heart
  | 'highHeartRateEvent'
  | 'lowHeartRateEvent'
  | 'irregularHeartRhythmEvent'
  // Hearing
  | 'audioExposureEvent'
  | 'environmentalAudioExposureEvent'
  | 'headphoneAudioExposureEvent'
  // Other
  | 'toothbrushingEvent'
  | 'handwashingEvent'
  // Symptoms
  | 'abdominalCramps'
  | 'acne'
  | 'appetiteChanges'
  | 'bladderIncontinence'
  | 'bloating'
  | 'breastPain'
  | 'chestTightnessOrPain'
  | 'chills'
  | 'constipation'
  | 'coughing'
  | 'diarrhea'
  | 'dizziness'
  | 'drySkin'
  | 'fainting'
  | 'fatigue'
  | 'fever'
  | 'generalizedBodyAche'
  | 'hairLoss'
  | 'headache'
  | 'heartburn'
  | 'hotFlashes'
  | 'lossOfSmell'
  | 'lossOfTaste'
  | 'lowerBackPain'
  | 'memoryLapse'
  | 'moodChanges'
  | 'nausea'
  | 'nightSweats'
  | 'pelvicPain'
  | 'rapidPoundingOrFlutteringHeartbeat'
  | 'runnyNose'
  | 'shortnessOfBreath'
  | 'sinusCongestion'
  | 'skippedHeartbeat'
  | 'sleepChanges'
  | 'soreThroat'
  | 'vaginalDryness'
  | 'vomiting'
  | 'wheezing';

// ─────────────────────────────────────────────────────────────────────────────
// Characteristic Type Identifiers
// ─────────────────────────────────────────────────────────────────────────────

export type CharacteristicTypeIdentifier =
  | 'biologicalSex'
  | 'bloodType'
  | 'dateOfBirth'
  | 'fitzpatrickSkinType'
  | 'wheelchairUse'
  | 'activityMoveMode';

// ─────────────────────────────────────────────────────────────────────────────
// Workout Activity Types (80+ types)
// ─────────────────────────────────────────────────────────────────────────────

export type WorkoutActivityType =
  | 'americanFootball'
  | 'archery'
  | 'australianFootball'
  | 'badminton'
  | 'barre'
  | 'baseball'
  | 'basketball'
  | 'bowling'
  | 'boxing'
  | 'cardioDance'
  | 'climbing'
  | 'cooldown'
  | 'coreTraining'
  | 'cricket'
  | 'crossCountrySkiing'
  | 'crossTraining'
  | 'curling'
  | 'cycling'
  | 'dance'
  | 'discSports'
  | 'downhillSkiing'
  | 'elliptical'
  | 'equestrianSports'
  | 'fencing'
  | 'fishing'
  | 'fitnessGaming'
  | 'flexibility'
  | 'functionalStrengthTraining'
  | 'golf'
  | 'gymnastics'
  | 'handCycling'
  | 'handball'
  | 'highIntensityIntervalTraining'
  | 'hiking'
  | 'hockey'
  | 'hunting'
  | 'jumpRope'
  | 'kickboxing'
  | 'lacrosse'
  | 'martialArts'
  | 'mindAndBody'
  | 'mixedCardio'
  | 'paddleSports'
  | 'pickleball'
  | 'pilates'
  | 'play'
  | 'preparationAndRecovery'
  | 'racquetball'
  | 'rowing'
  | 'rugby'
  | 'running'
  | 'sailing'
  | 'skatingSports'
  | 'snowboarding'
  | 'snowSports'
  | 'soccer'
  | 'socialDance'
  | 'softball'
  | 'squash'
  | 'stairClimbing'
  | 'stairs'
  | 'stepTraining'
  | 'surfingSports'
  | 'swimming'
  | 'tableTennis'
  | 'taiChi'
  | 'tennis'
  | 'trackAndField'
  | 'traditionalStrengthTraining'
  | 'transition'
  | 'volleyball'
  | 'walking'
  | 'waterFitness'
  | 'waterPolo'
  | 'waterSports'
  | 'wheelchairRunPace'
  | 'wheelchairWalkPace'
  | 'wrestling'
  | 'yoga'
  | 'other';

// ─────────────────────────────────────────────────────────────────────────────
// Combined Data Type
// ─────────────────────────────────────────────────────────────────────────────

export type HealthKitDataType =
  | QuantityTypeIdentifier
  | CategoryTypeIdentifier
  | CharacteristicTypeIdentifier
  | 'workoutType'
  | 'activitySummaryType';

// ─────────────────────────────────────────────────────────────────────────────
// Authorization Types
// ─────────────────────────────────────────────────────────────────────────────

export interface HealthKitPermissions {
  read: HealthKitDataType[];
  write: HealthKitDataType[];
}

export type AuthorizationStatus =
  | 'notDetermined'
  | 'sharingDenied'
  | 'sharingAuthorized';

export interface AuthorizationResult {
  status: AuthorizationStatus;
  permissions: {
    read: Record<string, AuthorizationStatus>;
    write: Record<string, AuthorizationStatus>;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Sample Types
// ─────────────────────────────────────────────────────────────────────────────

export interface DeviceInfo {
  name?: string;
  manufacturer?: string;
  model?: string;
  hardwareVersion?: string;
  firmwareVersion?: string;
  softwareVersion?: string;
  localIdentifier?: string;
  udiDeviceIdentifier?: string;
}

export interface QuantitySample {
  uuid: string;
  quantityType: QuantityTypeIdentifier;
  value: number;
  unit: string;
  startDate: string;
  endDate: string;
  sourceName: string;
  sourceId: string;
  device?: DeviceInfo;
  metadata?: Record<string, unknown>;
}

export interface CategorySample {
  uuid: string;
  categoryType: CategoryTypeIdentifier;
  value: number;
  startDate: string;
  endDate: string;
  sourceName: string;
  sourceId: string;
  metadata?: Record<string, unknown>;
}

export interface WorkoutSample {
  uuid: string;
  workoutActivityType: WorkoutActivityType;
  duration: number;
  totalEnergyBurned?: number;
  totalDistance?: number;
  startDate: string;
  endDate: string;
  sourceName: string;
  sourceId: string;
  metadata?: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Query Types
// ─────────────────────────────────────────────────────────────────────────────

export interface QueryOptions {
  startDate?: string;
  endDate?: string;
  limit?: number;
  ascending?: boolean;
}

export interface StatisticsOptions extends QueryOptions {
  interval: 'hour' | 'day' | 'week' | 'month' | 'year';
}

export type StatisticsAggregation =
  | 'cumulativeSum'
  | 'discreteAverage'
  | 'discreteMin'
  | 'discreteMax'
  | 'mostRecent';

export interface StatisticsResult {
  quantityType: QuantityTypeIdentifier;
  startDate: string;
  endDate: string;
  sumQuantity?: number;
  averageQuantity?: number;
  minimumQuantity?: number;
  maximumQuantity?: number;
  mostRecentQuantity?: number;
  unit: string;
}

export interface AnchoredQueryResult<T> {
  samples: T[];
  deletedObjects: Array<{ uuid: string }>;
  anchor: string;
  hasMore: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Event Types
// ─────────────────────────────────────────────────────────────────────────────

export interface HealthKitUpdateEvent {
  typeIdentifier: string;
  anchor?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Activity Summary
// ─────────────────────────────────────────────────────────────────────────────

export interface ActivitySummary {
  dateComponents: {
    year: number;
    month: number;
    day: number;
  };
  activeEnergyBurned: number;
  activeEnergyBurnedGoal: number;
  appleExerciseTime: number;
  appleExerciseTimeGoal: number;
  appleStandHours: number;
  appleStandHoursGoal: number;
}

export type AppleHealthModuleEvents = {
  onHealthKitUpdate: (event: HealthKitUpdateEvent) => void;
  onBackgroundDelivery: (event: HealthKitUpdateEvent) => void;
};
