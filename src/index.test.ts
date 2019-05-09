import {
  Retrieval,
  RetrievalState,
  success,
  shouldAttempt,
  idleRetrieval,
  workingRetrival
} from ".";
import { expect } from "chai";

const value = { state: RetrievalState.Retrieving } as (Retrieval<boolean>);
const doSomethingWith = (_value: boolean) => undefined;

if (value.state === RetrievalState.Succeeded) {
  doSomethingWith(value.value);
}

if (value.state === RetrievalState.Errored) {
  doSomethingWith(!!value.error.serviceError);
}

const succeeded = success(true);
expect(succeeded.state).to.equal(RetrievalState.Succeeded);
expect(shouldAttempt(success(true))).to.be.false;
expect(shouldAttempt(workingRetrival)).to.be.false;
expect(shouldAttempt(idleRetrieval)).to.be.true;
expect(shouldAttempt(workingRetrival.state)).to.be.false;
expect(shouldAttempt(idleRetrieval.state)).to.be.true;
