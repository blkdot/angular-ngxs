import { Actions, ofActionCompleted, ofActionDispatched } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActionType } from '@ngxs/store/src/actions/symbols';
import { takeUntil } from 'rxjs/operators';

export default (actions$: Actions, until: Observable<any>, actions: ActionType[], initState = false): Observable<boolean> => {
  const isLoading$ = new BehaviorSubject<boolean>(initState);

  actions$.pipe(
    takeUntil(until),
    ofActionDispatched(...actions)
  )
    .subscribe(() => isLoading$.next(true));

  actions$.pipe(
    takeUntil(until),
    ofActionCompleted(...actions)
  )
    .subscribe(() => isLoading$.next(false));

  return isLoading$.asObservable();
};
