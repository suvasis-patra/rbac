export class ApiResponse<T> {
  statusCode: number;
  success: boolean;
  data: T;
  message: string;
  constructor(statusCode = 200, success = true, data: T, message: string) {
    this.statusCode = statusCode;
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
