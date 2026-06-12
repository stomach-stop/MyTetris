export class Strategy {
    constructor(rand) {
        this.rand = rand;
    }
    
    nextType(shapes) {
        throw new Error("nextType method must be implemented");
    }
}