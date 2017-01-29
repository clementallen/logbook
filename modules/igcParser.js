// Constructor for an exception which is thrown if the file
// being parsed is not in a valid IGC format.
function IGCException(message) {
    this.message = message;
    this.name = 'IGCException';
}

// Parses an IGC logger file.
function parseManufacturer(aRecord) {
    const manufacturers = {
        ACT: 'Aircotec',
        CAM: 'Cambridge Aero Instruments',
        CNI: 'Clearnav Instruments',
        DSX: 'Data Swan',
        EWA: 'EW Avionics',
        FIL: 'Filser',
        FLA: 'FLARM',
        FLY: 'Flytech',
        GCS: 'Garrecht',
        IMI: 'IMI Gliding Equipment',
        LGS: 'Logstream',
        LXN: 'LX Navigation',
        LXV: 'LXNAV d.o.o.',
        NAV: 'Naviter',
        NKL: 'Nielsen Kellerman',
        NTE: 'New Technologies s.r.l.',
        PES: 'Peschges',
        PFE: 'PressFinish Technologies',
        PRT: 'Print Technik',
        SCH: 'Scheffel',
        SDI: 'Streamline Data Instruments',
        TRI: 'Triadis Engineering GmbH',
        WES: 'Westerboer',
        XCS: 'XCSoar',
        ZAN: 'Zander'
    };
    const manufacturerInfo = {
        manufacturer: 'Unknown',
        serial: aRecord.substring(4, 7)
    };

    const manufacturerCode = aRecord.substring(1, 4);
    if (manufacturers[manufacturerCode]) {
        manufacturerInfo.manufacturer = manufacturers[manufacturerCode];
    }
    return manufacturerInfo;
}

function dateToTimestamp(date) {
    const year = date.substring(0, 4);
    // Javascript numbers months from zero, not 1!
    const month = date.substring(4, 6) - 1;
    const day = date.substring(6, 8);
    const hour = date.substring(8, 10);
    const minute = date.substring(10, 12);
    const second = date.substring(12, 14);
    const filedate = new Date(Date.UTC(year, month, day, hour, minute, second));

    return filedate.getTime() / 1000;
}

function extractFlightTimings(igcFile) {
    // Date is recorded as: LCMU::TKOFFLAND:takeoff, landing in the format (yyyymmddhhmmss)
    const flightTimingsString = igcFile.match(/TKOFFLAND:1,([\d]{14}),([\d]{14})/);

    const flightTimings = null;

    if (flightTimingsString !== null) {
        return {
            takeoff: dateToTimestamp(flightTimingsString[1]),
            landing: dateToTimestamp(flightTimingsString[2]) - 600
        };
    }
    return flightTimings;
}

function extractDate(igcFile) {
    // Date is recorded as: HFDTEddmmyy (where HFDTE is a literal and dddmmyy are digits).
    const dateRecord = igcFile.match(/H[FO]DTE([\d]{2})([\d]{2})([\d]{2})/);

    if (dateRecord === null) {
        throw new IGCException('The file does not contain a date header.');
    }
    const day = parseInt(dateRecord[1], 10);
    // Javascript numbers months from zero, not 1!
    const month = parseInt(dateRecord[2], 10) - 1;
    // The IGC specification has a built-in Millennium Bug (2-digit year).
    // I will arbitrarily assume that any year before '80' is in the 21st century.
    let year = parseInt(dateRecord[3], 10);
    if (year < 80) {
        year += 2000;
    } else {
        year += 1900;
    }
    const filedate = new Date(Date.UTC(year, month, day));
    return filedate.getTime() / 1000;
}

function getReadEnl(iRecord) {
    const charpt = iRecord.search('ENL');
    if (charpt > 6) {
        const pos = iRecord.substring(charpt - 4, charpt);
        return {
            start: parseInt(pos.substring(0, 2), 10) - 1,
            end: parseInt(pos.substring(2, 4), 10)
        };
    }
    return null;
}

function parseHeader(headerRecord) {
    const headerSubtypes = {
        PLT: 'Pilot',
        CM2: 'Crew member 2',
        GTY: 'Glider type',
        GID: 'Glider ID',
        DTM: 'GPS Datum',
        RFW: 'Firmware version',
        RHW: 'Hardware version',
        FTY: 'Flight recorder type',
        GPS: 'GPS',
        PRS: 'Pressure sensor',
        FRS: 'Security suspect, use validation program',
        CID: 'Competition ID',
        CCL: 'Competition class'
    };

    const headerName = headerSubtypes[headerRecord.substring(2, 5)];
    if (headerName !== undefined) {
        const colonIndex = headerRecord.indexOf(':');
        if (colonIndex !== -1) {
            const headerValue = headerRecord.substring(colonIndex + 1);
            if (headerValue.length > 0 && /([^\s]+)/.test(headerValue)) {
                return {
                    name: headerName,
                    value: headerValue
                };
            }
        }
    }

    return null;
}

function parseLatLong(latLongString) {
    let latitude = (parseFloat(latLongString.substring(0, 2)) + parseFloat(latLongString.substring(2, 7))) / 60000.0;
    if (latLongString.charAt(7) === 'S') {
        latitude = -latitude;
    }

    let longitude = (parseFloat(latLongString.substring(8, 11)) + parseFloat(latLongString.substring(11, 16))) / 60000.0;
    if (latLongString.charAt(16) === 'W') {
        longitude = -longitude;
    }

    return {
        lat: latitude,
        lng: longitude
    };
}

function parsePosition(positionRecord, model, readEnl) {
    // Regex to match position records:
    // Hours, minutes, seconds, latitude, N or S, longitude, E or W,
    // Fix validity ('A' = 3D fix, 'V' = 2D or no fix),
    // pressure altitude, GPS altitude.
    // Latitude and longitude are in degrees and minutes, with the minutes
    // value multiplied by 1000 so that no decimal point is needed.
    //                                            hours        minutes    seconds    latitude        longitude                press alt    gps alt
    const positionRegex = /^B([\d]{2})([\d]{2})([\d]{2})([\d]{7}[NS][\d]{8}[EW])([AV])([-\d][\d]{4})([-\d][\d]{4})/;
    const positionMatch = positionRecord.match(positionRegex);
    let noiseLevel;

    if (positionMatch) {
        // position.Time holds number of seconds since UTC midnight.
        let positionTime = 3600 * parseInt(positionMatch[1], 10) + 60 * parseInt(positionMatch[2], 10) + parseInt(positionMatch[3], 10);
        if (model.recordTime.length > 0 && model.recordTime[0] > positionTime) {
            positionTime += 86400;
        }
        if (readEnl !== null) {
            noiseLevel = parseInt(positionRecord.substring(readEnl.start, readEnl.end), 10);
        } else {
            noiseLevel = 0;
        }
        const position = parseLatLong(positionMatch[4]);
        if ((position.lat !== 0) && (position.lng !== 0)) {
            return {
                recordTime: positionTime,
                latLong: position,
                quality: positionMatch[5],
                pressureAltitude: parseInt(positionMatch[6], 10),
                gpsAltitude: parseInt(positionMatch[7], 10),
                noise: noiseLevel
            };
        }
    }

    return null;
}

// Parsing function starts here
module.exports = (igcFile) => {
    const igcLines = igcFile.split('\n');
    if (igcLines.length < 2) {
        throw new IGCException('Not an IGC file');
    }
    // The first line should begin with 'A' followed by
    // a 3-character manufacturer Id and a 3-character serial number.
    if (!(/^A[\w]{6}/)
        .test(igcLines[0])) {
        throw new IGCException('Not an IGC file');
    }

    const model = {
        headers: [],
        recordTime: [],
        latLong: [],
        pressureAltitude: [],
        gpsAltitude: [],
        taskpoints: [],
        enl: [],
        fixQuality: [],
        flightDate: 0,
        flightTimings: {},
        takeOffIndex: 0,
        landingIndex: 0,
        takeOffPressure: 0,
        takeOffGps: 0,
        hasPressure: false,
        timeInterval: 0,
        bounds: {
            south: 90,
            west: 180,
            north: -90,
            east: -180
        }
    };

    const manufacturerInfo = parseManufacturer(igcLines[0]);
    model.headers.push({
        name: 'Logger manufacturer',
        value: manufacturerInfo.manufacturer
    });

    model.headers.push({
        name: 'Logger serial number',
        value: manufacturerInfo.serial
    });
    model.flightDate = extractDate(igcFile);
    model.flightTimings = extractFlightTimings(igcFile);
    let lineIndex;
    let positionData;
    let recordType;
    let currentLine;
    let headerData;
    let readEnl = null;
    const taskRegex = /^C[\d]{7}[NS][\d]{8}[EW].*/;
    for (lineIndex = 0; lineIndex < igcLines.length; lineIndex++) {
        currentLine = igcLines[lineIndex];
        recordType = currentLine.charAt(0);
        switch (recordType) {
        case 'B': // Position fix
            positionData = parsePosition(currentLine, model, readEnl);
            if (positionData) {
                model.recordTime.push(positionData.recordTime);
                model.latLong.push(positionData.latLong);
                model.pressureAltitude.push(positionData.pressureAltitude);
                model.gpsAltitude.push(positionData.gpsAltitude);
                model.enl.push(positionData.noise);
                model.fixQuality.push(positionData.quality);
                if (positionData.pressureAltitude > 0) {
                    model.hasPressure = true;
                }
                if (positionData.latLong.lat > model.bounds.north) {
                    model.bounds.north = positionData.latLong.lat;
                }
                if (positionData.latLong.lat < model.bounds.south) {
                    model.bounds.south = positionData.latLong.lat;
                }
                if (positionData.latLong.lng > model.bounds.east) {
                    model.bounds.east = positionData.latLong.lng;
                }
                if (positionData.latLong.lng < model.bounds.west) {
                    model.bounds.west = positionData.latLong.lng;
                }
            }
            break;
        case 'I': // Fix extensions
            readEnl = getReadEnl(currentLine);
            break;
        case 'C': // Task declaration
            if (taskRegex.test(currentLine)) {
                // drop the 'C' and push raw data to model.    Will parse later if needed using same functions as for user entered tasks
                model.taskpoints.push(currentLine.substring(1)
                    .trim());
            }
            break;
        case 'H': // Header information
            headerData = parseHeader(currentLine);
            if (headerData) {
                model.headers.push(headerData);
            }
            break;
        }
    }
    model.timeInterval = (model.recordTime[model.recordTime.length - 1] - model.recordTime[0]) / model.recordTime.length;
    let i = 1;
    let j = model.recordTime.length - 1;
    let cuSum = 0;
    if (model.hasPressure) {
        i = 1;
        do {
            cuSum = cuSum + model.pressureAltitude[i] - model.pressureAltitude[i - 1];
            i++;
        }
        while ((cuSum < 4) && (i < model.recordTime.length));
        cuSum = 0;
        do {
            cuSum = cuSum + model.pressureAltitude[j - 1] - model.pressureAltitude[j];
            j--;
        }
        while ((cuSum < 4) && (j > 1));
    } else {
        do {
            i++;
        }
        while ((model.fixQuality[i] !== 'A') && (i < model.recordTime.length));
        do {
            cuSum = cuSum + model.gpsAltitude[i] - model.gpsAltitude[i - 1];
            i++;
        }
        while ((cuSum < 4) && (i < model.recordTime.length));
        do {
            j--;
        }
        while ((model.fixQuality[j] !== 'A') && (j > 2));
        cuSum = 0;
        do {
            cuSum = cuSum + model.gpsAltitude[j - 1] - model.gpsAltitude[j];
            j--;
        }
        while ((cuSum < 4) && (j > 1));
    }
    model.takeOffIndex = i - 1;
    model.landingIndex = j;
    return model;
};
