const monsterEvilList = [
  {
    monId: "evil_001",
    path: "images/mon/mon_evil_001_1.png",
    step: [
      { path: "images/mon/mon_evil_001_1.png", name: "흑보송", spec: { hp: 15, atk: 4, def: 0, mat: 0, mdf: 0, spd: 1 }, desc: "악의 티끌에서 떨어져 나온 보송보송한 먼지, 만지면 생각보다 따끔하지만 위협적이지 않다. 집단행동을 하지만 겁이 많아 공격성은 없고 귀여운게 특징이다." },
      { path: "images/mon/mon_evil_001_2.png", name: "흑악게", desc: "보송보송한 먼지들이 뭉쳐 조금은 단단해지고 뾰족뾰족해졌다. 보송이 여러마리가 합쳐져 가운데 핵에서 융합을 일으키고 있다. 이제 닿거나 만지면 단순히 따끔한 것으로 끝나지 않는다. 홀로 있는 사냥감을 노린다. 그게 너일지도 모르니 조심해야한다." },
      { path: "images/mon/mon_evil_001_3.png", name: "악황가리", desc: "흑악게 개체들이 동족을 잡아먹고 최종 각성한 끔찍한 개체. 전 세계적으로 몇 백 개체밖에 없다고 보고되며 주로 한 무리의 흑보송을 거느린다. 악의 기운으로 주변을 물들이거나 사냥감을 타락시켜 잡아먹는다. 가운데 눈을 오래 바라본다면 이상한 속삭임이 들리고 환각을 듣는다는 실험 보고서가 있다." }
    ]
  },
  {
    monId: "evil_002",
    path: "images/mon/mon_evil_002_1.png",
    step: [
      { path: "images/mon/mon_evil_002_1.png", name: "돌거미", spec: { hp: 20, atk: 2, def: 1, mat: 0, mdf: 1, spd: 1 }, desc: "주로 어두운 동굴 속 미로에서 많이 발견된다. 먹을 것이 많지 않은 동굴 속에서 돌과 석회질을 섭취한 거미는 외피가 돌처럼 굳어지게 되었다." },
      { path: "images/mon/mon_evil_002_2.png", name: "자철거미", desc: '자철석을 주로 섭취한 돌거미들은 인간 탐험가들의 전자 장비를 특히 좋아한다. "장비 없는 어둠 속에서의 탐험이라니 끔찍하다구...자철석 동굴에 들어갈 때는 특히 탐험 장비를 잘 간수해야해. 돌거미들이 단백질을 먹이로 그렇게 즐기는 편은 아니지만 딱히 싫어하지도 않거든.." 자철거미 서식지에서 발견된 인간 탐험가의 녹음기에서' },
      { path: "images/mon/mon_evil_002_3.png", name: "전자철거미", desc: "이..인간, 전자 자,장비를 많이 섭취하면, 지,지능도 덩달아 높아지는게 틀림..없어.. 그,그 놈은.. 지나치게 교활하고 영리했어.. 내 동료들을 다 납치한 후에는 나를 보며 웃더라니까? 정말이야! 미,믿어줘 -자철동굴 탐험대 4인 중 유일한 생존자의 인터뷰" }
    ]
  },
]

const monsterWaterList = [{
  monId: "water_001",
  path: "images/pet/pet_water_001_1.png",
  step: [
    { path: "images/pet/pet_water_001_1.png", name: "물의 알", spec: { hp: 17, atk: 4, def: 0, mat: 0, mdf: 0, spd: 1, }, level: { level: 1, exp: 0, nextStepLv: 3, nextLvXp: 15 }, desc: "푸른 물의 기운을 머금은 알이다. 영어에 밀접하게 반응한다. 어떤 아이가 깨어날지는 알 수 없다." },
    { path: "images/pet/pet_water_001_2.png", path_back: "images/pet/pet_water_001_2_back.png", name: "몰랑이", spec: { hp: 55, atk: 10, def: 1, mat: 3, mdf: 4, spd: 1, hpUp: 5, atkUp: 1, defUp: 0.1, matUp: 2, mdfUp: 0.2 }, level: { level: 4, exp: 0, nextStepLv: 10, nextLvXp: 50 }, desc: "여러 개의 다리를 가진 말랑한 젤리 같은 생물체다. 귀여운 고양이를 닮아 여학생들의 펫으로 인기가 높은 편, 단 주인이 아닌 사람이 만지려고 하면 다리처럼 생긴 촉수를 들어 따끔하게 쏠 수도 있으니 함부로 만지지 말자." },
    { path: "images/pet/pet_water_001_3.png", name: "몰랑둥이", desc: "흑악게 개체들이 동족을 잡아먹고 최종 각성한 끔찍한 개체. 전 세계적으로 몇 백 개체밖에 없다고 보고되며 주로 한 무리의 흑보송을 거느린다. 악의 기운으로 주변을 물들이거나 사냥감을 타락시켜 잡아먹는다. 가운데 눈을 오래 바라본다면 이상한 속삭임이 들리고 환각을 듣는다는 실험 보고서가 있다." },
    { path: "images/pet/pet_water_001_4.png", name: "몰랑둥이", desc: "흑악게 개체들이 동족을 잡아먹고 최종 각성한 끔찍한 개체. 전 세계적으로 몇 백 개체밖에 없다고 보고되며 주로 한 무리의 흑보송을 거느린다. 악의 기운으로 주변을 물들이거나 사냥감을 타락시켜 잡아먹는다. 가운데 눈을 오래 바라본다면 이상한 속삭임이 들리고 환각을 듣는다는 실험 보고서가 있다." }
  ]
},]

const monsterGrassList = [{
  monId: "grass_001",
  path: "images/pet/pet_grass_001_1.png",
  step: [
    { path: "images/pet/pet_grass_001_1.png", name: "풀의 알", spec: { hp: 16, atk: 4, def: 1, mat: 0, mdf: 0, spd: 1, }, level: { level: 1, exp: 0, nextStepLv: 3, nextLvXp: 15 }, desc: "싱그러운 대지의 기운을 머금은 알이다. 국어에 밀접하게 반응한다. 어떤 아이가 깨어날지는 알 수 없다." },
    { path: "images/pet/pet_grass_001_2.png", path_back: "images/pet/pet_water_001_2_back.png", name: "몰랑이", spec: { hp: 55, atk: 10, def: 1, mat: 3, mdf: 4, spd: 1, hpUp: 5, atkUp: 1, defUp: 0.1, matUp: 2, mdfUp: 0.2 }, level: { level: 4, exp: 0, nextStepLv: 10, nextLvXp: 50 }, desc: "여러 개의 다리를 가진 말랑한 젤리 같은 생물체다. 귀여운 고양이를 닮아 여학생들의 펫으로 인기가 높은 편, 단 주인이 아닌 사람이 만지려고 하면 다리처럼 생긴 촉수를 들어 따끔하게 쏠 수도 있으니 함부로 만지지 말자." },
    { path: "images/pet/pet_grass_001_3.png", name: "몰랑둥이", desc: "흑악게 개체들이 동족을 잡아먹고 최종 각성한 끔찍한 개체. 전 세계적으로 몇 백 개체밖에 없다고 보고되며 주로 한 무리의 흑보송을 거느린다. 악의 기운으로 주변을 물들이거나 사냥감을 타락시켜 잡아먹는다. 가운데 눈을 오래 바라본다면 이상한 속삭임이 들리고 환각을 듣는다는 실험 보고서가 있다." },
    { path: "images/pet/pet_grass_001_4.png", name: "몰랑둥이", desc: "흑악게 개체들이 동족을 잡아먹고 최종 각성한 끔찍한 개체. 전 세계적으로 몇 백 개체밖에 없다고 보고되며 주로 한 무리의 흑보송을 거느린다. 악의 기운으로 주변을 물들이거나 사냥감을 타락시켜 잡아먹는다. 가운데 눈을 오래 바라본다면 이상한 속삭임이 들리고 환각을 듣는다는 실험 보고서가 있다." }
  ]
},]

const monsterFireList = [{
  monId: "fire_001",
  path: "images/pet/pet_fire_001_1.png",
  step: [
    { path: "images/pet/pet_fire_001_1.png", name: "풀의 알", spec: { hp: 16, atk: 4, def: 1, mat: 0, mdf: 0, spd: 1, }, level: { level: 1, exp: 0, nextStepLv: 3, nextLvXp: 15 }, desc: "싱그러운 대지의 기운을 머금은 알이다. 국어에 밀접하게 반응한다. 어떤 아이가 깨어날지는 알 수 없다." },
    { path: "images/pet/pet_fire_001_2.png", path_back: "images/pet/pet_water_001_2_back.png", name: "몰랑이", spec: { hp: 55, atk: 10, def: 1, mat: 3, mdf: 4, spd: 1, hpUp: 5, atkUp: 1, defUp: 0.1, matUp: 2, mdfUp: 0.2 }, level: { level: 4, exp: 0, nextStepLv: 10, nextLvXp: 50 }, desc: "여러 개의 다리를 가진 말랑한 젤리 같은 생물체다. 귀여운 고양이를 닮아 여학생들의 펫으로 인기가 높은 편, 단 주인이 아닌 사람이 만지려고 하면 다리처럼 생긴 촉수를 들어 따끔하게 쏠 수도 있으니 함부로 만지지 말자." },
    { path: "images/pet/pet_fire_001_3.png", name: "몰랑둥이", desc: "흑악게 개체들이 동족을 잡아먹고 최종 각성한 끔찍한 개체. 전 세계적으로 몇 백 개체밖에 없다고 보고되며 주로 한 무리의 흑보송을 거느린다. 악의 기운으로 주변을 물들이거나 사냥감을 타락시켜 잡아먹는다. 가운데 눈을 오래 바라본다면 이상한 속삭임이 들리고 환각을 듣는다는 실험 보고서가 있다." },
    { path: "images/pet/pet_fire_001_4.png", name: "몰랑둥이", desc: "흑악게 개체들이 동족을 잡아먹고 최종 각성한 끔찍한 개체. 전 세계적으로 몇 백 개체밖에 없다고 보고되며 주로 한 무리의 흑보송을 거느린다. 악의 기운으로 주변을 물들이거나 사냥감을 타락시켜 잡아먹는다. 가운데 눈을 오래 바라본다면 이상한 속삭임이 들리고 환각을 듣는다는 실험 보고서가 있다." }
  ]
},]

const monsterNormalList = [{
  monId: "normal_001",
  path: "images/pet/pet_normal_001_1.png",
  step: [
    { path: "images/pet/pet_normal_001_1.png", name: "풀의 알", spec: { hp: 16, atk: 4, def: 1, mat: 0, mdf: 0, spd: 1, }, level: { level: 1, exp: 0, nextStepLv: 3, nextLvXp: 15 }, desc: "싱그러운 대지의 기운을 머금은 알이다. 국어에 밀접하게 반응한다. 어떤 아이가 깨어날지는 알 수 없다." },
    { path: "images/pet/pet_normal_001_2.png", path_back: "images/pet/pet_water_001_2_back.png", name: "몰랑이", spec: { hp: 55, atk: 10, def: 1, mat: 3, mdf: 4, spd: 1, hpUp: 5, atkUp: 1, defUp: 0.1, matUp: 2, mdfUp: 0.2 }, level: { level: 4, exp: 0, nextStepLv: 10, nextLvXp: 50 }, desc: "여러 개의 다리를 가진 말랑한 젤리 같은 생물체다. 귀여운 고양이를 닮아 여학생들의 펫으로 인기가 높은 편, 단 주인이 아닌 사람이 만지려고 하면 다리처럼 생긴 촉수를 들어 따끔하게 쏠 수도 있으니 함부로 만지지 말자." },
    { path: "images/pet/pet_normal_001_3.png", name: "몰랑둥이", desc: "흑악게 개체들이 동족을 잡아먹고 최종 각성한 끔찍한 개체. 전 세계적으로 몇 백 개체밖에 없다고 보고되며 주로 한 무리의 흑보송을 거느린다. 악의 기운으로 주변을 물들이거나 사냥감을 타락시켜 잡아먹는다. 가운데 눈을 오래 바라본다면 이상한 속삭임이 들리고 환각을 듣는다는 실험 보고서가 있다." },
    { path: "images/pet/pet_normal_001_4.png", name: "몰랑둥이", desc: "흑악게 개체들이 동족을 잡아먹고 최종 각성한 끔찍한 개체. 전 세계적으로 몇 백 개체밖에 없다고 보고되며 주로 한 무리의 흑보송을 거느린다. 악의 기운으로 주변을 물들이거나 사냥감을 타락시켜 잡아먹는다. 가운데 눈을 오래 바라본다면 이상한 속삭임이 들리고 환각을 듣는다는 실험 보고서가 있다." }
  ]
},]


const monsterList = [...monsterEvilList, ...monsterWaterList, ...monsterGrassList, ...monsterFireList, ...monsterNormalList]

export { monsterEvilList, monsterWaterList, monsterGrassList, monsterList, monsterFireList, monsterNormalList }
