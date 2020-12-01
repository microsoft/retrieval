/**
 * State of the Retrieval<T>
 */
export enum RetrievalState {
  Idle,
  Retrieving,
  Succeeded,
  Errored
}

/**
 * Contains successful value retrieval.
 */
export interface ISuccessfulRetrieval<T> {
  state: RetrievalState.Succeeded;
  value: T;
}

/**
 * Indicates that we're not working on retrieving any data.
 */
export interface IIdleRetrieval {
  state: RetrievalState.Idle;
}

/**
 * Indicates that we're currently making a request to retrieve more data.
 */
export interface IWorkingRetrieval {
  state: RetrievalState.Retrieving;
}

/**
 * Error result from a retrieval.
 */
export interface IRetrievalError {
  state: RetrievalState.Errored;
  error: IError;
}

/**
 *  Genric error interface that can be extended
 */
export interface IError {
  statusCode: number;
  serviceError?: IServiceError;
  correlationVector?: string;
}

/**
 * Common contract for service error responses.
 */
export interface IServiceError<T = void> {
  errorCode: number;
  errorMessage: string;
  path?: string[];
  helpUri?: string;
  metadata?: T;
}

/**
 * Type that contains an asynchronous data retrieval.
 */
export type Retrieval<T> =
  | IIdleRetrieval
  | IWorkingRetrieval
  | ISuccessfulRetrieval<T>
  | IRetrievalError;

/**
 * Creates a successful retrieval containing the given value.
 */
export const success = <T>(value: T): ISuccessfulRetrieval<T> => ({
  state: RetrievalState.Succeeded,
  value
});

/**
 * Creates a errorful retrieval containing the given error.
 */
export const error = (error: IError): IRetrievalError => ({
  state: RetrievalState.Errored,
  error
});

/**
 * Returns if the retrieve is in a state (errored or idle) where we might
 * want to try it again.
 */
export const shouldAttempt = (retrieval: Retrieval<any> | RetrievalState) => {
  const state = typeof retrieval === "number" ? retrieval : retrieval.state;
  return state === RetrievalState.Errored || state === RetrievalState.Idle;
};

/**
 * Idle retrieval state constant.
 */
export const idleRetrieval: Retrieval<any> = { state: RetrievalState.Idle };

/**
 * In-progress retrieval state constant.
 */
export const workingRetrival: Retrieval<any> = {
  state: RetrievalState.Retrieving
};
