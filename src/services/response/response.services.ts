export class jsonResponse {
  code: number;
  message: string;
  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }
  get success(): object {
    return {
      status: true,
      code: this.code,
      message: this.message,
    };
  }
  get failed(): object {
    return {
      status: false,
      code: this.code,
      message: this.message,
    };
  }

  // success = ({ code = null, message = null, data = null }) => {
  //   // this.code = code ?? 200;
  //   // this.message = message ?? '';
  //   // this.data = data ?? null;
  //   return {
  //     status: true,
  //     code: code ?? 200,
  //     message: message ?? '',
  //     data: data ?? null,
  //     timeStamp: Date.now(),
  //   };
  // };
  // failed = ({ code = null, message = null, error = null }) => {
  //   return {
  //     status: false,
  //     code: code ?? 500,
  //     message: message ?? 'Internal Server Error',
  //     error: error ?? null,
  //     timeStamp: Date.now(),
  //   };
  // };
}
