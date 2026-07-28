import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { callPurchaseBattlePremium } from '../../firebase/config'
import BattlePremiumModal from './BattlePremiumModal'

jest.mock('../../firebase/config', () => ({
  callPurchaseBattlePremium: jest.fn(),
}))
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}))
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}))

describe('BattlePremiumModal', () => {
  const dispatch = jest.fn()
  const navigate = jest.fn()
  const onHide = jest.fn()
  const onPurchaseSuccess = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useDispatch.mockReturnValue(dispatch)
    useNavigate.mockReturnValue(navigate)
    useSelector.mockImplementation((selector) => selector({
      user: {
        rira: 5000,
        battlePremiumUntil: Date.now() + 86400000,
      },
    }))
  })

  test('구매 성공 시 서버 결과를 Redux와 부모 컴포넌트에 전달한다', async () => {
    const purchase = {
      success: true,
      balance: 1700,
      premiumUntilMillis: Date.now() + 31 * 86400000,
    }
    callPurchaseBattlePremium.mockResolvedValue({ data: purchase })

    render(
      <BattlePremiumModal
        show
        onHide={onHide}
        onPurchaseSuccess={onPurchaseSuccess}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: '3,300리라로 구매' }))

    await waitFor(() => {
      expect(onPurchaseSuccess).toHaveBeenCalledWith(purchase)
    })
    expect(callPurchaseBattlePremium).toHaveBeenCalledWith({
      requestId: expect.any(String),
    })
    expect(dispatch).toHaveBeenCalledWith({
      type: 'user/setUser',
      payload: {
        rira: purchase.balance,
        battlePremiumUntil: purchase.premiumUntilMillis,
      },
    })
  })
})
