import Weapons from './Weapons';
import Shields from './Shields';

const Simple = {
  currentAnimation: null,
  currentAnimationTime: 0,
  attackIntervalID: null,
  staminaIncreasing: 0,
  nextAttackTime: 0,
  health: 100,
  maxHealth: 100,
  state: 'idle',
  alliance: 'enemy',
  stamina: 100,
  maxStamina: 100,
  dodgeStamina: 20,
  equippedWeapon: Weapons.sword,
  equippedShield: Shields.shield,
  attackFrequency: 4000,
  dodgeSpeed: 800,
  staminaIncreaseSpeed: 4000,
  staminaStartIncreaseSpeed: 1000,
  idleSpeed: 2000,
};

export default Simple;
