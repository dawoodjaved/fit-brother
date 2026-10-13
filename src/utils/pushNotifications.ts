/**
 * Remote push is not available in Expo Go on Android (SDK 53+).
 * Keep this as a no-op stub so the app boots cleanly in Expo Go.
 * Wire real push later in a development / production build.
 */
export async function setupNotificationsSafely(): Promise<void> {
  // Intentionally empty for Expo Go compatibility.
}
