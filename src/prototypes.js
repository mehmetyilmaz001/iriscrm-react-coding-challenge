Storage.prototype.setItem = new Proxy(Storage.prototype.setItem, {
    apply(target, thisArg, argumentList) {
        const event = new CustomEvent('localstorage', {
            detail: {
                key: argumentList[0],
                oldValue: thisArg.getItem(argumentList[0]),
                newValue: argumentList[1],
            },
        });
        window.dispatchEvent(event);
        return Reflect.apply(target, thisArg, argumentList);
    },
});