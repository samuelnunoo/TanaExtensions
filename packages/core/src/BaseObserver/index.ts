

export class BaseObserver<T> {
    public listeners:T[]

    constructor() {
        this.listeners = []
    }

    public addListener(listener:T) {
        this.listeners.push(listener)
    }

    public removeListener(listener:T) {
        this.listeners = this.listeners.filter( listener => listener !== listener)
    }

}