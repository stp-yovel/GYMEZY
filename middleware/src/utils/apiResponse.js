export class ApiResponse {
  constructor(statusCode, data = null, message = 'Success', meta = null) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    if (meta !== null) {
      this.meta = meta;
    }
  }

  static success(data, message = 'Success', statusCode = 200, meta = null) {
    return new ApiResponse(statusCode, data, message, meta);
  }

  static created(data, message = 'Resource created successfully', meta = null) {
    return new ApiResponse(201, data, message, meta);
  }

  static noContent(message = 'Resource deleted successfully') {
    return new ApiResponse(204, null, message);
  }
}
