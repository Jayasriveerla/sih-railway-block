const trainTimetable = [
    { id: "12424", name: "Rajdhani Express", arrival: "14:15", section: "Section_Alpha", platform: "p1" },
    { id: "12002", name: "Shatabdi Express", arrival: "14:45", section: "Section_Alpha", platform: "p2" }
];

const stationPlatforms = {
    p1: { currentTrain: null, clearsAt: "00:00" },
    p2: { currentTrain: "Freight Train 702", clearsAt: "15:00" }
};

document.getElementById("schedulerForm").addEventListener("submit", (event) => {
    event.preventDefault();
    
    const selectedSector = document.getElementById("sectorSelect").value.replace(/[^a-zA-Z0-String_]/g, "");
    const blockStartStr = document.getElementById("timeInput").value;
    const durationMins = parseInt(document.getElementById("durationInput").value, 10);
    const terminal = document.getElementById("logTerminal");

    try {
        const [hours, minutes] = blockStartStr.split(':').map(Number);
        const blockStart = hours * 60 + minutes;
        const blockEnd = blockStart + durationMins;

        let activeConflict = null;
        for (let train of trainTimetable) {
            if (train.section === selectedSector) {
                const [tH, tM] = train.arrival.split(':').map(Number);
                const trainTime = tH * 60 + tM;

                if (trainTime >= blockStart && trainTime <= blockEnd) {
                    activeConflict = train;
                    break;
                }
            }
        }

        let reportLog = `[ANALYZING] Scanned line segment: ${selectedSector}\n`;
        if (activeConflict) {
            terminal.style.color = "#fbbf24";
            reportLog += `[CONFLICT] Window overlaps with Train ${activeConflict.id} (${activeConflict.name}) at ${activeConflict.arrival}.\n`;
            
            const [pH, pM] = stationPlatforms[activeConflict.platform].clearsAt.split(':').map(Number);
            const platformClearTime = pH * 60 + pM;
            const [arrH, arrM] = activeConflict.arrival.split(':').map(Number);
            const arrivalTime = arrH * 60 + arrM;

            if (arrivalTime < platformClearTime) {
                const holdingMinutes = platformClearTime - arrivalTime;
                reportLog += `[OUTER SIGNAL DETENTION PREVENTED]\n`;
                reportLog += ` -> MITIGATION: Enforce pacing speed control at previous junction.\n`;
                reportLog += ` -> SYSTEM BENEFIT: Saved ${holdingMinutes} mins idling outside platform.\n`;
            }
        } else {
            terminal.style.color = "#4ade80";
            reportLog += `[SUCCESS] Block window approved. No active conflict loops encountered.`;
        }
        terminal.innerText = reportLog;

    } catch (error) {
        terminal.style.color = "#f87171";
        terminal.innerText = "[RUNTIME ERROR] Secure logic execution safely halted.";
    }
});
