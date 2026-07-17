import type { NotificationPermissionsStatus } from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Linking, Platform } from "react-native";

import { getCreditReminderNotificationMessage } from "../utils/creditReminderNotificationMessages";

const CREDIT_REMINDER_STORAGE_KEY =
  "@inova-ru:credit-reminder-notifications";
const CREDIT_REMINDER_NOTIFICATION_CHANNEL_ID = "credit-reminder-heads-up";

type AsyncStorageModule =
  typeof import("@react-native-async-storage/async-storage")["default"];
type ExpoNotificationsModule = typeof import("expo-notifications");

async function getAsyncStorageAsync(): Promise<AsyncStorageModule> {
  const asyncStorageModule = await import(
    "@react-native-async-storage/async-storage"
  );

  return asyncStorageModule.default;
}

async function getNotificationsAsync(): Promise<ExpoNotificationsModule> {
  return await import("expo-notifications");
}

export const CREDIT_REMINDER_WEEK_DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export type CreditReminderWeekDay =
  (typeof CREDIT_REMINDER_WEEK_DAYS)[number];

export interface CreditReminderTime {
  hour: number;
  minute: number;
}

export interface CreditReminderConfiguration {
  enabled: boolean;
  time: CreditReminderTime;
  weekDays: CreditReminderWeekDay[];
}

export type CreditReminderPermissionStatus =
  | "denied"
  | "granted"
  | "undetermined"
  | "unknown";

export type CreditReminderSyncStatus =
  | "idle"
  | "permission-denied"
  | "schedule-error"
  | "storage-error";

interface NotificationPermissionResult {
  canAskAgain: boolean;
  granted: boolean;
  status: CreditReminderPermissionStatus;
}

interface CreditReminderSyncResult {
  permission: NotificationPermissionResult;
  status: CreditReminderSyncStatus;
}

export interface UseCreditReminderNotificationsReturn {
  canAskPermissionAgain: boolean;
  configuration: CreditReminderConfiguration;
  isLoading: boolean;
  isSaving: boolean;
  openNotificationSettings: () => Promise<void>;
  permissionStatus: CreditReminderPermissionStatus;
  retryPermissionRequest: () => Promise<void>;
  syncStatus: CreditReminderSyncStatus;
  updateEnabled: (enabled: boolean) => Promise<void>;
  updateTime: (time: CreditReminderTime) => Promise<void>;
  updateWeekDays: (weekDays: CreditReminderWeekDay[]) => Promise<void>;
}

const CREDIT_REMINDER_DEFAULT_CONFIGURATION: CreditReminderConfiguration = {
  enabled: false,
  time: {
    hour: 10,
    minute: 30,
  },
  weekDays: [],
};

const CREDIT_REMINDER_WEEK_DAY_TRIGGER_MAP: Record<
  CreditReminderWeekDay,
  number
> = {
  sunday: 1,
  monday: 2,
  tuesday: 3,
  wednesday: 4,
  thursday: 5,
  friday: 6,
  saturday: 7,
};

const CREDIT_REMINDER_NOTIFICATION_IDENTIFIERS: Record<
  CreditReminderWeekDay,
  string
> = {
  sunday: "credit-reminder-sunday",
  monday: "credit-reminder-monday",
  tuesday: "credit-reminder-tuesday",
  wednesday: "credit-reminder-wednesday",
  thursday: "credit-reminder-thursday",
  friday: "credit-reminder-friday",
  saturday: "credit-reminder-saturday",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCreditReminderWeekDay(
  value: unknown
): value is CreditReminderWeekDay {
  return (
    typeof value === "string" &&
    CREDIT_REMINDER_WEEK_DAYS.includes(value as CreditReminderWeekDay)
  );
}

function normalizeWeekDays(
  weekDays: CreditReminderWeekDay[]
): CreditReminderWeekDay[] {
  return CREDIT_REMINDER_WEEK_DAYS.filter((weekDay) =>
    weekDays.includes(weekDay)
  );
}

function parseStoredWeekDays(value: unknown): CreditReminderWeekDay[] {
  if (!Array.isArray(value)) {
    return CREDIT_REMINDER_DEFAULT_CONFIGURATION.weekDays;
  }

  return normalizeWeekDays(value.filter(isCreditReminderWeekDay));
}

function isValidHour(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 23;
}

function isValidMinute(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 59;
}

function parseStoredTime(value: unknown): CreditReminderTime {
  if (!isRecord(value)) {
    return CREDIT_REMINDER_DEFAULT_CONFIGURATION.time;
  }

  if (!isValidHour(value.hour) || !isValidMinute(value.minute)) {
    return CREDIT_REMINDER_DEFAULT_CONFIGURATION.time;
  }

  return {
    hour: value.hour,
    minute: value.minute,
  };
}

function parseStoredConfiguration(
  value: unknown
): CreditReminderConfiguration {
  if (!isRecord(value)) {
    return CREDIT_REMINDER_DEFAULT_CONFIGURATION;
  }

  return {
    enabled:
      typeof value.enabled === "boolean"
        ? value.enabled
        : CREDIT_REMINDER_DEFAULT_CONFIGURATION.enabled,
    time: parseStoredTime(value.time),
    weekDays: parseStoredWeekDays(value.weekDays),
  };
}

async function loadStoredConfigurationAsync(): Promise<CreditReminderConfiguration> {
  const AsyncStorage = await getAsyncStorageAsync();
  const storedConfiguration = await AsyncStorage.getItem(
    CREDIT_REMINDER_STORAGE_KEY
  );

  if (!storedConfiguration) {
    return CREDIT_REMINDER_DEFAULT_CONFIGURATION;
  }

  try {
    const parsedConfiguration: unknown = JSON.parse(storedConfiguration);
    return parseStoredConfiguration(parsedConfiguration);
  } catch {
    return CREDIT_REMINDER_DEFAULT_CONFIGURATION;
  }
}

async function persistConfigurationAsync(
  configuration: CreditReminderConfiguration
): Promise<void> {
  const AsyncStorage = await getAsyncStorageAsync();

  await AsyncStorage.setItem(
    CREDIT_REMINDER_STORAGE_KEY,
    JSON.stringify(configuration)
  );
}

async function ensureAndroidNotificationChannelAsync(
  notifications?: ExpoNotificationsModule
): Promise<void> {
  if (Platform.OS !== "android") {
    return;
  }

  const Notifications = notifications ?? (await getNotificationsAsync());

  await Notifications.setNotificationChannelAsync(
    CREDIT_REMINDER_NOTIFICATION_CHANNEL_ID,
    {
      enableVibrate: true,
      importance: Notifications.AndroidImportance.HIGH,
      name: "Lembretes de recarga importantes",
      vibrationPattern: [0, 250, 250, 250],
    }
  );
}

function hasNotificationPermission(
  permission: NotificationPermissionsStatus,
  Notifications: ExpoNotificationsModule
): boolean {
  return (
    permission.granted ||
    permission.ios?.status ===
      Notifications.IosAuthorizationStatus.PROVISIONAL ||
    permission.ios?.status === Notifications.IosAuthorizationStatus.EPHEMERAL
  );
}

function getPermissionStatus(
  permission: NotificationPermissionsStatus,
  Notifications: ExpoNotificationsModule
): CreditReminderPermissionStatus {
  if (hasNotificationPermission(permission, Notifications)) {
    return "granted";
  }

  if (
    permission.status === "denied" ||
    permission.ios?.status === Notifications.IosAuthorizationStatus.DENIED
  ) {
    return "denied";
  }

  return "undetermined";
}

function mapNotificationPermission(
  permission: NotificationPermissionsStatus,
  Notifications: ExpoNotificationsModule
): NotificationPermissionResult {
  return {
    canAskAgain: permission.canAskAgain,
    granted: hasNotificationPermission(permission, Notifications),
    status: getPermissionStatus(permission, Notifications),
  };
}

async function getCurrentPermissionAsync(
  notifications?: ExpoNotificationsModule
): Promise<NotificationPermissionResult> {
  const Notifications = notifications ?? (await getNotificationsAsync());
  const permission = await Notifications.getPermissionsAsync();
  return mapNotificationPermission(permission, Notifications);
}

async function requestNotificationPermissionAsync(
  notifications?: ExpoNotificationsModule
): Promise<NotificationPermissionResult> {
  const Notifications = notifications ?? (await getNotificationsAsync());

  await ensureAndroidNotificationChannelAsync(Notifications);

  const currentPermission = await Notifications.getPermissionsAsync();

  if (hasNotificationPermission(currentPermission, Notifications)) {
    return mapNotificationPermission(currentPermission, Notifications);
  }

  if (!currentPermission.canAskAgain) {
    return mapNotificationPermission(currentPermission, Notifications);
  }

  const requestedPermission = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true,
    },
  });

  return mapNotificationPermission(requestedPermission, Notifications);
}

async function cancelCreditReminderNotificationsAsync(
  weekDays: readonly CreditReminderWeekDay[] = CREDIT_REMINDER_WEEK_DAYS,
  notifications?: ExpoNotificationsModule
): Promise<void> {
  const Notifications = notifications ?? (await getNotificationsAsync());

  await Promise.all(
    weekDays.map((weekDay) =>
      Notifications.cancelScheduledNotificationAsync(
        CREDIT_REMINDER_NOTIFICATION_IDENTIFIERS[weekDay]
      )
    )
  );
}

function getUnselectedWeekDays(
  selectedWeekDays: CreditReminderWeekDay[]
): CreditReminderWeekDay[] {
  return CREDIT_REMINDER_WEEK_DAYS.filter(
    (weekDay) => !selectedWeekDays.includes(weekDay)
  );
}

async function scheduleCreditReminderNotificationsAsync(
  configuration: CreditReminderConfiguration,
  notifications?: ExpoNotificationsModule
): Promise<void> {
  const Notifications = notifications ?? (await getNotificationsAsync());
  const notificationMessage = getCreditReminderNotificationMessage();

  await Promise.all(
    configuration.weekDays.map((weekDay) =>
      Notifications.scheduleNotificationAsync({
        content: {
          body: notificationMessage.body,
          data: {
            source: "credit-reminder",
            weekDay,
          },
          priority: Notifications.AndroidNotificationPriority.MAX,
          sound: true,
          title: notificationMessage.title,
          vibrate: [0, 250, 250, 250],
        },
        identifier: CREDIT_REMINDER_NOTIFICATION_IDENTIFIERS[weekDay],
        trigger: {
          channelId: CREDIT_REMINDER_NOTIFICATION_CHANNEL_ID,
          hour: configuration.time.hour,
          minute: configuration.time.minute,
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: CREDIT_REMINDER_WEEK_DAY_TRIGGER_MAP[weekDay],
        },
      })
    )
  );
}

async function syncCreditReminderNotificationsAsync(
  configuration: CreditReminderConfiguration,
  shouldRequestPermission: boolean
): Promise<CreditReminderSyncResult> {
  const Notifications = await getNotificationsAsync();

  await ensureAndroidNotificationChannelAsync(Notifications);

  if (!configuration.enabled || configuration.weekDays.length === 0) {
    await cancelCreditReminderNotificationsAsync(
      CREDIT_REMINDER_WEEK_DAYS,
      Notifications
    );

    const permission = await getCurrentPermissionAsync(Notifications);
    return {
      permission,
      status: "idle",
    };
  }

  const permission = shouldRequestPermission
    ? await requestNotificationPermissionAsync(Notifications)
    : await getCurrentPermissionAsync(Notifications);

  if (!permission.granted) {
    return {
      permission,
      status: "permission-denied",
    };
  }

  await scheduleCreditReminderNotificationsAsync(configuration, Notifications);
  await cancelCreditReminderNotificationsAsync(
    getUnselectedWeekDays(configuration.weekDays),
    Notifications
  );

  return {
    permission,
    status: "idle",
  };
}

async function refreshCreditReminderPermissionAsync(): Promise<CreditReminderSyncResult> {
  const Notifications = await getNotificationsAsync();
  const permission = await getCurrentPermissionAsync(Notifications);

  return {
    permission,
    status: "idle",
  };
}

export function useCreditReminderNotifications(): UseCreditReminderNotificationsReturn {
  const [configuration, setConfiguration] =
    useState<CreditReminderConfiguration>(
      CREDIT_REMINDER_DEFAULT_CONFIGURATION
    );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] =
    useState<CreditReminderPermissionStatus>("unknown");
  const [canAskPermissionAgain, setCanAskPermissionAgain] =
    useState<boolean>(true);
  const [syncStatus, setSyncStatus] =
    useState<CreditReminderSyncStatus>("idle");
  const configurationRef = useRef<CreditReminderConfiguration>(
    CREDIT_REMINDER_DEFAULT_CONFIGURATION
  );
  const syncOperationIdRef = useRef<number>(0);

  function applySyncResult(syncResult: CreditReminderSyncResult): void {
    setCanAskPermissionAgain(syncResult.permission.canAskAgain);
    setPermissionStatus(syncResult.permission.status);
    setSyncStatus(syncResult.status);
  }

  function setCurrentConfiguration(
    nextConfiguration: CreditReminderConfiguration
  ): void {
    configurationRef.current = nextConfiguration;
    setConfiguration(nextConfiguration);
  }

  function startSyncOperation(): number {
    const nextOperationId = syncOperationIdRef.current + 1;
    syncOperationIdRef.current = nextOperationId;
    return nextOperationId;
  }

  function isLatestSyncOperation(operationId: number): boolean {
    return syncOperationIdRef.current === operationId;
  }

  async function applyConfigurationAsync(
    nextConfiguration: CreditReminderConfiguration,
    shouldRequestPermission: boolean
  ): Promise<void> {
    const operationId = startSyncOperation();

    setCurrentConfiguration(nextConfiguration);
    setIsSaving(true);

    try {
      await persistConfigurationAsync(nextConfiguration);
    } catch {
      if (isLatestSyncOperation(operationId)) {
        setSyncStatus("storage-error");
        setIsSaving(false);
      }

      return;
    }

    try {
      const syncResult = await syncCreditReminderNotificationsAsync(
        nextConfiguration,
        shouldRequestPermission
      );

      if (isLatestSyncOperation(operationId)) {
        applySyncResult(syncResult);
      }
    } catch {
      if (isLatestSyncOperation(operationId)) {
        setSyncStatus("schedule-error");
      }
    } finally {
      if (isLatestSyncOperation(operationId)) {
        setIsSaving(false);
      }
    }
  }

  async function updateEnabled(enabled: boolean): Promise<void> {
    const nextConfiguration = {
      ...configurationRef.current,
      enabled,
    };

    await applyConfigurationAsync(nextConfiguration, enabled);
  }

  async function updateWeekDays(
    weekDays: CreditReminderWeekDay[]
  ): Promise<void> {
    const nextWeekDays = normalizeWeekDays(weekDays);
    const nextConfiguration = {
      ...configurationRef.current,
      weekDays: nextWeekDays,
    };

    await applyConfigurationAsync(
      nextConfiguration,
      nextConfiguration.enabled && nextWeekDays.length > 0
    );
  }

  async function updateTime(time: CreditReminderTime): Promise<void> {
    const nextConfiguration = {
      ...configurationRef.current,
      time,
    };

    await applyConfigurationAsync(
      nextConfiguration,
      nextConfiguration.enabled && nextConfiguration.weekDays.length > 0
    );
  }

  async function retryPermissionRequest(): Promise<void> {
    const operationId = startSyncOperation();

    setIsSaving(true);

    try {
      const syncResult = await syncCreditReminderNotificationsAsync(
        configurationRef.current,
        true
      );

      if (isLatestSyncOperation(operationId)) {
        applySyncResult(syncResult);
      }
    } catch {
      if (isLatestSyncOperation(operationId)) {
        setSyncStatus("schedule-error");
      }
    } finally {
      if (isLatestSyncOperation(operationId)) {
        setIsSaving(false);
      }
    }
  }

  async function openNotificationSettings(): Promise<void> {
    await Linking.openSettings();
  }

  useEffect(() => {
    let isMounted = true;

    async function synchronizeStoredConfigurationAsync(
      storedConfiguration: CreditReminderConfiguration,
      operationId: number
    ): Promise<void> {
      try {
        const syncResult =
          storedConfiguration.enabled && storedConfiguration.weekDays.length > 0
            ? await syncCreditReminderNotificationsAsync(
                storedConfiguration,
                false
              )
            : await refreshCreditReminderPermissionAsync();

        if (isMounted && isLatestSyncOperation(operationId)) {
          applySyncResult(syncResult);
        }
      } catch {
        if (isMounted && isLatestSyncOperation(operationId)) {
          setSyncStatus("schedule-error");
        }
      }
    }

    async function initializeNotifications(): Promise<void> {
      try {
        const storedConfiguration = await loadStoredConfigurationAsync();

        if (!isMounted) {
          return;
        }

        setCurrentConfiguration(storedConfiguration);
        setIsLoading(false);

        const operationId = startSyncOperation();
        void synchronizeStoredConfigurationAsync(
          storedConfiguration,
          operationId
        );
      } catch {
        if (isMounted) {
          setSyncStatus("storage-error");
          setIsLoading(false);
        }
      }
    }

    void initializeNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    canAskPermissionAgain,
    configuration,
    isLoading,
    isSaving,
    openNotificationSettings,
    permissionStatus,
    retryPermissionRequest,
    syncStatus,
    updateEnabled,
    updateTime,
    updateWeekDays,
  };
}
