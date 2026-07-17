import type { NotificationBehavior } from "expo-notifications";
import { Platform } from "react-native";

let notificationHandlerConfigured = false;

type ExpoNotificationsModule = typeof import("expo-notifications");

async function getNotificationsAsync(): Promise<ExpoNotificationsModule> {
  return await import("expo-notifications");
}

export async function configureNotificationHandler(): Promise<void> {
  if (notificationHandlerConfigured || Platform.OS === "web") {
    return;
  }

  try {
    const Notifications = await getNotificationsAsync();

    Notifications.setNotificationHandler({
      handleNotification: async (): Promise<NotificationBehavior> => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    notificationHandlerConfigured = true;
  } catch (error: unknown) {
    void error;
  }
}
