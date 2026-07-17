import AsyncStorage from "@react-native-async-storage/async-storage";
import * as BackgroundTask from "expo-background-task";
import type { NotificationPermissionsStatus } from "expo-notifications";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { Platform } from "react-native";

import { fetchCurrentCreditBalanceAsync } from "../services/creditBalanceService";
import { getLowBalanceNotificationMessage } from "../utils/balanceMonitorNotificationMessages";

export const BALANCE_MONITOR_TASK_NAME = "credit-balance-monitor";
export const BALANCE_MONITOR_MINIMUM_INTERVAL_MINUTES = 1;

const BALANCE_MONITOR_STORAGE_KEY =
  "@inova-ru:balance-monitor-notifications";
const BALANCE_MONITOR_LAST_NOTIFICATION_DATE_KEY =
  "@inova-ru:balance-monitor-last-notification-date";
const BALANCE_MONITOR_NOTIFICATION_CHANNEL_ID =
  "credit-balance-monitor-heads-up";

export interface BalanceMonitorConfiguration {
  enabled: boolean;
  minimumBalance: number;
}

export type BalanceMonitorPermissionStatus =
  | "denied"
  | "granted"
  | "undetermined"
  | "unknown";

export type BalanceMonitorSyncStatus =
  | "idle"
  | "permission-denied"
  | "storage-error"
  | "task-error"
  | "task-unavailable";

export interface BalanceMonitorPermissionResult {
  canAskAgain: boolean;
  granted: boolean;
  status: BalanceMonitorPermissionStatus;
}

export const BALANCE_MONITOR_DEFAULT_CONFIGURATION: BalanceMonitorConfiguration =
  {
    enabled: false,
    minimumBalance: 50,
  };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidMinimumBalance(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function normalizeMinimumBalance(value: number): number {
  return Math.round(value * 100) / 100;
}

function parseStoredConfiguration(value: unknown): BalanceMonitorConfiguration {
  if (!isRecord(value)) {
    return BALANCE_MONITOR_DEFAULT_CONFIGURATION;
  }

  return {
    enabled:
      typeof value.enabled === "boolean"
        ? value.enabled
        : BALANCE_MONITOR_DEFAULT_CONFIGURATION.enabled,
    minimumBalance: isValidMinimumBalance(value.minimumBalance)
      ? normalizeMinimumBalance(value.minimumBalance)
      : BALANCE_MONITOR_DEFAULT_CONFIGURATION.minimumBalance,
  };
}

function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function hasNotificationPermission(
  permission: NotificationPermissionsStatus
): boolean {
  return (
    permission.granted ||
    permission.ios?.status ===
      Notifications.IosAuthorizationStatus.PROVISIONAL ||
    permission.ios?.status === Notifications.IosAuthorizationStatus.EPHEMERAL
  );
}

function getPermissionStatus(
  permission: NotificationPermissionsStatus
): BalanceMonitorPermissionStatus {
  if (hasNotificationPermission(permission)) {
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
  permission: NotificationPermissionsStatus
): BalanceMonitorPermissionResult {
  return {
    canAskAgain: permission.canAskAgain,
    granted: hasNotificationPermission(permission),
    status: getPermissionStatus(permission),
  };
}

export async function loadStoredBalanceMonitorConfigurationAsync(): Promise<BalanceMonitorConfiguration> {
  const storedConfiguration = await AsyncStorage.getItem(
    BALANCE_MONITOR_STORAGE_KEY
  );

  if (!storedConfiguration) {
    return BALANCE_MONITOR_DEFAULT_CONFIGURATION;
  }

  try {
    const parsedConfiguration: unknown = JSON.parse(storedConfiguration);
    return parseStoredConfiguration(parsedConfiguration);
  } catch {
    return BALANCE_MONITOR_DEFAULT_CONFIGURATION;
  }
}

export async function persistBalanceMonitorConfigurationAsync(
  configuration: BalanceMonitorConfiguration
): Promise<void> {
  await AsyncStorage.setItem(
    BALANCE_MONITOR_STORAGE_KEY,
    JSON.stringify({
      enabled: configuration.enabled,
      minimumBalance: normalizeMinimumBalance(configuration.minimumBalance),
    })
  );
}

export async function getBalanceMonitorNotificationPermissionAsync(): Promise<BalanceMonitorPermissionResult> {
  const permission = await Notifications.getPermissionsAsync();
  return mapNotificationPermission(permission);
}

export async function requestBalanceMonitorNotificationPermissionAsync(): Promise<BalanceMonitorPermissionResult> {
  await ensureBalanceMonitorNotificationChannelAsync();

  const currentPermission = await Notifications.getPermissionsAsync();

  if (hasNotificationPermission(currentPermission)) {
    return mapNotificationPermission(currentPermission);
  }

  if (!currentPermission.canAskAgain) {
    return mapNotificationPermission(currentPermission);
  }

  const requestedPermission = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true,
    },
  });

  return mapNotificationPermission(requestedPermission);
}

export async function ensureBalanceMonitorNotificationChannelAsync(): Promise<void> {
  if (Platform.OS !== "android") {
    return;
  }

  await Notifications.setNotificationChannelAsync(
    BALANCE_MONITOR_NOTIFICATION_CHANNEL_ID,
    {
      enableVibrate: true,
      importance: Notifications.AndroidImportance.HIGH,
      name: "Alertas de saldo baixo",
      vibrationPattern: [0, 250, 250, 250],
    }
  );
}

async function loadLastLowBalanceNotificationDateAsync(): Promise<string | null> {
  return await AsyncStorage.getItem(BALANCE_MONITOR_LAST_NOTIFICATION_DATE_KEY);
}

async function persistLastLowBalanceNotificationDateAsync(
  dateKey: string
): Promise<void> {
  await AsyncStorage.setItem(
    BALANCE_MONITOR_LAST_NOTIFICATION_DATE_KEY,
    dateKey
  );
}

async function scheduleLowBalanceNotificationAsync(
  currentBalance: number,
  minimumBalance: number
): Promise<void> {
  const notificationMessage = getLowBalanceNotificationMessage({
    currentBalance,
    minimumBalance,
  });

  await ensureBalanceMonitorNotificationChannelAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      body: notificationMessage.body,
      data: {
        currentBalance,
        minimumBalance,
        source: "balance-monitor",
      },
      priority: Notifications.AndroidNotificationPriority.MAX,
      sound: true,
      title: notificationMessage.title,
      vibrate: [0, 250, 250, 250],
    },
    trigger: {
      channelId: BALANCE_MONITOR_NOTIFICATION_CHANNEL_ID,
    },
  });
}

function logBalanceMonitorTaskDebug(
  message: string,
  data?: Record<string, unknown>
): void {
  if (__DEV__) {
    console.log("[balance-monitor]", message, data ?? "");
  }
}

export async function isBalanceMonitorTaskRegisteredAsync(): Promise<boolean> {
  if (!(await TaskManager.isAvailableAsync())) {
    return false;
  }

  return await TaskManager.isTaskRegisteredAsync(BALANCE_MONITOR_TASK_NAME);
}

export async function registerBalanceMonitorTaskAsync(): Promise<BalanceMonitorSyncStatus> {
  if (!(await TaskManager.isAvailableAsync())) {
    return "task-unavailable";
  }

  const backgroundTaskStatus = await BackgroundTask.getStatusAsync();

  if (backgroundTaskStatus !== BackgroundTask.BackgroundTaskStatus.Available) {
    return "task-unavailable";
  }

  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    BALANCE_MONITOR_TASK_NAME
  );

  if (isRegistered) {
    return "idle";
  }

  await BackgroundTask.registerTaskAsync(BALANCE_MONITOR_TASK_NAME, {
    // This is a minimum interval suggestion, not an exact schedule. Android
    // WorkManager and iOS BGTaskScheduler decide the real execution timing.
    minimumInterval: BALANCE_MONITOR_MINIMUM_INTERVAL_MINUTES,
  });

  return "idle";
}

export async function unregisterBalanceMonitorTaskAsync(): Promise<void> {
  if (!(await TaskManager.isAvailableAsync())) {
    return;
  }

  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    BALANCE_MONITOR_TASK_NAME
  );

  if (isRegistered) {
    await BackgroundTask.unregisterTaskAsync(BALANCE_MONITOR_TASK_NAME);
  }
}

export async function triggerBalanceMonitorTaskForTestingAsync(): Promise<boolean> {
  if (__DEV__) {
    const result = await runBalanceMonitorTaskAsync({
      ignoreDailyThrottle: true,
    });

    return result === BackgroundTask.BackgroundTaskResult.Success;
  }

  return await BackgroundTask.triggerTaskWorkerForTestingAsync();
}

async function runBalanceMonitorTaskAsync({
  ignoreDailyThrottle = false,
}: {
  ignoreDailyThrottle?: boolean;
} = {}): Promise<BackgroundTask.BackgroundTaskResult> {
  try {
    const configuration = await loadStoredBalanceMonitorConfigurationAsync();
    logBalanceMonitorTaskDebug("Task started.", {
      enabled: configuration.enabled,
      ignoreDailyThrottle,
      minimumBalance: configuration.minimumBalance,
    });

    if (!configuration.enabled) {
      logBalanceMonitorTaskDebug("Skipped: balance monitor is disabled.");
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    const currentBalance = await fetchCurrentCreditBalanceAsync();

    if (currentBalance >= configuration.minimumBalance) {
      logBalanceMonitorTaskDebug("Skipped: current balance is above minimum.", {
        currentBalance,
        minimumBalance: configuration.minimumBalance,
      });
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    const todayKey = getLocalDateKey(new Date());
    const lastNotificationDate =
      await loadLastLowBalanceNotificationDateAsync();

    if (!ignoreDailyThrottle && lastNotificationDate === todayKey) {
      logBalanceMonitorTaskDebug("Skipped: notification already sent today.", {
        todayKey,
      });
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    await scheduleLowBalanceNotificationAsync(
      currentBalance,
      configuration.minimumBalance
    );
    await persistLastLowBalanceNotificationDateAsync(todayKey);
    logBalanceMonitorTaskDebug("Notification scheduled.", {
      currentBalance,
      minimumBalance: configuration.minimumBalance,
    });

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error: unknown) {
    console.warn("Failed to run balance monitor background task.", error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
}

if (!TaskManager.isTaskDefined(BALANCE_MONITOR_TASK_NAME)) {
  TaskManager.defineTask(BALANCE_MONITOR_TASK_NAME, () =>
    runBalanceMonitorTaskAsync()
  );
}
