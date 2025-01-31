import * as tokensInfo from '../tokensInfo'
import * as methodType from '../methodType'

export const TEST_NET_KOVAN_MAIN_TOKEN = {
  ...tokensInfo.TOKEN_WETH_INFO,
  symbol: 'ETH',
  address: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
  decimals: 18,
  methodType: methodType.DEPOSITOR,
}

export const TEST_NET_KOVAN_TOKENS = [
  TEST_NET_KOVAN_MAIN_TOKEN,
  {
    ...tokensInfo.TOKEN_DOC_INFO,
    symbol: 'eDOC',
    address: '0x09a8f2041Be23e8eC3c72790C9A92089BC70FbCa',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_DAI_INFO,
    symbol: 'DAI',
    address: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_SAI_INFO,
    symbol: 'SAI',
    address: '0xc7cc3413f169a027dccfeffe5208ca4f38ef0c40',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_BITPRO_INFO,
    symbol: 'eBITPRO',
    address: '0xB3c9ec8833bfA0d382a183EcED27aBc079520928',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_RIF_INFO,
    symbol: 'etRIF',
    address: '0x69f6d4d4813f8e2e618dae7572e04b6d5329e207',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_TUSD_INFO,
    symbol: 'TUSD',
    address: '0x0000000000085d4780B73119b644AE5ecd22b376',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_ZRX_INFO,
    symbol: 'ZRX',
    address: '0x2002d3812f58e35f0ea1ffbf80a75a38c32175fa',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_LINK_INFO,
    symbol: 'LINK',
    address: '0xa36085F69e2889c224210F603D836748e7dC0088',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_USDT_INFO,
    symbol: 'USDT',
    address: '0x13512979ade267ab5100878e2e0f485b568328a4',
    decimals: 6,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_USDC_INFO,
    symbol: 'USDC',
    address: '0xe22da380ee6b445bb8273c81944adeb6e8450422',
    decimals: 6,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_OLD_INFO,
    symbol: 'Ω',
    address: '0x865f275121113b3fe8f91632aeaa4637e8a9f861',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_BUND_INFO,
    symbol: 'BUND',
    address: '0x8d3e855f3f55109d473735ab76f753218400fe96',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_UBI_INFO,
    symbol: 'UBI',
    address: '0xddade19b13833d1bf52c1fe1352d41a8dd9fe8c9',
    decimals: 18,
    methodType: methodType.RECEIVER,
  },
  {
    ...tokensInfo.TOKEN_WBTC_INFO,
    symbol: 'WBTC',
    address: '0xd1b98b6607330172f1d991521145a22bce793277',
    decimals: 8,
    methodType: methodType.RECEIVER,
  },
]
