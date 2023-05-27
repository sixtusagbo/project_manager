/**
 * Subscribe to state change events.
 */
type Listener<T> = (items: T[]) => void;

/**
 * Application State Manager.
 *
 * Will be inherited by singletons that is used to manage a state.
 *
 * @see ProjectState where it is inherited.
 */
export class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}
