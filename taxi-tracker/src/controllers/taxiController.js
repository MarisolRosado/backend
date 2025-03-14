class TaxiController {
    constructor() {
        this.taxis = [];
    }

    generateRandomCoordinates() {
        const lat = (Math.random() * (90 - (-90)) + (-90)).toFixed(6);
        const lng = (Math.random() * (180 - (-180)) + (-180)).toFixed(6);
        return { lat: parseFloat(lat), lng: parseFloat(lng) };
    }

    addTaxi() {
        const coordinates = this.generateRandomCoordinates();
        const taxi = { id: this.taxis.length + 1, coordinates };
        this.taxis.push(taxi);
        return taxi;
    }

    getTaxis() {
        return this.taxis;
    }
}

export default TaxiController;