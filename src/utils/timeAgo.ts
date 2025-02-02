function timeAgo(timestamp: string) {
    const now = (new Date()).getTime();
    const then = new Date(timestamp).getTime();
    const secondsAgo = Math.floor((now - then) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
        const count = Math.floor(secondsAgo / seconds);
        if (count >= 1) {
            return count === 1 ? `1 ${unit} ago` : `${count} ${unit}s ago`;
        }
    }

    return "just now";
}

export {timeAgo}