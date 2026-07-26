const formatDuration = (ms) => {
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (ms % day === 0) {
        const days = ms / day;
        return `${days} ${days === 1 ? "day" : "days"}`;
    }

    if (ms % hour === 0) {
        const hours = ms / hour;
        return `${hours} ${hours === 1 ? "hour" : "hours"}`;
    }

    if (ms % minute === 0) {
        const minutes = ms / minute;
        return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
    }

    const seconds = Math.ceil(ms / 1000);
    return `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
};

export default formatDuration;
