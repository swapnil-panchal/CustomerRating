import { all, fork } from 'redux-saga/effects';
const forkList = (sagasList) => sagasList.map(saga => fork(saga));

export default function* rootSaga() {
    yield all([
        // ...forkList(newsSagas)

        // fork(getNewsListWatcher)
    ])
}