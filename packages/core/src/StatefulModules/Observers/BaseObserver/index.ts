

export default class BaseObserver<T> {
    listeners:T[] = []

    addListener(listener:T) {
        this.listeners.push(listener)
    }

    removeListener(listener:T) {
        this.listeners = this.listeners.filter( listener => listener !== listener)
    }

}