import { useEffect, useState } from "react";
import { Linking } from "react-native";

import {
  BALANCE_MONITOR_DEFAULT_CONFIGURATION,
  type BalanceMonitorConfiguration,
  type BalanceMonitorPermissionStatus,
  type BalanceMonitorSyncStatus,
  getBalanceMonitorNotificationPermissionAsync,
  isBalanceMonitorTaskRegisteredAsync,
  loadStoredBalanceMonitorConfigurationAsync,
  persistBalanceMonitorConfigurationAsync,
  registerBalanceMonitorTaskAsync,
  requestBalanceMonitorNotificationPermissionAsync,
  unregisterBalanceMonitorTaskAsync,
} from "../tasks/balanceMonitorTask";

interface BalanceMonitorSyncResult {
  permission: {
    canAskAgain: boolean;
    granted: boolean;
    status: BalanceMonitorPermissionStatus;
  };
  status: BalanceMonitorSyncStatus;
}

export interface UseBalanceMonitorNotificationsReturn {
  canAskPermissionAgain: boolean;
  configuration: BalanceMonitorConfiguration;
  isLoading: boolean;
  isSaving: boolean;
  isTaskRegistered: boolean;
  openNotificationSettings: () => Promise<void>;
  permissionStatus: BalanceMonitorPermissionStatus;
  retryPermissionRequest: () => Promise<void>;
  syncStatus: BalanceMonitorSyncStatus;
  updateEnabled: (
    enabled: boolean,
    minimumBalance?: number
  ) => Promise<void>;
  updateMinimumBalance: (minimumBalance: number) => Promise<void>;
}

async function syncBalanceMonitorAsync(
  configuration: BalanceMonitorConfiguration,
  shouldRequestPermission: boolean
): Promise<BalanceMonitorSyncResult> {
  if (!configuration.enabled) {
    await unregisterBalanceMonitorTaskAsync();

    return {
      permission: await getBalanceMonitorNotificationPermissionAsync(),
      status: "idle",
    };
  }

  const permission = shouldRequestPermission
    ? await requestBalanceMonitorNotificationPermissionAsync()
    : await getBalanceMonitorNotificationPermissionAsync();

  if (!permission.granted) {
    await unregisterBalanceMonitorTaskAsync();

    return {
      permission,
      status: "permission-denied",
    };
  }

  const registrationStatus = await registerBalanceMonitorTaskAsync();

  return {
    permission,
    status: registrationStatus,
  };
}

export function useBalanceMonitorNotifications(): UseBalanceMonitorNotificationsReturn {
  const [configuration, setConfiguration] =
    useState<BalanceMonitorConfiguration>(
      BALANCE_MONITOR_DEFAULT_CONFIGURATION
    );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isTaskRegistered, setIsTaskRegistered] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] =
    useState<BalanceMonitorPermissionStatus>("unknown");
  const [canAskPermissionAgain, setCanAskPermissionAgain] =
    useState<boolean>(true);
  const [syncStatus, setSyncStatus] =
    useState<BalanceMonitorSyncStatus>("idle");

  function applySyncResult(syncResult: BalanceMonitorSyncResult): void {
    setCanAskPermissionAgain(syncResult.permission.canAskAgain);
    setPermissionStatus(syncResult.permission.status);
    setSyncStatus(syncResult.status);
  }

  async function refreshTaskRegistrationAsync(): Promise<void> {
    setIsTaskRegistered(await isBalanceMonitorTaskRegisteredAsync());
  }

  async function applyConfigurationAsync(
    nextConfiguration: BalanceMonitorConfiguration,
    shouldRequestPermission: boolean
  ): Promise<void> {
    setConfiguration(nextConfiguration);
    setIsSaving(true);

    try {
      await persistBalanceMonitorConfigurationAsync(nextConfiguration);
    } catch {
      setSyncStatus("storage-error");
      setIsSaving(false);
      return;
    }

    try {
      const syncResult = await syncBalanceMonitorAsync(
        nextConfiguration,
        shouldRequestPermission
      );
      applySyncResult(syncResult);
      await refreshTaskRegistrationAsync();
    } catch {
      setSyncStatus("task-error");
    } finally {
      setIsSaving(false);
    }
  }

  async function updateEnabled(
    enabled: boolean,
    minimumBalance = configuration.minimumBalance
  ): Promise<void> {
    await applyConfigurationAsync(
      {
        enabled,
        minimumBalance,
      },
      enabled
    );
  }

  async function updateMinimumBalance(minimumBalance: number): Promise<void> {
    await applyConfigurationAsync(
      {
        ...configuration,
        minimumBalance,
      },
      false
    );
  }

  async function retryPermissionRequest(): Promise<void> {
    setIsSaving(true);

    try {
      const syncResult = await syncBalanceMonitorAsync(configuration, true);
      applySyncResult(syncResult);
      await refreshTaskRegistrationAsync();
    } catch {
      setSyncStatus("task-error");
    } finally {
      setIsSaving(false);
    }
  }

  async function openNotificationSettings(): Promise<void> {
    await Linking.openSettings();
  }

  useEffect(() => {
    let isMounted = true;

    async function initializeBalanceMonitor(): Promise<void> {
      try {
        const storedConfiguration =
          await loadStoredBalanceMonitorConfigurationAsync();
        const permission = await getBalanceMonitorNotificationPermissionAsync();

        if (!isMounted) {
          return;
        }

        setConfiguration(storedConfiguration);
        setCanAskPermissionAgain(permission.canAskAgain);
        setPermissionStatus(permission.status);

        if (storedConfiguration.enabled) {
          const syncResult = await syncBalanceMonitorAsync(
            storedConfiguration,
            false
          );

          if (isMounted) {
            applySyncResult(syncResult);
          }
        }

        if (isMounted) {
          await refreshTaskRegistrationAsync();
        }
      } catch {
        if (isMounted) {
          setSyncStatus("storage-error");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void initializeBalanceMonitor();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    canAskPermissionAgain,
    configuration,
    isLoading,
    isSaving,
    isTaskRegistered,
    openNotificationSettings,
    permissionStatus,
    retryPermissionRequest,
    syncStatus,
    updateEnabled,
    updateMinimumBalance,
  };
}
