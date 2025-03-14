function getRandomCoordinates(minLat, maxLat, minLng, maxLng) {
    const latitude = Math.random() * (maxLat - minLat) + minLat;
    const longitude = Math.random() * (maxLng - minLng) + minLng;
    return { latitude, longitude };
}

function generateTaxiCoordinates(numTaxis, minLat, maxLat, minLng, maxLng) {
    const coordinates = [];
    for (let i = 0; i < numTaxis; i++) {
        coordinates.push(getRandomCoordinates(minLat, maxLat, minLng, maxLng));
    }
    return coordinates;
}

module.exports = {
    getRandomCoordinates,
    generateTaxiCoordinates
};