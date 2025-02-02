export const timeCount = (intervalFn: (arg0: number, arg1: number)=>void, intervalMs: number, timeoutFn: ()=>void, timeoutMs: number) => {
    let intervalId: any;
    let elapsedMs = 0;

    /**
     * On start function
     * @returns {undefined}
     */
    function startInterval() {
        intervalId = setInterval(() => {
            elapsedMs += intervalMs;
            intervalFn(elapsedMs, timeoutMs);
        }, intervalMs);
    }

    /**
     * On finish function
     * @returns {undefined}
     */
    function stopInterval() {
        clearInterval(intervalId);
        timeoutFn();
    }

    startInterval();

    setTimeout(stopInterval, timeoutMs);
};
