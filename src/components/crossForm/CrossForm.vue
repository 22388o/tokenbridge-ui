<template>
  <Form id="crossForm" ref="crossForm" name="crossForm" class="cross-form" @submit="onSubmit">
    <div id="bridgeTab" class="align-center">
      <div class="firstRow row justify-content-sm-center">
        <!-- Column 2 -->
        <div class="text-center  col-sm-2">
          <label class="tokenAddress-label" for="originNetwork">Origin Network</label>
          <div class="form-group">
            <span class="originNetwork">
              {{ originNetwork?.name }}
            </span>
          </div>
        </div>

        <!-- Column 4 -->
        <div class="youOwn text-center col-sm-2">
          <label class="tokenAddress-label" for="tokenAddress">You own</label>
          <div class="dropdown">
            <button
              id="tokenAddress"
              class="btn dropdown-toggle"
              :class="{ disabled: disabled }"
              :disabled="disabled"
              type="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span v-if="selectedToken?.symbol">
                <img
                  :src="selectedToken?.icon"
                  class="token-logo"
                  :alt="`${selectedToken?.name} Logo`"
                />
              </span>
              {{ selectedToken?.symbol ? selectedToken.symbol : 'Select a token' }}
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li v-for="token in currentNetworkTokens" :key="token.token">
                <a class="dropdown-item" href="#" @click="selectToken(token, $event)">
                  <span><img :src="token.icon" class="token-logo"/></span>
                  {{ token.symbol }}
                </a>
              </li>
            </div>
          </div>
          <div class="invalid-feedback-container">
            <div class="invalid-feedback" name="tokenAddress">
              {{ selectedTokenError }}
            </div>
          </div>
        </div>

        <!-- Column 7 -->
        <div class="amountToCross text-center col-sm-3">
          <label class="amount-label" for="amount">
            <a id="max" class="max" @click="setMaxAmount">
              Max
            </a>
          </label>
          <div class="form-group amount">
            <Field
              id="amount"
              v-model="amount"
              name="amount"
              class="outline form-control text-center"
              :class="{ disabled: disabled }"
              placeholder="Amount"
              :disabled="disabled"
              :rules="validateAmount"
              required
            />
            <div class="invalid-feedback-container">
              <ErrorMessage class="invalid-feedback" name="amount" />
            </div>
          </div>
        </div>

        <!-- Column 12 -->
        <div class="senderAddress text-center  col-sm-5">
          <label class="sender-label" for="sender-address">Sender address</label>
          <div class="form-group">
            <input
              id="sender-address"
              type="text"
              name="senderAddress"
              class="form-control-plaintext text-center"
              :class="{ disabled: disabled }"
              readonly
              :value="senderAddress"
            />
          </div>
        </div>
      </div>

      <div class="secondRow row justify-content-sm-center">
        <!-- Column 2 -->
        <div class="text-center  col-sm-2">
          <label class="tokenAddress-label" for="destinationNetwork">Destination Network</label>
          <div class="form-group">
            <span class="destinationNetwork">
              {{ destinationNetwork?.name }}
            </span>
          </div>
        </div>

        <!-- Column 4 -->
        <div class="text-center youWillReceive col-sm-2">
          <label class="willReceive-label" for="willReceive">You will receive</label>
          <div class="input-group">
            <div id="willReceive" class="form-control-plaintext" name="willReceive">
              <span
                id="willReceiveToken"
                class="willReceiveToken"
                :class="{ disabled: disabled }"
                name="willReceiveToken"
              >
                <span v-if="willReceiveToken?.icon">
                  <img :src="willReceiveToken?.icon" class="token-logo" />
                </span>
                {{ willReceiveToken?.symbol || '-' }}
              </span>
            </div>
          </div>
          <div class="confirmation-time">
            Confirmations
            {{ confirmations.blocks ? ` ${confirmations.blocks} blocks` : ' -' }}
            <br />
            {{ confirmations.time ? ` ~ aprox ${confirmations.time}` : '' }}
          </div>
        </div>

        <!-- Column 7 -->
        <div class="convertedAmount text-center col-sm-3">
          <label class="amount-label" for="receive-amount">Amount</label>
          <div class="form-group amount">
            <input
              id="receive-amount"
              name="receiveAmount"
              class="form-control-plaintext text-center align-center"
              :class="{ disabled: disabled }"
              :value="receiveAmount"
              readonly
            />
            <div class="fee">Service fee {{ fee * 100 + '%' }}</div>
          </div>
        </div>

        <!-- Column 12 -->
        <div class="receiverAddress text-center col-sm-5">
          <label class="receive-label-address" for="receiveAddress">
            <a id="same-address" class="same-address" @click="useSameAddress">
              Receiver address
            </a>
          </label>
          <div class="form-group receive-address">
            <Field
              id="receiveAddress"
              v-model="receiverAddress"
              type="text"
              name="receiveAddress"
              class="outline form-control text-center"
              :class="{ disabled: disabled }"
              placeholder="0x00...af"
              :disabled="!sharedState.isConnected"
              :rules="validateAddress"
              required
            />
            <div class="invalid-feedback-container">
              <ErrorMessage class="invalid-feedback" name="receiveAddress" />
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="offset-md-2 col-md-8 col-12">
          <p v-if="destinationNetwork?.isRsk" class="alert alert-warning" role="alert">
            Binance is not taking deposits sent by a smart contract for RSK network, they only
            accept deposits from an account
          </p>
        </div>
      </div>
    </div>
    <div v-if="claimCost" class="row justify-content-center mb-4">
      <div class="col-sm-12 col-md-5 border note-container px-4 py-2 bg-light text-center">
        <strong class="fw-bold d-block">Important!</strong>
        <span>
          You'll need <strong>{{ claimCost }}</strong> to claim the tokens
        </span>
      </div>
    </div>

    <div class="row justify-content-center mb-3">
      <button
        v-if="!hasAllowance"
        id="approve"
        class="btn btn-primary mr-3"
        :disabled="disabled"
        @click="approveClick"
      >
        Approve
      </button>
      <button
        id="deposit"
        type="submit"
        class="btn btn-primary"
        :disabled="disabled || !hasAllowance"
      >
        Cross tokens
      </button>
    </div>

    <WaitSpinner :show="showSpinner" :wait-seconds="waitSeconds" />

    <SuccessMsg
      :show="showSuccess"
      :confirmations="confirmations"
      :receive-amount="receiveAmount"
      :receive-token="willReceiveToken?.symbol || ''"
    />
    <ErrorMsg :error="error" />

    <Modal v-if="showModal" @close="showModal = false">
      <template #title>
        How to obtain the tokens
      </template>
      <template #body>
        <p>When the transaction is mined you will see it like</p>
        <img src="pending-tx.png" alt="pending transaction" />
        <p>Once it has enough confirmation you will need to <b>claim it on the other network</b></p>
        <img src="claim-tx.png" alt="claim transaction" />
      </template>
    </Modal>
  </Form>
</template>
<script>
import { Field, Form, ErrorMessage } from 'vee-validate'
import BigNumber from 'bignumber.js'
import moment from 'moment'

import ERC20_ABI from '@/constants/abis/erc20.json'
import { sanitizeTxHash, retry3Times } from '@/utils'

import Modal from '@/components/commons/Modal.vue'
import WaitSpinner from './WaitSpinner.vue'
import SuccessMsg from './SuccessMsg.vue'
import ErrorMsg from './ErrorMsg.vue'
import { store } from '@/store.js'
import { ESTIMATED_GAS_AVG } from '@/constants/transactions'
import { METHOD_TYPES } from '@/constants/methodType'
import ERC20TokenTransaction from '@/modules/transactions/transactionsTypes/ERC20TokenTransaction'

export default {
  name: 'CrossForm',
  components: {
    Modal,
    WaitSpinner,
    SuccessMsg,
    ErrorMsg,
    Form,
    Field,
    ErrorMessage,
  },
  inject: ['$services'],
  props: {
    typesLimits: {
      type: Array,
      required: true,
    },
    rskFee: {
      type: Number,
      required: true,
    },
    sideFee: {
      type: Number,
      required: true,
    },
    rskConfirmations: {
      type: Object,
      required: true,
    },
    sideConfirmations: {
      type: Object,
      required: true,
    },
  },
  emits: ['newTransaction'],
  data() {
    return {
      sharedState: store.state,
      receiverAddress: '',
      amount: '',
      selectedToken: {},
      selectedTokenError: '',
      selectedTokenBalance: 0,
      selectedTokenMaxLimit: 0,
      selectedTokenMinLimit: 0,
      selectedTokenMediumAmount: 0,
      selectedTokenLargeAmount: 0,
      hasAllowance: false,
      showSpinner: false,
      showSuccess: false,
      showModal: false,
      error: '',
      claimCost: null,
      erc20TokenInstance: null,
    }
  },
  computed: {
    confirmations() {
      if (
        !this.sharedState.currentConfig ||
        !this.amount ||
        !this.typesLimits?.length ||
        !this.selectedToken?.typeId
      )
        return {}
      const config = this.sharedState.currentConfig
      const confirmations = config.isRsk ? this.rskConfirmations : this.sideConfirmations
      // convert amount to wei to compare against limits
      const amount = new BigNumber(this.amount).shiftedBy(18)
      const limit = this.typesLimits[this.selectedToken?.typeId]
      if (amount.isLessThan(limit.mediumAmount)) {
        return {
          blocks: confirmations.smallAmount,
          time: moment
            .duration(confirmations.smallAmount * config.secondsPerBlock, 'seconds')
            .add(2, 'minutes') // voting time
            .humanize(),
        }
      } else if (amount.isLessThan(limit.largeAmount)) {
        return {
          blocks: confirmations.mediumAmount,
          time: moment
            .duration(confirmations.mediumAmountTime * config.secondsPerBlock, 'seconds')
            .add(2, 'minutes') // voting time
            .humanize(),
        }
      } else {
        return {
          blocks: confirmations.largeAmount,
          time: moment
            .duration(confirmations.largeAmountTime * config.secondsPerBlock, 'seconds')
            .add(2, 'minutes') // voting time
            .humanize(),
        }
      }
    },
    accountConnected() {
      return `${this.sharedState.chainId} ${this.sharedState.accountAddress} ${this.sharedState.sideConfig?.networkId}`
    },
    fee() {
      if (!this.sharedState.currentConfig) return this.rskFee
      return this.sharedState.currentConfig.isRsk ? this.rskFee : this.sideFee
    },
    disabled() {
      return !this.sharedState.isConnected || this.showSpinner
    },
    currentNetworkTokens() {
      return this.originNetwork?.tokens
    },
    senderAddress() {
      return this.sharedState.accountAddress || '0x00...00'
    },
    originNetwork() {
      return this.sharedState.currentConfig || this.sharedState.rskConfig
    },
    destinationNetwork() {
      return this.sharedState.currentConfig?.crossToNetwork || this.sharedState.sideConfig
    },
    willReceiveToken() {
      return this.selectedToken?.receiveToken
    },
    receiveAmount() {
      return this.amount - this.amount * this.fee
    },
    waitSeconds() {
      if (!this.sharedState.currentConfig || !this.selectedTokenMediumAmount || !this.amount) {
        return 0
      }
      return this.sharedState.currentConfig.secondsPerBlock
    },
  },
  watch: {
    amount(value) {
      this.error = ''
      this.showSuccess = false
      this.amount = value.replace(',', '.').replace(/[^0-9]\./gi, '')
    },
    accountConnected() {
      if (this.isMounted) {
        this.handleOnAccountConnected()
      }
    },
  },
  mounted() {
    if (!this.erc20TokenInstance) {
      this.handleOnAccountConnected()
    }
    this.isMounted = true
  },
  methods: {
    handleOnAccountConnected() {
      this.refreshBalanceAndAllowance()
      this.resetForm()
      this.setClaimCost()
      this.initData()
    },
    initData() {
      this.erc20TokenInstance = new ERC20TokenTransaction({
        web3: this.sharedState.web3,
        config: this.sharedState.currentConfig,
      })
    },
    resetForm() {
      this.selectedToken = {}
      this.amount = ''
      this.$refs.crossForm.resetForm()
    },
    refreshBalanceAndAllowance() {
      const data = this
      const web3 = data.sharedState.web3
      const config = data.sharedState.currentConfig
      const token = data.selectedToken
      if (!token?.address || !web3 || !config) {
        return
      }
      const decimals = token.decimals
      if (token.methodType === METHOD_TYPES.DEPOSITOR) {
        web3.eth.getBalance(data.sharedState.accountAddress).then(ethBalance => {
          data.selectedTokenBalance = new BigNumber(ethBalance).shiftedBy(-decimals)
          if (new BigNumber(data.amount).isGreaterThan(data.selectedTokenBalance)) {
            data.amount = data.selectedTokenBalance.toFixed(decimals)
          }
        })
        data.hasAllowance = true
      } else {
        const tokenContract = new web3.eth.Contract(ERC20_ABI, token.address)
        retry3Times(tokenContract.methods.balanceOf(data.sharedState.accountAddress).call).then(
          balance => {
            data.selectedTokenBalance = new BigNumber(balance).shiftedBy(-decimals)
            if (new BigNumber(data.amount).isGreaterThan(data.selectedTokenBalance)) {
              data.amount = data.selectedTokenBalance.toFixed(decimals)
            }
          },
        )
        retry3Times(
          tokenContract.methods.allowance(data.sharedState.accountAddress, config.bridge).call,
        ).then(allowance => {
          // as we set the allowance to the highest uint256 it should always be bigger than selectedTokenMaxLimit
          data.hasAllowance = new BigNumber(allowance)
            .shiftedBy(-18)
            .gte(data.selectedTokenMaxLimit)
        })
      }
    },
    async selectToken(token, event) {
      const data = this
      data.error = ''
      data.showSuccess = false
      if (event) event.preventDefault()
      this.selectedToken = token
      this.selectedTokenError = ''
      const web3 = this.sharedState.web3
      const config = this.sharedState.currentConfig
      if (!token?.address || !web3 || !config) {
        return
      }

      // // The correct form is use calcMaxWithdraw to check the limit
      // // we use the max limit as it is more performant and theres a 99.9% that this is the max limit
      // const allowTokensContract = new web3.eth.Contract(ALLOW_TOKENS_ABI, config.allowTokens)
      // const maxWithdrawInWei = await allowTokensContract.methods
      //   .calcMaxWithdraw(tokenAddress)
      //   .call()
      const limits = data.typesLimits[data.selectedToken.typeId]
      data.selectedTokenMaxLimit = new BigNumber(limits.max).shiftedBy(-18)
      data.selectedTokenMinLimit = new BigNumber(limits.min).shiftedBy(-18)
      data.selectedTokenMediumAmount = new BigNumber(limits.mediumAmount).shiftedBy(-18)
      data.selectedTokenLargeAmount = new BigNumber(limits.largeAmount).shiftedBy(-18)

      data.refreshBalanceAndAllowance()
    },
    async setMaxAmount(event) {
      const data = this
      if (event) event.preventDefault()
      if (!data.selectedTokenMaxLimit || !data.selectedTokenBalance) return
      let maxAmount = data.selectedTokenBalance
      if (data.selectedTokenBalance.isGreaterThan(data.selectedTokenMaxLimit)) {
        maxAmount = data.selectedTokenMaxLimit
      }
      data.amount = maxAmount.toFixed(data.selectedToken.decimals, BigNumber.ROUND_DOWN)
    },
    useSameAddress(event) {
      const data = this
      if (event) event.preventDefault()
      data.receiverAddress = data.sharedState.accountAddress
    },
    txExplorerLink(txHash) {
      const sanitizedTxHash = sanitizeTxHash(txHash)
      return txHash
        ? `<a target="_blank" href="${this.sharedState.currentConfig.explorer}/tx/${sanitizedTxHash}">see Tx</a>`
        : ''
    },
    async approveClick(event) {
      const data = this
      data.error = ''
      data.showSuccess = false
      event.preventDefault()
      if (!data.selectedToken?.address) {
        data.selectedTokenError = 'Choose a token to approve'
        return
      }
      const web3 = data.sharedState.web3
      const config = data.sharedState.currentConfig
      if (!web3 || !config) {
        // should be disabled
        return
      }
      const accountAddress = data.sharedState.accountAddress
      const tokenAddress = data.selectedToken.address

      try {
        data.showSpinner = true
        const receipt = await this.erc20TokenInstance.approve(tokenAddress, {
          from: accountAddress,
          gas: 70_000,
        })
        console.info(receipt)
        data.hasAllowance = true
        data.showSpinner = false
      } catch (error) {
        data.hasAllowance = false
        data.showSpinner = false
        console.error(error)
        data.error = `Couldn't approve. ${error?.message}`
      }
    },
    async onSubmit() {
      const data = this
      data.error = ''
      data.showSuccess = false
      const web3 = data.sharedState.web3
      const config = data.sharedState.currentConfig
      if (!web3 || !config || !data.sharedState.accountAddress) {
        data.error = 'Need to connect a wallet'
        return
      }
      const receiverAddress = data.receiverAddress
      const token = data.selectedToken
      const tokenAddress = token?.address
      if (!tokenAddress) {
        data.selectedTokenError = 'Choose a token to cross'
        return
      }
      if (!receiverAddress) {
        data.error = 'Choose a Receiver address'
        return
      }
      if (!data.hasAllowance) {
        data.error = 'Need to approve first'
        return
      }

      if (!data.amount) {
        data.error = 'Complete the Amount field'
        return
      }
      data.showSpinner = true

      data.showModal = true

      try {
        const transactionSaved = await this.erc20TokenInstance.cross(
          data.amount,
          data.receiveAmount,
          token,
          data.sharedState.accountAddress.toLowerCase(),
          receiverAddress.toLowerCase(),
        )
        data.showSpinner = false
        data.showSuccess = true

        data.$emit('newTransaction', transactionSaved)
        data.resetForm()
      } catch (error) {
        data.showSpinner = false
        data.showModal = false
        console.error(error)
        data.error = `Couln't cross the tokens. ${error?.message}`
      }
    },
    validateAmount(value) {
      const data = this
      if (!value) {
        return 'amount is required'
      }
      const amount = new BigNumber(value)
      if (!data.selectedToken?.symbol) return true

      if (amount.isLessThan(data.selectedTokenMinLimit)) {
        return `min amount is ${data.selectedTokenMinLimit}`
      }
      if (amount.isGreaterThan(data.selectedTokenBalance)) {
        return `amount bigger than your balance`
      }
      if (amount.isGreaterThan(data.selectedTokenMaxAmount)) {
        return `max amount is ${data.selectedTokenMaxAmount}`
      }
      return true
    },
    validateAddress(value) {
      if (!value) return 'destination address is required'
      if (!/^(0x)?[0-9a-f]{40}$/i.test(value)) {
        return 'invalid address'
      }
      return true
    },
    setClaimCost() {
      if (!this.sharedState.currentConfig) {
        return
      }
      const { isRsk } = this.sharedState?.currentConfig || {}
      const web3 = isRsk ? this.sharedState.sideWeb3 : this.sharedState.rskWeb3
      const networkConf = isRsk ? this.sharedState.sideConfig : this.sharedState.rskConfig
      web3.eth.getGasPrice().then(gasPrice => {
        const costInWei = new BigNumber(ESTIMATED_GAS_AVG)
          .multipliedBy(gasPrice)
          .shiftedBy(-18)
          .toPrecision(6)
          .toString()
        this.claimCost = `${costInWei} ${networkConf?.mainToken?.symbol}`
      })
    },
  },
}
</script>
<style scoped>
.alert {
  font-size: 12px;
  line-height: 14px;
  margin-bottom: 0;
}
</style>
