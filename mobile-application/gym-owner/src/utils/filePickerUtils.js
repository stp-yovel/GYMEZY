import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { Alert } from 'react-native';

/**
 * Pick an image from gallery or camera and return base64 / uri
 */
export const pickImageFromDevice = async (options = {}) => {
  const defaultOptions = {
    mediaType: 'photo',
    includeBase64: true,
    quality: 0.8,
    maxWidth: 1200,
    maxHeight: 1200,
    ...options,
  };

  try {
    const result = await launchImageLibrary(defaultOptions);

    if (result.didCancel) {
      return null;
    }

    if (result.errorCode) {
      Alert.alert('Image Picker Error', result.errorMessage || 'Failed to pick image');
      return null;
    }

    const asset = result.assets?.[0];
    if (!asset) return null;

    const base64Data = asset.base64
      ? `data:${asset.type || 'image/jpeg'};base64,${asset.base64}`
      : asset.uri;

    return {
      uri: asset.uri,
      fileName: asset.fileName || 'uploaded_image.jpg',
      fileSize: asset.fileSize,
      type: asset.type || 'image/jpeg',
      fileData: base64Data,
    };
  } catch (error) {
    Alert.alert('Selection Error', error.message || 'Unable to select media');
    return null;
  }
};

/**
 * Capture a photo using camera
 */
export const capturePhotoFromCamera = async (options = {}) => {
  const defaultOptions = {
    mediaType: 'photo',
    includeBase64: true,
    quality: 0.8,
    maxWidth: 1200,
    maxHeight: 1200,
    saveToPhotos: true,
    ...options,
  };

  try {
    const result = await launchCamera(defaultOptions);

    if (result.didCancel) {
      return null;
    }

    if (result.errorCode) {
      Alert.alert('Camera Error', result.errorMessage || 'Failed to capture photo');
      return null;
    }

    const asset = result.assets?.[0];
    if (!asset) return null;

    const base64Data = asset.base64
      ? `data:${asset.type || 'image/jpeg'};base64,${asset.base64}`
      : asset.uri;

    return {
      uri: asset.uri,
      fileName: asset.fileName || 'camera_photo.jpg',
      fileSize: asset.fileSize,
      type: asset.type || 'image/jpeg',
      fileData: base64Data,
    };
  } catch (error) {
    Alert.alert('Camera Error', error.message || 'Unable to open camera');
    return null;
  }
};
