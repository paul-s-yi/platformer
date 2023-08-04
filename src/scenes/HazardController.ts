const generateKey = (name: string, id: number) => {
  return `${name}-${id}`;
};

export default class HazardController {
  private hazards = new Map<string, MatterJS.BodyType>();

  add(name: string, body: MatterJS.BodyType) {
    const key = generateKey(name, body.id);
    if (this.hazards.has(key)) {
      throw new Error(`Hazard with key ${key} already exists`);
    }
    this.hazards.set(key, body);
  }

  is(name: string, body: MatterJS.BodyType) {
    const key = generateKey(name, body.id);
    if (!this.hazards.has(key)) {
      return false;
    }
    return true;
  }
}
