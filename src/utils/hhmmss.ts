export const HHMMSS = (seconds: number)=> {
    let hours: string|number = Math.floor(seconds / 3600);
    let minutes: string|number = Math.floor((seconds % 3600) / 60);
    let secs: string|number = seconds % 60;

    // Pad with leading zeros if necessary
    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    secs = String(secs).padStart(2, '0');

    return `${hours}:${minutes}:${secs}`;
};
