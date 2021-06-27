import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import {
  DailyTriggerInput,
  NotificationContentInput,
} from "expo-notifications";

const NOTIFICATION_KEY = "flashcard:notification";

export const clearLocalNotification = () =>
  AsyncStorage.removeItem(NOTIFICATION_KEY).then(
    Notifications.cancelAllScheduledNotificationsAsync
  );

const createNotification = (): NotificationContentInput => ({
  title: "Check cards",
  body: `Don't forget to check your cards today.`,
  sound: true,
  sticky: false,
  vibrate: [0, 250, 250, 250],
  priority: "high",
});

export const setLocalNotification = () => {
  AsyncStorage.getItem(NOTIFICATION_KEY)
    .then(JSON.parse)
    .then((data) => {
      if (data === null) {
        Notifications.getPermissionsAsync().then(({ status }) => {
          if (status === "granted") {
            Notifications.cancelAllScheduledNotificationsAsync();

            const trigger: DailyTriggerInput = {
              minute: 0,
              hour: 12,
              repeats: true,
            };
            Notifications.scheduleNotificationAsync({
              content: createNotification(),
              trigger,
            });
            AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true));
          }
        });
      }
    });
};
