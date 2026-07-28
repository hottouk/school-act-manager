import { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { callPurchaseBattlePremium } from '../../firebase/config'
import { setUser } from '../../store/userSlice'
import {
  BATTLE_PREMIUM_DURATION_DAYS,
  BATTLE_PREMIUM_PRICE,
  getPremiumUntilMillis,
  isUserBattlePremium,
} from '../../utils/premiumUtils'

const createPremiumPurchaseRequestId = () => {
  if (
    typeof window !== 'undefined'
    && typeof window.crypto?.randomUUID === 'function'
  ) {
    return window.crypto.randomUUID()
  }

  return `premium_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`
}

const BattlePremiumModal = ({ show, onHide, onPurchaseSuccess }) => {
  const user = useSelector(({ user }) => user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [purchaseRequestId, setPurchaseRequestId] = useState(null)
  const [purchaseError, setPurchaseError] = useState('')

  const isPremium = isUserBattlePremium(user)
  const premiumUntilMillis = getPremiumUntilMillis(user?.battlePremiumUntil)
  const parsedRira = Number(user?.rira ?? 0)
  const riraBalance = Number.isFinite(parsedRira) ? parsedRira : 0
  const hasEnoughRira = riraBalance >= BATTLE_PREMIUM_PRICE
  const formattedPremiumUntil = premiumUntilMillis
    ? new Date(premiumUntilMillis).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    : null

  const handleClose = () => {
    if (isPurchasing) return
    setPurchaseError('')
    onHide()
  }

  const handlePurchase = async () => {
    if (isPurchasing || !hasEnoughRira) return

    const requestId = purchaseRequestId || createPremiumPurchaseRequestId()
    if (!purchaseRequestId) setPurchaseRequestId(requestId)
    setIsPurchasing(true)
    setPurchaseError('')

    try {
      const response = await callPurchaseBattlePremium({ requestId })
      const purchase = response?.data || {}

      if (!purchase.success || !purchase.premiumUntilMillis) {
        throw new Error('프리미엄 구매 결과를 확인할 수 없습니다.')
      }

      dispatch(setUser({
        rira: purchase.balance,
        battlePremiumUntil: purchase.premiumUntilMillis,
      }))
      setPurchaseRequestId(null)
      onPurchaseSuccess?.(purchase)
    } catch (error) {
      console.error('프리미엄 이용권 구매 실패:', error)
      setPurchaseError(
        error?.message || '이용권을 구매하지 못했습니다. 잠시 후 다시 시도해주세요.'
      )
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleChargeRira = () => {
    handleClose()
    navigate('/purchase')
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop={isPurchasing ? 'static' : true}
      keyboard={!isPurchasing}
    >
      <PremiumModalHeader closeButton={!isPurchasing}>
        <div>
          <ModalEyebrow>BATTLE PREMIUM</ModalEyebrow>
          <Modal.Title>배틀 프리미엄 이용권</Modal.Title>
        </div>
      </PremiumModalHeader>
      <Modal.Body>
        <PremiumIntro>
          보스 몬스터, 배경화면, 라운드 수의 모든 선택지를
          {' '}{BATTLE_PREMIUM_DURATION_DAYS}일 동안 자유롭게 사용할 수 있습니다.
        </PremiumIntro>
        <PurchaseInfoGrid>
          <PurchaseInfo>
            <span>이용 기간</span>
            <strong>{BATTLE_PREMIUM_DURATION_DAYS}일</strong>
          </PurchaseInfo>
          <PurchaseInfo>
            <span>가격</span>
            <strong>{BATTLE_PREMIUM_PRICE.toLocaleString()}리라</strong>
          </PurchaseInfo>
          <PurchaseInfo>
            <span>현재 잔액</span>
            <PurchaseValue $warning={!hasEnoughRira}>
              {riraBalance.toLocaleString()}리라
            </PurchaseValue>
          </PurchaseInfo>
        </PurchaseInfoGrid>
        {isPremium && formattedPremiumUntil && (
          <ExtensionNotice>
            현재 만료일은 <strong>{formattedPremiumUntil}</strong>입니다.
            구매하면 이 만료일부터 {BATTLE_PREMIUM_DURATION_DAYS}일이 추가됩니다.
          </ExtensionNotice>
        )}
        {!hasEnoughRira && (
          <BalanceNotice>
            이용권을 구매하려면 리라가{' '}
            {(BATTLE_PREMIUM_PRICE - riraBalance).toLocaleString()}만큼 더 필요합니다.
          </BalanceNotice>
        )}
        {purchaseError && <ErrorMessage role="alert">{purchaseError}</ErrorMessage>}
      </Modal.Body>
      <PremiumModalFooter>
        <ModalSecondaryButton
          type="button"
          disabled={isPurchasing}
          onClick={handleClose}
        >
          나중에
        </ModalSecondaryButton>
        <ModalPrimaryButton
          type="button"
          disabled={isPurchasing}
          onClick={hasEnoughRira ? handlePurchase : handleChargeRira}
        >
          {hasEnoughRira
            ? isPurchasing
              ? '구매 처리 중...'
              : `${BATTLE_PREMIUM_PRICE.toLocaleString()}리라로 구매`
            : '리라 충전하러 가기'}
        </ModalPrimaryButton>
      </PremiumModalFooter>
    </Modal>
  )
}

const PremiumModalHeader = styled(Modal.Header)`
  border-bottom: 1px solid #e8e2cc;
  background: linear-gradient(120deg, #3453d177, #f2f4ff);
`
const ModalEyebrow = styled.span`
  display: block;
  margin-bottom: 2px;
  color: #3454d1;
  font-size: 10px;
  font-weight: 950;
  letter-spacing: .14em;
`
const PremiumIntro = styled.p`
  margin: 0 0 16px;
  color: #5f6779;
  font-size: 14px;
  line-height: 1.65;
`
const PurchaseInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 14px;

  @media (max-width: 480px) { grid-template-columns: 1fr; }
`
const PurchaseInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border: 1px solid #e3e7f0;
  border-radius: 10px;
  background: #f8f9fc;

  span { color: #7a8399; font-size: 11px; font-weight: 700; }
  strong { color: #30384f; font-size: 14px; }
`
const PurchaseValue = styled.strong`
  color: ${({ $warning }) => $warning ? '#b42318' : '#30384f'} !important;
`
const ExtensionNotice = styled.p`
  margin: 0 0 12px;
  padding: 11px 12px;
  border-radius: 9px;
  color: #66520b;
  background: #fff9df;
  font-size: 12px;
  line-height: 1.55;
`
const BalanceNotice = styled.p`
  margin: 0 0 12px;
  padding: 11px 12px;
  border-radius: 9px;
  color: #b42318;
  background: #fff0ee;
  font-size: 12px;
  font-weight: 750;
`
const ErrorMessage = styled.p`
  margin: 0 0 12px;
  padding: 10px 12px;
  border-radius: 9px;
  color: #b42318;
  background: #fff0ee;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.45;
`
const PremiumModalFooter = styled(Modal.Footer)`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 8px;
`
const ModalSecondaryButton = styled.button`
  min-height: 45px;
  border: 1px solid #d8ddea;
  border-radius: 10px;
  color: #5f6779;
  background: #fff;
  font-weight: 800;
  cursor: pointer;

  &:disabled { opacity: .55; cursor: wait; }
`
const ModalPrimaryButton = styled.button`
  min-height: 45px;
  border: 0;
  border-radius: 10px;
  color: #fff;
  background: #3454d1;
  font-weight: 900;
  cursor: pointer;

  &:hover:not(:disabled) { background: #2945b8; }
  &:disabled { opacity: .6; cursor: wait; }
`

export default BattlePremiumModal
