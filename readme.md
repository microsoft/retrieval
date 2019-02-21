# @mixer/retrieval

This utility package contains data types we've found useful in a variety of situations for modelling asynchronous actions, particularly within Redux stores. This serves a more robust and type-safe model that more basic patterns we saw developing, such as having "loading" state be represented as a null/undefined value, or error states being represented as additional optional properties.

The 'top-level' type is `Retrieval<T>`, which models one of several state:

 - `Idle` - not retrieving anything
 - `Retrieving` - currently getting data
 - `Succeeded` - data was retrieved
 - `Error

### Pattern: Getting Simple Data

Here, we make a simple outbound request that returns a boolean, using Redux. The state interface might be something like this:

```ts
import { Retrieval } from '@mixer/retrieval';

interface IMyState {
  isCool: Retrieval<boolean>;
}
```

Then in your Reducer:

```ts
import { workingRetrieval, success } from '@mixer/retrieval';

switch (action.type) {
  case getType(getCool.request):
    return { ...state, isCool: workingRetrieval };
  case getType(getCool.failure):
    return { ...state, isCool: action.payload /* IErrorRetrieval */ };
  case getType(getCool.success):
    return { ...state, isCool: success(action.payload /* boolean */) };
}
```

You can then reduce out the state you care about, in a type-safe way. For instance, you could get the boolean if present, or return undefined if we're not sure yet:

```ts
const getIsCool = (state: IMyState): boolean | undefined =>
  state.isCool.state === RetrievalState.Succeeded
    ? state.isCool.value
    : undefined;
```

### Pattern: Getting Paginated Data

Here's a pattern you might use if you're getting pages of data and use a continuation token to retrieve more. We store the known results as an array, and store the continuation token as a `Retrieve`'d string.

```ts
import { Retrieval } from '@mixer/retrieval';

interface IMyState {
  data: ReadonlyArray<IMyData>;
  continuationToken: Retrieval<string | undefined>;
}
```

Then in your reducer:

```ts

import { workingRetrieval, success } from '@mixer/retrieval';

switch (action.type) {
  case getType(getCool.request):
    return { ...state, continuationToken: workingRetrieval };
  case getType(getCool.failure):
    return { ...state, continuationToken: action.payload /* IErrorRetrieval */ };
  case getType(getCool.success):
    return {
      ...state,
      continuationToken: success(action.payload.continuationToken),
      data: state.data.concat(action.payload.results),
    };
}
```

You can then select out various interesting facets from this set of data:

```ts
export const getIsLoading = (state: IMyState): boolean =>
  state.continuationToken.value === RetrievalState.Loading;

export const getMightHaveMoreData = (state: IMyState): boolean => {
  const ct = state.continuationToken;
  return ct.state !== RetrievalState.Succeeded || !!ct.value;
};
```
