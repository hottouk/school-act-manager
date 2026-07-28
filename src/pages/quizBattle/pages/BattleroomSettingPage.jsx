import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import MainContainer from '../../../components/Styled/MainContainer'
import BackBtn from '../../../components/Btn/BackBtn'
import BattlePremiumModal from '../../../components/Modal/BattlePremiumModal'
import useFetchStorageImg from '../../../hooks/Game/useFetchStorageImg'
import { callCreateRoom } from '../../../firebase/config'
import {
  BACKGROUND_OPTIONS,
  BOSS_OPTIONS,
  DEFAULT_BACKGROUND_ID,
  DEFAULT_BOSS_ID,
  ROUND_OPTIONS,
} from '../../../data/battleRoomData'
import SubNav from '../../../components/Bar/SubNav'
import {
  BATTLE_PREMIUM_DURATION_DAYS,
  isUserBattlePremium,
} from '../../../utils/premiumUtils'

const FREE_ROUND_COUNT = 3

//260720 codex
const BattleroomSettingPage = () => {
  const user = useSelector(({ user }) => user)
  const { state: quiz } = useLocation()
  const navigate = useNavigate()
  const { fetchPathUrlMap } = useFetchStorageImg()
  const [bossType, setBossType] = useState(DEFAULT_BOSS_ID)
  const [backgroundId, setBackgroundId] = useState(DEFAULT_BACKGROUND_ID)
  const [maxRounds, setMaxRounds] = useState(FREE_ROUND_COUNT)
  const [bossImageMap, setBossImageMap] = useState(new Map())
  const [isCreating, setIsCreating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)
  const [purchaseNotice, setPurchaseNotice] = useState('')
  const [pendingPremiumSelection, setPendingPremiumSelection] = useState(null)
  //프리미엄 관련
  const isPremium = isUserBattlePremium(user, currentTime)

  useEffect(() => {
    let isActive = true
    const paths = BOSS_OPTIONS.map(({ frontPath }) => frontPath)

    fetchPathUrlMap(paths)
      .then((imageMap) => {
        if (isActive && imageMap) setBossImageMap(imageMap)
      })
      .catch((error) => {
        console.error('보스 이미지 미리보기를 불러오지 못했습니다.', error)
      })

    return () => { isActive = false }
  }, [fetchPathUrlMap])

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCurrentTime(Date.now())
    }, 30000)
    return () => window.clearInterval(timerId)
  }, [])

  useEffect(() => {
    if (isPremium) return
    setBossType(DEFAULT_BOSS_ID)
    setBackgroundId(DEFAULT_BACKGROUND_ID)
    setMaxRounds(FREE_ROUND_COUNT)
  }, [isPremium])

  const selectedBoss = useMemo(
    () => BOSS_OPTIONS.find(({ id }) => id === bossType),
    [bossType]
  )
  const selectedBackground = useMemo(
    () => BACKGROUND_OPTIONS.find(({ id }) => id === backgroundId),
    [backgroundId]
  )

  const openPremiumModal = (selection = null) => {
    setPendingPremiumSelection(selection)
    setIsPremiumModalOpen(true)
  }

  const closePremiumModal = () => {
    setIsPremiumModalOpen(false)
    setPendingPremiumSelection(null)
  }

  const handleBossSelect = (bossId) => {
    if (!isPremium && bossId !== DEFAULT_BOSS_ID) {
      openPremiumModal({ type: 'boss', value: bossId })
      return
    }
    setBossType(bossId)
  }

  const handleBackgroundSelect = (nextBackgroundId) => {
    if (!isPremium && nextBackgroundId !== DEFAULT_BACKGROUND_ID) {
      openPremiumModal({ type: 'background', value: nextBackgroundId })
      return
    }
    setBackgroundId(nextBackgroundId)
  }

  const handleRoundSelect = (round) => {
    if (!isPremium && round !== FREE_ROUND_COUNT) {
      openPremiumModal({ type: 'round', value: round })
      return
    }
    setMaxRounds(round)
  }

  const applyPendingPremiumSelection = () => {
    if (pendingPremiumSelection?.type === 'boss') {
      setBossType(pendingPremiumSelection.value)
    }
    if (pendingPremiumSelection?.type === 'background') {
      setBackgroundId(pendingPremiumSelection.value)
    }
    if (pendingPremiumSelection?.type === 'round') {
      setMaxRounds(pendingPremiumSelection.value)
    }
  }

  const handlePremiumPurchaseSuccess = () => {
    applyPendingPremiumSelection()
    setCurrentTime(Date.now())
    setPurchaseNotice(
      `프리미엄 이용권이 ${BATTLE_PREMIUM_DURATION_DAYS}일 연장되었습니다.`
    )
    setPendingPremiumSelection(null)
    setIsPremiumModalOpen(false)
  }

  const handleCreateRoom = async () => {
    if (!quiz?.id) {
      setErrorMessage('퀴즈 정보를 찾을 수 없습니다. 퀴즈 목록에서 다시 시도해주세요.')
      return
    }
    if (isCreating) return

    setIsCreating(true)
    setErrorMessage('')
    try {
      const response = await callCreateRoom({
        quizId: quiz.id,
        quizSource: quiz.quizSource || 'quiz',
        bossType,
        backgroundId,
        maxRounds,
      })
      const { battleCode, roomId } = response?.data || {}
      if (!battleCode || !roomId) throw new Error('게임방 정보를 받지 못했습니다.')

      navigate('/quiz_game_thr', {
        replace: true,
        state: { battleCode, roomId },
      })
    } catch (error) {
      console.error('게임방 생성 실패:', error)
      setErrorMessage(error?.message || '게임방을 만들지 못했습니다. 잠시 후 다시 시도해주세요.')
      setIsCreating(false)
    }
  }

  if (!quiz?.id) {
    return (
      <MainContainer styles={{ backgroundColor: '#f5f7ff' }}>
        <MissingState>
          <h2>퀴즈 정보를 찾을 수 없어요.</h2>
          <p>퀴즈 목록에서 게임방 만들기를 다시 눌러주세요.</p>
          <PrimaryButton type="button" onClick={() => navigate('/quiz')}>퀴즈 목록으로</PrimaryButton>
        </MissingState>
      </MainContainer>
    )
  }

  return (
    <MainContainer>
      <SubNav><BackBtn /></SubNav>
      <PageShell>
        <PageHeader>
          <HeaderCopy>
            <Eyebrow>QUIZ BATTLE</Eyebrow>
            <h1>게임방 설정</h1>
            <p>우리 반에 어울리는 보스와 전장을 고르고 게임을 시작해보세요.</p>
          </HeaderCopy>
          <PremiumStatusButton
            type="button"
            $active={isPremium}
            onClick={() => openPremiumModal()}
          >
            <span>{isPremium ? 'PREMIUM' : 'FREE'}</span>
            <strong>
              {isPremium
                ? `이용 기간 ${BATTLE_PREMIUM_DURATION_DAYS}일 연장`
                : '프리미엄 이용권 구매'}
            </strong>
          </PremiumStatusButton>
        </PageHeader>
        {purchaseNotice && (
          <SuccessMessage role="status">{purchaseNotice}</SuccessMessage>
        )}
        <SettingLayout>
          <SettingsColumn>
            <SettingSection>
              <SectionHeading>
                <StepNumber>1</StepNumber>
                <div><h2>보스 몬스터</h2><p>이번 배틀에서 상대할 보스를 선택하세요.</p></div>
              </SectionHeading>
              <OptionGrid>
                {BOSS_OPTIONS.map((boss) => {
                  const isLocked = !isPremium && boss.id !== DEFAULT_BOSS_ID
                  return (
                    <BossCard
                      key={boss.id}
                      type="button"
                      $selected={bossType === boss.id}
                      $accent={boss.accent}
                      $locked={isLocked}
                      onClick={() => handleBossSelect(boss.id)}
                      aria-pressed={bossType === boss.id}
                      aria-label={isLocked
                        ? `${boss.name} - 프리미엄 구매 안내 열기`
                        : boss.name}
                    >
                      <BossImageArea $accent={boss.accent} $locked={isLocked}>
                        {bossImageMap.get(boss.frontPath)
                          ? <BossImage src={bossImageMap.get(boss.frontPath)} alt="" />
                          : <ImagePlaceholder>?</ImagePlaceholder>}
                      </BossImageArea>
                      <OptionText><strong>{boss.name}</strong><span>{boss.description}</span></OptionText>
                      {isLocked
                        ? <PremiumLockBadge><span aria-hidden="true">🔒</span> PREMIUM</PremiumLockBadge>
                        : <CheckMark $selected={bossType === boss.id}>✓</CheckMark>}
                    </BossCard>
                  )
                })}
              </OptionGrid>
            </SettingSection>

            {selectedBoss && (
              <BossSpecSection $accent={selectedBoss.accent} aria-live="polite">
                <BossSpecHeader>
                  <BossSpecIdentity>
                    <BossSpecThumb $accent={selectedBoss.accent}>
                      {bossImageMap.get(selectedBoss.frontPath)
                        ? <img src={bossImageMap.get(selectedBoss.frontPath)} alt="" />
                        : <span>?</span>}
                    </BossSpecThumb>
                    <div>
                      <SpecEyebrow>SELECTED BOSS</SpecEyebrow>
                      <h2>{selectedBoss.name} 전투 능력치</h2>
                      <p>{selectedBoss.description}</p>
                    </div>
                  </BossSpecIdentity>
                  <PerPlayerBadge>학생 1명 기준</PerPlayerBadge>
                </BossSpecHeader>
                <BossStats>
                  <BossStatCard $color="#e5484d">
                    <StatIcon aria-hidden="true">♥</StatIcon>
                    <StatCopy><span>체력</span><strong>{selectedBoss.statPerPlayer.hp}</strong></StatCopy>
                    <StatUnit>HP</StatUnit>
                  </BossStatCard>
                  <BossStatCard $color="#f59f00">
                    <StatIcon aria-hidden="true">⚔</StatIcon>
                    <StatCopy><span>공격력</span><strong>{selectedBoss.statPerPlayer.atk}</strong></StatCopy>
                    <StatUnit>ATK</StatUnit>
                  </BossStatCard>
                  <BossStatCard $color="#3454d1">
                    <StatIcon aria-hidden="true">◆</StatIcon>
                    <StatCopy><span>방어력</span><strong>{selectedBoss.statPerPlayer.def}</strong></StatCopy>
                    <StatUnit>DEF</StatUnit>
                  </BossStatCard>
                </BossStats>
                <SpecNotice>
                  실제 능력치는 게임 시작 시 접속한 학생 수만큼 증가합니다.
                  <ExampleText>
                    예: 학생 4명 · 체력 {selectedBoss.statPerPlayer.hp * 4}
                    {' / '}공격력 {selectedBoss.statPerPlayer.atk * 4}
                    {' / '}방어력 {selectedBoss.statPerPlayer.def * 4}
                  </ExampleText>
                </SpecNotice>
              </BossSpecSection>
            )}

            <SettingSection>
              <SectionHeading>
                <StepNumber>2</StepNumber>
                <div><h2>배경화면</h2><p>배틀이 펼쳐질 장소를 선택하세요.</p></div>
              </SectionHeading>
              <BackgroundGrid>
                {BACKGROUND_OPTIONS.map((background) => {
                  const isLocked = !isPremium && background.id !== DEFAULT_BACKGROUND_ID
                  return (
                    <BackgroundCard
                      key={background.id}
                      type="button"
                      $selected={backgroundId === background.id}
                      $locked={isLocked}
                      onClick={() => handleBackgroundSelect(background.id)}
                      aria-pressed={backgroundId === background.id}
                      aria-label={isLocked
                        ? `${background.name} - 프리미엄 구매 안내 열기`
                        : background.name}
                    >
                      <BackgroundPreview src={background.image} alt="" $locked={isLocked} />
                      <BackgroundCopy><strong>{background.name}</strong><span>{background.description}</span></BackgroundCopy>
                      {isLocked
                        ? <PremiumLockBadge><span aria-hidden="true">🔒</span> PREMIUM</PremiumLockBadge>
                        : <CheckMark $selected={backgroundId === background.id}>✓</CheckMark>}
                    </BackgroundCard>
                  )
                })}
              </BackgroundGrid>
            </SettingSection>

            <SettingSection>
              <SectionHeading>
                <StepNumber>3</StepNumber>
                <div><h2>라운드 수</h2><p>한 라운드마다 퀴즈가 최대 5문제 출제됩니다.</p></div>
              </SectionHeading>
              <RoundGroup>
                {ROUND_OPTIONS.map((round) => {
                  const isLocked = !isPremium && round !== FREE_ROUND_COUNT
                  return (
                    <RoundButton
                      key={round}
                      type="button"
                      $selected={maxRounds === round}
                      $locked={isLocked}
                      onClick={() => handleRoundSelect(round)}
                      aria-pressed={maxRounds === round}
                      aria-label={isLocked
                        ? `${round}라운드 - 프리미엄 구매 안내 열기`
                        : `${round}라운드`}
                    >
                      <strong>{round}</strong><span>라운드</span>
                      {isLocked && (
                        <RoundPremiumBadge>
                          <span aria-hidden="true">🔒</span> PREMIUM
                        </RoundPremiumBadge>
                      )}
                    </RoundButton>
                  )
                })}
              </RoundGroup>
            </SettingSection>
          </SettingsColumn>

          <SummaryAside>
            <SummaryCard>
              <SummaryLabel>게임 미리보기</SummaryLabel>
              <BattlePreview $background={selectedBackground?.image}>
                {selectedBoss && bossImageMap.get(selectedBoss.frontPath)
                  ? <PreviewBoss src={bossImageMap.get(selectedBoss.frontPath)} alt={selectedBoss.name} />
                  : <ImagePlaceholder>?</ImagePlaceholder>}
                <PreviewBadge>{selectedBackground?.name}</PreviewBadge>
              </BattlePreview>
              <SummaryRows>
                <SummaryRow><span>보스</span><strong>{selectedBoss?.name}</strong></SummaryRow>
                <SummaryRow><span>배경</span><strong>{selectedBackground?.name}</strong></SummaryRow>
                <SummaryRow><span>진행</span><strong>{maxRounds}라운드 · 최대 {maxRounds * 5}문제</strong></SummaryRow>
                <SummaryRow><span>퀴즈</span><strong>{quiz.quizList?.length || 0}개 단어</strong></SummaryRow>
              </SummaryRows>
              {errorMessage && <ErrorMessage role="alert">{errorMessage}</ErrorMessage>}
              <PrimaryButton type="button" disabled={isCreating} onClick={handleCreateRoom}>
                {isCreating ? '게임방 만드는 중...' : '이 설정으로 게임방 만들기'}
              </PrimaryButton>
            </SummaryCard>
          </SummaryAside>
        </SettingLayout>
      </PageShell>
      <BattlePremiumModal
        show={isPremiumModalOpen}
        onHide={closePremiumModal}
        onPurchaseSuccess={handlePremiumPurchaseSuccess}
      />
    </MainContainer>
  )
}

const PageShell = styled.div`
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  padding: 48px 0 80px;
  color: #33171d;
  @media (max-width: 767px) { width: min(100% - 24px, 680px); padding: 22px 0 56px; }
`
const PageHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 30px;

  @media (max-width: 620px) { flex-direction: column; }
`
const HeaderCopy = styled.div`
  h1 { margin: 2px 0 8px; font-size: clamp(30px, 4vw, 44px); font-weight: 900; letter-spacing: -.04em; }
  p { margin: 0; color: #667085; font-size: 16px; }
`
const Eyebrow = styled.span`color: #3454d1; font-size: 12px; font-weight: 900; letter-spacing: .16em;`
const PremiumStatusButton = styled.button`
  display: flex;
  align-items: flex-start;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 2px;
  min-width: 185px;
  padding: 11px 14px;
  border: 1px solid ${({ $active }) => $active ? '#e2b93b' : '#cfd7ef'};
  border-radius: 12px;
  color: ${({ $active }) => $active ? '#725600' : '#3454d1'};
  background: ${({ $active }) => $active ? '#fff8d8' : '#f3f5ff'};
  text-align: left;
  cursor: pointer;

  span { font-size: 10px; font-weight: 950; letter-spacing: .12em; }
  strong { font-size: 13px; }
  &:hover { transform: translateY(-1px); box-shadow: 0 8px 16px rgba(34, 52, 104, .1); }
  &:focus-visible { outline: 3px solid rgba(52, 84, 209, .28); outline-offset: 2px; }
`
const SuccessMessage = styled.p`
  margin: -14px 0 20px;
  padding: 11px 14px;
  border: 1px solid #a6dfbd;
  border-radius: 10px;
  color: #176b3a;
  background: #ecfbf2;
  font-size: 13px;
  font-weight: 800;
`
const SettingLayout = styled.div`display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 24px; align-items: start; @media (max-width: 960px) { grid-template-columns: 1fr; }`
const SettingsColumn = styled.div`display: flex; flex-direction: column; gap: 18px; min-width: 0;`
const SettingSection = styled.section`position: relative; padding: 24px; border: 1px solid #e1e6f5; border-radius: 18px; background: #fff; box-shadow: 0 8px 24px rgba(34, 52, 104, .06); @media (max-width: 600px) { padding: 18px; }`
const BossSpecSection = styled(SettingSection)`
  overflow: hidden;
  border-color: ${({ $accent }) => `${$accent}55`};
  background: linear-gradient(135deg, #fff 55%, ${({ $accent }) => `${$accent}12`});

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: ${({ $accent }) => $accent};
  }
`
const BossSpecHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;

  @media (max-width: 560px) { align-items: flex-start; flex-direction: column; }
`
const BossSpecIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;

  h2 { margin: 2px 0 3px; font-size: 20px; font-weight: 850; }
  p { margin: 0; color: #7a8399; font-size: 13px; }
`
const BossSpecThumb = styled.div`
  display: grid;
  place-items: center;
  flex: 0 0 72px;
  width: 72px;
  height: 72px;
  overflow: hidden;
  border-radius: 18px;
  background: radial-gradient(circle, ${({ $accent }) => `${$accent}38`}, ${({ $accent }) => `${$accent}10`});

  img { width: 68px; height: 68px; object-fit: contain; }
  span { color: #fff; font-size: 26px; font-weight: 900; }
`
const SpecEyebrow = styled.span`color: #3454d1; font-size: 10px; font-weight: 900; letter-spacing: .12em;`
const PerPlayerBadge = styled.span`flex: 0 0 auto; padding: 7px 11px; border-radius: 999px; color: #3454d1; background: #eef1ff; font-size: 12px; font-weight: 850;`
const BossStats = styled.div`display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; @media (max-width: 560px) { grid-template-columns: 1fr; }`
const BossStatCard = styled.div`
  --stat-color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 14px;
  border: 1px solid ${({ $color }) => `${$color}32`};
  border-radius: 13px;
  background: ${({ $color }) => `${$color}0c`};
`
const StatIcon = styled.span`display: grid; place-items: center; flex: 0 0 35px; height: 35px; border-radius: 10px; color: #fff; background: var(--stat-color); font-size: 17px;`
const StatCopy = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  span { color: #7a8399; font-size: 11px; font-weight: 700; }
  strong { color: #20283c; font-size: 21px; line-height: 1.15; }
`
const StatUnit = styled.span`align-self: flex-end; color: #98a0b3; font-size: 10px; font-weight: 800;`
const SpecNotice = styled.p`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 14px 0 0;
  padding-top: 12px;
  border-top: 1px dashed #dfe4f0;
  color: #667085;
  font-size: 12px;
  line-height: 1.5;

  @media (max-width: 680px) { flex-direction: column; gap: 3px; }
`
const ExampleText = styled.span`color: #3454d1; font-weight: 800;`
const SectionHeading = styled.div`
  display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
  h2 { margin: 0 0 3px; font-size: 20px; font-weight: 850; }
  p { margin: 0; color: #7a8399; font-size: 13px; }
`
const StepNumber = styled.span`display: grid; place-items: center; flex: 0 0 34px; height: 34px; border-radius: 11px; color: #fff; background: #3454d1; font-weight: 900;`
const OptionGrid = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc((100% - 24px) / 3);
  gap: 12px;
  padding: 2px 2px 12px;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scroll-snap-type: x proximity;
  scrollbar-color: #9aa9e8 #edf0fa;
  scrollbar-width: thin;

  &::-webkit-scrollbar { height: 9px; }
  &::-webkit-scrollbar-track { border-radius: 999px; background: #edf0fa; }
  &::-webkit-scrollbar-thumb { border: 2px solid #edf0fa; border-radius: 999px; background: #9aa9e8; }
  &::-webkit-scrollbar-thumb:hover { background: #7386d9; }

  @media (max-width: 680px) {
    grid-auto-columns: minmax(240px, 85%);
  }
`
const BossCard = styled.button`
  position: relative; min-width: 0; padding: 0 0 15px; overflow: hidden; border: 2px solid ${({ $selected, $accent }) => $selected ? $accent : '#e4e8f1'}; border-radius: 14px; background: ${({ $locked }) => $locked ? '#f6f7fa' : '#fff'}; text-align: left; cursor: pointer; transition: transform .16s ease, box-shadow .16s ease; scroll-snap-align: start;
  &:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(34, 52, 104, .1); }
  &:focus-visible { outline: 3px solid rgba(52, 84, 209, .28); outline-offset: 2px; }
`
const BossImageArea = styled.div`display: grid; place-items: center; height: 138px; margin-bottom: 12px; background: radial-gradient(circle, ${({ $accent }) => `${$accent}35`} 0, ${({ $accent }) => `${$accent}0d`} 62%, transparent 63%); filter: ${({ $locked }) => $locked ? 'grayscale(.75)' : 'none'}; opacity: ${({ $locked }) => $locked ? .64 : 1};`
const BossImage = styled.img`width: 128px; height: 128px; object-fit: contain; image-rendering: auto;`
const ImagePlaceholder = styled.div`display: grid; place-items: center; width: 74px; height: 74px; border-radius: 50%; color: #fff; background: #a8b1c7; font-size: 34px; font-weight: 900;`
const OptionText = styled.span`display: flex; flex-direction: column; gap: 4px; padding: 0 13px; strong { font-size: 16px; } span { color: #7a8399; font-size: 12px; line-height: 1.45; }`
const CheckMark = styled.span`position: absolute; top: 9px; right: 9px; display: grid; place-items: center; width: 25px; height: 25px; border-radius: 50%; color: ${({ $selected }) => $selected ? '#fff' : 'transparent'}; background: ${({ $selected }) => $selected ? '#3454d1' : 'rgba(255,255,255,.75)'}; box-shadow: 0 2px 8px rgba(0,0,0,.12); font-size: 14px; font-weight: 900;`
const PremiumLockBadge = styled.span`
  position: absolute;
  z-index: 3;
  top: 9px;
  left: 9px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 7px;
  border: 1px solid rgba(125, 91, 0, .2);
  border-radius: 999px;
  color: #6f5400;
  background: rgba(255, 248, 216, .94);
  box-shadow: 0 3px 9px rgba(54, 40, 0, .12);
  font-size: 9px;
  font-weight: 950;
  letter-spacing: .05em;
`
const BackgroundGrid = styled.div`display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; @media (max-width: 680px) { grid-template-columns: 1fr; }`
const BackgroundCard = styled.button`
  position: relative; min-width: 0; padding: 0; overflow: hidden; border: 2px solid ${({ $selected }) => $selected ? '#3454d1' : '#e4e8f1'}; border-radius: 14px; background: ${({ $locked }) => $locked ? '#f6f7fa' : '#fff'}; text-align: left; cursor: pointer;
  &:hover { box-shadow: 0 10px 20px rgba(34, 52, 104, .1); }
  &:focus-visible { outline: 3px solid rgba(52, 84, 209, .28); outline-offset: 2px; }
`
const BackgroundPreview = styled.img`display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; filter: ${({ $locked }) => $locked ? 'grayscale(.8)' : 'none'}; opacity: ${({ $locked }) => $locked ? .65 : 1};`
const BackgroundCopy = styled.span`display: flex; flex-direction: column; gap: 3px; padding: 11px 12px 13px; strong { font-size: 15px; } span { color: #7a8399; font-size: 11px; line-height: 1.4; }`
const RoundGroup = styled.div`display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; @media (max-width: 520px) { grid-template-columns: repeat(2, 1fr); }`
const RoundButton = styled.button`
  position: relative; display: flex; flex-direction: column; align-items: center; gap: 2px; min-height: 86px; padding: 15px 8px; border: 2px solid ${({ $selected }) => $selected ? '#3454d1' : '#e3e7f0'}; border-radius: 12px; color: ${({ $selected, $locked }) => $locked ? '#9298a8' : $selected ? '#3454d1' : '#4a5265'}; background: ${({ $selected, $locked }) => $locked ? '#f6f7fa' : $selected ? '#eef1ff' : '#fff'}; cursor: pointer;
  strong { font-size: 24px; line-height: 1; } span { font-size: 12px; font-weight: 700; }
  &:focus-visible { outline: 3px solid rgba(52, 84, 209, .28); outline-offset: 2px; }
`
const RoundPremiumBadge = styled.span`
  position: absolute;
  bottom: 6px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: #795d00;
  font-size: 8px !important;
  font-weight: 950 !important;
  letter-spacing: .04em;
`
const SummaryAside = styled.aside`position: sticky; top: 20px; @media (max-width: 960px) { position: static; }`
const SummaryCard = styled.section`padding: 18px; border: 1px solid #dce3fa; border-radius: 20px; background: #fff; box-shadow: 0 16px 36px rgba(34, 52, 104, .12);`
const SummaryLabel = styled.span`display: inline-block; margin-bottom: 12px; color: #3454d1; font-size: 12px; font-weight: 900; letter-spacing: .08em;`
const BattlePreview = styled.div`
  position: relative; display: grid; place-items: center; height: 190px; overflow: hidden; border-radius: 14px; background: ${({ $background }) => $background ? `url(${$background}) center/cover` : '#dfe5f5'};
  &::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(13,22,48,.45), transparent 60%); }
`
const PreviewBoss = styled.img`position: relative; z-index: 1; width: 170px; height: 170px; object-fit: contain; filter: drop-shadow(0 12px 9px rgba(0,0,0,.28));`
const PreviewBadge = styled.span`position: absolute; z-index: 2; right: 10px; bottom: 10px; padding: 5px 9px; border-radius: 99px; color: #fff; background: rgba(14,22,44,.68); font-size: 11px; font-weight: 800; backdrop-filter: blur(5px);`
const SummaryRows = styled.div`display: flex; flex-direction: column; margin-bottom: 17px; border-top: 1px solid #edf0f7;`
const SummaryRow = styled.div`display: flex; justify-content: space-between; gap: 12px; padding: 11px 2px; border-bottom: 1px solid #edf0f7; font-size: 13px; span { color: #7a8399; } strong { color: #30384f; text-align: right; }`
const ErrorMessage = styled.p`margin: 0 0 12px; padding: 10px 12px; border-radius: 9px; color: #b42318; background: #fff0ee; font-size: 12px; font-weight: 700; line-height: 1.45;`
const PrimaryButton = styled.button`
  width: 100%; min-height: 52px; padding: 12px 18px; border: 0; border-radius: 12px; color: #fff; background: #3454d1; box-shadow: 0 8px 18px rgba(52,84,209,.24); font-size: 15px; font-weight: 900; cursor: pointer;
  &:hover:not(:disabled) { background: #2945b8; transform: translateY(-1px); }
  &:disabled { opacity: .62; cursor: wait; }
`
const MissingState = styled.div`width: min(520px, calc(100% - 32px)); margin: 100px auto; padding: 32px; border-radius: 18px; background: #fff; text-align: center; h2 { margin: 0 0 8px; } p { margin: 0 0 24px; color: #efefef; }`

export default BattleroomSettingPage
