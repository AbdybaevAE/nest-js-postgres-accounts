export type TResponse<T> = {
  isSuccess: boolean;
  data: T;
};
export type TPromiseResponse<T> = Promise<TResponse<T>>;

export function GetSuccess<T>(data: T) {
  return {
    isSuccess: true,
    data,
  };
}
export function GetFailure<T>(data: T) {
  return {
    isSuccess: false,
    data,
  };
}
