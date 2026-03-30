import water_pet from '../image/pets/pet_water_001_2.png';
import water_back from '../image/pets/pet_water_001_2_back.png'
import fire_pet from '../image/pets/pet_fire_001_2.png';
import fire_back from '../image/pets/pet_fire_001_2_back.png'
import grass_pet from '../image/pets/pet_grass_001_2.png';
import grass_back from '../image/pets/pet_grass_001_2_back.png';

export const petData = [
  { name: "물랑이", atk: 11, def: 2, rest: 5, hp: 80, petImg: water_pet, backImg: water_back, code: "water001", des: "옅은 바다에 서식하는 쫑알몬. 화가나면 촉수로 따끔한 공격을 한다. 공격이 매서운 편이다." },
  { name: "팬디", atk: 10, def: 2, rest: 4, hp: 100, petImg: fire_pet, backImg: fire_back, code: "fire001", des: "불의 기운을 지닌 곰 쫑알몬, 아직은 엄마의 보호가 필요한 아기곰이다." },
  { name: "풀토리", atk: 7, def: 2, rest: 10, hp: 100, petImg: grass_pet, backImg: grass_back, code: "grass001", des: "산 속에서 오랫동안 자란 쫑알몬이다. 풀의 기운을 머금어 회복에 특화된 힘을 지녔다." }
];
