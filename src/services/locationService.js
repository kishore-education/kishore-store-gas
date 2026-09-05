/**
 * Pinpoint High-Accuracy Geolocation Service
 * Uses watchPosition and strict hardware GPS options (maximumAge: 0, enableHighAccuracy: true)
 * to lock onto high-accuracy coordinates (<= 15m radius).
 * 
 * @param {Object} [options]
 * @param {Function} [options.onProgress] - Callback for live accuracy updates (e.g. radius in meters)
 * @param {number} [options.targetAccuracyMeters=15] - Target accuracy threshold in meters
 * @param {number} [options.maxWaitMs=8000] - Max time to wait for pinpoint lock before returning best fix
 * @returns {Promise<{lat: number, lng: number, accuracy: number, address: string, mapsUrl: string, gpsCoords: string}>}
 */
export async function getAbsolutePinpointLocation({ onProgress, targetAccuracyMeters = 15, maxWaitMs = 8000 } = {}) {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by this browser.');
  }

  const highAccuracyOptions = {
    enableHighAccuracy: true, // Forces GPS/Hardware tracking rather than Wi-Fi/IP guesses
    timeout: 10000,           // Gives GPS hardware up to 10 seconds to spin up and lock on
    maximumAge: 0             // Strictly forbids cached positions; forces a brand-new reading
  };

  return new Promise((resolve, reject) => {
    let bestPosition = null;
    let watchId = null;
    let timeoutTimer = null;

    const cleanupAndResolve = async (pos) => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (timeoutTimer !== null) clearTimeout(timeoutTimer);

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const accuracy = Math.round(pos.coords.accuracy);
      const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

      let address = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        if (data.display_name) {
          address = data.display_name;
        }
      } catch (e) {
        // Fallback to coordinates
      }

      resolve({
        lat,
        lng,
        accuracy,
        address,
        mapsUrl,
        gpsCoords: `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      });
    };

    timeoutTimer = setTimeout(() => {
      if (bestPosition) {
        cleanupAndResolve(bestPosition);
      } else {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        reject(new Error('GPS location timeout. Please ensure location permissions are enabled.'));
      }
    }, maxWaitMs);

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const accuracy = position.coords.accuracy;

        if (onProgress) {
          onProgress(Math.round(accuracy));
        }

        if (!bestPosition || accuracy < bestPosition.coords.accuracy) {
          bestPosition = position;
        }

        // Target accuracy met (<= 15 meters) -> Finish immediately
        if (accuracy <= targetAccuracyMeters) {
          cleanupAndResolve(position);
        }
      },
      (error) => {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        if (timeoutTimer !== null) clearTimeout(timeoutTimer);
        reject(new Error(`GPS Error (${error.code}): ${error.message}`));
      },
      highAccuracyOptions
    );
  });
}

export default getAbsolutePinpointLocation;
