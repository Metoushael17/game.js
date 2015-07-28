const hands = {
  attackSpeed: 400,
  staminaDamage: 20,
  damage: 5,
  type: 'fists',
  name: 'Bare hands',
};

const dagger = {
  attackSpeed: 700,
  staminaDamage: 30,
  damage: 10,
  type: 'dagger',
  name: 'The Pussy Dagger',
};

const sword = {
  attackSpeed: 1000,
  staminaDamage: 50,
  damage: 50,
  type: 'longsword',
  name: 'LongLightSaber Sword',
};

const Weapons = {
  hands: hands,
  dagger: dagger,
  sword: sword,
};

// if(localStorage.Weapons) {
//   Weapons = JSON.parse(localStorage.Weapons);
// }

export default Weapons;
